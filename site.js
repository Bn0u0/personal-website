(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer: fine)').matches;
  if(!reduced&&window.Lenis){window.__lenis=new Lenis({autoRaf:true,anchors:true,smoothWheel:true,lerp:.085,wheelMultiplier:.9})}

  const manifestoStatement=document.querySelector('.manifesto__statement');
  if(manifestoStatement){
    let charIndex=0;
    manifestoStatement.querySelectorAll(':scope > span').forEach(line=>{
      line.classList.remove('reveal');
      line.classList.add('manifesto__line');
      const text=line.textContent;
      line.textContent='';
      [...text].forEach(char=>{
        const letter=document.createElement('span');
        letter.className='manifesto__char';
        letter.style.setProperty('--char-index',charIndex++);
        letter.textContent=char===' '?'\u00A0':char;
        line.appendChild(letter);
      });
    });
    if(reduced){manifestoStatement.classList.add('is-flowing')}
    else{
      const manifestoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){manifestoStatement.classList.add('is-flowing');manifestoObserver.disconnect()}}),{threshold:.28,rootMargin:'0px 0px -10% 0px'});
      manifestoObserver.observe(manifestoStatement);
    }
  }

  const reveals=document.querySelectorAll('.reveal');
  const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-inview');ro.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});reveals.forEach(x=>ro.observe(x));

  const cursor=document.querySelector('.cursor'),label=document.querySelector('.cursor__label');let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
  if(fine&&!reduced&&cursor){addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});(function loop(){cx+=(mx-cx)*.28;cy+=(my-cy)*.28;document.documentElement.style.setProperty('--cx',cx+'px');document.documentElement.style.setProperty('--cy',cy+'px');requestAnimationFrame(loop)})();document.querySelectorAll('[data-cursor],a,button').forEach(el=>{el.addEventListener('mouseenter',()=>{if(el.dataset.cursor){cursor.classList.add('is-active');label.textContent=el.dataset.cursor}});el.addEventListener('mouseleave',()=>cursor.classList.remove('is-active'))})}

  const brand=document.querySelector('.brand'),profileTrigger=document.querySelector('.brand-avatar'),profileCard=document.querySelector('.profile-card');
  if(fine&&brand&&profileTrigger&&profileCard){let profileTimer;const openProfile=()=>{clearTimeout(profileTimer);brand.classList.add('is-profile-open');profileCard.classList.add('is-visible');profileCard.setAttribute('aria-hidden','false')};const closeProfile=()=>{clearTimeout(profileTimer);profileTimer=setTimeout(()=>{brand.classList.remove('is-profile-open');profileCard.classList.remove('is-visible');profileCard.setAttribute('aria-hidden','true')},120)};profileTrigger.addEventListener('mouseenter',openProfile);profileTrigger.addEventListener('mouseleave',closeProfile);profileCard.addEventListener('mouseenter',openProfile);profileCard.addEventListener('mouseleave',closeProfile);brand.addEventListener('focus',openProfile);brand.addEventListener('blur',closeProfile)}

  const projects={
    picnest:{number:'01',year:'2026',title:'PicNest 2.0',mediaTitle:'PICNEST 2.0',headline:'A small world designed to feel alive.',description:'Virtual world experiments around exploration, collection, multiplayer presence and Peep personality.',tags:['World','Social','R3F','Systems'],below:'A living-world project focused on discovery, collection and the relationship between players and their Peep.'},
    quant:{number:'02',year:'2026',title:'Quant Research System',mediaTitle:'QUANT RESEARCH SYSTEM',headline:'Research first. Deployment last.',description:'An auditable strategy research pipeline built around mechanism testing, robustness checks and strict separation between research and live execution.',tags:['Python','MT5','Research','Validation'],below:'The emphasis is not on showing a profitable chart. It is on showing how hypotheses survive or fail a repeatable research pipeline.'},
    grass:{number:'03',year:'2026',title:'Grass Cutting 3min',mediaTitle:'GRASS CUTTING 3MIN',headline:'A tiny game loop built for immediate play.',description:'A compact mobile-oriented prototype exploring fast sessions, systems design and cross-platform implementation.',tags:['Game','Mobile','Phaser','Prototype'],below:'A short-session game experiment where the constraint is part of the design: interaction should become legible almost immediately.'},
    doodle:{number:'04',year:'2026',title:'Doodle Tyrant',mediaTitle:'DOODLE TYRANT',headline:'Bad drawings turned into a combat language.',description:'A rogue-lite concept built around merge logic, synergy systems and intentionally rough crayon-like art direction.',tags:['Rogue-lite','Game Design','Systems','Art Direction'],below:'The visual roughness is intentional. The project explores whether an imperfect drawing language can become the identity of the combat system.'},
    learning:{number:'05',year:'2026',title:'Learning Games',mediaTitle:'LEARNING GAMES',headline:'Learning redesigned as collection.',description:'A language-learning game concept using listening, gacha and collection loops to transform repetition into progression.',tags:['Learning','Gacha','Collection','Product'],below:'Instead of presenting study as a task list, the project asks whether collection and progression can make repetition feel naturally motivated.'},
    pixel:{number:'06',year:'2026',title:'Pixel Lab',mediaTitle:'PIXEL LAB',headline:'A technical sandbox for pixels and motion.',description:'Canvas and physics experiments focused on interaction, sprite processing and small technical prototypes.',tags:['Canvas','Physics','Pixel','Experiment'],below:'A lab rather than a single product: a place for small rendering, interaction and sprite-processing experiments.'}
  };

  const detail=document.querySelector('.project-detail'),detailClose=document.querySelector('.project-detail__close'),detailMedia=document.querySelector('.project-detail__media');
  const dn=document.querySelector('.detail-number'),dy=document.querySelector('.detail-year'),dt=document.querySelector('.project-detail__title'),dh=document.querySelector('.project-detail__headline'),dd=document.querySelector('.project-detail__description'),dTags=document.querySelector('.project-detail__tags'),dmn=document.querySelector('.detail-media-number'),dmt=document.querySelector('.detail-media-title'),db=document.querySelector('.detail-below-copy');
  let lastTrigger=null;

  if(detail){
    detail.dataset.organicReveal='true';
    const organicStyle=document.createElement('style');
    organicStyle.textContent=`
      .project-detail{
        transform:none!important;
        transition:none!important;
        will-change:clip-path;
      }
      .project-detail.is-open{
        transform:none!important;
        transition:none!important;
      }
      @media(prefers-reduced-motion:reduce){
        .project-detail{clip-path:none!important;will-change:auto}
      }
    `;
    document.head.appendChild(organicStyle);
  }

  let detailOrigin={x:innerWidth/2,y:innerHeight/2};
  let detailShape=null;
  let detailRadius=0;
  let detailMaxRadius=0;
  let detailFrame=0;

  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const easeOutQuint=t=>1-Math.pow(1-t,5);
  const easeInOutCubic=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

  function detailReady(){return detail&&detailMedia&&dn&&dy&&dt&&dh&&dd&&dTags&&dmn&&dmt&&db}

  function randomShape(){
    return {
      k1:2+Math.floor(Math.random()*2),
      k2:4+Math.floor(Math.random()*2),
      k3:6+Math.floor(Math.random()*2),
      a1:.038+Math.random()*.026,
      a2:.018+Math.random()*.018,
      a3:.008+Math.random()*.010,
      p1:Math.random()*TAU,
      p2:Math.random()*TAU,
      p3:Math.random()*TAU,
      squashX:.985+Math.random()*.03,
      squashY:.985+Math.random()*.03
    };
  }

  function originFromEvent(event,trigger){
    const r=trigger?.getBoundingClientRect?.();
    const pointer=event&&event.detail!==0&&Number.isFinite(event.clientX)&&Number.isFinite(event.clientY);
    return {
      x:clamp(pointer?event.clientX:(r?r.left+r.width/2:innerWidth/2),0,innerWidth),
      y:clamp(pointer?event.clientY:(r?r.top+r.height/2:innerHeight/2),0,innerHeight)
    };
  }

  function coverageRadius(origin){
    const corners=[
      Math.hypot(origin.x,origin.y),
      Math.hypot(innerWidth-origin.x,origin.y),
      Math.hypot(origin.x,innerHeight-origin.y),
      Math.hypot(innerWidth-origin.x,innerHeight-origin.y)
    ];
    return Math.max(...corners)*1.34+48;
  }

  function blobPolygon(origin,radius,shape){
    const count=64;
    const pts=[];
    for(let i=0;i<count;i++){
      const a=TAU*i/count;
      const organic=1+
        Math.sin(a*shape.k1+shape.p1)*shape.a1+
        Math.sin(a*shape.k2+shape.p2)*shape.a2+
        Math.sin(a*shape.k3+shape.p3)*shape.a3;
      const rr=Math.max(2,radius*organic);
      const x=origin.x+Math.cos(a)*rr*shape.squashX;
      const y=origin.y+Math.sin(a)*rr*shape.squashY;
      pts.push(`${x.toFixed(2)}px ${y.toFixed(2)}px`);
    }
    return `polygon(${pts.join(',')})`;
  }

  function animateDetail(opening,onDone){
    if(!detail||reduced){onDone?.();return;}
    cancelAnimationFrame(detailFrame);
    if(opening)detailMaxRadius=coverageRadius(detailOrigin);
    else if(!Number.isFinite(detailRadius)||detailRadius<=0)detailRadius=coverageRadius(detailOrigin);

    const from=detailRadius;
    const to=opening?detailMaxRadius:2;
    const duration=1500;
    const started=performance.now();

    const frame=now=>{
      const t=clamp((now-started)/duration,0,1);
      const eased=opening?easeOutQuint(t):easeInOutCubic(t);
      detailRadius=from+(to-from)*eased;
      detail.style.clipPath=blobPolygon(detailOrigin,detailRadius,detailShape);
      detail.style.webkitClipPath=detail.style.clipPath;
      if(t<1){detailFrame=requestAnimationFrame(frame);return;}
      if(opening){
        detailRadius=detailMaxRadius;
        detail.style.clipPath='none';
        detail.style.webkitClipPath='none';
      }
      onDone?.();
    };
    detailFrame=requestAnimationFrame(frame);
  }

  function openProject(key,trigger,event){
    const p=projects[key];
    if(!p||!detailReady())return;
    lastTrigger=trigger||null;
    dn.textContent=p.number;dy.textContent=p.year;dt.textContent=p.title;dh.textContent=p.headline;dd.textContent=p.description;dmn.textContent=p.number;dmt.textContent=p.mediaTitle;db.textContent=p.below;
    detailMedia.dataset.project=key;dTags.innerHTML=p.tags.map(t=>`<span>${t}</span>`).join('');detail.scrollTop=0;

    detailOrigin=originFromEvent(event,trigger);
    detailShape=randomShape();
    detailMaxRadius=coverageRadius(detailOrigin);
    detailRadius=reduced?detailMaxRadius:6;

    if(!reduced){
      detail.style.clipPath=blobPolygon(detailOrigin,detailRadius,detailShape);
      detail.style.webkitClipPath=detail.style.clipPath;
    }else{
      detail.style.clipPath='none';
      detail.style.webkitClipPath='none';
    }

    detail.setAttribute('aria-hidden','false');
    document.body.classList.add('is-detail-open');
    window.__lenis?.stop?.();
    detail.classList.add('is-open');

    if(reduced){requestAnimationFrame(()=>detail.focus?.({preventScroll:true}));return;}
    requestAnimationFrame(()=>animateDetail(true,()=>detail.focus?.({preventScroll:true})));
  }

  function closeProject(){
    if(!detail||!detail.classList.contains('is-open'))return;
    window.__lenis?.stop?.();

    const finish=()=>{
      detail.classList.remove('is-open');
      detail.setAttribute('aria-hidden','true');
      document.body.classList.remove('is-detail-open');
      detail.style.clipPath='none';
      detail.style.webkitClipPath='none';
      detailRadius=0;
      window.__lenis?.start?.();
      setTimeout(()=>lastTrigger?.focus?.({preventScroll:true}),0);
    };

    if(reduced){finish();return;}
    detailMaxRadius=coverageRadius(detailOrigin);
    detailRadius=detailMaxRadius;
    detail.style.clipPath=blobPolygon(detailOrigin,detailRadius,detailShape||randomShape());
    detail.style.webkitClipPath=detail.style.clipPath;
    animateDetail(false,finish);
  }

  document.querySelectorAll('.project-item').forEach(item=>{
    const row=item.querySelector('.project-row');
    if(!row)return;
    row.addEventListener('click',event=>openProject(item.dataset.project,row,event));
  });
  detailClose?.addEventListener('click',closeProject);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&detail?.classList.contains('is-open'))closeProject()});

  if(fine&&!reduced&&detail&&detailMedia){addEventListener('mousemove',e=>{if(!detail.classList.contains('is-open'))return;const r=detailMedia.getBoundingClientRect();const nx=Math.max(-.5,Math.min(.5,(e.clientX-r.left)/r.width-.5));const ny=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));detailMedia.style.setProperty('--ax',nx*28+'px');detailMedia.style.setProperty('--ay',ny*20+'px');detailMedia.style.setProperty('--bx',nx*-18+'px');detailMedia.style.setProperty('--by',ny*-24+'px')})}

  document.querySelectorAll('.magnetic').forEach(el=>{if(!fine||reduced)return;el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate3d(${x*.16}px,${y*.2}px,0)`});el.addEventListener('mouseleave',()=>{el.style.transition='transform 420ms cubic-bezier(.2,.7,.2,1)';el.style.transform='translate3d(0,0,0)';setTimeout(()=>el.style.transition='',430)})});

  const pr=document.querySelector('.scroll-progress'),pb=document.querySelector('.scroll-progress__bar');let timer;
  function progressBar(v){if(!pr||!pb)return;v=Math.max(0,Math.min(1,v||0));pb.style.transform=`scaleX(${v})`;pr.classList.add('is-scrolling');clearTimeout(timer);timer=setTimeout(()=>pr.classList.remove('is-scrolling'),180)}
  function nativeP(){const s=document.documentElement.scrollHeight-innerHeight;return s>0?(scrollY||document.documentElement.scrollTop)/s:0}
  if(window.__lenis)window.__lenis.on('scroll',({progress:p})=>progressBar(p));else addEventListener('scroll',()=>progressBar(nativeP()),{passive:true});
  addEventListener('resize',()=>progressBar(nativeP()),{passive:true});progressBar(nativeP());setTimeout(()=>pr?.classList.remove('is-scrolling'),220);

  const languageScript=document.createElement('script');
  languageScript.src='./lang.js';languageScript.async=false;
  languageScript.addEventListener('load',()=>{const polish=document.createElement('script');polish.src='./lang-polish.js';polish.async=false;document.body.appendChild(polish)});
  document.body.appendChild(languageScript);
})();