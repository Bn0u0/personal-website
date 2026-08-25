(()=>{
  const gate=document.querySelector('.entry-gate');
  if(!gate){
    document.documentElement.classList.remove('is-entry-gated');
    dispatchEvent(new CustomEvent('bn0u0:entry-complete'));
    return;
  }

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION={micro:180,ui:320,content:560,scene:1000,epic:2000};
  const SELECT={wipe:500};
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
    requestAnimationFrame(announceHomeIntro);
    revealFallback=setTimeout(settle,MOTION.epic+260);
  }

  function prepareSelection(button){
    /* The selected label no longer travels to the viewport centre. Keep its
       transform anchor at zero and let the centred welcome layer take over
       only after the click feedback + erase phase has finished. */
    button.style.setProperty('--entry-selected-x','0px');

    buttons.forEach(item=>{
      const selected=item===button;
      item.setAttribute('aria-pressed',String(selected));
      item.disabled=true;
      item.classList.toggle('is-entry-selected',selected);
      item.classList.toggle('is-entry-unselected',!selected);
    });
  }

  function playSelectedFeedback(button){
    /* One restrained press/release gesture. Its 500 ms duration deliberately
       matches the full wipe timeline (420 ms erase + 80 ms stagger), so the
       feedback resolves on the exact frame the last erased element finishes. */
    const motion=button.animate([
      {transform:'translate3d(0,0,0) scale(1)',offset:0},
      {transform:'translate3d(0,1px,0) scale(.976)',offset:.24},
      {transform:'translate3d(0,0,0) scale(1.012)',offset:.58},
      {transform:'translate3d(0,0,0) scale(1)',offset:1}
    ],{
      duration:SELECT.wipe,
      easing:'cubic-bezier(.2,.72,.28,1)',
      fill:'none'
    });
    return motion.finished.catch(()=>{});
  }

  async function choose(next,button){
    if(committed)return;
    committed=true;

    const selectedCopy=next==='zh'?'歡迎':'WELCOME';
    prepareSelection(button);
    gate.dataset.language=next;
    if(welcome)welcome.textContent=selectedCopy;

    const languageReady=applyPreferredLanguage(next);

    if(reduced){
      await languageReady;
      finishImmediate();
      return;
    }

    /* 1) Click feedback and erase begin together and finish together. */
    await nextPaint();
    gate.classList.add('is-selection-erasing');
    await Promise.all([
      playSelectedFeedback(button),
      delay(SELECT.wipe)
    ]);

    /* 2) No centring travel. The original 中文 / EN dissolves in place while
       the single centred welcome layer and ripple begin immediately. */
    gate.classList.add('is-choosing','is-welcoming');

    await Promise.all([
      languageReady,
      delay(MOTION.scene)
    ]);

    /* 3) Fade the welcome cleanly, then hand off to the surface reveal. */
    await dismissForeground();
    startFinalReveal();
  }

  buttons.forEach(button=>{
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>choose(button.dataset.entryLang,button));
  });
})();
