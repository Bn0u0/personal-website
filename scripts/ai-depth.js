(()=>{
  const section=document.querySelector('.about-ai');
  if(!section||document.querySelector('.ai-depth'))return;

  const COPY={
    en:{
      intro:'I set the direction. AI searches, decomposes, builds and verifies. The useful part is the loop between the two.',
      principles:['Direction','Challenge','Evidence','Memory'],
      explore:'Explore further',
      notes:'4 notes ↗',
      eyebrow:'AI / Extended notes',
      close:'Close',
      next:'Next',
      back:'Back',
      items:[
        {
          title:'Prototype together',
          headline:'Turn an idea into something that can answer back.',
          body:'Early on, the collaboration was direct: describe an idea, turn it into UI or code, run it, find what feels wrong, then rebuild it. Games and interface experiments were where this rhythm became natural. The value was not the first output. It was shortening the distance between imagination, implementation and another round of judgment.'
        },
        {
          title:'Argue, do not obey',
          headline:'Agreement is useful only when it survives pressure.',
          body:'The relationship became more useful when agreement stopped being the goal. I ask AI to attack weak logic, separate facts from assumptions and make me explain decisions that do not survive scrutiny. It should not replace judgment; it should make weak judgment harder to hide.'
        },
        {
          title:'Turn intuition into evidence',
          headline:'A good explanation is not enough. It has to be able to fail.',
          body:'In quantitative research, informal market judgment is translated into canonical definitions, repeatable backtests, no-lookahead rules, data roles and gates. The useful transition is from “this seems true” to a claim that leaves evidence and can be audited, reproduced or rejected later.'
        },
        {
          title:'Keep the history',
          headline:'A system should remember why it became this.',
          body:'Across PicNest, quant research and this website, versions, commits, rollback points, failed directions and design changes are part of the work rather than noise to erase. The collaboration has gradually moved from “help me build this” toward maintaining a traceable history of why a system changed.'
        }
      ]
    },
    zh:{
      intro:'我決定方向；AI 負責搜尋、拆解、實作與驗證。真正有價值的是兩者之間反覆往返的循環。',
      principles:['方向','質疑','證據','記憶'],
      explore:'延伸探討',
      notes:'4 則 ↗',
      eyebrow:'AI / 延伸筆記',
      close:'關閉',
      next:'下一則',
      back:'返回',
      items:[
        {
          title:'一起做出原型',
          headline:'把一個想法，變成能反過來回答你的東西。',
          body:'最早的合作很直接：我描述一個想法，AI 把它變成 UI 或程式，跑起來後再找哪裡不對、重新做。遊戲與介面實驗是最早形成這種節奏的地方。真正有價值的不是第一次輸出，而是把想像、實作與下一次判斷之間的距離壓得很短。'
        },
        {
          title:'不是順著我',
          headline:'同意只有在經得起壓力之後才有價值。',
          body:'真正開始變得有用，是在「同意我」不再是目標之後。我會要求 AI 攻擊薄弱的邏輯，把事實、假設和推論拆開，逼我重新解釋那些經不起質疑的決定。它不應該取代判斷，而是讓差的判斷更難躲起來。'
        },
        {
          title:'把直覺變成證據',
          headline:'說得合理不夠，它必須有機會被證明是錯的。',
          body:'到了量化研究，原本口語化的市場判斷會被翻成 canonical definition、可重複回測、No-lookahead 規則、資料角色與 Gate。真正重要的是把「我覺得這是真的」，轉成一個會留下證據、之後能被重現、稽核或否決的命題。'
        },
        {
          title:'讓系統記得過往',
          headline:'一個系統應該記得自己為什麼變成現在這樣。',
          body:'從 PicNest、量化研究到這個網站，版本、Commit、Rollback、失敗方向與設計改變都不是該被擦掉的雜訊，而是工作的一部分。合作慢慢從「幫我把它做出來」，變成保留一條可以追溯的歷史：每一次改變，都知道它為什麼發生。'
        }
      ]
    }
  };

  const isZh=()=>document.documentElement.lang.toLowerCase().startsWith('zh');
  const data=()=>COPY[isZh()?'zh':'en'];
  const intro=section.querySelector('.about-ai__intro');
  const history=section.querySelector('.about-ai__history');
  const rows=[...section.querySelectorAll('.about-ai__row')];

  const explore=document.createElement('button');
  explore.type='button';
  explore.className='about-ai__explore';
  explore.setAttribute('aria-haspopup','dialog');
  explore.innerHTML='<span class="about-ai__explore-label"></span><span class="about-ai__explore-meta"></span>';
  (history||section).appendChild(explore);

  /* Discovery stays editorial: the path itself becomes the affordance. */
  if(!document.querySelector('style[data-ai-depth-discovery]')){
    const style=document.createElement('style');
    style.dataset.aiDepthDiscovery='true';
    style.textContent=`
      .about-ai__history{isolation:isolate}
      .about-ai__history::after{
        content:"";
        position:absolute;
        z-index:-1;
        left:0;
        right:0;
        top:-.5px;
        height:1px;
        pointer-events:none;
        background:linear-gradient(90deg,rgba(242,240,235,.04),rgba(242,240,235,.10) 66%,rgba(242,240,235,.58));
        transform:scaleX(0);
        transform-origin:left center;
        opacity:.78;
        transition:transform var(--motion-content,720ms) var(--ease-soft,cubic-bezier(.22,1,.36,1)),opacity var(--motion-ui,340ms) ease;
      }
      .about-ai__row,.about-ai__row-title,.about-ai__row-index,.about-ai__row::before{
        transition:color var(--motion-ui,340ms) ease,opacity var(--motion-ui,340ms) ease,transform var(--motion-ui,340ms) var(--ease-soft,cubic-bezier(.22,1,.36,1));
      }
      .about-ai__row:last-of-type::before{
        width:4px!important;
        height:4px!important;
        top:-2.5px!important;
        background:rgba(242,240,235,.58)!important;
      }
      .about-ai__explore{
        color:rgba(242,240,235,.72)!important;
        transform:translateX(-24px);
        width:calc(100% + 24px);
        padding-left:40px!important;
        transition:color var(--motion-ui,340ms) ease,transform var(--motion-ui,340ms) var(--ease-soft,cubic-bezier(.22,1,.36,1));
      }
      .about-ai__explore-label{opacity:.96}
      .about-ai__explore-meta{
        display:inline-block;
        opacity:.66!important;
        transition:transform var(--motion-ui,340ms) var(--ease-soft,cubic-bezier(.22,1,.36,1)),opacity var(--motion-micro,200ms) ease;
      }
      .about-ai__explore::before{
        left:40px!important;
        width:5px!important;
        height:5px!important;
        top:-3px!important;
        border:1px solid currentColor;
        background:var(--fg)!important;
        box-sizing:border-box;
        opacity:.92;
        transition:transform var(--motion-ui,340ms) var(--ease-soft,cubic-bezier(.22,1,.36,1)),box-shadow var(--motion-ui,340ms) ease;
      }
      .about-ai__explore::after{left:40px!important}

      .about-ai__history:hover::after,
      .about-ai__history:focus-within::after,
      .about-ai__history.is-explore-near::after{transform:scaleX(1)}
      .about-ai__history:hover .about-ai__row-title,
      .about-ai__history:focus-within .about-ai__row-title,
      .about-ai__history.is-explore-near .about-ai__row-title{color:rgba(242,240,235,.50)!important}
      .about-ai__history:hover .about-ai__row-index,
      .about-ai__history:focus-within .about-ai__row-index,
      .about-ai__history.is-explore-near .about-ai__row-index{opacity:.72}
      .about-ai__history:hover .about-ai__row::before,
      .about-ai__history:focus-within .about-ai__row::before,
      .about-ai__history.is-explore-near .about-ai__row::before{opacity:.62}
      .about-ai__history:hover .about-ai__explore,
      .about-ai__history:focus-within .about-ai__explore,
      .about-ai__history.is-explore-near .about-ai__explore{color:rgba(242,240,235,.90)!important}
      .about-ai__history.is-explore-near .about-ai__explore-meta{
        opacity:.88!important;
        transform:translate3d(1.5px,-1.5px,0);
      }
      .about-ai__history.is-explore-near .about-ai__explore::before{
        transform:scale(1.18);
        box-shadow:0 0 0 4px rgba(242,240,235,.055);
      }
      .about-ai__explore:hover,.about-ai__explore:focus-visible{color:rgba(242,240,235,.98)!important}

      .about-ai.is-discovery-cue .about-ai__history::after{animation:aiPathReveal 900ms var(--ease-soft,cubic-bezier(.22,1,.36,1)) 1}
      .about-ai.is-discovery-cue .about-ai__explore-meta{animation:aiExploreNudge 760ms var(--ease-soft,cubic-bezier(.22,1,.36,1)) 1}
      .about-ai.is-discovery-cue .about-ai__explore::before{animation:aiExploreNode 760ms ease 1}
      @keyframes aiPathReveal{0%{transform:scaleX(0);opacity:.35}70%{transform:scaleX(1);opacity:.84}100%{transform:scaleX(0);opacity:.78}}
      @keyframes aiExploreNudge{0%,100%{transform:translate3d(0,0,0);opacity:.66}42%{transform:translate3d(2px,-2px,0);opacity:.96}}
      @keyframes aiExploreNode{0%,100%{box-shadow:0 0 0 0 rgba(242,240,235,0)}45%{box-shadow:0 0 0 4px rgba(242,240,235,.07)}}

      @media(max-width:1000px){
        .about-ai__explore{transform:translateX(-18px);width:calc(100% + 18px);padding-left:28px!important}
        .about-ai__explore::before,.about-ai__explore::after{left:28px!important}
      }
      @media(max-width:640px){
        .about-ai__explore{transform:none;width:min(230px,100%);padding-left:10px!important}
        .about-ai__explore::before,.about-ai__explore::after{left:10px!important}
      }
      @media(prefers-reduced-motion:reduce){
        .about-ai__history::after,.about-ai__row,.about-ai__row-title,.about-ai__row-index,.about-ai__row::before,
        .about-ai__explore,.about-ai__explore-meta,.about-ai__explore::before{transition:none!important;animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  if('IntersectionObserver'in window){
    let discoveryTimer=0;
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.55))return;
      observer.disconnect();
      clearTimeout(discoveryTimer);
      section.classList.add('is-discovery-cue');
      discoveryTimer=setTimeout(()=>section.classList.remove('is-discovery-cue'),980);
    },{threshold:[.55]});
    observer.observe(section);
  }

  /* On fine pointers, proximity reveals interactivity before the cursor lands on the label. */
  if(history&&matchMedia('(pointer:fine)').matches){
    let pointerFrame=0;
    let pointerX=0;
    let pointerY=0;
    const updateProximity=()=>{
      pointerFrame=0;
      const rect=explore.getBoundingClientRect();
      const cx=Math.max(rect.left,Math.min(pointerX,rect.right));
      const cy=Math.max(rect.top,Math.min(pointerY,rect.bottom));
      const distance=Math.hypot(pointerX-cx,pointerY-cy);
      history.classList.toggle('is-explore-near',distance<=150);
    };
    history.addEventListener('pointermove',event=>{
      pointerX=event.clientX;
      pointerY=event.clientY;
      if(!pointerFrame)pointerFrame=requestAnimationFrame(updateProximity);
    },{passive:true});
    history.addEventListener('pointerleave',()=>{
      if(pointerFrame)cancelAnimationFrame(pointerFrame);
      pointerFrame=0;
      history.classList.remove('is-explore-near');
    });
  }

  const layer=document.createElement('section');
  layer.className='ai-depth';
  layer.setAttribute('aria-hidden','true');
  layer.setAttribute('aria-modal','true');
  layer.setAttribute('role','dialog');
  layer.setAttribute('aria-label','AI extended notes');
  layer.tabIndex=-1;
  layer.innerHTML=`
    <div class="ai-depth__top">
      <span class="ai-depth__eyebrow"></span>
      <button class="ai-depth__close" type="button"></button>
    </div>
    <div class="ai-depth__content">
      <span class="ai-depth__index"></span>
      <div class="ai-depth__copy">
        <p class="ai-depth__title"></p>
        <h3 class="ai-depth__headline"></h3>
        <p class="ai-depth__body"></p>
      </div>
    </div>
    <div class="ai-depth__bottom">
      <div class="ai-depth__steps" aria-label="AI notes"></div>
      <button class="ai-depth__next" type="button"><span class="ai-depth__next-label"></span><span class="ai-depth__next-icon">→</span></button>
    </div>`;
  document.body.appendChild(layer);

  const q=s=>layer.querySelector(s);
  const steps=q('.ai-depth__steps');
  const nextButton=q('.ai-depth__next');
  for(let i=0;i<4;i++){
    const b=document.createElement('button');
    b.type='button';
    b.className='ai-depth__step';
    b.textContent=`0${i+1}`;
    b.addEventListener('click',()=>setItem(i));
    steps.appendChild(b);
  }

  let index=0;
  let open=false;
  let changeTimer=0;

  function applyLanguage(){
    const c=data();
    if(intro)intro.textContent=c.intro;
    rows.forEach((row,i)=>{
      const title=row.querySelector('.about-ai__row-title');
      if(title&&c.principles[i])title.textContent=c.principles[i];
    });
    explore.querySelector('.about-ai__explore-label').textContent=c.explore;
    explore.querySelector('.about-ai__explore-meta').textContent=c.notes;
    q('.ai-depth__eyebrow').textContent=c.eyebrow;
    q('.ai-depth__close').textContent=c.close;
    layer.setAttribute('aria-label',c.eyebrow);
    render();
  }

  function render(){
    const c=data();
    const item=c.items[index];
    q('.ai-depth__index').textContent=`0${index+1} / 04`;
    q('.ai-depth__title').textContent=item.title;
    q('.ai-depth__headline').textContent=item.headline;
    q('.ai-depth__body').textContent=item.body;
    q('.ai-depth__next-label').textContent=index===3?c.back:c.next;
    q('.ai-depth__next-icon').textContent=index===3?'←':'→';
    [...steps.children].forEach((b,i)=>b.classList.toggle('is-active',i===index));
  }

  function setItem(next){
    const n=(next+4)%4;
    if(n===index)return;
    clearTimeout(changeTimer);
    layer.classList.add('is-changing');
    changeTimer=setTimeout(()=>{
      index=n;
      render();
      requestAnimationFrame(()=>layer.classList.remove('is-changing'));
    },160);
  }

  function openLayer(){
    if(open)return;
    open=true;
    layer.setAttribute('aria-hidden','false');
    document.body.classList.add('is-ai-depth-open');
    window.__lenis?.stop?.();
    requestAnimationFrame(()=>{
      layer.classList.add('is-open');
      layer.focus({preventScroll:true});
    });
  }

  function closeLayer(restoreFocus=true){
    if(!open)return;
    open=false;
    layer.classList.remove('is-open');
    layer.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-ai-depth-open');
    window.__lenis?.start?.();
    if(restoreFocus)setTimeout(()=>explore.focus({preventScroll:true}),0);
  }

  explore.addEventListener('click',openLayer);
  q('.ai-depth__close').addEventListener('click',()=>closeLayer(true));
  nextButton.addEventListener('click',()=>index===3?closeLayer(true):setItem(index+1));
  document.addEventListener('keydown',event=>{
    if(!open)return;
    if(event.key==='Escape')closeLayer(true);
    if(event.key==='ArrowRight')index===3?closeLayer(true):setItem(index+1);
    if(event.key==='ArrowLeft')setItem(index-1);
  });

  new MutationObserver(()=>queueMicrotask(applyLanguage)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  applyLanguage();
})();