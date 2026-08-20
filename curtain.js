(async()=>{
  const hero=document.querySelector('.hero');
  const work=document.querySelector('.work');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer: fine)').matches;

  if(!hero||!work||reduced){
    document.documentElement.classList.add('curtain-static');
    return;
  }

  function loadScript(src,test){
    if(test?.())return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const existing=[...document.scripts].find(s=>s.src===src);
      if(existing){
        if(test?.())return resolve();
        existing.addEventListener('load',resolve,{once:true});
        existing.addEventListener('error',reject,{once:true});
        return;
      }
      const script=document.createElement('script');
      script.src=src;
      script.async=false;
      script.addEventListener('load',resolve,{once:true});
      script.addEventListener('error',reject,{once:true});
      document.head.appendChild(script);
    });
  }

  let THREE;
  try{
    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',()=>window.gsap),
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',()=>window.ScrollTrigger),
      loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>window.html2canvas)
    ]);
    THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  }catch(error){
    console.warn('[Curtain] Real-cloth dependencies unavailable; using normal page flow.',error);
    document.documentElement.classList.add('curtain-static');
    return;
  }

  const gsap=window.gsap;
  const ScrollTrigger=window.ScrollTrigger;
  if(!gsap||!ScrollTrigger||!window.html2canvas||!THREE){
    document.documentElement.classList.add('curtain-static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const canvas=document.createElement('canvas');
  canvas.className='cloth-canvas';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);

  let renderer,scene,camera,mesh,geometry,material,sourceTexture,bumpTexture;
  let positions,previous,rest,uvs,constraints,pinned,cols,rows,segX,segY,clothWidth,clothHeight;
  let targetProgress=0,scrollVelocity=0,lastTime=performance.now(),simActive=true,ready=false;
  let captureTimer=null,pendingCapture=false,capturing=false,trigger=null;
  const pinTargets=[];

  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
  const idx=(x,y)=>y*cols+x;

  function buildRenderer(){
    renderer?.dispose?.();
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.35:1.8));
    renderer.setSize(innerWidth,innerHeight,false);
    renderer.setClearColor(0x000000,0);
    if('outputColorSpace' in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;

    scene=new THREE.Scene();
    camera=new THREE.OrthographicCamera(-1,1,1,-1,0.01,20);
    camera.position.z=4;

    const hemi=new THREE.HemisphereLight(0xffffff,0x8c8a84,2.05);
    const key=new THREE.DirectionalLight(0xffffff,3.2);
    key.position.set(-2.4,2.7,4.8);
    const fill=new THREE.DirectionalLight(0xbfc9c6,1.2);
    fill.position.set(3.6,-1.2,2.2);
    scene.add(hemi,key,fill);
  }

  function buildWeaveTexture(){
    const c=document.createElement('canvas');
    c.width=c.height=256;
    const ctx=c.getContext('2d');
    const image=ctx.createImageData(256,256);
    const d=image.data;
    for(let y=0;y<256;y++){
      for(let x=0;x<256;x++){
        const i=(y*256+x)*4;
        const warp=Math.sin(x*Math.PI*.52)*12;
        const weft=Math.sin(y*Math.PI*.66)*7;
        const cross=Math.sin((x+y)*Math.PI*.14)*3.5;
        const noise=(Math.random()-.5)*4;
        const v=clamp(128+warp+weft+cross+noise,74,182);
        d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;
      }
    }
    ctx.putImageData(image,0,0);
    const tex=new THREE.CanvasTexture(c);
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.repeat.set(innerWidth<700?5:8,innerWidth<700?4:6);
    tex.needsUpdate=true;
    return tex;
  }

  function addConstraint(a,b,mul=1){
    const ia=a*3,ib=b*3;
    const dx=rest[ib]-rest[ia],dy=rest[ib+1]-rest[ia+1],dz=rest[ib+2]-rest[ia+2];
    constraints.push([a,b,Math.hypot(dx,dy,dz),mul]);
  }

  function buildCloth(){
    if(mesh){
      scene.remove(mesh);
      geometry?.dispose?.();
      material?.dispose?.();
    }

    const aspect=innerWidth/innerHeight;
    clothWidth=2*aspect;
    clothHeight=2;
    segX=innerWidth<700?28:44;
    segY=innerWidth<700?20:30;
    cols=segX+1;
    rows=segY+1;

    geometry=new THREE.PlaneGeometry(clothWidth,clothHeight,segX,segY);
    const attr=geometry.attributes.position;
    positions=attr.array;
    previous=new Float32Array(positions.length);
    rest=new Float32Array(positions.length);
    previous.set(positions);
    rest.set(positions);
    uvs=geometry.attributes.uv.array;
    pinned=new Uint8Array(cols*rows);
    constraints=[];
    pinTargets.length=0;

    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        const i=idx(x,y);
        if(y===0)pinned[i]=1;
        if(x+1<cols)addConstraint(i,idx(x+1,y),1);
        if(y+1<rows)addConstraint(i,idx(x,y+1),1);
        if(x+1<cols&&y+1<rows){
          addConstraint(i,idx(x+1,y+1),.82);
          addConstraint(idx(x+1,y),idx(x,y+1),.82);
        }
        if(x+2<cols)addConstraint(i,idx(x+2,y),.32);
        if(y+2<rows)addConstraint(i,idx(x,y+2),.32);
      }
    }

    bumpTexture?.dispose?.();
    bumpTexture=buildWeaveTexture();
    material=new THREE.MeshStandardMaterial({
      color:0xffffff,
      map:sourceTexture||null,
      bumpMap:bumpTexture,
      bumpScale:innerWidth<700?.008:.011,
      roughness:.92,
      metalness:0,
      side:THREE.DoubleSide
    });
    mesh=new THREE.Mesh(geometry,material);
    mesh.frustumCulled=false;
    scene.add(mesh);
    geometry.computeVertexNormals();
  }

  function resetCloth(){
    if(!positions||!rest)return;
    positions.set(rest);
    previous.set(rest);
    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        const i=idx(x,y)*3;
        const u=x/segX,v=y/segY;
        const seed=Math.sin(u*Math.PI*20+v*Math.PI*2.3)*.0017*Math.sin(v*Math.PI);
        positions[i+2]=seed;
        previous[i+2]=seed;
      }
    }
    geometry.attributes.position.needsUpdate=true;
    geometry.computeVertexNormals();
  }

  function updatePins(progress){
    const gather=smooth(clamp(progress/.79));
    const exit=smooth(clamp((progress-.72)/.28));
    const span=clothWidth*(1-.885*gather);
    const left=-clothWidth/2-clothWidth*1.12*exit;
    pinTargets.length=cols;

    for(let x=0;x<cols;x++){
      const u=x/segX;
      const ringWave=Math.sin(u*Math.PI*segX*.92)*.014*clothWidth*gather;
      const railEase=u*u*(3-2*u);
      const xTarget=left+span*(u*.9+railEase*.1);
      const zTarget=ringWave*(.35+.65*Math.sin(Math.PI*clamp(progress/.9)));
      pinTargets[x]=[xTarget,clothHeight/2,zTarget];
    }
  }

  function applyPins(){
    if(!positions)return;
    for(let x=0;x<cols;x++){
      const i=idx(x,0)*3;
      const t=pinTargets[x];
      if(!t)continue;
      positions[i]=t[0];positions[i+1]=t[1];positions[i+2]=t[2];
      previous[i]=t[0];previous[i+1]=t[1];previous[i+2]=t[2];
    }
  }

  function solveConstraints(){
    const strength=.93;
    for(let it=0;it<5;it++){
      for(let c=0;c<constraints.length;c++){
        const [a,b,restLen,mul]=constraints[c];
        const ai=a*3,bi=b*3;
        let dx=positions[bi]-positions[ai];
        let dy=positions[bi+1]-positions[ai+1];
        let dz=positions[bi+2]-positions[ai+2];
        const dist=Math.hypot(dx,dy,dz)||1e-6;
        const diff=((dist-restLen)/dist)*strength*mul;
        dx*=diff;dy*=diff;dz*=diff;
        const pa=pinned[a],pb=pinned[b];
        if(pa&&pb)continue;
        if(pa){positions[bi]-=dx;positions[bi+1]-=dy;positions[bi+2]-=dz;}
        else if(pb){positions[ai]+=dx;positions[ai+1]+=dy;positions[ai+2]+=dz;}
        else{
          positions[ai]+=dx*.5;positions[ai+1]+=dy*.5;positions[ai+2]+=dz*.5;
          positions[bi]-=dx*.5;positions[bi+1]-=dy*.5;positions[bi+2]-=dz*.5;
        }
      }
      applyPins();
    }
  }

  function simulate(dt,time){
    if(!positions)return;
    updatePins(targetProgress);
    const p=targetProgress;
    const active=smooth(clamp((p-.01)/.86));
    const exit=smooth(clamp((p-.72)/.28));
    const wind=clamp(scrollVelocity/3200,-1.4,1.4);
    const substeps=2;
    const step=Math.min(dt,.032)/substeps;

    for(let s=0;s<substeps;s++){
      const damp=Math.pow(.986,step*60);
      for(let y=1;y<rows;y++){
        const v=y/segY;
        for(let x=0;x<cols;x++){
          const u=x/segX;
          const i=idx(x,y)*3;
          const cx=positions[i],cy=positions[i+1],cz=positions[i+2];
          let vx=(cx-previous[i])*damp;
          let vy=(cy-previous[i+1])*damp;
          let vz=(cz-previous[i+2])*damp;
          previous[i]=cx;previous[i+1]=cy;previous[i+2]=cz;

          const foldA=Math.sin(u*Math.PI*18+v*Math.PI*2.4+time*1.15);
          const foldB=Math.sin(u*Math.PI*10-v*Math.PI*3.2-time*.73);
          const vertical=Math.sin(v*Math.PI);
          const turbulence=(foldA*.00042+foldB*.00022)*active*vertical;
          const velocityKick=wind*.00054*vertical*(.25+.75*u)*active;

          positions[i]=cx+vx-exit*.0009*clothWidth;
          positions[i+1]=cy+vy-.00011*(.2+active);
          positions[i+2]=cz+vz+turbulence+velocityKick;

          if(exit>.72){
            const guide=-clothWidth/2-clothWidth*(.75+1.15*exit);
            positions[i]+=(guide-positions[i])*.0045*exit*(.25+.75*v);
          }
        }
      }
      applyPins();
      solveConstraints();
    }

    geometry.attributes.position.needsUpdate=true;
    geometry.computeVertexNormals();
  }

  async function captureHero(){
    if(capturing)return;
    capturing=true;
    try{
      await document.fonts?.ready?.catch?.(()=>{});
      const shot=await window.html2canvas(hero,{
        backgroundColor:'#f2f0eb',
        logging:false,
        useCORS:true,
        scale:Math.min(2.2,Math.max(1.35,(devicePixelRatio||1)*1.15)),
        width:hero.clientWidth,
        height:hero.clientHeight,
        onclone:doc=>{
          const clone=doc.querySelector('.hero');
          if(!clone)return;
          clone.classList.remove('hero--cloth-source','hero--curtain');
          clone.style.visibility='visible';
          clone.style.opacity='1';
          clone.style.clipPath='none';
          clone.style.webkitClipPath='none';
          clone.querySelectorAll('.hero__line>span,.reveal').forEach(el=>{
            el.style.animation='none';
            el.style.transition='none';
            el.style.transform='none';
            el.style.opacity='1';
            el.style.filter='none';
          });
        }
      });

      const tex=new THREE.CanvasTexture(shot);
      if('colorSpace' in tex)tex.colorSpace=THREE.SRGBColorSpace;
      tex.minFilter=THREE.LinearFilter;
      tex.magFilter=THREE.LinearFilter;
      tex.needsUpdate=true;
      sourceTexture?.dispose?.();
      sourceTexture=tex;
      if(material){material.map=sourceTexture;material.needsUpdate=true;}

      if(!ready){
        ready=true;
        document.documentElement.classList.add('curtain-ready');
        hero.classList.add('hero--cloth-source');
        work.classList.add('work--behind-curtain');
        canvas.classList.add('is-ready');
      }
      pendingCapture=false;
    }catch(error){
      console.warn('[Curtain] Could not rasterize hero texture.',error);
      if(!ready){
        document.documentElement.classList.add('curtain-static');
        canvas.remove();
      }
    }finally{
      capturing=false;
    }
  }

  buildRenderer();
  buildCloth();
  resetCloth();
  await captureHero();
  if(!ready)return;

  trigger=ScrollTrigger.create({
    trigger:hero,
    start:'top top',
    end:()=>`+=${Math.max(620,innerHeight*1.02)}`,
    scrub:.42,
    pin:true,
    pinSpacing:false,
    anticipatePin:1,
    invalidateOnRefresh:true,
    onEnter:()=>{simActive=true;canvas.classList.add('is-active')},
    onEnterBack:()=>{simActive=true;canvas.classList.add('is-active')},
    onLeave:()=>{targetProgress=1;setTimeout(()=>canvas.classList.remove('is-active'),180)},
    onLeaveBack:()=>{targetProgress=0;canvas.classList.add('is-active');if(pendingCapture)captureHero()},
    onUpdate:self=>{
      targetProgress=self.progress;
      scrollVelocity=self.getVelocity();
      simActive=true;
      canvas.classList.add('is-active');
      if(self.progress<.015&&pendingCapture&&!capturing)captureHero();
    }
  });

  if(window.__lenis?.on)window.__lenis.on('scroll',ScrollTrigger.update);

  const heroObserver=new MutationObserver(()=>{
    pendingCapture=true;
    clearTimeout(captureTimer);
    captureTimer=setTimeout(()=>{
      if(targetProgress<.015&&!capturing)captureHero();
    },520);
  });
  heroObserver.observe(hero,{childList:true,characterData:true,subtree:true});

  if(fine){
    let pointerY=.5,pointerX=.5;
    addEventListener('pointermove',e=>{
      pointerX=e.clientX/innerWidth;
      pointerY=e.clientY/innerHeight;
      if(targetProgress>.03&&targetProgress<.94&&positions){
        const influence=Math.sin(pointerY*Math.PI)*.00034*(pointerX-.5);
        for(let y=1;y<rows;y++){
          const v=y/segY;
          const i=idx(cols-1,y)*3+2;
          previous[i]-=influence*Math.sin(v*Math.PI);
        }
      }
    },{passive:true});
  }

  let resizeTimer;
  addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(async()=>{
      buildRenderer();
      buildCloth();
      resetCloth();
      pendingCapture=true;
      if(targetProgress<.02)await captureHero();
      ScrollTrigger.refresh();
    },220);
  },{passive:true});

  function frame(now){
    const dt=Math.min(.034,(now-lastTime)/1000||1/60);
    lastTime=now;
    if(simActive&&renderer&&mesh){
      simulate(dt,now/1000);
      renderer.render(scene,camera);
      if(targetProgress>=.999&&Math.abs(scrollVelocity)<8)simActive=false;
    }
    scrollVelocity*=.9;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  canvas.classList.add('is-active');
  ScrollTrigger.refresh();
})();