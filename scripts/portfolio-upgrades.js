(()=>{
  const P=window.__portfolioProjects||{};
  if(!Object.keys(P).length)return;
  const root=document.documentElement;
  const detail=document.querySelector('.project-detail');
  const detailClose=detail?.querySelector('.project-detail__close');
  const detailTop=detail?.querySelector('.project-detail__top');
  const detailMedia=detail?.querySelector('.project-detail__media');
  const below=detail?.querySelector('.detail-below-copy');
  const lang=()=>root.lang.toLowerCase().startsWith('zh')?'zh':'en';
  let currentKey='picnest';
  let uiClosing=false;

  if(detail)detail.setAttribute('tabindex','-1');

  window.__portfolioRuntime=Object.freeze({
    pointer:matchMedia('(pointer:fine)').matches?'fine':'coarse',
    reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,
    project:key=>P[key]||null
  });

  const esc=s=>String(s??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  function projectCopy(p){return p?.[lang()]||p?.en||{}}

  function ensureCaseLink(){
    if(!detailTop)return null;
    let link=detailTop.querySelector('.project-detail__case-link');
    if(!link){
      link=document.createElement('a');
      link.className='project-detail__case-link';
      link.dataset.cursor='READ';
      link.textContent='Case study ↗';
      detailTop.insertBefore(link,detailClose||null);
    }
    return link;
  }

  function renderEvidence(key){
    const p=P[key];
    if(!p||!detail)return;
    currentKey=key;
    const c=projectCopy(p);
    detail.dataset.project=key;
    detail.querySelector('.detail-number')?.replaceChildren(document.createTextNode(p.number));
    detail.querySelector('.detail-year')?.replaceChildren(document.createTextNode(p.period));
    detail.querySelector('.project-detail__title')?.replaceChildren(document.createTextNode(p.title));
    detail.querySelector('.project-detail__headline')?.replaceChildren(document.createTextNode(c.headline||''));
    detail.querySelector('.project-detail__description')?.replaceChildren(document.createTextNode(c.description||''));
    const tags=detail.querySelector('.project-detail__tags');
    if(tags)tags.innerHTML=(p.stack||[]).map(t=>`<span>${esc(t)}</span>`).join('');
    detail.querySelector('.detail-media-number')?.replaceChildren(document.createTextNode(p.number));
    detail.querySelector('.detail-media-title')?.replaceChildren(document.createTextNode(p.mediaTitle));

    const link=ensureCaseLink();
    if(link){link.href=p.route;link.setAttribute('aria-label',`${p.title} full case study`)}

    if(detailMedia){
      detailMedia.dataset.project=key;
      const slot=detailMedia.querySelector('.detail-image-slot');
      if(slot)slot.textContent=lang()==='zh'?'證據 / VERIFIED SYSTEM':'Evidence / verified system';
      let rail=detailMedia.querySelector('.detail-evidence-rail');
      if(!rail){rail=document.createElement('div');rail.className='detail-evidence-rail';detailMedia.appendChild(rail)}
      rail.innerHTML=(c.evidence||[]).map((e,i)=>`<div class="detail-evidence-chip"><span>${String(i+1).padStart(2,'0')} / ${esc(e[0])}</span><strong>${esc(e[1])}</strong></div>`).join('');
    }

    if(below){
      const evidence=(c.evidence||[]).map((e,i)=>`<article class="evidence-card"><span class="evidence-card__index">E${String(i+1).padStart(2,'0')}</span><span class="evidence-card__label">${esc(e[0])}</span><strong>${esc(e[1])}</strong><p>${esc(e[2])}</p></article>`).join('');
      const decisions=(c.decisions||[]).map((d,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(d)}</p></li>`).join('');
      const actions=[
        p.liveUrl?`<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">LIVE BUILD ↗</a>`:'',
        p.sourceUrl?`<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">SOURCE ↗</a>`:'',
        `<a href="${esc(p.route)}">FULL CASE STUDY ↗</a>`
      ].filter(Boolean).join('');
      below.innerHTML=`
        <section class="detail-story-block"><span class="detail-story-kicker">OVERVIEW</span><p class="detail-overview">${esc(c.overview||'')}</p></section>
        <section class="detail-story-grid"><article><span>CORE SYSTEM</span><p>${esc(c.core||'')}</p></article><article><span>ENGINEERING</span><p>${esc(c.engineering||'')}</p></article><article><span>CURRENT STATUS</span><p>${esc(c.below||'')}</p></article></section>
        <section class="detail-evidence-section"><div class="detail-section-head"><span>EVIDENCE</span><span>${(c.evidence||[]).length.toString().padStart(2,'0')} VERIFIED POINTS</span></div><div class="detail-evidence-grid">${evidence}</div></section>
        <section class="detail-decision-section"><div class="detail-section-head"><span>DECISION TRACE</span><span>WHY IT BECAME THIS</span></div><ol class="decision-trace">${decisions}</ol></section>
        <div class="detail-actions">${actions}</div>`;
    }
  }

  function syncRows(){
    document.querySelectorAll('.project-item[data-project]').forEach(item=>{
      const p=P[item.dataset.project];
      if(!p)return;
      const c=projectCopy(p);
      const year=item.querySelector('.project-row__year');
      const meta=item.querySelector('.project-row__meta');
      if(year)year.textContent=p.period;
      if(meta)meta.textContent=c.meta||meta.textContent;
    });
  }

  function pushProjectRoute(key){
    const p=P[key];
    if(!p||location.pathname===p.route)return;
    history.pushState({project:key},'',p.route);
  }

  document.addEventListener('click',event=>{
    const row=event.target.closest?.('.project-item[data-project] .project-row');
    if(!row)return;
    const key=row.closest('.project-item')?.dataset.project;
    if(!P[key])return;
    currentKey=key;
    pushProjectRoute(key);
    queueMicrotask(()=>renderEvidence(key));
    requestAnimationFrame(()=>renderEvidence(key));
  },true);

  function historyClose(){
    if(!history.state?.project)return;
    uiClosing=true;
    history.back();
    setTimeout(()=>{uiClosing=false},750);
  }
  detailClose?.addEventListener('pointerdown',historyClose,true);
  detailClose?.addEventListener('click',historyClose,true);
  addEventListener('keydown',event=>{
    if(event.key==='Escape'&&detail?.classList.contains('is-open'))historyClose();
  },true);

  addEventListener('popstate',()=>{
    if(uiClosing)return;
    if(detail?.classList.contains('is-open')&&location.pathname==='/'){
      detailClose?.click();
    }
  });

  const background=[document.querySelector('.site-header'),document.querySelector('main'),document.querySelector('.site-footer'),document.querySelector('.profile-card')].filter(Boolean);
  function syncInert(){
    const open=document.body.classList.contains('is-detail-open')||document.body.classList.contains('is-archive-open')||document.body.classList.contains('is-ai-depth-open');
    background.forEach(el=>{if(open)el.setAttribute('inert','');else el.removeAttribute('inert')});
  }
  new MutationObserver(syncInert).observe(document.body,{attributes:true,attributeFilter:['class']});

  function addNow(){
    const footer=document.querySelector('.site-footer');
    if(!footer||document.querySelector('.now-strip'))return;
    const now=document.createElement('section');
    now.className='now-strip';
    now.setAttribute('aria-label','Current work');
    now.innerHTML='<span>NOW / AUG 2026</span><p>Personal Digital Laboratory · PicNest reliability · Quant V8 replay</p><a href="#work">CURRENT WORK ↗</a>';
    footer.parentNode.insertBefore(now,footer);
  }

  const langObserver=new MutationObserver(()=>{syncRows();if(detail?.classList.contains('is-open'))renderEvidence(currentKey)});
  langObserver.observe(root,{attributes:true,attributeFilter:['lang']});
  addNow();
  syncRows();
  syncInert();

  window.__portfolioOpenProject=key=>{if(P[key])renderEvidence(key)};
})();