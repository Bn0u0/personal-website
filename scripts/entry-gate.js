(()=>{
  const gate=document.querySelector('.entry-gate');
  if(!gate){
    document.documentElement.classList.remove('is-entry-gated');
    return;
  }

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION={micro:180,ui:320,content:560,scene:1000,epic:1560};
  const buttons=[...gate.querySelectorAll('[data-entry-lang]')];
  const welcome=gate.querySelector('.entry-gate__welcome');
  let committed=false;
  let revealFallback=0;

  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const currentLanguage=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';

  /* site.js creates Lenis immediately after this file runs. Stop it on the next
     task so the entry screen owns the viewport even if a wheel event arrives. */
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

    /* Keep the cleared layer around for two painted frames. This gives Safari
       and mobile GPUs a chance to commit the fully-open mask before the overlay
       node disappears, eliminating the one-frame residue during handoff. */
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      gate.remove();
      document.documentElement.classList.remove('is-entry-gated');
      window.__lenis?.start?.();
    }));
  }

  function finishImmediate(){
    gate.classList.add('is-cleared');
    gate.remove();
    document.documentElement.classList.remove('is-entry-gated');
    window.__lenis?.start?.();
  }

  function startFinalReveal(){
    let settled=false;
    const settle=()=>{
      if(settled)return;
      settled=true;
      gate.removeEventListener('animationend',onAnimationEnd);
      releaseGate();
    };
    const onAnimationEnd=event=>{
      if(event.animationName!=='entrySurfaceReveal')return;
      settle();
    };

    gate.addEventListener('animationend',onAnimationEnd);
    gate.classList.add('is-revealing');

    /* Fade the word/ripples late enough that they remain part of the water scene,
       while the opaque surface itself continues its longer radial reveal. */
    setTimeout(()=>gate.classList.add('is-finishing'),MOTION.scene);

    /* animationend is the canonical finish signal; this is only a defensive
       escape hatch for browsers that fail to report pseudo-element animations. */
    revealFallback=setTimeout(settle,MOTION.epic+220);
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

    startFinalReveal();
  }

  buttons.forEach(button=>{
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>choose(button.dataset.entryLang,button));
  });
})();
