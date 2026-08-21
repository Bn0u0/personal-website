(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  if(reduced||!fine)return;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};

  const configs=[
    {el:document.querySelector('.hero'),dark:false,strength:1},
    {el:document.querySelector('.work'),dark:false,strength:.72},
    {el:document.querySelector('.manifesto'),dark:true,strength:.84},
    {el:document.querySelector('.about-ai'),dark:true,strength:.84}
  ].filter(item=>item.el);

  const dpr=Math.min(devicePixelRatio||1,2);
  const cursor=document.querySelector('.cursor');

  const pointer={
    x:innerWidth/2,y:innerHeight/2,
    lastX:innerWidth/2,lastY:innerHeight/2,
    vx:0,vy:0,lastT:performance.now(),inside:true
  };

  addEventListener('pointermove',event=>{
    const now=performance.now();
    const dt=Math.max(8,now-pointer.lastT);
    const scale=16.67/dt;
    const ivx=(event.clientX-pointer.lastX)*scale;
    const ivy=(event.clientY-pointer.lastY)*scale;
    pointer.vx=pointer.vx*.68+ivx*.32;
    pointer.vy=pointer.vy*.68+ivy*.32;
    pointer.x=event.clientX;
    pointer.y=event.clientY;
    pointer.lastX=event.clientX;
    pointer.lastY=event.clientY;
    pointer.lastT=now;
    pointer.inside=true;
  },{passive:true});
  document.addEventListener('mouseleave',()=>pointer.inside=false);
  document.addEventListener('mouseenter',()=>pointer.inside=true);

  function setup(item){
    const canvas=document.createElement('canvas');
    canvas.className='elastic-grid-canvas';
    canvas.setAttribute('aria-hidden','true');
    item.el.classList.add('elastic-grid-host');
    item.el.prepend(canvas);
    item.canvas=canvas;
    item.ctx=canvas.getContext('2d');
    item.w=0;item.h=0;item.alpha=0;
    item.fast={x:0,y:0};
    item.mid={x:0,y:0};
    item.slow={x:0,y:0};

    const resize=()=>{
      const rect=item.el.getBoundingClientRect();
      const w=Math.max(1,rect.width),h=Math.max(1,item.el.offsetHeight||rect.height);
      item.w=w;item.h=h;
      canvas.width=Math.round(w*dpr);
      canvas.height=Math.round(h*dpr);
      canvas.style.width=w+'px';
      canvas.style.height=h+'px';
      item.ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    item.resize=resize;
    resize();
    new ResizeObserver(resize).observe(item.el);
  }
  configs.forEach(setup);

  function activeSurface(){
    for(const item of configs){
      const r=item.el.getBoundingClientRect();
      if(pointer.x>=r.left&&pointer.x<=r.right&&pointer.y>=r.top&&pointer.y<=r.bottom)return {item,rect:r};
    }
    return null;
  }

  function blendCenter(item,r){
    if(r<.48){
      const t=smooth(.10,.48,r);
      return {
        x:item.fast.x+(item.mid.x-item.fast.x)*t,
        y:item.fast.y+(item.mid.y-item.fast.y)*t
      };
    }
    const t=smooth(.48,1.05,r);
    return {
      x:item.mid.x+(item.slow.x-item.mid.x)*t,
      y:item.mid.y+(item.slow.y-item.mid.y)*t
    };
  }

  function draw(item,rect,now,isActive){
    const ctx=item.ctx;
    ctx.clearRect(0,0,item.w,item.h);
    if(item.alpha<.002)return;

    const localX=pointer.x-rect.left;
    const localY=pointer.y-rect.top;

    if(!item.fast.x&&!item.fast.y){
      item.fast.x=item.mid.x=item.slow.x=localX;
      item.fast.y=item.mid.y=item.slow.y=localY;
    }

    if(isActive){
      item.fast.x+=(localX-item.fast.x)*.15;
      item.fast.y+=(localY-item.fast.y)*.15;
      item.mid.x+=(localX-item.mid.x)*.09;
      item.mid.y+=(localY-item.mid.y)*.09;
      item.slow.x+=(localX-item.slow.x)*.045;
      item.slow.y+=(localY-item.slow.y)*.045;
    }

    const speed=Math.hypot(pointer.vx,pointer.vy);
    const speedN=clamp(speed/34,0,1);
    const dirX=speed>1?pointer.vx/speed:0;
    const dirY=speed>1?pointer.vy/speed:0;
    const activeCursor=cursor?.classList.contains('is-active');
    const interactionScale=activeCursor?.20:1;

    const spacing=25;
    const cols=17,rows=17;
    const halfW=(cols-1)*spacing/2;
    const halfH=(rows-1)*spacing/2;
    const phase=now*.00052;
    const rgb=item.dark?'242,240,235':'18,18,18';

    for(let iy=0;iy<rows;iy++){
      for(let ix=0;ix<cols;ix++){
        const gx=(ix-(cols-1)/2)*spacing;
        const gy=(iy-(rows-1)/2)*spacing;

        /* Rounded-rect / superellipse envelope: avoids looking like a circular spotlight. */
        const nx=Math.abs(gx)/(halfW||1);
        const ny=Math.abs(gy)/(halfH||1);
        const r=Math.pow(Math.pow(nx,2.35)+Math.pow(ny,2.05),1/2.2);
        if(r>1.08)continue;

        const c=blendCenter(item,r);
        const outer=smooth(.18,1.02,r);
        const center=1-smooth(.02,.78,r);

        /* Outer points lag further behind velocity; center remains responsive. */
        const trail=outer*speedN*31;
        let x=c.x+gx-dirX*trail;
        let y=c.y+gy-dirY*trail;

        /* Tiny directional shear only appears while moving quickly. */
        const shear=clamp(speedN*.075,0,.075);
        x+=gy*shear*dirX;
        y+=gx*shear*dirY;

        /* Sub-pixel breathing prevents the field from freezing into a sticker. */
        const breathe=Math.sin(phase+ix*.57+iy*.41)*(.22+.52*outer);
        x+=breathe;
        y+=Math.cos(phase*.83+ix*.31-iy*.49)*(.18+.38*outer);

        let fade=1-smooth(.42,1.06,r);
        const projection=(gx*dirX+gy*dirY)/(halfW||1);
        if(speedN>.03){
          const behind=clamp(-projection,0,1);
          const ahead=clamp(projection,0,1);
          fade*=1+behind*.16*speedN-ahead*.07*speedN;
        }
        fade*=.93+.07*Math.sin(ix*.63+iy*.39);
        if(fade<=.005)continue;

        const pattern=.5+.5*Math.sin(ix*.71+iy*.47+1.2);
        const size=1.08+center*.86+pattern*.22;
        const baseAlpha=item.dark?.042:.05;
        const peak=item.dark?.16:.185;
        const alpha=(baseAlpha+fade*peak)*item.alpha*item.strength*interactionScale;

        ctx.beginPath();
        ctx.fillStyle=`rgba(${rgb},${clamp(alpha,0,item.dark?.22:.25)})`;
        ctx.arc(x,y,size,0,Math.PI*2);
        ctx.fill();
      }
    }
  }

  function frame(now){
    const active=activeSurface();
    pointer.vx*=.89;
    pointer.vy*=.89;

    for(const item of configs){
      const isActive=pointer.inside&&active?.item===item;
      const desired=isActive?1:0;
      item.alpha+=(desired-item.alpha)*(isActive?.105:.075);
      const rect=isActive?active.rect:item.el.getBoundingClientRect();
      draw(item,rect,now,isActive);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
