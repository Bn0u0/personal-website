(()=>{
  const archive=document.querySelector('.project-archive');
  const trigger=document.querySelector('.work-more');
  const close=document.querySelector('.project-archive__close');
  const detail=document.querySelector('.project-detail');
  if(!archive||!trigger||!close)return;

  /* Fallback for older cached HTML. Current index.html loads this stylesheet
     directly so the first click cannot race the animation CSS. */
  if(!document.querySelector('link[data-archive-reindex]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./styles/archive-reindex.css';
    link.dataset.archiveReindex='true';
    document.head.appendChild(link);
  }

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

  const MOTION=window.__motion||{
    micro:180,ui:320,content:560,scene:1000,
    exitMicro:90,exitUi:160,exitContent:280,exitScene:500,
    staggerTight:40,staggerStandard:80
  };
  const lang=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';
  const set=(selector,value)=>{const el=document.querySelector(selector);if(el&&el.textContent!==value)el.textContent=value};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    lastFocus=document.activeElement;
    archive.style.display='';
    archive.scrollTop=0;
    archive.setAttribute('aria-hidden','false');
    document.body.classList.add('is-archive-open');
    window.__lenis?.stop?.();

    archive.classList.remove('is-instant-close','is-split-closing','is-open','is-split-opening');
    archive.classList.add('is-split-preparing');
    void archive.offsetWidth;

    /* CONTENT wall motion collides at 560ms; MICRO impact + 01→06 stagger
       resolve inside the single SCENE budget of 1000ms. */
    phaseFrame=requestAnimationFrame(()=>{
      phaseFrame=0;
      archive.classList.remove('is-split-preparing');
      archive.classList.add('is-open','is-split-opening');

      phaseTimer=setTimeout(()=>{
        phaseTimer=0;
        archive.classList.remove('is-split-opening');
        archive.focus?.({preventScroll:true});
      },MOTION.scene);
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

    /* Exit always uses the exact 0.5× SCENE derivative. */
    clearPhaseTimer();
    archive.classList.remove('is-split-preparing','is-split-opening');
    archive.classList.add('is-open','is-split-closing');

    phaseTimer=setTimeout(()=>{
      phaseTimer=0;
      finishClose();
    },MOTION.exitScene);
  }

  trigger.addEventListener('click',openArchive);

  /* Pointer users start the reverse on press rather than release. */
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

  /* Project Detail owns its own Lenis stop/start cycle. If it closes back into
     this modal index, immediately keep page Lenis stopped so only archive scroll moves. */
  if(detail)new MutationObserver(()=>{
    if(archive.classList.contains('is-open')&&!detail.classList.contains('is-open')){
      requestAnimationFrame(()=>window.__lenis?.stop?.());
    }
  }).observe(detail,{attributes:true,attributeFilter:['class']});

  const heading=document.querySelector('#work .section-heading');
  if(heading)new MutationObserver(()=>requestAnimationFrame(applyCopy)).observe(heading,{childList:true,characterData:true,subtree:true});
  new MutationObserver(applyCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  /* Language wipe remains UI-scale; its small stagger uses only shared spacing tiers. */
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

  applyCopy();
  setTimeout(applyCopy,120);
  setTimeout(applyCopy,700);
})();
