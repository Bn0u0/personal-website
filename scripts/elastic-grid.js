(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  if(reduced||!fine)return;

  const hero=document.querySelector('.hero');
  if(!hero)return;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
  const cursor=document.querySelector('.cursor');

  /* Hero only for now: the grid is an ambient response, not a site-wide cursor effect. */
  hero.classList.add('elastic-grid-surface');

  const canvas=document.createElement('canvas');
  canvas.className='elastic-grid-canvas elastic-grid-canvas--global';
  canvas.setAttribute('aria-hidden','true');
  document.body.prepend(canvas);

  const ctx=canvas.getContext('2d');
  const dpr=Math.min(devicePixelRatio||1,2);
  let W=innerWidth,H=innerHeight;

  function resize(){
    W=innerWidth;H=innerHeight;
    canvas.width=Math.round(W*dpr);
    canvas.height=Math.round(H*dpr);
    canvas.style.width=W+'px';
    canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  addEventListener('resize',resize,{passive:true});
  resize();

  const pointer={
    x:W/2,y:H/2,lastX:W/2,lastY:H/2,
    vx:0,vy:0,lastT:performance.now(),lastMove:0,
    inside:false,hasMoved:false
  };

  addEventListener('pointermove',event=>{
    const now=performance.now();
    const dt=Math.max(8,now-pointer.lastT);
    const scale=16.67/dt;
    const ivx=(event.clientX-pointer.lastX)*scale;
    const ivy=(event.clientY-pointer.lastY)*scale;
    pointer.vx=pointer.vx*.78+ivx*.22;
    pointer.vy=pointer.vy*.78+ivy*.22;
    pointer.x=event.clientX;
    pointer.y=event.clientY;
    pointer.lastX=event.clientX;
    pointer.lastY=event.clientY;
    pointer.lastT=now;
    pointer.lastMove=now;
    pointer.inside=true;
    pointer.hasMoved=true;
  },{passive:true});
  document.addEventListener('mouseleave',()=>pointer.inside=false);
  document.addEventListener('mouseenter',()=>{if(pointer.hasMoved)pointer.inside=true});

  const makeLayer=()=>({x:W/2,y:H/2,vx:0,vy:0});
  const fast=makeLayer(),mid=makeLayer(),slow=makeLayer();

  function spring(layer,tx,ty,k,damping,dt){
    const step=clamp(dt/16.67,.55,1.7);
    layer.vx+=(tx-layer.x)*k*step;
    layer.vy+=(ty-layer.y)*k*step;
    layer.vx*=Math.pow(damping,step);
    layer.vy*=Math.pow(damping,step);
    layer.x+=layer.vx*step;
    layer.y+=layer.vy*step;
  }

  function blendCenter(r){
    if(r<.44){
      const t=smooth(.06,.44,r);
      return {x:fast.x+(mid.x-fast.x)*t,y:fast.y+(mid.y-fast.y)*t};
    }
    const t=smooth(.44,1.02,r);
    return {x:mid.x+(slow.x-mid.x)*t,y:mid.y+(slow.y-mid.y)*t};
  }

  function heroContains(x,y){
    const r=hero.getBoundingClientRect();
    return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
  }

  function rectDistance(x,y,rect){
    const dx=Math.max(rect.left-x,0,x-rect.right);
    const dy=Math.max(rect.top-y,0,y-rect.bottom);
    return Math.hypot(dx,dy);
  }

  function contentRects(){
    return [...document.querySelectorAll('.hero__title,.hero__eyebrow,.hero__footer')]
      .map(el=>el.getBoundingClientRect())
      .filter(r=>r.bottom>=0&&r.top<=H);
  }

  function contentAvoidance(x,y,rects){
    let factor=1;
    for(const r of rects){
      const inside=x>=r.left-10&&x<=r.right+10&&y>=r.top-10&&y<=r.bottom+10;
      if(inside)return .12;
      const d=rectDistance(x,y,r);
      factor=Math.min(factor,.28+.72*smooth(10,72,d));
    }
    return factor;
  }

  function pointerContextScale(){
    const el=document.elementFromPoint(pointer.x,pointer.y);
    if(!el)return 1;
    if(el.closest?.('a,button,.magnetic,[data-cursor],.language-toggle,.nav-about'))return .04;
    if(el.closest?.('.hero__title,.hero__eyebrow,.hero__footer'))return .30;
    return 1;
  }

  let alpha=0;
  let lastFrame=performance.now();

  function frame(now){
    const dt=Math.min(34,Math.max(8,now-lastFrame));
    lastFrame=now;

    const heroActive=pointer.inside&&pointer.hasMoved&&heroContains(pointer.x,pointer.y);
    const overlayOpen=document.body.classList.contains('is-detail-open')||document.body.classList.contains('is-archive-open');

    const speed=Math.hypot(pointer.vx,pointer.vy);
    const speedN=clamp(speed/34,0,1);
    const dirX=speed>1?pointer.vx/speed:0;
    const dirY=speed>1?pointer.vy/speed:0;
    const normalX=-dirY,normalY=dirX;

    /* Influence rather than follow: each spring aims behind the pointer, with a tiny ambient drift. */
    if(pointer.hasMoved){
      const ambientX=Math.sin(now*.00019)*9;
      const ambientY=Math.cos(now*.00016)*7;
      const fastLag=12+speedN*16;
      const midLag=26+speedN*24;
      const slowLag=42+speedN*30;
      spring(fast,pointer.x-dirX*fastLag+ambientX,pointer.y-dirY*fastLag+ambientY,.044,.80,dt);
      spring(mid,pointer.x-dirX*midLag+ambientX*.72,pointer.y-dirY*midLag+ambientY*.72,.025,.835,dt);
      spring(slow,pointer.x-dirX*slowLag+ambientX*.42,pointer.y-dirY*slowLag+ambientY*.42,.0115,.875,dt);
    }

    pointer.vx*=.915;
    pointer.vy*=.915;

    const idle=Math.max(0,now-pointer.lastMove);
    const idleScale=idle<180?1:idle<1600?(1-(idle-180)/1420)*.88+.12:.10;
    const speedScale=1-speedN*.58;
    const contextScale=pointerContextScale();
    const activeCursor=cursor?.classList.contains('is-active');
    const cursorScale=activeCursor?.05:1;

    const desired=heroActive&&!overlayOpen
      ? .66*idleScale*speedScale*contextScale*cursorScale
      : 0;
    alpha+=(desired-alpha)*(desired>alpha?.075:.045);

    ctx.clearRect(0,0,W,H);
    if(alpha<.0015){requestAnimationFrame(frame);return}

    const heroRect=hero.getBoundingClientRect();
    const avoidRects=contentRects();
    const spacing=25;
    const cols=17,rows=17;
    const halfW=(cols-1)*spacing/2;
    const halfH=(rows-1)*spacing/2;
    const phase=now*.00034;

    for(let iy=0;iy<rows;iy++){
      for(let ix=0;ix<cols;ix++){
        const gx=(ix-(cols-1)/2)*spacing;
        const gy=(iy-(rows-1)/2)*spacing;
        const nx=Math.abs(gx)/(halfW||1);
        const ny=Math.abs(gy)/(halfH||1);
        const r=Math.pow(Math.pow(nx,2.35)+Math.pow(ny,2.05),1/2.2);
        if(r>1.06)continue;

        const c=blendCenter(r);
        const outer=smooth(.15,1.0,r);
        const center=1-smooth(.02,.72,r);

        /* Motion stays soft and secondary: less trail/shear than the previous version. */
        const trail=outer*speedN*25;
        let x=c.x+gx-dirX*trail;
        let y=c.y+gy-dirY*trail;

        const shear=clamp(speedN*.025,0,.025)*smooth(.14,.90,r);
        x+=gy*shear*dirX;
        y+=gx*shear*dirY;

        const projection=(gx*dirX+gy*dirY)/(halfW||1);
        const cross=(gx*normalX+gy*normalY)/(halfW||1);
        const bow=Math.sin(projection*Math.PI)*cross*speedN*2.8*outer;
        x+=normalX*bow;
        y+=normalY*bow;

        const breathe=Math.sin(phase+ix*.51+iy*.35)*(.10+.25*outer);
        x+=breathe;
        y+=Math.cos(phase*.77+ix*.27-iy*.41)*(.09+.20*outer);

        /* Hero is the only legal surface. Crossing its bounds kills the point immediately. */
        if(x<heroRect.left||x>heroRect.right||y<heroRect.top||y>heroRect.bottom)continue;

        /* Only the inner 7–10 rows read clearly; the rest dissolve into the background. */
        let fade=1-smooth(.26,.88,r);
        fade*=.92+.08*Math.sin(ix*.61+iy*.37);
        if(fade<=.004)continue;

        const avoid=contentAvoidance(x,y,avoidRects);
        const pattern=.5+.5*Math.sin(ix*.69+iy*.45+1.1);
        const size=.86+center*.48+pattern*.13;
        const pointAlpha=(.018+fade*.092)*alpha*avoid;

        ctx.beginPath();
        ctx.fillStyle=`rgba(18,18,18,${clamp(pointAlpha,0,.10)})`;
        ctx.arc(x,y,size,0,Math.PI*2);
        ctx.fill();
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
