(()=>{
  const archive=document.querySelector('.project-archive');
  const trigger=document.querySelector('.work-more');
  const close=document.querySelector('.project-archive__close');
  const detail=document.querySelector('.project-detail');
  if(!archive||!trigger||!close)return;

  if(!document.querySelector('link[data-archive-reindex]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./styles/archive-reindex.css';
    link.dataset.archiveReindex='true';
    document.head.appendChild(link);
  }

  const COPY={
    en:{
      view:'View all projects',
      archiveTop:'Work / Project index',
      close:'Close',
      title:'All projects',
      intro:'The full index — the same projects, shown at a quieter scale so the page can work as an archive instead of another hero section.',
      end:'End of index'
    },
    zh:{
      view:'查看全部專案',
      archiveTop:'作品 / 專案索引',
      close:'關閉',
      title:'全部專案',
      intro:'完整索引——保留所有目前整理完成的專案，但用比首頁更安靜、更小一階的尺度呈現，讓這裡真正像作品檔案而不是另一個首頁。',
      end:'索引結束'
    }
  };

  const BASE=window.__motion||{
    micro:180,ui:320,content:560,scene:1000,
    exitMicro:90,exitUi:160,exitContent:280,exitScene:500,
    staggerTight:40,staggerStandard:80
  };
  const cssMs=(name,fallback)=>{
    const raw=getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value=parseFloat(raw);
    if(!Number.isFinite(value))return fallback;
    return raw.endsWith('s')&&!raw.endsWith('ms')?value*1000:value;
  };
  const MOTION={
    ...BASE,
    editorial:cssMs('--motion-editorial',760),
    showcase:cssMs('--motion-showcase',920)
  };

  const archiveRows=()=>[...archive.querySelectorAll('.project-archive__list .project-item')];
  const selectedRows=()=>[...document.querySelectorAll('#work .project-list .project-item')];
  const totalProjects=()=>{
    const canonicalCount=Object.keys(window.__portfolioProjects||{}).length;
    return canonicalCount||archiveRows().length;
  };
  const count2=n=>String(n).padStart(2,'0');

  /* Keep the opening state alive until the final archive row settles. The row
     count is derived from the DOM so future projects do not require timing edits. */
  const openSequenceDuration=()=>MOTION.showcase+(MOTION.staggerTight*Math.max(1,archiveRows().length))+MOTION.editorial;
  const lang=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';
  const set=(selector,value)=>{const el=document.querySelector(selector);if(el&&el.textContent!==value)el.textContent=value};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyCopy(){
    const currentLang=lang();
    const c=COPY[currentLang];
    const selected=count2(selectedRows().length);
    const total=count2(totalProjects());
    const headingCount=document.querySelector('#work .section-heading p:last-child');
    const selectedCopy=currentLang==='zh'?`精選 ${selected} 個`:`${selected} selected`;
    const totalCopy=currentLang==='zh'?`共 ${total} 個`:`${total} total`;
    const footerCount=currentLang==='zh'?`共 ${total} 個專案`:`${total} projects`;
    if(headingCount&&headingCount.textContent!==selectedCopy)headingCount.textContent=selectedCopy;
    set('.work-more__label',c.view);
    set('.work-more__meta-text',totalCopy);
    set('.project-archive__kicker',c.archiveTop);
    set('.project-archive__count',totalCopy);
    set('.project-archive__close-label',c.close);
    set('.project-archive__heading h2',c.title);
    set('.project-archive__heading p',c.intro);
    set('.project-archive__footer-start',c.end);
    set('.project-archive__footer-count',footerCount);
  }

  function syncRowMotionIndex(){
    archiveRows().forEach((row,index)=>{
      row.style.setProperty('--archive-row-index',String(index+1));
      row.style.setProperty('--archive-row-reverse-index',String(Math.max(0,archiveRows().length-index-1)));
    });
  }

  let lastFocus=null;
  let phaseFrame=0;
  let phaseTimer=0;

  function clearPhaseTimer(){
    if(phaseFrame)cancelAnimationFrame(phaseFrame);
    clearTimeout(phaseTimer);
    phaseFrame=0;
    phaseTimer=0;
  }

  function openArchiveImmediate(){
    clearPhaseTimer();
    lastFocus=document.activeElement;
    archive.style.display='';
    archive.scrollTop=0;
    archive.setAttribute('aria-hidden','false');
    document.body.classList.add('is-archive-open');
    window.__lenis?.stop?.();
    archive.classList.remove('is-instant-close','is-split-preparing','is-split-opening','is-split-closing');
    archive.classList.add('is-open');
    requestAnimationFrame(()=>archive.focus?.({preventScroll:true}));
  }

  function openArchive(){
    if(archive.classList.contains('is-open')||archive.classList.contains('is-split-preparing')||archive.classList.contains('is-split-closing'))return;
    if(reduced){openArchiveImmediate();return}

    clearPhaseTimer();
    syncRowMotionIndex();
    lastFocus=document.activeElement;
    archive.style.display='';
    archive.scrollTop=0;
    archive.setAttribute('aria-hidden','false');
    document.body.classList.add('is-archive-open');
    window.__lenis?.stop?.();

    archive.classList.remove('is-instant-close','is-split-closing','is-open','is-split-opening');
    archive.classList.add('is-split-preparing');
    void archive.offsetWidth;

    phaseFrame=requestAnimationFrame(()=>{
      phaseFrame=0;
      archive.classList.remove('is-split-preparing');
      archive.classList.add('is-open','is-split-opening');

      phaseTimer=setTimeout(()=>{
        phaseTimer=0;
        archive.classList.remove('is-split-opening');
        archive.focus?.({preventScroll:true});
      },openSequenceDuration());
    });
  }

  function finishClose(){
    clearPhaseTimer();
    archive.style.display='none';
    archive.classList.remove('is-open','is-split-preparing','is-split-opening','is-split-closing');
    archive.classList.add('is-instant-close');
    archive.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-archive-open');
    window.__lenis?.start?.();

    requestAnimationFrame(()=>archive.classList.remove('is-instant-close'));
    setTimeout(()=>lastFocus?.focus?.({preventScroll:true}),0);
  }

  function closeArchive(){
    if((!archive.classList.contains('is-open')&&!archive.classList.contains('is-split-preparing'))||archive.classList.contains('is-split-closing'))return;
    if(detail?.classList.contains('is-open'))return;
    if(reduced){finishClose();return}

    clearPhaseTimer();
    archive.classList.remove('is-split-preparing','is-split-opening');
    archive.classList.add('is-open','is-split-closing');

    phaseTimer=setTimeout(()=>{
      phaseTimer=0;
      finishClose();
    },MOTION.exitScene);
  }

  trigger.addEventListener('click',openArchive);

  close.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    event.preventDefault();
    closeArchive();
  });
  close.addEventListener('click',event=>{
    if(event.detail===0)closeArchive();
  });

  archive.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
  archive.addEventListener('touchmove',event=>event.stopPropagation(),{passive:true});
  addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    if(detail?.classList.contains('is-open'))return;
    if(archive.classList.contains('is-open')||archive.classList.contains('is-split-preparing'))closeArchive();
  });

  if(detail)new MutationObserver(()=>{
    if(archive.classList.contains('is-open')&&!detail.classList.contains('is-open')){
      requestAnimationFrame(()=>window.__lenis?.stop?.());
    }
  }).observe(detail,{attributes:true,attributeFilter:['class']});

  const heading=document.querySelector('#work .section-heading');
  if(heading)new MutationObserver(()=>requestAnimationFrame(applyCopy)).observe(heading,{childList:true,characterData:true,subtree:true});
  new MutationObserver(applyCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  document.addEventListener('click',event=>{
    if(!event.target.closest?.('.language-toggle')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const els=[...document.querySelectorAll('.work-more,.project-archive__identity,.project-archive__heading,.project-archive__close,.project-archive__footer')];
    els.forEach((el,i)=>{
      el.classList.add('lang-fade-target');
      el.style.setProperty('--lang-delay',`${Math.min(i*MOTION.staggerTight,MOTION.staggerStandard)}ms`);
    });
    requestAnimationFrame(()=>els.forEach(el=>el.classList.add('is-lang-out')));
    setTimeout(()=>els.forEach(el=>el.classList.remove('is-lang-out')),MOTION.ui+MOTION.staggerStandard);
    setTimeout(()=>els.forEach(el=>{
      el.classList.remove('lang-fade-target');
      el.style.removeProperty('--lang-delay');
    }),MOTION.content+MOTION.ui);
  },true);

  syncRowMotionIndex();
  applyCopy();
  setTimeout(applyCopy,120);
  setTimeout(applyCopy,700);
})();
