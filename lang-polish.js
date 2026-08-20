(()=>{
  const toggle=document.querySelector('.language-toggle');
  if(!toggle)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const style=document.createElement('style');
  style.textContent=`
    @property --lang-wipe{
      syntax:'<percentage>';
      inherits:false;
      initial-value:110%;
    }
    .language-transition{display:none!important}
    .language-toggle{
      width:auto!important;height:auto!important;padding:0!important;margin-left:2px!important;
      border:0!important;border-radius:0!important;background:transparent!important;
      display:inline-flex!important;align-items:center!important;gap:5px!important;overflow:visible!important;
      font-size:10px!important;line-height:1!important;letter-spacing:.06em!important;
      text-transform:none!important;color:inherit!important;opacity:.92;
      transition:opacity 220ms ease!important
    }
    .language-toggle:hover{background:transparent!important;border:0!important;opacity:1}
    .language-toggle:active{transform:none!important}
    .language-toggle:disabled{opacity:.58!important}
    .language-toggle__thumb{display:none!important}
    .language-toggle__option{
      display:inline!important;height:auto!important;color:inherit!important;mix-blend-mode:normal!important;
      opacity:.38;transition:opacity 240ms ease!important
    }
    .language-toggle__sep{opacity:.28}
    .language-toggle:not(.is-zh) .language-toggle__en,
    .language-toggle.is-zh .language-toggle__zh{opacity:1}

    .hero__eyebrow{justify-content:flex-start!important;gap:12px!important}
    .hero__eyebrow span:last-child{display:inline!important}

    .work-scroll-cue{
      position:absolute;
      right:var(--pad);
      bottom:44px;
      z-index:3;
      color:var(--muted);
      font-size:11px;
      line-height:1.25;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    .work .section-heading.reveal,
    .work .project-item.reveal{
      opacity:1!important;
      transform:none!important;
    }

    .project-detail{
      height:100dvh!important;
      max-height:100dvh!important;
      overflow-y:auto!important;
      overflow-x:hidden!important;
      overscroll-behavior-y:contain!important;
      -webkit-overflow-scrolling:touch;
      touch-action:pan-y;
      scroll-behavior:smooth;
    }
    .project-detail__top{
      min-height:64px;
      box-sizing:border-box;
    }
    .project-detail__hero{
      min-height:calc(100dvh - 64px)!important;
      height:auto!important;
      padding-top:clamp(44px,6vh,72px)!important;
      padding-bottom:clamp(44px,6vh,72px)!important;
    }
    .project-detail__copy,
    .project-detail__media{
      min-width:0;
    }

    .manifesto__statement{
      line-height:1!important;
      padding-bottom:.08em!important;
    }
    .manifesto__line{
      overflow:visible!important;
      padding-bottom:.08em!important;
    }

    .lang-fade-target{
      --lang-wipe:110%;
      -webkit-mask-image:linear-gradient(90deg,
        #000 calc(var(--lang-wipe) - 7%),
        rgba(0,0,0,.96) calc(var(--lang-wipe) - 3%),
        rgba(0,0,0,.48) calc(var(--lang-wipe) + 2%),
        transparent calc(var(--lang-wipe) + 8%));
      mask-image:linear-gradient(90deg,
        #000 calc(var(--lang-wipe) - 7%),
        rgba(0,0,0,.96) calc(var(--lang-wipe) - 3%),
        rgba(0,0,0,.48) calc(var(--lang-wipe) + 2%),
        transparent calc(var(--lang-wipe) + 8%));
      -webkit-mask-repeat:no-repeat;
      mask-repeat:no-repeat;
      transition:--lang-wipe 255ms cubic-bezier(.55,.05,.25,1)!important;
      transition-delay:var(--lang-delay,0ms)!important;
      will-change:mask-image,-webkit-mask-image;
    }
    .lang-fade-target.is-lang-out{--lang-wipe:-10%}

    @supports not (mask-image:linear-gradient(#000,transparent)){
      .lang-fade-target{
        clip-path:inset(0 0 0 0);
        transition:clip-path 255ms cubic-bezier(.55,.05,.25,1)!important;
        transition-delay:var(--lang-delay,0ms)!important
      }
      .lang-fade-target.is-lang-out{clip-path:inset(0 100% 0 0)}
    }

    @media(max-height:920px) and (min-width:1001px){
      .project-detail__hero{
        align-items:start!important;
        padding-top:36px!important;
        padding-bottom:52px!important;
      }
      .project-detail__copy{padding-top:12px!important}
      .project-detail__title{font-size:clamp(54px,6.4vw,112px)!important}
      .project-detail__media{min-height:clamp(360px,58dvh,620px)!important}
    }

    @media(max-width:640px){
      .language-toggle{font-size:9px!important;gap:4px!important;margin-left:0!important}
      .hero__eyebrow{gap:9px!important}
      .manifesto__statement{line-height:1.02!important}
      .work-scroll-cue{bottom:30px;font-size:9px}
      .project-detail__top{min-height:56px}
      .project-detail__hero{
        min-height:calc(100dvh - 56px)!important;
        padding-top:34px!important;
        padding-bottom:44px!important;
      }
    }
    @media(prefers-reduced-motion:reduce){
      .lang-fade-target{transition:none!important;-webkit-mask-image:none!important;mask-image:none!important;clip-path:none!important}
      .project-detail{scroll-behavior:auto}
    }
  `;
  document.head.appendChild(style);

  toggle.innerHTML='<span class="language-toggle__option language-toggle__en">EN</span><span class="language-toggle__sep" aria-hidden="true">/</span><span class="language-toggle__option language-toggle__zh">中文</span>';

  function syncHeroCopy(){
    const lines=document.querySelectorAll('.hero__line>span');
    if(lines.length<2)return;
    const zh=document.documentElement.lang.toLowerCase().startsWith('zh');
    const copy=zh
      ? ['我只是想把','腦子裡的東西做出來']
      : ['I just want to make','the things in my head'];
    copy.forEach((value,index)=>{
      if(lines[index].textContent!==value)lines[index].textContent=value;
    });
  }

  function syncWorkCue(){
    const label=document.querySelector('.work-scroll-cue__label');
    if(!label)return;
    const zh=document.documentElement.lang.toLowerCase().startsWith('zh');
    label.textContent=zh?'往下探索':'Scroll to explore';
  }

  syncHeroCopy();
  syncWorkCue();
  const heroTitle=document.querySelector('.hero__title');
  if(heroTitle)new MutationObserver(syncHeroCopy).observe(heroTitle,{childList:true,characterData:true,subtree:true});
  new MutationObserver(syncWorkCue).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  const selector=[
    '.nav a',
    '.profile-card__index','.profile-card__role','.profile-card__location','.profile-card__areas','.profile-card__status',
    '.hero__eyebrow span','.hero__line','.hero__footer p','.scroll-cue',
    '.section-heading p','.project-row__meta','.project-hover-info','.project-row__action',
    '.section-kicker','.manifesto__statement','.manifesto__grid>p','.manifesto__tags',
    '.site-footer p','.site-footer a',
    '.project-detail__top-label','.project-detail__close','.project-detail__headline','.project-detail__description',
    '.project-detail__tags','.detail-image-slot','.project-detail__below-label','.detail-below-copy'
  ].join(',');

  function targets(){
    return [...document.querySelectorAll(selector)].filter((el,i,arr)=>arr.indexOf(el)===i);
  }

  toggle.addEventListener('click',()=>{
    if(reduced||toggle.disabled)return;
    const els=targets();
    els.forEach((el,i)=>{
      el.classList.add('lang-fade-target');
      el.style.setProperty('--lang-delay',`${Math.min((i%12)*5,55)}ms`);
    });

    requestAnimationFrame(()=>els.forEach(el=>el.classList.add('is-lang-out')));

    setTimeout(()=>{
      syncHeroCopy();
      syncWorkCue();
      els.forEach(el=>el.classList.remove('is-lang-out'));
    },390);

    setTimeout(()=>{
      els.forEach(el=>{
        el.classList.remove('lang-fade-target');
        el.style.removeProperty('--lang-delay');
      });
    },760);
  },true);

  const detail=document.querySelector('.project-detail');
  if(detail){
    detail.setAttribute('tabindex','-1');
    detail.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
    detail.addEventListener('touchmove',event=>event.stopPropagation(),{passive:true});
  }

  /* site.js owns project-detail open/close transitions. The older defensive
     fallback is intentionally not registered when the organic reveal system
     is present, otherwise it would terminate the reverse animation early. */
  if(detail&&detail.dataset.organicReveal!=='true'){
    const closeButton=document.querySelector('.project-detail__close');
    const ensureOpen=()=>{
      if(!detail)return;
      detail.scrollTop=0;
      if(!detail.classList.contains('is-open')){
        detail.setAttribute('aria-hidden','false');
        document.body.classList.add('is-detail-open');
        requestAnimationFrame(()=>detail.classList.add('is-open'));
        window.__lenis?.stop?.();
      }
      requestAnimationFrame(()=>detail.focus?.({preventScroll:true}));
    };
    const ensureClosed=()=>{
      detail.classList.remove('is-open');
      detail.setAttribute('aria-hidden','true');
      document.body.classList.remove('is-detail-open');
      window.__lenis?.start?.();
    };
    document.addEventListener('click',event=>{
      const row=event.target.closest?.('.project-row');
      if(!row)return;
      setTimeout(ensureOpen,0);
    },true);
    closeButton?.addEventListener('click',()=>setTimeout(ensureClosed,0),true);
    addEventListener('keydown',event=>{
      if(event.key==='Escape'&&detail.classList.contains('is-open'))ensureClosed();
    });
  }
})();