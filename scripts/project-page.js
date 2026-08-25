(()=>{
  const key=document.body.dataset.projectPage;
  const p=window.__portfolioProjects?.[key];
  if(!p)return;
  const root=document.documentElement;
  const preferred=(()=>{try{return localStorage.getItem('bn0u0-language')}catch(e){return null}})();
  const initial=preferred==='zh'?'zh':'en';
  root.lang=initial==='zh'?'zh-Hant':'en';
  const esc=s=>String(s??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  const set=(sel,value)=>{const el=document.querySelector(sel);if(el)el.textContent=value};
  const setAll=(sel,value)=>document.querySelectorAll(sel).forEach(el=>{el.textContent=value});

  function syncStructuredData(){
    let node=document.querySelector('script[data-project-schema]');
    if(!node){node=document.createElement('script');node.type='application/ld+json';node.dataset.projectSchema='true';document.head.appendChild(node)}
    node.textContent=JSON.stringify({
      '@context':'https://schema.org',
      '@type':'CreativeWork',
      name:p.title,
      description:p.en?.description||'',
      creator:{'@type':'Person',name:'BN0U0'},
      url:`https://personal-website-eta-navy-67.vercel.app${p.route}`,
      dateModified:'2026-08-25'
    });
  }

  const render=()=>{
    const zh=root.lang.toLowerCase().startsWith('zh');
    const c=zh?p.zh:p.en;
    set('.case-kicker__type',c.meta);
    set('.case-title',p.title);
    set('.case-period',p.period);
    set('.case-headline',c.headline);
    set('.case-description',c.description);
    set('.overview-copy',c.overview);
    set('.core-copy',c.core);
    set('.engineering-copy',c.engineering);
    setAll('.status-copy',c.below);
    set('.status-title',p.status);
    set('.case-back',zh?'← 回到作品':'← Back to work');
    set('.lang-toggle',zh?'EN':'中文');
    set('.case-system__label','SYSTEM / VERIFIED');
    const nodes=document.querySelector('.case-system__nodes');
    if(nodes)nodes.innerHTML=(c.evidence||[]).map((e,i)=>`<article class="system-node"><span>0${i+1} / ${esc(e[0])}</span><strong>${esc(e[1])}</strong><p>${esc(e[2])}</p></article>`).join('');
    const evidence=document.querySelector('.evidence-grid');
    if(evidence)evidence.innerHTML=(c.evidence||[]).map((e,i)=>`<article class="evidence-card"><span>E${String(i+1).padStart(2,'0')} / ${esc(e[0])}</span><strong>${esc(e[1])}</strong><p>${esc(e[2])}</p></article>`).join('');
    const decisions=document.querySelector('.decision-list');
    if(decisions)decisions.innerHTML=(c.decisions||[]).map((d,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${esc(d)}</p></li>`).join('');
    const actions=document.querySelector('.case-actions');
    if(actions){actions.innerHTML=[p.liveUrl?`<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">LIVE BUILD ↗</a>`:'',p.sourceUrl?`<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">SOURCE ↗</a>`:''].filter(Boolean).join('')}
    document.querySelectorAll('[data-section-label]').forEach(el=>{
      const k=el.dataset.sectionLabel;
      const labels={overview:zh?'專案 / OVERVIEW':'PROJECT / OVERVIEW',evidence:zh?'證據 / EVIDENCE':'PROOF / EVIDENCE',decision:zh?'演變 / DECISION TRACE':'EVOLUTION / DECISION TRACE',status:zh?'目前 / STATUS':'NOW / STATUS'};
      el.textContent=labels[k]||el.textContent;
    });
  };

  document.querySelector('.lang-toggle')?.addEventListener('click',()=>{
    const next=root.lang.toLowerCase().startsWith('zh')?'en':'zh';
    root.lang=next==='zh'?'zh-Hant':'en';
    try{localStorage.setItem('bn0u0-language',next)}catch(e){}
    render();
  });
  syncStructuredData();
  render();
})();