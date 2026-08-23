(()=>{
  const gate=document.querySelector('.entry-gate');
  if(!gate){
    document.documentElement.classList.remove('is-entry-gated');
    dispatchEvent(new CustomEvent('bn0u0:entry-complete'));
    return;
  }

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION={micro:180,ui:320,content:560,scene:1000,epic:2000};
  const buttons=[...gate.querySelectorAll('[data-entry-lang]')];
  const welcome=gate.querySelector('.entry-gate__welcome');
  let committed=false;
  let revealFallback=0;
  let announced=false;
  let introAnnounced=false;

  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const nextPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const currentLanguage=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';
  const announceEntryComplete=()=>{
    if(announced)return;
    announced=true;
    dispatchEvent(new CustomEvent('bn0u0:entry-complete'));
  };
  const announceHomeIntro=()=>{
    if(introAnnounced)return;
    introAnnounced=true;
    dispatchEvent(new CustomEvent('bn0u0:home-intro-start'));
  };

  setTimeout(()=>window.__lenis?.stop?.(),0);

  function applyPreferredLanguage(next){
    try{localStorage.setItem('bn0u0-language',next)}catch(e){}

    return new Promise(resolve=>{
      const started=performance.now();
      let requestedToggle=false;

      const sync=()=>{
        const current=currentLanguage();
        const toggle=document.querySelector('.language-toggle');

        if(current===next&&(!toggle||!toggle.disabled)){
          resolve();
          return;
        }

        if(toggle&&!toggle.disabled&&!requestedToggle&&current!==next){
          requestedToggle=true;
          toggle.click();
        }

        if(performance.now()-started>1800){
          document.documentElement.lang=next==='zh'?'zh-Hant':'en';
          resolve();
          return;
        }
        requestAnimationFrame(sync);
      };

      requestAnimationFrame(sync);
    });
  }

  function releaseGate(){
    clearTimeout(revealFallback);
    gate.classList.add('is-cleared');

    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      gate.remove();
      document.documentElement.classList.remove('is-entry-gated');
      window.__lenis?.start?.();
      announceEntryComplete();
    }));
  }

  function finishImmediate(){
    gate.classList.add('is-cleared');
    gate.remove();
    document.documentElement.classList.remove('is-entry-gated');
    window.__lenis?.start?.();
    announceHomeIntro();
    announceEntryComplete();
  }

  async function dismissForeground(){
    gate.classList.add('is-dismissing');
    await delay(MOTION.content);
    gate.classList.add('is-welcome-cleared');
    await nextPaint();
  }

  function startFinalReveal(){
    let settled=false;
    const completed=new Set();
    const required=new Set(['entrySurfaceTopReveal','entrySurfaceBottomReveal']);

    const settle=()=>{
      if(settled)return;
      settled=true;
      gate.removeEventListener('animationend',onAnimationEnd);
      releaseGate();
    };

    const onAnimationEnd=event=>{
      if(!required.has(event.animationName))return;
      completed.add(event.animationName);
      if(completed.size===required.size)settle();
    };

    gate.addEventListener('animationend',onAnimationEnd);
    gate.classList.add('is-revealing');

    /* The hero becomes the visual centre while the surface opens behind it. */
    requestAnimationFrame(announceHomeIntro);

    revealFallback=setTimeout(settle,MOTION.epic+260);
  }

  async function choose(next,button){
    if(committed)return;
    committed=true;

    buttons.forEach(item=>{
      item.setAttribute('aria-pressed',String(item===button));
      item.disabled=true;
    });

    gate.dataset.language=next;
    if(welcome)welcome.textContent=next==='zh'?'歡迎':'WELCOME';
    gate.classList.add('is-choosing');

    const languageReady=applyPreferredLanguage(next);

    if(reduced){
      await languageReady;
      finishImmediate();
      return;
    }

    await delay(MOTION.ui);
    gate.classList.add('is-welcoming');

    await Promise.all([
      languageReady,
      delay(MOTION.content)
    ]);

    /* Let the completed word exist for one MICRO beat. This is long enough to
       register as intentional, but the pause occurs before dismissal; once the
       word is gone, the hero/background handoff remains immediate. */
    await delay(MOTION.micro);

    await dismissForeground();
    startFinalReveal();
  }

  buttons.forEach(button=>{
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>choose(button.dataset.entryLang,button));
  });
})();
