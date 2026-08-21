(()=>{
  const TIMELINES=Object.freeze({
    picnest:'11 MAY 2026 — 14 AUG 2026',
    quant:'15 JAN 2026 — 21 AUG 2026',
    grass:'16 DEC 2025 — 21 AUG 2026',
    doodle:'23 APR 2026',
    learning:'04 JAN 2026',
    pixel:'08 JAN 2026 — 10 JAN 2026'
  });

  let currentKey='picnest';

  function setText(node,value){
    if(node&&node.textContent!==value)node.textContent=value;
  }

  function applyRows(){
    document.querySelectorAll('.project-item[data-project]').forEach(item=>{
      const timeline=TIMELINES[item.dataset.project];
      if(!timeline)return;
      setText(item.querySelector('.project-row__year'),timeline);
    });
  }

  function applyDetail(){
    const timeline=TIMELINES[currentKey];
    if(!timeline)return;
    setText(document.querySelector('.detail-year'),timeline);
  }

  function refresh(){
    applyRows();
    applyDetail();
  }

  document.addEventListener('click',event=>{
    const row=event.target.closest?.('.project-item[data-project] .project-row');
    if(!row)return;
    currentKey=row.closest('.project-item')?.dataset.project||currentKey;
    queueMicrotask(applyDetail);
    setTimeout(applyDetail,0);
  });

  const detail=document.querySelector('.project-detail');
  if(detail){
    new MutationObserver(()=>{
      const expected=TIMELINES[currentKey];
      const node=document.querySelector('.detail-year');
      if(node&&expected&&node.textContent!==expected)setText(node,expected);
    }).observe(detail,{childList:true,subtree:true});
  }

  refresh();
  window.__bn0u0ProjectTimelines=TIMELINES;
})();