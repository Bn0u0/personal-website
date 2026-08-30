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

  if(detail){
    detail.setAttribute('tabindex','-1');
    detail.setAttribute('data-lenis-prevent','');
    detail.setAttribute('data-lenis-prevent-wheel','');
    detail.setAttribute('data-lenis-prevent-touch','');
  }

  if(!document.querySelector('style[data-project-intro-journey]')){
    const style=document.createElement('style');
    style.dataset.projectIntroJourney='true';
    style.textContent=`
      .project-detail__intro-journey{
        margin-top:30px;
        padding-top:20px;
        border-top:1px solid rgba(242,240,235,.16);
        max-width:680px;
      }
      .project-detail__intro-journey[hidden]{display:none!important}
      .project-detail__intro-journey-kicker{
        display:block;
        margin-bottom:12px;
        color:rgba(242,240,235,.42);
        font-size:9px;
        line-height:1;
        letter-spacing:.11em;
        text-transform:uppercase;
      }
      .project-detail__intro-journey p{
        margin:0 0 11px!important;
        max-width:680px!important;
        color:rgba(242,240,235,.72)!important;
        font-size:12px!important;
        line-height:1.72!important;
        letter-spacing:-.005em;
      }
      .project-detail__intro-journey p:last-child{margin-bottom:0!important}
      @media(max-width:900px){
        .project-detail__intro-journey{margin-top:22px;padding-top:16px}
        .project-detail__intro-journey p{font-size:11px!important;line-height:1.68!important}
      }
    `;
    document.head.appendChild(style);
  }

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
  const projectCopy=p=>p?.[lang()]||p?.en||{};
  const projectStory=key=>window.__portfolioCaseStudies?.[key]?.[lang()]||null;

  const PICNEST_INTRO={
    zh:[
      'PicNest 並不是從 PicNest 2.0 才開始。第一代 PicNest 的 Git 歷史從 2025.10.16 開始；最初只是想做出一個能保存內容、能互動、也能讓人留下痕跡的數位空間。短時間內，登入、貨幣、拍攝、遊戲循環與多人房間快速出現，但功能越多，也越逼我重新回答一次：這個地方真正想成為什麼？',
      '2026.05.11，我選擇把 PicNest 2.0 當成一次重做，而不是替舊系統繼續疊功能。房間逐漸變成一座島，收藏逐漸變成探索，Peep 也從等待玩家操作的內容，變成會依需求、個性、距離與世界狀態做決定的居民。玩家不再是世界的控制者，而是進入一個原本就有自己規則的地方。',
      '這個專案也改變了我對「進度」的理解。早期我很容易把速度當成進步；後來才開始接受：能運作的程式也可能走錯方向，已經投入的時間不是保留舊架構的理由，有時候停止加功能反而是最重要的開發決定。現在的 PicNest 更在意自主性、可靠性與信任——我想做的不是功能最多的遊戲，而是一個即使沒有任務逼你前進，也仍然值得回來看看的小世界。'
    ],
    en:[
      'PicNest did not begin with PicNest 2.0. The first repository starts on 2025-10-16 as an attempt to make a digital place that could preserve things, support interaction and let people leave traces behind. Authentication, currency, capture, a game loop and multiplayer rooms arrived quickly, but every new feature made the same question harder to avoid: what was this place actually trying to become?',
      'On 2026-05-11, PicNest 2.0 became a rebuild rather than another layer on top of the old system. A room gradually became an island, collection became discovery, and Peeps moved from passive content toward inhabitants that choose actions from needs, traits, distance and world state. The player stopped being the controller of the world and became someone entering a place with rules of its own.',
      'The project also changed how I define progress. Early on, speed was easy to mistake for progress. PicNest forced me to accept that working code can still point in the wrong direction, sunk cost is not a reason to preserve an architecture, and sometimes stopping feature growth is the most important development decision. Today the project prioritizes autonomy, reliability and trust: not the game with the most features, but a small world worth returning to even when nothing is asking the player to perform.'
    ]
  };

  function ensureIntroJourney(){
    const copy=detail?.querySelector('.project-detail__copy');
    if(!copy)return null;
    let block=copy.querySelector('.project-detail__intro-journey');
    if(!block){
      block=document.createElement('div');
      block.className='project-detail__intro-journey';
      const tags=copy.querySelector('.project-detail__tags');
      (tags?.parentNode||copy).insertBefore(block,tags?.nextSibling||null);
    }
    return block;
  }

  function renderIntroJourney(key){
    const block=ensureIntroJourney();
    if(!block)return;
    if(key!=='picnest'){
      block.hidden=true;
      block.innerHTML='';
      return;
    }
    block.hidden=false;
    const paragraphs=PICNEST_INTRO[lang()]||PICNEST_INTRO.en;
    block.innerHTML=`<span class="project-detail__intro-journey-kicker">${lang()==='zh'?'PROJECT JOURNEY / 創作歷程':'PROJECT JOURNEY / CREATOR NOTES'}</span>${paragraphs.map(text=>`<p>${esc(text)}</p>`).join('')}`;
  }

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
    detail.querySelector('.detail-year')?.replaceChildren(document.createTextNode(key==='picnest'?'2025.10.16 — NOW':p.period));
    detail.querySelector('.project-detail__title')?.replaceChildren(document.createTextNode(p.title));
    detail.querySelector('.project-detail__headline')?.replaceChildren(document.createTextNode(c.headline||''));
    detail.querySelector('.project-detail__description')?.replaceChildren(document.createTextNode(c.description||''));

    const tags=detail.querySelector('.project-detail__tags');
    if(tags)tags.innerHTML=(p.stack||[]).map(t=>`<span>${esc(t)}</span>`).join('');
    renderIntroJourney(key);

    detail.querySelector('.detail-media-number')?.replaceChildren(document.createTextNode(p.number));
    detail.querySelector('.detail-media-title')?.replaceChildren(document.createTextNode(p.mediaTitle));

    const link=ensureCaseLink();
    if(link){
      link.href=p.route;
      link.setAttribute('aria-label',`${p.title} full case study`);
    }

    if(detailMedia){
      detailMedia.dataset.project=key;
      const slot=detailMedia.querySelector('.detail-image-slot');
      if(slot)slot.textContent=lang()==='zh'?'證據 / VERIFIED SYSTEM':'Evidence / verified system';
      let rail=detailMedia.querySelector('.detail-evidence-rail');
      if(!rail){rail=document.createElement('div');rail.className='detail-evidence-rail';detailMedia.appendChild(rail)}
      rail.innerHTML=systemEvidence.map((e,i)=>`<div class="detail-evidence-chip"><span>${String(i+1).padStart(2,'0')} / ${esc(e[0])}</span><strong>${esc(e[1])}</strong></div>`).join('');
    }

    if(!below)return;
    const evidence=evidenceItems.map((e,i)=>`<article class="evidence-card"><span class="evidence-card__index">E${String(i+1).padStart(2,'0')}</span><span class="evidence-card__label">${esc(e[0])}</span><strong>${esc(e[1])}</strong><p>${esc(e[2])}</p></article>`).join('');
    const decisions=(c.decisions||[]).map((d,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(d)}</p></li>`).join('');
    const journey=story?.journey?.length?`<section class="detail-journey" aria-label="PicNest evolution"><div class="detail-section-head"><span>${lang()==='zh'?'歷程 / TURNING POINTS':'JOURNEY / TURNING POINTS'}</span><span>${String(story.journey.length).padStart(2,'0')} / EVOLUTION</span></div><div class="detail-journey__intro"><h3>${esc(story.journeyTitle)}</h3><p>${esc(story.journeyIntro)}</p></div><div class="detail-journey__list">${story.journey.map((step,i)=>`<article class="detail-journey-step"><div><span>${String(i+1).padStart(2,'0')}</span><small>${esc(step[0])}</small></div><div><strong>${esc(step[1])}</strong><p>${esc(step[2])}</p></div></article>`).join('')}</div><div class="detail-journey__reflection"><span>REFLECTION / 001</span><div><strong>${esc(story.reflectionTitle)}</strong><p>${esc(story.reflection)}</p></div></div></section>`:'';
    const actions=[p.liveUrl?`<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">LIVE BUILD ↗</a>`:'',p.sourceUrl?`<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">SOURCE ↗</a>`:'',`<a href="${esc(p.route)}">FULL CASE STUDY ↗</a>`].filter(Boolean).join('');

    below.innerHTML=`<section class="detail-story-block"><span class="detail-story-kicker">OVERVIEW</span><p class="detail-overview">${esc(c.overview||'')}</p></section><section class="detail-story-grid"><article><span>CORE SYSTEM</span><p>${esc(c.core||'')}</p></article><article><span>ENGINEERING</span><p>${esc(c.engineering||'')}</p></article><article><span>CURRENT STATUS</span><p>${esc(c.below||'')}</p></article></section>${journey}<section class="detail-evidence-section"><div class="detail-section-head"><span>${story?esc(story.evidenceTitle):'EVIDENCE'}</span><span>${evidenceItems.length.toString().padStart(2,'0')} VERIFIED POINTS</span></div>${story?.evidenceIntro?`<p class="detail-evidence-intro">${esc(story.evidenceIntro)}</p>`:''}<div class="detail-evidence-grid">${evidence}</div></section><section class="detail-decision-section"><div class="detail-section-head"><span>DECISION TRACE</span><span>WHY IT BECAME THIS</span></div><ol class="decision-trace">${decisions}</ol></section><div class="detail-actions">${actions}</div>`;
  }

  function syncRows(){
    document.querySelectorAll('.project-item[data-project]').forEach(item=>{
      const p=P[item.dataset.project];
      if(!p)return;
      const c=projectCopy(p);
      const year=item.querySelector('.project-row__year');
      const meta=item.querySelector('.project-row__meta');
      if(year)year.textContent=item.dataset.project==='picnest'?'2025.10.16 — NOW':p.period;
      if(meta)meta.textContent=c.meta||meta.textContent;
    });
  }

  function pushProjectRoute(key){const p=P[key];if(!p||location.pathname===p.route)return;history.pushState({project:key},'',p.route)}

  document.addEventListener('click',event=>{
    const row=event.target.closest?.('.project-item[data-project] .project-row');
    if(!row)return;
    const key=row.closest('.project-item')?.dataset.project;
    if(!P[key])return;
    currentKey=key;
    pushProjectRoute(key);
    renderEvidence(key);
    requestAnimationFrame(()=>renderEvidence(key));
    if(key==='picnest')caseDataReady.then(()=>{renderEvidence(key);detail?.scrollTo({top:0,left:0,behavior:'instant'})});
  });

  function historyClose(){if(uiClosing||!history.state?.project)return;uiClosing=true;history.back();setTimeout(()=>{uiClosing=false},750)}
  detailClose?.addEventListener('pointerdown',historyClose,true);
  detailClose?.addEventListener('click',historyClose,true);
  addEventListener('keydown',event=>{if(event.key==='Escape'&&detail?.classList.contains('is-open'))historyClose()},true);
  addEventListener('popstate',()=>{if(uiClosing)return;if(detail?.classList.contains('is-open')&&location.pathname==='/')detailClose?.click()});

  const background=[document.querySelector('.site-header'),document.querySelector('main'),document.querySelector('.site-footer'),document.querySelector('.profile-card')].filter(Boolean);
  function syncInert(){const open=document.body.classList.contains('is-detail-open')||document.body.classList.contains('is-archive-open')||document.body.classList.contains('is-ai-depth-open');background.forEach(el=>{if(open)el.setAttribute('inert','');else el.removeAttribute('inert')})}
  new MutationObserver(syncInert).observe(document.body,{attributes:true,attributeFilter:['class']});

  const langObserver=new MutationObserver(()=>{syncRows();if(detail?.classList.contains('is-open'))renderEvidence(currentKey)});
  langObserver.observe(root,{attributes:true,attributeFilter:['lang']});
  syncRows();syncInert();
  caseDataReady.then(()=>{if(detail?.classList.contains('is-open')&&currentKey==='picnest')renderEvidence(currentKey)});
  window.__portfolioOpenProject=key=>{if(P[key])renderEvidence(key)};
})();