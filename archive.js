(()=>{
  const archive=document.querySelector('.project-archive');
  const trigger=document.querySelector('.work-more');
  const close=document.querySelector('.project-archive__close');
  if(!archive||!trigger||!close)return;

  const COPY={
    en:{
      selected:'05 selected',
      view:'View all projects',
      total:'06 total',
      archiveTop:'Work / Project index',
      close:'Close',
      title:'All projects',
      intro:'The full index — the same projects, shown at a quieter scale so the page can work as an archive instead of another hero section.',
      end:'End of index',
      count:'06 projects'
    },
    zh:{
      selected:'精選 05 個',
      view:'查看全部專案',
      total:'共 06 個',
      archiveTop:'作品 / 專案索引',
      close:'關閉',
      title:'全部專案',
      intro:'完整索引——保留所有目前整理完成的專案，但用比首頁更安靜、更小一階的尺度呈現，讓這裡真正像作品檔案而不是另一個首頁。',
      end:'索引結束',
      count:'共 06 個專案'
    }
  };

  const lang=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';
  const set=(selector,value)=>{const el=document.querySelector(selector);if(el&&el.textContent!==value)el.textContent=value};

  function applyCopy(){
    const c=COPY[lang()];
    const headingCount=document.querySelector('#work .section-heading p:last-child');
    if(headingCount&&headingCount.textContent!==c.selected)headingCount.textContent=c.selected;
    set('.work-more__label',c.view);
    set('.work-more__meta-text',c.total);
    set('.project-archive__kicker',c.archiveTop);
    set('.project-archive__count',c.total);
    set('.project-archive__close-label',c.close);
    set('.project-archive__heading h2',c.title);
    set('.project-archive__heading p',c.intro);
    set('.project-archive__footer-start',c.end);
    set('.project-archive__footer-count',c.count);
  }

  let lastFocus=null;
  function openArchive(){
    if(archive.classList.contains('is-open'))return;
    lastFocus=document.activeElement;
    archive.scrollTop=0;
    archive.setAttribute('aria-hidden','false');
    document.body.classList.add('is-archive-open');
    window.__lenis?.stop?.();
    requestAnimationFrame(()=>{
      archive.classList.add('is-open');
      setTimeout(()=>archive.focus?.({preventScroll:true}),40);
    });
  }

  function closeArchive(){
    if(!archive.classList.contains('is-open'))return;
    if(document.querySelector('.project-detail')?.classList.contains('is-open'))return;
    archive.classList.remove('is-open');
    archive.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-archive-open');
    window.__lenis?.start?.();
    setTimeout(()=>lastFocus?.focus?.({preventScroll:true}),0);
  }

  trigger.addEventListener('click',openArchive);
  close.addEventListener('click',closeArchive);
  archive.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
  archive.addEventListener('touchmove',event=>event.stopPropagation(),{passive:true});
  addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!archive.classList.contains('is-open'))return;
    if(document.querySelector('.project-detail')?.classList.contains('is-open'))return;
    closeArchive();
  });

  /* Keep the five-project count from being overwritten by the older language table. */
  const heading=document.querySelector('#work .section-heading');
  if(heading)new MutationObserver(()=>requestAnimationFrame(applyCopy)).observe(heading,{childList:true,characterData:true,subtree:true});
  new MutationObserver(applyCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  /* Join the existing directional language wipe while the archive is visible. */
  document.addEventListener('click',event=>{
    if(!event.target.closest?.('.language-toggle')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const els=[...document.querySelectorAll('.work-more,.project-archive__identity,.project-archive__heading,.project-archive__close,.project-archive__footer')];
    els.forEach((el,i)=>{
      el.classList.add('lang-fade-target');
      el.style.setProperty('--lang-delay',`${Math.min(i*6,30)}ms`);
    });
    requestAnimationFrame(()=>els.forEach(el=>el.classList.add('is-lang-out')));
    setTimeout(()=>els.forEach(el=>el.classList.remove('is-lang-out')),390);
    setTimeout(()=>els.forEach(el=>{
      el.classList.remove('lang-fade-target');
      el.style.removeProperty('--lang-delay');
    }),760);
  },true);

  applyCopy();
  setTimeout(applyCopy,120);
  setTimeout(applyCopy,700);
})();
