(()=>{
  const section=document.querySelector('.about-ai');
  if(!section||document.querySelector('.ai-depth'))return;

  const COPY={
    en:{
      intro:'I set the direction. AI searches, decomposes, builds and verifies. The useful part is the loop between the two.',
      principles:['Direction','Challenge','Evidence','Memory'],
      explore:'Explore further',
      notes:'04 notes ↗',
      eyebrow:'AI / Extended notes',
      close:'Close',
      next:'Next',
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
      notes:'04 notes ↗',
      eyebrow:'AI / 延伸筆記',
      close:'關閉',
      next:'下一則',
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

  /* The timeline should stay quiet, but its final node must still read as a real
     destination. Keep the affordance static by default and use one restrained
     first-view cue instead of a looping attention animation. */
  if(!document.querySelector('style[data-ai-depth-discovery]')){
    const style=document.createElement('style');
    style.dataset.aiDepthDiscovery='true';
    style.textContent=`
      .about-ai__row:last-of-type::before{
        width:4px!important;
        height:4px!important;
        top:-2.5px!important;
        background:rgba(242,240,235,.58)!important;
      }
      .about-ai__explore{
        color:rgba(242,240,235,.70)!important;
      }
      .about-ai__explore-label{
        opacity:.94;
      }
      .about-ai__explore-meta{
        display:inline-block;
        opacity:.62!important;
        transition:transform var(--motion-ui,340ms) var(--ease-soft,cubic-bezier(.22,1,.36,1)),opacity var(--motion-micro,200ms) ease;
      }
      .about-ai__explore::before{
        width:5px!important;
        height:5px!important;
        top:-3px!important;
        border:1px solid currentColor;
        background:var(--fg)!important;
        box-sizing:border-box;
        opacity:.9;
      }
      .about-ai__explore:hover,.about-ai__explore:focus-visible{
        color:rgba(242,240,235,.96)!important;
      }
      .about-ai.is-discovery-cue .about-ai__explore-meta{
        animation:aiExploreNudge 760ms var(--ease-soft,cubic-bezier(.22,1,.36,1)) 1;
      }
      .about-ai.is-discovery-cue .about-ai__explore::before{
        animation:aiExploreNode 760ms ease 1;
      }
      @keyframes aiExploreNudge{
        0%,100%{transform:translate3d(0,0,0);opacity:.62}
        42%{transform:translate3d(2px,-2px,0);opacity:.92}
      }
      @keyframes aiExploreNode{
        0%,100%{box-shadow:0 0 0 0 rgba(242,240,235,0)}
        45%{box-shadow:0 0 0 4px rgba(242,240,235,.07)}
      }
      @media(prefers-reduced-motion:reduce){
        .about-ai.is-discovery-cue .about-ai__explore-meta,
        .about-ai.is-discovery-cue .about-ai__explore::before{animation:none!important}
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
      discoveryTimer=setTimeout(()=>section.classList.remove('is-discovery-cue'),900);
    },{threshold:[.55]});
    observer.observe(section);
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
      <button class="ai-depth__next" type="button"><span class="ai-depth__next-label"></span><span>→</span></button>
    </div>`;
  document.body.appendChild(layer);

  const q=s=>layer.querySelector(s);
  const steps=q('.ai-depth__steps');
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
    q('.ai-depth__next-label').textContent=c.next;
    layer.setAttribute('aria-label',c.eyebrow);
    render();
  }

  function render(){
    const item=data().items[index];
    q('.ai-depth__index').textContent=`0${index+1} / 04`;
    q('.ai-depth__title').textContent=item.title;
    q('.ai-depth__headline').textContent=item.headline;
    q('.ai-depth__body').textContent=item.body;
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

  function closeLayer(){
    if(!open)return;
    open=false;
    layer.classList.remove('is-open');
    layer.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-ai-depth-open');
    window.__lenis?.start?.();
    setTimeout(()=>explore.focus({preventScroll:true}),0);
  }

  explore.addEventListener('click',openLayer);
  q('.ai-depth__close').addEventListener('click',closeLayer);
  q('.ai-depth__next').addEventListener('click',()=>setItem(index+1));
  document.addEventListener('keydown',event=>{
    if(!open)return;
    if(event.key==='Escape')closeLayer();
    if(event.key==='ArrowRight')setItem(index+1);
    if(event.key==='ArrowLeft')setItem(index-1);
  });

  new MutationObserver(()=>queueMicrotask(applyLanguage)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  applyLanguage();
})();