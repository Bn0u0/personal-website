(()=>{
  const gate=document.querySelector('.entry-gate');
  if(!gate){
    document.documentElement.classList.remove('is-entry-gated');
    dispatchEvent(new CustomEvent('bn0u0:entry-complete'));
    return;
  }

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION={micro:180,ui:320,content:560,scene:1000,epic:2000};
  const SELECT={wipe:500,center:560,morph:480};
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

  function prepareSelection(button){
    const rect=button.getBoundingClientRect();
    const shiftX=innerWidth/2-(rect.left+rect.width/2);
    button.style.setProperty('--entry-selected-x',`${shiftX.toFixed(2)}px`);

    buttons.forEach(item=>{
      const selected=item===button;
      item.setAttribute('aria-pressed',String(selected));
      item.disabled=true;
      item.classList.toggle('is-entry-selected',selected);
      item.classList.toggle('is-entry-unselected',!selected);
    });
  }

  function renderedTextCenterX(element){
    const range=document.createRange();
    range.selectNodeContents(element);
    const rect=range.getBoundingClientRect();
    return rect.left+rect.width/2;
  }

  function morphSelectedToWelcome(button,selectedCopy){
    const startStyle=getComputedStyle(button);
    const startFontSize=parseFloat(startStyle.fontSize);
    const startSpacing=startStyle.letterSpacing;
    const startShift=parseFloat(button.style.getPropertyValue('--entry-selected-x'))||0;

    if(welcome){
      welcome.textContent=selectedCopy;
      welcome.style.opacity='0';
    }

    const targetStyle=welcome?getComputedStyle(welcome):startStyle;
    const targetFontSize=parseFloat(targetStyle.fontSize)||startFontSize;
    const targetSpacing=targetStyle.letterSpacing||startSpacing;

    /* Swap only after EN / 中文 has reached the centre. Measure the rendered
       welcome text at its final typography, then compensate the transform so
       the glyph run itself — not the old EN / 中文 button box — stays on 50vw. */
    button.textContent=selectedCopy;
    button.style.fontSize=`${targetFontSize}px`;
    button.style.letterSpacing=targetSpacing;
    const finalShift=startShift+(innerWidth/2-renderedTextCenterX(button));

    /* Restore the starting typography before the browser paints, then animate
       size, tracking and the small centre correction as one continuous morph. */
    button.style.fontSize=`${startFontSize}px`;
    button.style.letterSpacing=startSpacing;

    const motion=button.animate([
      {
        fontSize:`${startFontSize}px`,
        letterSpacing:startSpacing,
        transform:`translate3d(${startShift.toFixed(2)}px,0,0)`
      },
      {
        fontSize:`${targetFontSize}px`,
        letterSpacing:targetSpacing,
        transform:`translate3d(${finalShift.toFixed(2)}px,0,0)`
      }
    ],{
      duration:SELECT.morph,
      easing:'cubic-bezier(.22,.22,.72,.96)',
      fill:'forwards'
    });

    return motion.finished.catch(()=>{}).then(()=>{
      const previousTransition=button.style.transition;
      button.style.transition='none';
      button.style.setProperty('--entry-selected-x',`${finalShift.toFixed(2)}px`);
      button.style.fontSize=`${targetFontSize}px`;
      button.style.letterSpacing=targetSpacing;
      motion.cancel();
      void button.offsetWidth;
      button.style.transition=previousTransition;
    });
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

    /* 1) Erase the unselected language and slash while the selected label stays unchanged. */
    await nextPaint();
    gate.classList.add('is-selection-erasing');
    await delay(SELECT.wipe);

    /* 2) Move the original 中文 / EN label all the way to centre first. */
    gate.classList.add('is-selection-centering');
    await delay(SELECT.center);

    /* 3) Only after it reaches centre, morph the same label into 歡迎 / WELCOME.
       Font size and tracking change continuously, and the ripple starts here. */
    const fontReady=morphSelectedToWelcome(button,selectedCopy);
    gate.classList.add('is-welcoming');

    await Promise.all([
      languageReady,
      fontReady,
      delay(MOTION.scene)
    ]);

    /* 4) Fade the same visible word out, then hand off to the final surface reveal. */
    gate.classList.add('is-choosing');
    await delay(MOTION.ui);
    gate.classList.add('is-welcome-cleared');
    await nextPaint();
    startFinalReveal();
  }

  buttons.forEach(button=>{
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>choose(button.dataset.entryLang,button));
  });
})();
