(()=>{
  const P=window.__portfolioProjects||{};
  if(!Object.keys(P).length)return;
  if(P.picnest)P.picnest.period='2025.10.16 — NOW';
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

  if(!document.querySelector('link[data-picnest-case-style]')){
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='/styles/picnest-case.css';
    style.dataset.picnestCaseStyle='true';
    document.head.appendChild(style);
  }

  const caseDataReady=window.__portfolioCaseStudies?.picnest?Promise.resolve():new Promise(resolve=>{
    const existing=document.querySelector('script[data-picnest-case-data]');
    if(existing){
      if(window.__portfolioCaseStudies?.picnest){resolve();return;}
      existing.addEventListener('load',resolve,{once:true});
      existing.addEventListener('error',resolve,{once:true});
      return;
    }
    const script=document.createElement('script');
    script.src='/data/picnest-case.js';
    script.dataset.picnestCaseData='true';
    script.addEventListener('load',resolve,{once:true});
    script.addEventListener('error',resolve,{once:true});
    document.head.appendChild(script);
  });

  window.__portfolioRuntime=Object.freeze({
    pointer:matchMedia('(pointer:fine)').matches?'fine':'coarse',
    reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,
    project:key=>P[key]||null
  });

  const esc=s=>String(s??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  function projectCopy(p){return p?.[lang()]||p?.en||{}}
  function projectStory(key){return window.__portfolioCaseStudies?.[key]?.[lang()]||null}

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
    const story=projectStory(key);
    const systemEvidence=story?.systemEvidence||c.evidence||[];
    const evidenceItems=story?.evidence?.length?[...systemEvidence,...story.evidence]:(c.evidence||[]);
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
      rail.innerHTML=systemEvidence.map((e,i)=>`<div class="detail-evidence-chip"><span>${String(i+1).padStart(2,'0')} / ${esc(e[0])}</span><strong>${esc(e[1])}</strong></div>`).join('');
    }

    if(below){
      const evidence=evidenceItems.map((e,i)=>`<article class="evidence-card"><span class="evidence-card__index">E${String(i+1).padStart(2,'0')}</span><span class="evidence-card__label">${esc(e[0])}</span><strong>${esc(e[1])}</strong><p>${esc(e[2])}</p></article>`).join('');
      const decisions=(c.decisions||[]).map((d,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(d)}</p></li>`).join('');
      const journey=story?.journey?.length?`<section class="detail-journey"><div class="detail-section-head"><span>${lang()==='zh'?'歷程 / TURNING POINTS':'JOURNEY / TURNING POINTS'}</span><span>${String(story.journey.length).padStart(2,'0')} / EVOLUTION</span></div><div class="detail-journey__intro"><h3>${esc(story.journeyTitle)}</h3><p>${esc(story.journeyIntro)}</p></div><div class="detail-journey__list">${story.journey.map((step,i)=>`<article class="detail-journey-step"><div><span>${String(i+1).padStart(2,'0')}</span><small>${esc(step[0])}</small></div><div><strong>${esc(step[1])}</strong><p>${esc(step[2])}</p></div></article>`).join('')}</div><div class="detail-journey__reflection"><span>REFLECTION / 001</span><div><strong>${esc(story.reflectionTitle)}</strong><p>${esc(story.reflection)}</p></div></div></section>`:'';
      const actions=[p.liveUrl?`<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">LIVE BUILD ↗</a>`:'',p.sourceUrl?`<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">SOURCE ↗</a>`:'',`<a href="${esc(p.route)}">FULL CASE STUDY ↗</a>`].filter(Boolean).join('');
      below.innerHTML=`<section class="detail-story-block"><span class="detail-story-kicker">OVERVIEW</span><p class="detail-overview">${esc(c.overview||'')}</p></section><section class="detail-story-grid"><article><span>CORE SYSTEM</span><p>${esc(c.core||'')}</p></article><article><span>ENGINEERING</span><p>${esc(c.engineering||'')}</p></article><article><span>CURRENT STATUS</span><p>${esc(c.below||'')}</p></article></section>${journey}<section class="detail-evidence-section"><div class="detail-section-head"><span>${story?esc(story.evidenceTitle):'EVIDENCE'}</span><span>${evidenceItems.length.toString().padStart(2,'0')} VERIFIED POINTS</span></div>${story?.evidenceIntro?`<p class="detail-evidence-intro">${esc(story.evidenceIntro)}</p>`:''}<div class="detail-evidence-grid">${evidence}</div></section><section class="detail-decision-section"><div class="detail-section-head"><span>DECISION TRACE</span><span>WHY IT BECAME THIS</span></div><ol class="decision-trace">${decisions}</ol></section><div class="detail-actions">${actions}</div>`;
    }
  }

  function syncRows(){
    document.querySelectorAll('.project-item[data-project]').forEach(item=>{
      const p=P[item.dataset.project];if(!p)return;
      const c=projectCopy(p);const year=item.querySelector('.project-row__year');const meta=item.querySelector('.project-row__meta');
      if(year)year.textContent=p.period;if(meta)meta.textContent=c.meta||meta.textContent;
    });
  }

  function pushProjectRoute(key){const p=P[key];if(!p||location.pathname===p.route)return;history.pushState({project:key},'',p.route)}

  document.addEventListener('click',event=>{
    const row=event.target.closest?.('.project-item[data-project] .project-row');if(!row)return;
    const key=row.closest('.project-item')?.dataset.project;if(!P[key])return;
    currentKey=key;pushProjectRoute(key);queueMicrotask(()=>renderEvidence(key));requestAnimationFrame(()=>renderEvidence(key));
    if(key==='picnest')caseDataReady.then(()=>{renderEvidence(key);setTimeout(()=>renderEvidence(key),0)});
  },true);

  function historyClose(){if(uiClosing||!history.state?.project)return;uiClosing=true;history.back();setTimeout(()=>{uiClosing=false},750)}
  detailClose?.addEventListener('pointerdown',historyClose,true);detailClose?.addEventListener('click',historyClose,true);
  addEventListener('keydown',event=>{if(event.key==='Escape'&&detail?.classList.contains('is-open'))historyClose()},true);
  addEventListener('popstate',()=>{if(uiClosing)return;if(detail?.classList.contains('is-open')&&location.pathname==='/')detailClose?.click()});

  const background=[document.querySelector('.site-header'),document.querySelector('main'),document.querySelector('.site-footer'),document.querySelector('.profile-card')].filter(Boolean);
  function syncInert(){const open=document.body.classList.contains('is-detail-open')||document.body.classList.contains('is-archive-open')||document.body.classList.contains('is-ai-depth-open');background.forEach(el=>{if(open)el.setAttribute('inert','');else el.removeAttribute('inert')})}
  new MutationObserver(syncInert).observe(document.body,{attributes:true,attributeFilter:['class']});

  function addNow(){const footer=document.querySelector('.site-footer');if(!footer||document.querySelector('.now-strip'))return;const now=document.createElement('section');now.className='now-strip';now.setAttribute('aria-label','Current work');now.innerHTML='<span>NOW / AUG 2026</span><p>Personal Digital Laboratory · PicNest reliability · Quant V8 replay</p><a href="#work">CURRENT WORK ↗</a>';footer.parentNode.insertBefore(now,footer)}

  const langObserver=new MutationObserver(()=>{syncRows();if(detail?.classList.contains('is-open'))renderEvidence(currentKey)});
  langObserver.observe(root,{attributes:true,attributeFilter:['lang']});addNow();syncRows();syncInert();
  caseDataReady.then(()=>{syncRows();if(detail?.classList.contains('is-open')&&currentKey==='picnest')renderEvidence(currentKey)});
  window.__portfolioOpenProject=key=>{if(P[key])renderEvidence(key)};
})();