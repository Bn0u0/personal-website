(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  if(reduced||!fine)return;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};

  /* One continuous field for the whole site. Section boundaries only decide color/strength. */
  const surfaces=[
    {el:document.querySelector('.hero'),dark:false,strength:1},
    {el:document.querySelector('.work'),dark:false,strength:.72},
    {el:document.querySelector('.manifesto'),dark:true,strength:.84},
    {el:document.querySelector('.about-ai'),dark:true,strength:.84},
    {el:document.querySelector('.site-footer'),dark:false,strength:.62}
  ].filter(item=>item.el);

  surfaces.forEach(({el})=>el.classList.add('elastic-grid-surface'));

  const canvas=document.createElement('canvas');
  canvas.className='elastic-grid-canvas elastic-grid-canvas--global';
  canvas.setAttribute('aria-hidden','true');
  document.body.prepend(canvas);

  const ctx=canvas.getContext('2d');
  const dpr=Math.min(devicePixelRatio||1,2);
  const cursor=document.querySelector('.cursor');

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
    vx:0,vy:0,lastT:performance.now(),inside:false,hasMoved:false
  };

  addEventListener('pointermove',event=>{
    const now=performance.now();
    const dt=Math.max(8,now-pointer.lastT);
    const scale=16.67/dt;
    const ivx=(event.clientX-pointer.lastX)*scale;
    const ivy=(event.clientY-pointer.lastY)*scale;
    pointer.vx=pointer.vx*.74+ivx*.26;
    pointer.vy=pointer.vy*.74+ivy*.26;
    pointer.x=event.clientX;
    pointer.y=event.clientY;
    pointer.lastX=event.clientX;
    pointer.lastY=event.clientY;
    pointer.lastT=now;
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
    if(r<.46){
      const t=smooth(.08,.46,r);
      return {x:fast.x+(mid.x-fast.x)*t,y:fast.y+(mid.y-fast.y)*t};
    }
    const t=smooth(.46,1.06,r);
    return {x:mid.x+(slow.x-mid.x)*t,y:mid.y+(slow.y-mid.y)*t};
  }

  function visibleSurfaces(){
    return surfaces.map(item=>({
      ...item,
      rect:item.el.getBoundingClientRect()
    })).filter(item=>item.rect.bottom>=-440&&item.rect.top<=H+440);
  }

  function surfaceAt(x,y,visible){
    for(const item of visible){
      const r=item.rect;
      if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return item;
    }
    return null;
  }

  let alpha=0;
  let lastFrame=performance.now();

  function frame(now){
    const dt=Math.min(34,Math.max(8,now-lastFrame));
    lastFrame=now;

    /* Springs never reset when crossing sections, so the membrane stays physically continuous. */
    if(pointer.hasMoved){
      spring(fast,pointer.x,pointer.y,.050,.78,dt);
      spring(mid,pointer.x,pointer.y,.029,.82,dt);
      spring(slow,pointer.x,pointer.y,.014,.855,dt);
    }

    pointer.vx*=.905;
    pointer.vy*=.905;

    const overlayOpen=document.body.classList.contains('is-detail-open')||document.body.classList.contains('is-archive-open');
    const targetAlpha=pointer.inside&&pointer.hasMoved&&!overlayOpen?1:0;
    alpha+=(targetAlpha-alpha)*(targetAlpha?.09:.06);

    ctx.clearRect(0,0,W,H);
    if(alpha<.002){requestAnimationFrame(frame);return}

    const visible=visibleSurfaces();
    const speed=Math.hypot(pointer.vx,pointer.vy);
    const speedN=clamp(speed/38,0,1);
    const dirX=speed>1?pointer.vx/speed:0;
    const dirY=speed>1?pointer.vy/speed:0;
    const normalX=-dirY,normalY=dirX;
    const activeCursor=cursor?.classList.contains('is-active');
    const interactionScale=activeCursor?.20:1;

    const spacing=25;
    const cols=17,rows=17;
    const halfW=(cols-1)*spacing/2;
    const halfH=(rows-1)*spacing/2;
    const phase=now*.00043;

    for(let iy=0;iy<rows;iy++){
      for(let ix=0;ix<cols;ix++){
        const gx=(ix-(cols-1)/2)*spacing;
        const gy=(iy-(rows-1)/2)*spacing;
        const nx=Math.abs(gx)/(halfW||1);
        const ny=Math.abs(gy)/(halfH||1);
        const r=Math.pow(Math.pow(nx,2.35)+Math.pow(ny,2.05),1/2.2);
        if(r>1.08)continue;

        const c=blendCenter(r);
        const outer=smooth(.16,1.03,r);
        const center=1-smooth(.02,.80,r);

        const trail=outer*speedN*36;
        let x=c.x+gx-dirX*trail;
        let y=c.y+gy-dirY*trail;

        const shear=clamp(speedN*.045,0,.045)*smooth(.12,.95,r);
        x+=gy*shear*dirX;
        y+=gx*shear*dirY;

        const projection=(gx*dirX+gy*dirY)/(halfW||1);
        const cross=(gx*normalX+gy*normalY)/(halfW||1);
        const bow=Math.sin(projection*Math.PI)*cross*speedN*4.8*outer;
        x+=normalX*bow;
        y+=normalY*bow;

        const breathe=Math.sin(phase+ix*.53+iy*.37)*(.16+.40*outer);
        x+=breathe;
        y+=Math.cos(phase*.79+ix*.29-iy*.43)*(.14+.31*outer);

        const surface=surfaceAt(x,y,visible);
        if(!surface)continue;

        let fade=1-smooth(.40,1.06,r);
        if(speedN>.03){
          const behind=clamp(-projection,0,1);
          const ahead=clamp(projection,0,1);
          fade*=1+behind*.13*speedN-ahead*.05*speedN;
        }
        fade*=.94+.06*Math.sin(ix*.63+iy*.39);
        if(fade<=.005)continue;

        const pattern=.5+.5*Math.sin(ix*.71+iy*.47+1.2);
        const size=1.08+center*.82+pattern*.20;
        const baseAlpha=surface.dark?.042:.05;
        const peak=surface.dark?.16:.185;
        const pointAlpha=(baseAlpha+fade*peak)*alpha*surface.strength*interactionScale;
        const rgb=surface.dark?'242,240,235':'18,18,18';

        ctx.beginPath();
        ctx.fillStyle=`rgba(${rgb},${clamp(pointAlpha,0,surface.dark?.22:.25)})`;
        ctx.arc(x,y,size,0,Math.PI*2);
        ctx.fill();
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
