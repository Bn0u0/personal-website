(()=>{
  const touchUI=matchMedia('(pointer:coarse)').matches||matchMedia('(hover:none)').matches;
  if(!touchUI)return;

  document.documentElement.classList.add('is-touch-ui');
  document.querySelector('.cursor')?.remove();

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION=window.__motion||{micro:180,ui:320,content:560,scene:1000};
  const canVibrate=typeof navigator.vibrate==='function';

  /* Progressive haptics: Android/Chromium-class browsers can use the Vibration
     API. Unsupported browsers (notably iOS Safari) simply keep the same visual
     feedback with no fake audio or cursor substitute. */
  const haptic={
    supported:canVibrate,
    impact(level='light'){
      if(reduced||!canVibrate)return false;
      const duration=level==='medium'?14:level==='heavy'?22:8;
      try{return navigator.vibrate(duration)}catch(e){return false}
    },
    cancel(){
      if(!canVibrate)return false;
      try{return navigator.vibrate(0)}catch(e){return false}
    }
  };
  window.__haptic=haptic;

  /* Touch gets a short tactile acknowledgement instead of the desktop cursor
     dot. Keep it selective: language choice and project entry, never scrolling. */
  document.querySelectorAll('[data-entry-lang],.project-row').forEach(control=>{
    control.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse')return;
      haptic.impact('light');
    },{passive:true});
  });

  /* The All Projects wall collision already has a visual screen impact. Match
     that physical event on supported phones, but intentionally keep close silent. */
  const archive=document.querySelector('.project-archive');
  if(archive){
    let impactTimer=0;
    const syncImpact=()=>{
      clearTimeout(impactTimer);
      if(!archive.classList.contains('is-split-opening'))return;
      impactTimer=setTimeout(()=>{
        if(archive.classList.contains('is-split-opening'))haptic.impact('medium');
      },MOTION.content);
    };
    new MutationObserver(syncImpact).observe(archive,{attributes:true,attributeFilter:['class']});
  }
})();
