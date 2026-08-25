(()=>{
  if(window.__labLensMounted)return;
  window.__labLensMounted=true;
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;

  const toggle=document.createElement('button');
  toggle.type='button';
  toggle.className='lab-lens-toggle';
  toggle.setAttribute('aria-pressed','false');
  toggle.innerHTML='<span>LAB</span><span class="lab-lens-toggle__state">OFF</span>';

  const lens=document.createElement('aside');
  lens.className='lab-lens';
  lens.setAttribute('aria-hidden','true');
  lens.innerHTML=`
    <div class="lab-lens__grid" aria-hidden="true"></div>
    <div class="lab-lens__cross x" aria-hidden="true"></div>
    <div class="lab-lens__cross y" aria-hidden="true"></div>
    <div class="lab-lens__panel">
      <div><span>LAB LENS</span><strong>BN0U0 / SYSTEM VIEW</strong></div>
      <dl>
        <div><dt>CURRENT</dt><dd data-lab="current">HOME</dd></div>
        <div><dt>VIEWPORT</dt><dd data-lab="viewport">—</dd></div>
        <div><dt>INPUT</dt><dd data-lab="input">—</dd></div>
        <div><dt>MOTION</dt><dd data-lab="motion">—</dd></div>
        <div><dt>FRAME</dt><dd data-lab="fps">—</dd></div>
        <div><dt>STACK</dt><dd data-lab="stack">HTML · CSS · JS</dd></div>
      </dl>
      <p>Press <kbd>L</kbd> to close · the interface is showing its own construction.</p>
    </div>`;
  document.body.append(toggle,lens);

  let open=false;
  let current='HOME';
  const q=name=>lens.querySelector(`[data-lab="${name}"]`);
  const visibleSections=[...document.querySelectorAll('main section[id],main>.hero')];

  function currentProject(){
    const detail=document.querySelector('.project-detail.is-open');
    if(detail){
      const key=detail.dataset.project||detail.querySelector('.project-detail__media')?.dataset.project;
      if(key&&window.__portfolioProjects?.[key])return window.__portfolioProjects[key];
    }
    const key=document.body.dataset.projectPage;
    return key&&window.__portfolioProjects?.[key]?window.__portfolioProjects[key]:null;
  }

  function update(){
    const project=currentProject();
    q('current').textContent=project?project.title:current;
    q('viewport').textContent=`${innerWidth} × ${innerHeight} / DPR ${Math.round(devicePixelRatio*100)/100}`;
    q('input').textContent=`${fine?'POINTER · FINE':'TOUCH · COARSE'}`;
    q('motion').textContent=reduced?'REDUCED':(getComputedStyle(root).getPropertyValue('--motion-content').trim()||'560ms CONTENT');
    q('stack').textContent=project?(project.stack||[]).slice(0,4).join(' · '):'HTML · CSS · JS · LENIS';
  }

  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible||currentProject())return;
    const el=visible.target;
    current=el.classList.contains('hero')?'HOME':(el.id||el.className).toUpperCase().replaceAll('-',' / ');
    if(open)update();
  },{threshold:[.25,.45,.65]});
  visibleSections.forEach(el=>observer.observe(el));

  let samples=[];
  let last=performance.now();
  function frame(now){
    const delta=now-last;last=now;
    if(delta>0&&delta<1000){samples.push(delta);if(samples.length>40)samples.shift()}
    if(open&&samples.length){
      const avg=samples.reduce((a,b)=>a+b,0)/samples.length;
      q('fps').textContent=`~${Math.min(120,Math.round(1000/avg))} FPS`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function setOpen(next){
    open=!!next;
    root.classList.toggle('is-lab-lens',open);
    lens.setAttribute('aria-hidden',String(!open));
    toggle.setAttribute('aria-pressed',String(open));
    toggle.querySelector('.lab-lens-toggle__state').textContent=open?'ON':'OFF';
    if(open)update();
  }
  toggle.addEventListener('click',()=>setOpen(!open));
  addEventListener('keydown',event=>{
    if(event.key.toLowerCase()!=='l'||event.metaKey||event.ctrlKey||event.altKey)return;
    if(event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||event.target?.isContentEditable)return;
    setOpen(!open);
  });
  addEventListener('resize',()=>{if(open)update()},{passive:true});
  new MutationObserver(()=>{if(open)update()}).observe(document.body,{attributes:true,attributeFilter:['class','data-project-page']});
})();