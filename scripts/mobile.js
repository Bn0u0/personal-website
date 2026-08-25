(()=>{
  const touchUI=matchMedia('(pointer:coarse)').matches||matchMedia('(hover:none)').matches;
  if(!touchUI)return;
  if(window.__bn0u0MobileInitialized)return;
  window.__bn0u0MobileInitialized=true;

  const root=document.documentElement;
  const shortestScreen=Math.min(screen.width||innerWidth,screen.height||innerHeight);
  const shortestViewport=Math.min(innerWidth,innerHeight);
  const phoneSized=Math.min(shortestScreen,shortestViewport)<=700;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BASE=window.__motion||{micro:180,ui:320,content:560,scene:1000,exitContent:280};
  const cssMs=(name,fallback)=>{
    const raw=getComputedStyle(root).getPropertyValue(name).trim();
    const value=parseFloat(raw);
    if(!Number.isFinite(value))return fallback;
    return raw.endsWith('s')&&!raw.endsWith('ms')?value*1000:value;
  };
  const MOTION={...BASE,showcase:cssMs('--motion-showcase',920)};

  root.classList.add('is-touch-ui');
  root.dataset.inputProfile='touch';
  root.dataset.mobileController='ready';
  if(phoneSized){
    root.classList.add('is-mobile-layout');
    root.dataset.layoutProfile='phone';
  }
  document.querySelector('.cursor')?.remove();

  let screenHeight=0;
  let lastOrientation=`${innerWidth}x${innerHeight}`;
  function captureScreen(){
    if(!phoneSized)return;
    const vv=window.visualViewport;
    const measured=Math.round(vv?.height||innerHeight);
    if(!Number.isFinite(measured)||measured<320)return;
    screenHeight=measured;
    root.style.setProperty('--mobile-screen',`${measured}px`);
    root.dataset.mobileScreen=`${measured}`;
  }
  captureScreen();

  function refreshAfterOrientation(){
    const signature=`${innerWidth}x${innerHeight}`;
    if(signature===lastOrientation)return;
    lastOrientation=signature;
    setTimeout(captureScreen,120);
    setTimeout(captureScreen,420);
  }
  addEventListener('orientationchange',()=>{
    lastOrientation='';
    setTimeout(refreshAfterOrientation,60);
  },{passive:true});
  addEventListener('pageshow',captureScreen,{passive:true});

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
      },MOTION.showcase);
    };
    new MutationObserver(syncImpact).observe(archive,{attributes:true,attributeFilter:['class']});
  }

  /* Project detail open/close is intentionally owned by site.js on every input
     profile. Mobile changes rendering cost and navigation affordances only; it
     no longer runs a second close state machine that can drift from desktop. */
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

  let cue=document.querySelector('.mobile-flow-cue');
  if(!cue){
    cue=document.createElement('button');
    cue.type='button';
    cue.className='mobile-flow-cue';
    cue.innerHTML='<span class="mobile-flow-cue__label"></span><span class="mobile-flow-cue__arrow" aria-hidden="true">↓</span>';
    document.body.appendChild(cue);
  }

  let currentIndex=0;
  let raf=0;
  const labelNode=cue.querySelector('.mobile-flow-cue__label');
  const isZh=()=>root.lang.toLowerCase().startsWith('zh');
  const label=()=>isZh()?'往下探索':'Scroll to explore';

  function syncCopy(){
    const value=label();
    labelNode.textContent=value;
    cue.setAttribute('aria-label',value);
  }

  function overlayOpen(){
    return root.classList.contains('is-entry-gated')||
      document.body.classList.contains('is-archive-open')||
      document.body.classList.contains('is-detail-open')||
      document.body.classList.contains('is-ai-depth-open');
  }

  function activeHeight(){return screenHeight||Math.round(window.visualViewport?.height||innerHeight)}

  function detectIndex(){
    const h=activeHeight();
    const probe=Math.min(h*.46,h-110);
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
    const section=flow[currentIndex]?.section;
    cue.classList.toggle('is-on-dark',!!section&&(section.classList.contains('manifesto')||section.classList.contains('about-ai')));
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

    currentIndex=Math.min(currentIndex+1,flow.length-1);
    const nextSection=flow[currentIndex]?.section;
    cue.classList.toggle('is-on-dark',!!nextSection&&(nextSection.classList.contains('manifesto')||nextSection.classList.contains('about-ai')));

    if(window.__lenis?.scrollTo){
      window.__lenis.scrollTo(target,{duration:reduced?0:1.0,force:true});
    }else{
      target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    }
    setTimeout(scheduleDetect,reduced?0:MOTION.scene);
  });

  addEventListener('scroll',scheduleDetect,{passive:true});
  addEventListener('resize',refreshAfterOrientation,{passive:true});
  new MutationObserver(()=>{
    syncCopy();
    scheduleDetect();
  }).observe(root,{attributes:true,attributeFilter:['lang','class']});
  new MutationObserver(scheduleDetect).observe(document.body,{attributes:true,attributeFilter:['class']});

  syncCopy();
  detectIndex();
})();