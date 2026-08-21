(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  const footer=document.querySelector('.site-footer');
  if(footer&&!footer.id)footer.id='site-footer';

  const sections=[
    {el:document.querySelector('.hero'),href:'#work',reuse:'.hero__footer .scroll-cue'},
    {el:document.querySelector('.work'),href:'#about',reuse:'.work-scroll-cue'},
    {el:document.querySelector('.manifesto'),href:'#about-002'},
    {el:document.querySelector('.about-ai'),href:'#site-footer'}
  ].filter(item=>item.el);

  const isZh=()=>document.documentElement.lang.toLowerCase().startsWith('zh');
  const copy=()=>isZh()?'往下探索':'Scroll to explore';

  function bindMagnetic(cue){
    if(!fine||reduced||cue.dataset.sectionCueMagnetic==='true')return;
    cue.dataset.sectionCueMagnetic='true';
    cue.addEventListener('mousemove',event=>{
      const r=cue.getBoundingClientRect();
      const x=event.clientX-r.left-r.width/2;
      const y=event.clientY-r.top-r.height/2;
      cue.style.transform=`translate3d(${x*.16}px,${y*.2}px,0)`;
    });
    cue.addEventListener('mouseleave',()=>{cue.style.transform='translate3d(0,0,0)'});
  }

  function normalizeCue(item){
    let cue=item.reuse?item.el.querySelector(item.reuse):null;
    const created=!cue;
    if(!cue){
      cue=document.createElement('a');
      cue.href=item.href;
      cue.className='scroll-cue magnetic';
      item.el.appendChild(cue);
    }else if(cue.parentElement!==item.el){
      item.el.appendChild(cue);
    }

    cue.href=item.href;
    cue.classList.add('section-scroll-cue');
    if(item.el.classList.contains('work'))cue.classList.add('work-scroll-cue');
    cue.innerHTML='<span class="section-scroll-cue__label"></span><span aria-hidden="true">↓</span>';
    cue.querySelector('.section-scroll-cue__label').textContent=copy();
    cue.setAttribute('aria-label',copy());
    if(created)bindMagnetic(cue);
    return cue;
  }

  const cues=sections.map(normalizeCue);

  function syncLanguage(){
    const label=copy();
    cues.forEach(cue=>{
      const node=cue.querySelector('.section-scroll-cue__label');
      if(node&&node.textContent!==label)node.textContent=label;
      cue.setAttribute('aria-label',label);
    });
  }

  new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  syncLanguage();
})();
