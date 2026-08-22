(()=>{
  const statement=document.querySelector('.about-ai__statement');
  if(!statement)return;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasPlayed=false;

  if(!document.querySelector('style[data-about-title-motion]')){
    const style=document.createElement('style');
    style.dataset.aboutTitleMotion='true';
    style.textContent=`
      .about-ai__statement{
        overflow:visible!important;
      }
      .about-ai__title-line{
        display:block;
        overflow:visible!important;
        padding-bottom:.08em;
      }
      .about-ai__title-char{
        display:inline-block;
        opacity:0;
        filter:blur(3px);
        transform:translate3d(-.025em,.16em,0) rotate(0);
        transition:
          opacity var(--motion-content,560ms) ease,
          transform var(--motion-content,560ms) var(--ease-soft,cubic-bezier(.22,1,.36,1)),
          filter var(--motion-content,560ms) ease;
        transition-delay:calc(var(--char-index) * var(--motion-stagger-tight,40ms));
        will-change:opacity,transform,filter;
      }
      .about-ai__statement.is-flowing .about-ai__title-char{
        opacity:1;
        filter:blur(0);
        transform:translate3d(0,0,0) rotate(0);
      }
      @media(prefers-reduced-motion:reduce){
        .about-ai__title-char{
          opacity:1!important;
          filter:none!important;
          transform:none!important;
          transition:none!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function wrapTitle(){
    const lines=[...statement.querySelectorAll(':scope > span')];
    if(!lines.length)return;

    statement.classList.remove('reveal','is-inview');
    statement.classList.remove('is-flowing');

    let charIndex=0;
    lines.forEach(line=>{
      const text=line.textContent;
      line.classList.add('about-ai__title-line');
      line.setAttribute('aria-label',text);
      line.textContent='';

      [...text].forEach(char=>{
        const letter=document.createElement('i');
        letter.className='about-ai__title-char';
        letter.setAttribute('aria-hidden','true');
        letter.style.setProperty('--char-index',charIndex++);
        letter.textContent=char===' '?'\u00A0':char;
        line.appendChild(letter);
      });
    });

    if(reduced||hasPlayed)statement.classList.add('is-flowing');
  }

  wrapTitle();

  if(reduced){
    hasPlayed=true;
    statement.classList.add('is-flowing');
  }else{
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      hasPlayed=true;
      statement.classList.add('is-flowing');
      observer.disconnect();
    },{threshold:.28,rootMargin:'0px 0px -10% 0px'});
    observer.observe(statement);
  }

  /* about.js updates the two direct line spans when language changes. Re-wrap
     after that observer has run; using <i> for glyphs keeps its span selector safe. */
  new MutationObserver(()=>queueMicrotask(wrapTitle)).observe(document.documentElement,{
    attributes:true,
    attributeFilter:['lang']
  });
})();

/* Touch/mobile polish is intentionally loaded after the desktop modules have
   registered their styles. This gives the touch layer the final cascade without
   duplicating the main stylesheet or changing the desktop composition. */
(()=>{
  const touchUI=matchMedia('(pointer:coarse)').matches||matchMedia('(hover:none)').matches;
  if(!touchUI)return;
  if(document.querySelector('link[data-mobile-polish]'))return;

  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='./styles/mobile.css';
  link.dataset.mobilePolish='true';

  const loadBehavior=()=>{
    if(document.querySelector('script[data-mobile-polish]'))return;
    const script=document.createElement('script');
    script.src='./scripts/mobile.js';
    script.dataset.mobilePolish='true';
    document.body.appendChild(script);
  };

  link.addEventListener('load',loadBehavior,{once:true});
  document.head.appendChild(link);
})();
