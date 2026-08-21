(()=>{
  const TIMELINES=Object.freeze({
    picnest:'2026.05.11 — 2026.08.14',
    quant:'2026.01.15 — 2026.08.21',
    grass:'2025.12.16 — 2026.08.21',
    doodle:'2026.04.23',
    learning:'2026.01.04',
    pixel:'2026.01.08 — 2026.01.10'
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