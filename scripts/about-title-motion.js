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
      /* `about.css` has a broad `.about-ai__statement span{display:block}` rule
         for the two line wrappers. Glyphs are spans now too, so they must
         explicitly stay inline or every character becomes a separate block. */
      .about-ai__statement .about-ai__title-char{
        display:inline-block!important;
        opacity:0;
        filter:blur(3px);
        transform:translate(-.025em,.18em);
        font-style:normal!important;
        transition:
          opacity var(--motion-editorial,760ms) ease,
          transform var(--motion-editorial,760ms) var(--ease-editorial,cubic-bezier(.20,.65,.20,1)),
          filter var(--motion-editorial,760ms) ease;
        transition-delay:calc(var(--char-index) * var(--motion-stagger-tight,40ms));
      }
      .about-ai__statement.is-flowing .about-ai__title-char{
        opacity:1;
        filter:none;
        transform:none;
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
        const letter=document.createElement('span');
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

  new MutationObserver(()=>queueMicrotask(wrapTitle)).observe(document.documentElement,{
    attributes:true,
    attributeFilter:['lang']
  });
})();
