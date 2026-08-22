(()=>{
  const touchUI=matchMedia('(pointer:coarse)').matches||matchMedia('(hover:none)').matches;
  if(!touchUI)return;

  const shortestScreen=Math.min(screen.width||innerWidth,screen.height||innerHeight);
  const shortestViewport=Math.min(innerWidth,innerHeight);
  const phoneSized=Math.min(shortestScreen,shortestViewport)<=700;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION=window.__motion||{micro:180,ui:320,content:560,scene:1000};

  /* Capability gate: desktop code never enters this branch. Touch behavior and
     phone layout are separate flags so tablets lose the mouse cursor without
     inheriting the compact phone composition. */
  document.documentElement.classList.add('is-touch-ui');
  document.documentElement.dataset.inputProfile='touch';
  if(phoneSized){
    document.documentElement.classList.add('is-mobile-layout');
    document.documentElement.dataset.layoutProfile='phone';
  }
  document.querySelector('.cursor')?.remove();

  const canVibrate=typeof navigator.vibrate==='function';
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

  document.querySelectorAll('[data-entry-lang],.project-row').forEach(control=>{
    control.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse')return;
      haptic.impact('light');
    },{passive:true});
  });

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

  /* Phone-only persistent section control. Desktop keeps its existing per-section
     cues untouched. On phones this one button stays at one viewport coordinate
     and changes only its destination, so repeated taps can move through the page
     without the thumb chasing a new control. */
  if(!phoneSized)return;

  const footer=document.querySelector('.site-footer');
  if(footer&&!footer.id)footer.id='site-footer';

  const flow=[
    {section:document.querySelector('.hero'),target:document.querySelector('#work')},
    {section:document.querySelector('.work'),target:document.querySelector('#about')},
    {section:document.querySelector('.manifesto'),target:document.querySelector('#about-002')},
    {section:document.querySelector('.about-ai'),target:footer}
  ].filter(item=>item.section&&item.target);
  if(!flow.length)return;

  const cue=document.createElement('button');
  cue.type='button';
  cue.className='mobile-flow-cue';
  cue.innerHTML='<span class="mobile-flow-cue__label"></span><span class="mobile-flow-cue__arrow" aria-hidden="true">↓</span>';
  document.body.appendChild(cue);

  let currentIndex=0;
  let raf=0;
  const labelNode=cue.querySelector('.mobile-flow-cue__label');
  const isZh=()=>document.documentElement.lang.toLowerCase().startsWith('zh');
  const label=()=>isZh()?'往下探索':'Scroll to explore';

  function syncCopy(){
    const value=label();
    labelNode.textContent=value;
    cue.setAttribute('aria-label',value);
  }

  function overlayOpen(){
    return document.documentElement.classList.contains('is-entry-gated')||
      document.body.classList.contains('is-archive-open')||
      document.body.classList.contains('is-detail-open')||
      document.body.classList.contains('is-ai-depth-open');
  }

  function detectIndex(){
    const probe=Math.min(innerHeight*.46,innerHeight-120);
    const footerRect=footer?.getBoundingClientRect();
    if(footerRect&&footerRect.top<=probe){
      cue.hidden=true;
      return;
    }

    let hit=-1;
    let nearest=Infinity;
    flow.forEach((item,index)=>{
      const rect=item.section.getBoundingClientRect();
      if(rect.top<=probe&&rect.bottom>probe)hit=index;
      const distance=Math.abs(rect.top-probe);
      if(hit<0&&distance<nearest){nearest=distance;currentIndex=index}
    });
    if(hit>=0)currentIndex=hit;

    cue.hidden=overlayOpen();
    cue.classList.toggle('is-on-dark',flow[currentIndex].section.classList.contains('manifesto')||flow[currentIndex].section.classList.contains('about-ai'));
  }

  function scheduleDetect(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{raf=0;detectIndex()});
  }

  cue.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse')haptic.impact('light');
  },{passive:true});

  cue.addEventListener('click',()=>{
    if(overlayOpen())return;
    const item=flow[currentIndex];
    if(!item)return;
    const target=item.target;

    /* Advance the logical destination immediately. A second tap during motion can
       continue forward instead of being trapped on the previous destination. */
    currentIndex=Math.min(currentIndex+1,flow.length-1);
    cue.classList.toggle('is-on-dark',flow[currentIndex]?.section.classList.contains('manifesto')||flow[currentIndex]?.section.classList.contains('about-ai'));

    if(window.__lenis?.scrollTo){
      window.__lenis.scrollTo(target,{duration:reduced?0:1.0,force:true});
    }else{
      target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    }
    setTimeout(scheduleDetect,reduced?0:MOTION.scene);
  });

  addEventListener('scroll',scheduleDetect,{passive:true});
  addEventListener('resize',scheduleDetect,{passive:true});
  addEventListener('orientationchange',scheduleDetect,{passive:true});
  new MutationObserver(()=>{
    syncCopy();
    scheduleDetect();
  }).observe(document.documentElement,{attributes:true,attributeFilter:['lang','class']});
  new MutationObserver(scheduleDetect).observe(document.body,{attributes:true,attributeFilter:['class']});

  syncCopy();
  detectIndex();
})();
