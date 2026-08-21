(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  if(reduced||!fine)return;

  const surfaces=[
    {el:document.querySelector('.hero'),weight:1,dark:false},
    {el:document.querySelector('.work'),weight:1,dark:false},
    {el:document.querySelector('.manifesto'),weight:.78,dark:true},
    {el:document.querySelector('.about-ai'),weight:.78,dark:true},
    {el:document.querySelector('.site-footer'),weight:.66,dark:false},
    {el:document.querySelector('.project-archive'),weight:.48,dark:false},
    {el:document.querySelector('.project-detail'),weight:.24,dark:true}
  ].filter(item=>item.el);

  surfaces.forEach(item=>{
    item.el.classList.add('surface-response');
    if(item.dark)item.el.classList.add('surface-response--dark');
    item.alpha=0;
  });

  let targetX=innerWidth/2,targetY=innerHeight/2;
  let fieldX=targetX,fieldY=targetY;
  let lastX=targetX,lastY=targetY,lastT=performance.now();
  let speed=0;
  let lastMove=0;
  let radius=205;
  let inside=true;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const cursor=document.querySelector('.cursor');
  const detail=document.querySelector('.project-detail');
  const archive=document.querySelector('.project-archive');

  addEventListener('pointermove',event=>{
    const now=performance.now();
    const dt=Math.max(8,now-lastT);
    const distance=Math.hypot(event.clientX-lastX,event.clientY-lastY);
    speed=clamp(distance/(dt/16.67),0,48);
    targetX=event.clientX;
    targetY=event.clientY;
    lastX=event.clientX;
    lastY=event.clientY;
    lastT=now;
    lastMove=now;
    inside=true;
  },{passive:true});

  document.addEventListener('mouseleave',()=>{inside=false});
  document.addEventListener('mouseenter',()=>{inside=true});

  function surfaceAt(x,y){
    if(detail?.classList.contains('is-open'))return surfaces.find(s=>s.el===detail)||null;
    if(archive?.classList.contains('is-open'))return surfaces.find(s=>s.el===archive)||null;
    for(const item of surfaces){
      if(item.el===detail||item.el===archive)continue;
      const rect=item.el.getBoundingClientRect();
      if(x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom)return item;
    }
    return null;
  }

  function frame(now){
    fieldX+=(targetX-fieldX)*.12;
    fieldY+=(targetY-fieldY)*.12;

    const active=surfaceAt(fieldX,fieldY);
    const idle=Math.max(0,now-lastMove);
    const activeCursor=cursor?.classList.contains('is-active');
    const motionStrength=idle<110?clamp(.013+speed*.00034,.013,.029):0;
    const desiredRadius=190+Math.min(speed*1.1,44);
    radius+=(desiredRadius-radius)*.08;
    speed*=.87;

    for(const item of surfaces){
      let desired=0;
      if(inside&&item===active){
        desired=motionStrength*item.weight*(activeCursor?.22:1);
        if(idle>=110){
          const fade=clamp(1-(idle-110)/720,0,1);
          desired=.011*item.weight*fade*(activeCursor?.22:1);
        }
      }
      item.alpha+=(desired-item.alpha)*.10;

      if(item.alpha<.00015){
        item.alpha=0;
        item.el.style.setProperty('--surface-core','0');
        item.el.style.setProperty('--surface-mid','0');
        item.el.style.setProperty('--surface-ring','0');
        continue;
      }

      if(item===active){
        const rect=item.el.getBoundingClientRect();
        item.el.style.setProperty('--surface-x',`${(fieldX-rect.left).toFixed(2)}px`);
        item.el.style.setProperty('--surface-y',`${(fieldY-rect.top).toFixed(2)}px`);
        item.el.style.setProperty('--surface-radius',`${radius.toFixed(1)}px`);
      }

      const darkScale=item.dark?.86:1;
      const core=item.alpha*darkScale;
      item.el.style.setProperty('--surface-core',core.toFixed(4));
      item.el.style.setProperty('--surface-mid',(core*.34).toFixed(4));
      item.el.style.setProperty('--surface-ring',(core*.16).toFixed(4));
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
