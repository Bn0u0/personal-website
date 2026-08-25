(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer: fine)').matches;
  const MOTION=window.__motion=Object.freeze({
    micro:180,
    ui:320,
    content:560,
    scene:1000,
    exitMicro:90,
    exitUi:160,
    exitContent:280,
    exitScene:500,
    staggerTight:40,
    staggerStandard:80
  });
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
  if(fine&&brand&&profileTrigger&&profileCard){let profileTimer;const openProfile=()=>{clearTimeout(profileTimer);brand.classList.add('is-profile-open');profileCard.classList.add('is-visible');profileCard.setAttribute('aria-hidden','false')};const closeProfile=()=>{clearTimeout(profileTimer);profileTimer=setTimeout(()=>{brand.classList.remove('is-profile-open');profileCard.classList.remove('is-visible');profileCard.setAttribute('aria-hidden','true')},MOTION.exitMicro)};profileTrigger.addEventListener('mouseenter',openProfile);profileTrigger.addEventListener('mouseleave',closeProfile);profileCard.addEventListener('mouseenter',openProfile);profileCard.addEventListener('mouseleave',closeProfile);brand.addEventListener('focus',openProfile);brand.addEventListener('blur',closeProfile)}

  /* Canonical project content now lives in data/projects.js. This adapter only
     shapes that shared data for the existing organic-detail animation runtime. */
  const canonical=window.__portfolioProjects||{};
  const projects=Object.fromEntries(Object.entries(canonical).map(([key,p])=>{
    const c=p.en||{};
    return [key,{
      number:p.number,
      year:p.period,
      title:p.title,
      mediaTitle:p.mediaTitle,
      headline:c.headline||p.title,
      description:c.description||'',
      tags:(p.stack||[]).slice(0,4),
      below:c.below||c.overview||''
    }];
  }));

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
  let detailCloseClipPath=null;

  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const easeOutQuint=t=>1-Math.pow(1-t,5);
  const easeOutCubic=t=>1-Math.pow(1-t,3);
  const DETAIL_CLOSE_CLIP_ID='project-detail-close-reveal';

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
    const pointer=event&&Number.isFinite(event.clientX)&&Number.isFinite(event.clientY)&&(event.type?.startsWith('pointer')||event.detail!==0);
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

  function blobPath(origin,radius,shape){
    const count=64;
    const pts=[];
    for(let i=0;i<count;i++){
      const a=TAU*i/count;
      const organic=1+
        Math.sin(a*shape.k1+shape.p1)*shape.a1+
        Math.sin(a*shape.k2+shape.p2)*shape.a2+
        Math.sin(a*shape.k3+shape.p3)*shape.a3;
      const rr=Math.max(2,radius*organic);
      pts.push([
        origin.x+Math.cos(a)*rr*shape.squashX,
        origin.y+Math.sin(a)*rr*shape.squashY
      ]);
    }
    return pts.map((point,index)=>`${index?'L':'M'}${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(' ')+' Z';
  }

  function ensureDetailCloseClip(){
    if(detailCloseClipPath?.isConnected)return detailCloseClipPath;
    const existing=document.getElementById(DETAIL_CLOSE_CLIP_ID);
    if(existing){
      detailCloseClipPath=existing.querySelector('path');
      if(detailCloseClipPath)return detailCloseClipPath;
    }

    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    const defs=document.createElementNS(ns,'defs');
    const clip=document.createElementNS(ns,'clipPath');
    const path=document.createElementNS(ns,'path');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('width','0');
    svg.setAttribute('height','0');
    svg.style.cssText='position:fixed;width:0;height:0;overflow:hidden;pointer-events:none';
    clip.id=DETAIL_CLOSE_CLIP_ID;
    clip.setAttribute('clipPathUnits','userSpaceOnUse');
    path.setAttribute('clip-rule','evenodd');
    path.setAttribute('fill-rule','evenodd');
    clip.appendChild(path);
    defs.appendChild(clip);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    detailCloseClipPath=path;
    return detailCloseClipPath;
  }

  function setInverseDetailClip(origin,radius,shape){
    if(!detail)return;
    const path=ensureDetailCloseClip();
    const outer=`M0 0 H${innerWidth.toFixed(2)} V${innerHeight.toFixed(2)} H0 Z`;
    path.setAttribute('d',`${outer} ${blobPath(origin,radius,shape)}`);
    const ref=`url(#${DETAIL_CLOSE_CLIP_ID})`;
    detail.style.clipPath=ref;
    detail.style.webkitClipPath=ref;
  }

  function animateDetail(opening,onDone){
    if(!detail||reduced){onDone?.();return;}
    cancelAnimationFrame(detailFrame);
    if(opening)detailMaxRadius=coverageRadius(detailOrigin);
    else if(!Number.isFinite(detailRadius)||detailRadius<=0)detailRadius=coverageRadius(detailOrigin);

    const from=detailRadius;
    const to=opening?detailMaxRadius:2;
    const duration=opening?MOTION.scene*2:MOTION.exitScene;
    const started=performance.now();

    const frame=now=>{
      const t=clamp((now-started)/duration,0,1);
      const eased=opening?easeOutQuint(t):easeOutCubic(t);
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

  function animateDetailCloseReveal(origin,onDone){
    if(!detail||reduced){onDone?.();return;}
    cancelAnimationFrame(detailFrame);
    const shape=detailShape||randomShape();
    const maxRadius=coverageRadius(origin);
    const duration=MOTION.exitScene;
    const started=performance.now();

    setInverseDetailClip(origin,2,shape);

    const frame=now=>{
      const t=clamp((now-started)/duration,0,1);
      const radius=2+(maxRadius-2)*easeOutCubic(t);
      setInverseDetailClip(origin,radius,shape);
      if(t<1){detailFrame=requestAnimationFrame(frame);return;}
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

    if(reduced){
      requestAnimationFrame(()=>detail.focus?.({preventScroll:true}));
      return;
    }
    requestAnimationFrame(()=>animateDetail(true,()=>detail.focus?.({preventScroll:true})));
  }

  function closeProject(event){
    if(!detail||!detail.classList.contains('is-open'))return;
    window.__lenis?.stop?.();
    const closeOrigin=originFromEvent(event,detailClose);

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
    animateDetailCloseReveal(closeOrigin,finish);
  }

  document.querySelectorAll('.project-item').forEach(item=>{
    const row=item.querySelector('.project-row');
    if(!row)return;
    row.addEventListener('click',event=>openProject(item.dataset.project,row,event));
  });

  detailClose?.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    event.preventDefault();
    closeProject(event);
  });
  detailClose?.addEventListener('click',event=>{
    if(event.detail===0)closeProject(event);
  });
  addEventListener('keydown',e=>{if(e.key==='Escape'&&detail?.classList.contains('is-open'))closeProject(e)});

  if(fine&&!reduced&&detail&&detailMedia){addEventListener('mousemove',e=>{if(!detail.classList.contains('is-open'))return;const r=detailMedia.getBoundingClientRect();const nx=Math.max(-.5,Math.min(.5,(e.clientX-r.left)/r.width-.5));const ny=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));detailMedia.style.setProperty('--ax',nx*28+'px');detailMedia.style.setProperty('--ay',ny*20+'px');detailMedia.style.setProperty('--bx',nx*-18+'px');detailMedia.style.setProperty('--by',ny*-24+'px')})}

  document.querySelectorAll('.magnetic').forEach(el=>{if(!fine||reduced)return;el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate3d(${x*.16}px,${y*.2}px,0)`});el.addEventListener('mouseleave',()=>{el.style.transition=`transform ${MOTION.ui}ms cubic-bezier(.2,.7,.2,1)`;el.style.transform='translate3d(0,0,0)';setTimeout(()=>el.style.transition='',MOTION.ui+16)})});

  const pr=document.querySelector('.scroll-progress'),pb=document.querySelector('.scroll-progress__bar');let timer;
  function progressBar(v){if(!pr||!pb)return;v=Math.max(0,Math.min(1,v||0));pb.style.transform=`scaleX(${v})`;pr.classList.add('is-scrolling');clearTimeout(timer);timer=setTimeout(()=>pr.classList.remove('is-scrolling'),MOTION.micro)}
  function nativeP(){const s=document.documentElement.scrollHeight-innerHeight;return s>0?(scrollY||document.documentElement.scrollTop)/s:0}
  if(window.__lenis)window.__lenis.on('scroll',({progress:p})=>progressBar(p));else addEventListener('scroll',()=>progressBar(nativeP()),{passive:true});
  addEventListener('resize',()=>progressBar(nativeP()),{passive:true});progressBar(nativeP());setTimeout(()=>pr?.classList.remove('is-scrolling'),MOTION.micro);

  const languageScript=document.createElement('script');
  languageScript.src='./scripts/lang.js';languageScript.async=false;
  languageScript.addEventListener('load',()=>{const polish=document.createElement('script');polish.src='./scripts/lang-polish.js';polish.async=false;document.body.appendChild(polish)});
  document.body.appendChild(languageScript);
})();