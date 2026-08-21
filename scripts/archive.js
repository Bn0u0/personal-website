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
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sourceRows=()=>[...document.querySelectorAll('#work .project-item[data-project] .project-row')].slice(0,5);
  const destinationRows=()=>[...archive.querySelectorAll('.project-item[data-project] .project-row')].slice(0,5);
  const rects=nodes=>nodes.map(node=>node.getBoundingClientRect());

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
  let transitionLayer=null;
  let transitionTimer=0;
  let busy=false;

  function clearTransitionLayer(){
    clearTimeout(transitionTimer);
    transitionLayer?.remove();
    transitionLayer=null;
    document.body.classList.remove('is-archive-reindexing');
  }

  function buildMorph(fromRects,toRects,startAtDestination=false){
    const originals=sourceRows();
    if(originals.length!==toRects.length||originals.length!==fromRects.length)return null;
    const layer=document.createElement('div');
    layer.className='archive-reindex-layer';
    const ease='cubic-bezier(.22,1,.36,1)';

    originals.forEach((row,i)=>{
      const base=fromRects[i];
      const target=toRects[i];
      const clone=row.cloneNode(true);
      clone.classList.add('archive-reindex-clone');
      clone.removeAttribute('data-cursor');
      clone.setAttribute('aria-hidden','true');
      clone.tabIndex=-1;
      Object.assign(clone.style,{
        left:`${base.left}px`,
        top:`${base.top}px`,
        width:`${base.width}px`,
        height:`${base.height}px`,
        transform:'translate3d(0,0,0) scale(1,1)',
        opacity:'1'
      });

      if(startAtDestination){
        const dx=target.left-base.left;
        const dy=target.top-base.top;
        const sx=target.width/base.width;
        const sy=target.height/base.height;
        clone.style.transform=`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`;
      }

      layer.appendChild(clone);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        clone.style.transition=`transform 720ms ${ease},opacity 160ms ease 620ms`;
        if(startAtDestination){
          clone.style.transform='translate3d(0,0,0) scale(1,1)';
        }else{
          const dx=target.left-base.left;
          const dy=target.top-base.top;
          const sx=target.width/base.width;
          const sy=target.height/base.height;
          clone.style.transform=`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`;
        }
        clone.style.opacity='.98';
      }));
    });
    document.body.appendChild(layer);
    return layer;
  }

  function openArchiveImmediate(){
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

  function openArchive(){
    if(archive.classList.contains('is-open')||busy)return;
    if(reduced||sourceRows().length<5){openArchiveImmediate();return}

    busy=true;
    lastFocus=document.activeElement;
    archive.scrollTop=0;
    archive.setAttribute('aria-hidden','false');
    document.body.classList.add('is-archive-open','is-archive-reindexing');
    window.__lenis?.stop?.();

    const from=rects(sourceRows());
    archive.classList.add('is-open','is-reindex-opening');
    const to=rects(destinationRows());
    transitionLayer=buildMorph(from,to,false);

    setTimeout(()=>archive.classList.add('is-reindex-settled'),620);
    transitionTimer=setTimeout(()=>{
      clearTransitionLayer();
      archive.classList.remove('is-reindex-opening');
      busy=false;
      archive.focus?.({preventScroll:true});
    },840);
  }

  function finishClose(){
    clearTransitionLayer();
    archive.classList.remove('is-open','is-reindex-opening','is-reindex-settled','is-reindex-closing');
    archive.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-archive-open');
    window.__lenis?.start?.();
    busy=false;
    setTimeout(()=>lastFocus?.focus?.({preventScroll:true}),0);
  }

  function closeArchive(){
    if(!archive.classList.contains('is-open')||busy)return;
    if(detail?.classList.contains('is-open'))return;
    if(reduced||sourceRows().length<5){
      archive.classList.remove('is-open');
      archive.setAttribute('aria-hidden','true');
      document.body.classList.remove('is-archive-open');
      window.__lenis?.start?.();
      setTimeout(()=>lastFocus?.focus?.({preventScroll:true}),0);
      return;
    }

    busy=true;
    document.body.classList.add('is-archive-reindexing');
    archive.classList.remove('is-reindex-opening','is-reindex-settled');
    archive.classList.add('is-reindex-closing');

    const source=rects(sourceRows());
    const destination=rects(destinationRows());
    transitionLayer=buildMorph(source,destination,true);
    transitionTimer=setTimeout(finishClose,760);
  }

  trigger.addEventListener('click',openArchive);
  close.addEventListener('click',closeArchive);
  archive.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
  archive.addEventListener('touchmove',event=>event.stopPropagation(),{passive:true});
  addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!archive.classList.contains('is-open'))return;
    if(detail?.classList.contains('is-open'))return;
    closeArchive();
  });

  /* Project Detail owns its own Lenis stop/start cycle. If it closes back into
     this modal index, immediately keep page Lenis stopped so only archive scroll moves. */
  if(detail)new MutationObserver(()=>{
    if(archive.classList.contains('is-open')&&!detail.classList.contains('is-open')){
      requestAnimationFrame(()=>window.__lenis?.stop?.());
    }
  }).observe(detail,{attributes:true,attributeFilter:['class']});

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
