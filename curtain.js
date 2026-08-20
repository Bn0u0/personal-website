(async()=>{
  const hero=document.querySelector('.hero');
  const work=document.querySelector('.work');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(!hero||!work||reduced){
    document.documentElement.classList.add('curtain-static');
    return;
  }

  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const existing=[...document.scripts].find(s=>s.src===src);
      if(existing){
        if(existing.dataset.loaded==='true')return resolve();
        existing.addEventListener('load',resolve,{once:true});
        existing.addEventListener('error',reject,{once:true});
        return;
      }
      const script=document.createElement('script');
      script.src=src;script.async=false;
      script.addEventListener('load',()=>{script.dataset.loaded='true';resolve()},{once:true});
      script.addEventListener('error',reject,{once:true});
      document.head.appendChild(script);
    });
  }

  try{
    if(!window.gsap)await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
    if(!window.ScrollTrigger)await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js');
  }catch(error){
    console.warn('[Curtain] GSAP unavailable, using normal page flow.',error);
    document.documentElement.classList.add('curtain-static');
    return;
  }

  const gsap=window.gsap;
  const ScrollTrigger=window.ScrollTrigger;
  if(!gsap||!ScrollTrigger){
    document.documentElement.classList.add('curtain-static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('curtain-ready');
  hero.classList.add('hero--curtain');
  work.classList.add('work--behind-curtain');

  const NS='http://www.w3.org/2000/svg';
  const defsSvg=document.createElementNS(NS,'svg');
  defsSvg.setAttribute('class','curtain-defs');
  defsSvg.setAttribute('aria-hidden','true');
  defsSvg.innerHTML='<defs><clipPath id="heroCurtainClip" clipPathUnits="objectBoundingBox"><path id="heroCurtainMaskPath"></path></clipPath></defs>';
  document.body.prepend(defsSvg);

  hero.style.clipPath='url(#heroCurtainClip)';
  hero.style.webkitClipPath='url(#heroCurtainClip)';

  const edgeLayer=document.createElement('div');
  edgeLayer.className='curtain-edge-layer';
  edgeLayer.setAttribute('aria-hidden','true');
  edgeLayer.innerHTML='<svg viewBox="0 0 1000 1000" preserveAspectRatio="none"><path class="curtain-edge-shadow"></path><path class="curtain-edge-highlight"></path></svg>';
  document.body.appendChild(edgeLayer);

  const maskPath=defsSvg.querySelector('#heroCurtainMaskPath');
  const shadowPath=edgeLayer.querySelector('.curtain-edge-shadow');
  const highlightPath=edgeLayer.querySelector('.curtain-edge-highlight');

  const state={p:0,tension:0};
  const yStops=[0,.13,.29,.47,.65,.83,1];
  const drape=[0,.22,.86,.46,.74,.20,0];
  const ripple=[0,-.10,.11,-.08,.10,-.08,0];

  function curve(points){
    let d=`M ${points[0][0]} ${points[0][1]}`;
    for(let i=0;i<points.length-1;i++){
      const p0=points[i-1]||points[i];
      const p1=points[i];
      const p2=points[i+1];
      const p3=points[i+2]||p2;
      const c1x=p1[0]+(p2[0]-p0[0])/6;
      const c1y=p1[1]+(p2[1]-p0[1])/6;
      const c2x=p2[0]-(p3[0]-p1[0])/6;
      const c2y=p2[1]-(p3[1]-p1[1])/6;
      d+=` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }

  function edgePoints(p){
    const eased=1-Math.pow(1-p,1.28);
    const edgeX=1-eased*1.09;
    const life=Math.sin(Math.PI*Math.min(1,p));
    const amplitude=(.009+.067*life)*(1-.18*p)+state.tension;
    return yStops.map((y,i)=>[
      edgeX+amplitude*(drape[i]+ripple[i]*life),
      y
    ]);
  }

  function render(){
    const p=Math.max(0,Math.min(1,state.p));
    const points=edgePoints(p);
    const edge=curve(points);
    const mask=`M 0 0 L ${points[0][0]} 0 ${edge.slice(edge.indexOf(' C'))} L 0 1 Z`;
    maskPath.setAttribute('d',mask);

    const scaled=points.map(([x,y])=>[x*1000,y*1000]);
    const edgeD=curve(scaled);
    shadowPath.setAttribute('d',edgeD);
    highlightPath.setAttribute('d',edgeD);
    hero.style.setProperty('--curtain-progress',p.toFixed(4));
    hero.style.setProperty('--curtain-fold-opacity',(0.08+p*0.20).toFixed(3));
    hero.style.setProperty('--curtain-fold-scale',(1-p*0.12).toFixed(4));
  }

  render();

  const heroContent=[
    hero.querySelector('.hero__eyebrow'),
    hero.querySelector('.hero__title'),
    hero.querySelector('.hero__footer')
  ].filter(Boolean);

  const timeline=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{
      trigger:hero,
      start:'top top',
      end:()=>`+=${Math.max(560,innerHeight*(innerWidth<700?.78:.92))}`,
      scrub:.58,
      pin:true,
      pinSpacing:false,
      anticipatePin:1,
      invalidateOnRefresh:true,
      onEnter:()=>edgeLayer.classList.add('is-active'),
      onEnterBack:()=>edgeLayer.classList.add('is-active'),
      onLeave:()=>edgeLayer.classList.remove('is-active'),
      onLeaveBack:()=>edgeLayer.classList.remove('is-active'),
      onUpdate:self=>{
        state.tension=Math.min(.024,Math.abs(self.getVelocity())/52000);
        gsap.to(state,{tension:0,duration:.28,ease:'power3.out',overwrite:'auto',onUpdate:render});
      }
    }
  });

  timeline
    .to(state,{p:1,duration:.84,onUpdate:render},0)
    .to(heroContent,{xPercent:-7,duration:.72,ease:'power1.in'},.04)
    .to(edgeLayer,{opacity:0,duration:.14,ease:'power2.in'},.76)
    .to({}, {duration:.16});

  if(window.__lenis?.on){
    window.__lenis.on('scroll',ScrollTrigger.update);
  }

  const refresh=()=>ScrollTrigger.refresh();
  addEventListener('load',refresh,{once:true});
  addEventListener('resize',refresh,{passive:true});
})();
