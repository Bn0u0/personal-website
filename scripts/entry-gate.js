(()=>{
  const gate=document.querySelector('.entry-gate');
  if(!gate){
    document.documentElement.classList.remove('is-entry-gated');
    return;
  }

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION={micro:180,ui:320,content:560,scene:1000};
  const buttons=[...gate.querySelectorAll('[data-entry-lang]')];
  const welcome=gate.querySelector('.entry-gate__welcome');
  let committed=false;

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

        /* lang.js may have initialized from the saved value before we ever need
           to touch the toggle. If it is settled, the selected language is ready. */
        if(current===next&&(!toggle||!toggle.disabled)){
          resolve();
          return;
        }

        /* When the existing controller is already live, let it perform the real
           copy/font swap. Its own transition stays hidden beneath this gate. */
        if(toggle&&!toggle.disabled&&!requestedToggle&&current!==next){
          requestedToggle=true;
          toggle.click();
        }

        /* Defensive fallback: never trap the visitor at the gate if a language
           script fails. The preference still persists for the next controller run. */
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

  function finish(){
    gate.classList.add('is-finishing');
    setTimeout(()=>{
      gate.remove();
      document.documentElement.classList.remove('is-entry-gated');
      window.__lenis?.start?.();
    },reduced?0:MOTION.ui);
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
      finish();
      return;
    }

    await delay(MOTION.ui);
    gate.classList.add('is-welcoming');

    /* Give the word and first ripple one full CONTENT beat, but never expose
       the underlying site until the existing language controller is settled. */
    await Promise.all([
      languageReady,
      delay(MOTION.content)
    ]);

    gate.classList.add('is-revealing');

    /* Fade the word only after the expanding radial hole has become readable;
       the ripple remains the visual edge that carries the page away. */
    setTimeout(()=>gate.classList.add('is-finishing'),MOTION.content);
    setTimeout(()=>{
      gate.remove();
      document.documentElement.classList.remove('is-entry-gated');
      window.__lenis?.start?.();
    },MOTION.scene);
  }

  buttons.forEach(button=>{
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>choose(button.dataset.entryLang,button));
  });
})();
