(()=>{
  /* Load the page-wide surface integration layer before motion polish. */
  if(!document.querySelector('link[data-surface-integration]')){
    const integration=document.createElement('link');
    integration.rel='stylesheet';
    integration.href='./surface-integration.css';
    integration.dataset.surfaceIntegration='true';
    document.head.appendChild(integration);
  }

  /* Load the elastic cursor grid after the core site is ready. Kept modular so the
     field can be tuned or removed without touching the main interaction system. */
  if(!document.querySelector('link[data-elastic-grid]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='./elastic-grid.css';
    link.dataset.elasticGrid='true';
    const loadBehavior=()=>{
      if(document.querySelector('script[data-elastic-grid]'))return;
      const script=document.createElement('script');
      script.src='./elastic-grid.js';
      script.dataset.elasticGrid='true';
      document.body.appendChild(script);
    };
    link.addEventListener('load',loadBehavior,{once:true});
    document.head.appendChild(link);
  }

  const C={
    en:{
      menu001:'About me',
      menu002:'AI + me',
      kicker:'About / 002',
      statement:['I do not use AI as the answer','I use it as a second thinking system'],
      intro:'What started as a way to turn ideas into working prototypes gradually became a repeatable collaboration loop: I decide what matters, define the direction and challenge the result; AI searches, decomposes, implements, verifies and keeps the reasoning traceable. The useful part is not that it answers quickly. It is that the same idea can be pushed through many forms until it becomes something testable.',
      rows:[
        {title:'Prototype together',copy:'Early on, the collaboration was very direct: describe an idea, turn it into UI or code, run it, find what feels wrong, then rebuild it. Games and interface experiments were where this rhythm became natural.'},
        {title:'Argue, do not obey',copy:'The relationship became more useful when agreement stopped being the goal. I explicitly ask AI to attack weak logic, separate facts from assumptions and make me explain decisions that do not survive scrutiny.'},
        {title:'Turn intuition into evidence',copy:'In quantitative research, informal market judgment is translated into canonical definitions, repeatable backtests, no-lookahead rules, data roles and gates. A persuasive explanation is not enough; the result has to leave evidence that can be audited later.'},
        {title:'Keep the history',copy:'Across PicNest, quant research and this website, versions, commits, rollback points, failed directions and design changes are part of the work rather than noise to erase. The collaboration has gradually moved from “help me build this” toward “help me build a system that remembers why it became this.”'}
      ],
      tags:['Human direction','AI leverage','Adversarial review','Evidence','Iteration','Version history']
    },
    zh:{
      menu001:'關於我',
      menu002:'AI 與我',
      kicker:'關於 / 002',
      statement:['我不是把 AI 當答案','我把它當第二個思考系統'],
      intro:'一開始只是把腦中的想法交給 AI，讓它變成能跑的原型；後來慢慢變成一套固定的協作循環：我決定什麼重要、定義方向、挑戰結果；AI 搜尋、拆解、實作、驗證，並把過程留下來。真正有價值的不是它回答得快，而是同一個想法可以被反覆推進，直到變成可以測試的東西。',
      rows:[
        {title:'一起做出原型',copy:'最早的合作很直接：我描述一個想法，AI 把它變成 UI 或程式，跑起來後再找哪裡不對、重新做。遊戲與介面實驗是我們最早形成這種節奏的地方。'},
        {title:'不是順著我',copy:'真正開始變得有用，是在「同意我」不再是目標之後。我會直接要求 AI 攻擊有問題的邏輯，把事實、假設和推論拆開；如果一個決定經不起質疑，我就必須重新解釋或重做。'},
        {title:'把直覺變成證據',copy:'到了量化研究，原本口語化的市場判斷會被翻成 canonical definition、可重複回測、No-lookahead 規則、資料角色與 Gate。說得合理不夠，結果必須留下之後可以重新稽核的證據。'},
        {title:'讓系統記得過往',copy:'從 PicNest、量化研究到現在這個網站，版本、Commit、Rollback、失敗方向與設計改變都不是要被擦掉的雜訊，而是工作本身的一部分。合作也慢慢從「幫我把它做出來」，變成「幫我做出一個知道自己為什麼變成現在這樣的系統」。'}
      ],
      tags:['人決定方向','AI 放大執行力','對抗式審查','證據','反覆迭代','版本歷史']
    }
  };

  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  const lang=()=>document.documentElement.lang.toLowerCase().startsWith('zh')?'zh':'en';
  const text=(s,v)=>{const el=q(s);if(el)el.textContent=v};

  function applyCopy(){
    const c=C[lang()];
    text('.about-menu-001 .nav-about__label',c.menu001);
    text('.about-menu-002 .nav-about__label',c.menu002);
    text('.about-ai__kicker',c.kicker);
    const lines=qa('.about-ai__statement span');
    c.statement.forEach((v,i)=>{if(lines[i])lines[i].textContent=v});
    text('.about-ai__intro',c.intro);
    qa('.about-ai__row').forEach((row,i)=>{
      if(!c.rows[i])return;
      const title=row.querySelector('.about-ai__row-title');
      const copy=row.querySelector('.about-ai__row-copy');
      if(title)title.textContent=c.rows[i].title;
      if(copy)copy.textContent=c.rows[i].copy;
    });
    const tagRoot=q('.about-ai__tags');
    if(tagRoot)tagRoot.innerHTML=c.tags.map(x=>`<span>${x}</span>`).join('');
  }

  const navAbout=q('.nav-about');
  const trigger=q('.nav-about__trigger');
  if(navAbout&&trigger){
    const open=()=>{navAbout.classList.add('is-open');trigger.setAttribute('aria-expanded','true')};
    const close=()=>{navAbout.classList.remove('is-open');trigger.setAttribute('aria-expanded','false')};
    navAbout.addEventListener('mouseenter',open);
    navAbout.addEventListener('mouseleave',close);
    navAbout.addEventListener('focusin',open);
    navAbout.addEventListener('focusout',event=>{if(!navAbout.contains(event.relatedTarget))close()});
    trigger.addEventListener('click',event=>{
      if(matchMedia('(pointer:coarse)').matches&&!navAbout.classList.contains('is-open')){
        event.preventDefault();
        open();
      }
    });
  }

  /* About / 002 joins the same directional language wipe as the rest of the site. */
  document.addEventListener('click',event=>{
    const toggle=event.target.closest?.('.language-toggle');
    if(!toggle||toggle.disabled||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const els=qa('.about-ai__kicker,.about-ai__statement,.about-ai__intro,.about-ai__row-title,.about-ai__row-copy,.about-ai__tags');
    els.forEach((el,i)=>{
      el.classList.add('lang-fade-target');
      el.style.setProperty('--lang-delay',`${Math.min((i%10)*5,45)}ms`);
    });
    requestAnimationFrame(()=>els.forEach(el=>el.classList.add('is-lang-out')));
    setTimeout(()=>els.forEach(el=>el.classList.remove('is-lang-out')),390);
    setTimeout(()=>els.forEach(el=>{
      el.classList.remove('lang-fade-target');
      el.style.removeProperty('--lang-delay');
    }),760);
  },true);

  new MutationObserver(applyCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  applyCopy();
})();
