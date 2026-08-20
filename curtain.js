(async()=>{
  const hero=document.querySelector('.hero');
  const work=document.querySelector('.work');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(!hero||!work||reduced){document.documentElement.classList.add('curtain-static');return;}

  const load=(src,test)=>{
    if(test?.())return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const old=[...document.scripts].find(s=>s.src===src);
      if(old){
        if(test?.())return resolve();
        old.addEventListener('load',resolve,{once:true});
        old.addEventListener('error',reject,{once:true});
        return;
      }
      const s=document.createElement('script');
      s.src=src;s.async=false;
      s.addEventListener('load',resolve,{once:true});
      s.addEventListener('error',reject,{once:true});
      document.head.appendChild(s);
    });
  };

  let THREE;
  try{
    await Promise.all([
      load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',()=>window.gsap),
      load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',()=>window.ScrollTrigger),
      load('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>window.html2canvas)
    ]);
    THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  }catch(error){
    console.warn('[Curtain] WebGL curtain unavailable.',error);
    document.documentElement.classList.add('curtain-static');
    return;
  }

  const gsap=window.gsap;
  const ScrollTrigger=window.ScrollTrigger;
  if(!gsap||!ScrollTrigger||!window.html2canvas){document.documentElement.classList.add('curtain-static');return;}
  gsap.registerPlugin(ScrollTrigger);

  const canvas=document.createElement('canvas');
  canvas.className='cloth-canvas';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);

  let renderer,scene,camera,mesh,geometry,material,heroTexture,bumpTexture;
  let pos,rest,segX=0,segY=0,cols=0,rows=0,w=2,h=2;
  let progress=0,velocity=0,ready=false,capturing=false,pendingCapture=false;
  let resizeTimer,captureTimer;

  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
  const id=(x,y)=>y*cols+x;

  function rendererSetup(){
    renderer?.dispose?.();
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.3:1.7));
    renderer.setSize(innerWidth,innerHeight,false);
    renderer.setClearColor(0x000000,0);
    if('outputColorSpace' in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;

    const aspect=innerWidth/innerHeight;
    scene=new THREE.Scene();
    camera=new THREE.OrthographicCamera(-aspect,aspect,1,-1,.01,20);
    camera.position.z=4;

    const hemi=new THREE.HemisphereLight(0xffffff,0x85827b,1.95);
    const key=new THREE.DirectionalLight(0xffffff,2.45);
    key.position.set(-2.6,2.8,4.5);
    const fill=new THREE.DirectionalLight(0xc7d0cd,.75);
    fill.position.set(3.4,-.7,2.7);
    scene.add(hemi,key,fill);
  }

  function weave(){
    const c=document.createElement('canvas');
    c.width=c.height=256;
    const ctx=c.getContext('2d');
    const img=ctx.createImageData(256,256),d=img.data;
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){
      const i=(y*256+x)*4;
      const warp=Math.sin(x*Math.PI*.55)*8.5;
      const weft=Math.sin(y*Math.PI*.74)*5.5;
      const cross=Math.sin((x+y)*.42)*2.2;
      const noise=(Math.random()-.5)*2.5;
      const v=clamp(128+warp+weft+cross+noise,88,170);
      d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;
    }
    ctx.putImageData(img,0,0);
    const t=new THREE.CanvasTexture(c);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.repeat.set(innerWidth<700?5:8,innerWidth<700?4:6);
    t.needsUpdate=true;
    return t;
  }

  function clothSetup(){
    if(mesh){scene.remove(mesh);geometry?.dispose?.();material?.dispose?.();}

    const aspect=innerWidth/innerHeight;
    w=aspect*2;h=2;
    segX=innerWidth<700?48:80;
    segY=innerWidth<700?30:48;
    cols=segX+1;rows=segY+1;

    geometry=new THREE.PlaneGeometry(w,h,segX,segY);
    geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
    pos=geometry.attributes.position.array;
    rest=new Float32Array(pos);

    bumpTexture?.dispose?.();
    bumpTexture=weave();
    material=new THREE.MeshStandardMaterial({
      color:0xffffff,
      map:heroTexture||null,
      bumpMap:bumpTexture,
      bumpScale:innerWidth<700?.0045:.0065,
      roughness:.96,
      metalness:0,
      flatShading:false,
      side:THREE.DoubleSide
    });

    mesh=new THREE.Mesh(geometry,material);
    mesh.frustumCulled=false;
    scene.add(mesh);
    deform(0,0);
  }

  function foldProfile(u,v,gather){
    const mobile=innerWidth<700;
    const folds=mobile?8:11;
    const vertical=.28+.72*Math.pow(Math.sin(Math.PI*clamp(v)),.72);
    const phase=u*Math.PI*2*folds + Math.sin(v*Math.PI)*.34 + v*.22;
    const baseAmp=w*(mobile?.0032:.0038);
    const gatherAmp=w*(mobile?.0085:.0115)*gather;
    const amp=(baseAmp+gatherAmp)*vertical;
    return (
      Math.sin(phase)*.86 +
      Math.sin(phase*2.01+v*.9)*.105 +
      Math.sin(phase*.51-v*.65)*.035
    )*amp;
  }

  function deform(rawProgress,rawVelocity){
    if(!pos||!rest)return;

    const p=rawProgress<.001?0:rawProgress>.999?1:clamp(rawProgress);
    const gather=smooth(p/.78);
    const exit=smooth((p-.76)/.24);
    const span=w*(1-.74*gather);
    const left=-w/2-w*1.20*exit;
    const velocityN=clamp(rawVelocity/7000,-.28,.28);

    for(let y=0;y<rows;y++){
      const v=y/segY;
      const vertical=Math.sin(Math.PI*v);
      for(let x=0;x<cols;x++){
        const u=x/segX;
        const i=id(x,y)*3;
        const baseY=rest[i+1];

        const phase=u*Math.PI*2*(innerWidth<700?8:11)+v*.38;
        const zFold=foldProfile(u,v,gather);
        const gatherEase=u*u*(3-2*u);
        const tinyPleatX=Math.sin(phase)*w*.00055*gather*vertical;
        const xPos=left+span*(u*.94+gatherEase*.06)+tinyPleatX;

        const centerWeight=Math.pow(Math.sin(Math.PI*u),2);
        const sag=h*(.0018+.0068*gather)*centerWeight*(.18+.82*v);
        const pullLag=w*.0022*gather*vertical*(u-.5);
        const velocitySway=velocityN*w*.00115*vertical*(.25+.75*u)*Math.cos(phase*.73);

        pos[i]=xPos-pullLag;
        pos[i+1]=baseY-sag;
        pos[i+2]=zFold+velocitySway;
      }
    }

    geometry.attributes.position.needsUpdate=true;
    geometry.computeVertexNormals();
  }

  async function capture(){
    if(capturing)return;
    capturing=true;
    try{
      try{await document.fonts?.ready;}catch(_e){}
      const shot=await window.html2canvas(hero,{
        backgroundColor:'#f2f0eb',
        logging:false,
        useCORS:true,
        scale:Math.min(2.1,Math.max(1.3,(devicePixelRatio||1)*1.1)),
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

      heroTexture?.dispose?.();
      heroTexture=tex;
      if(material){material.map=tex;material.needsUpdate=true;}

      if(!ready){
        ready=true;
        document.documentElement.classList.add('curtain-ready');
        hero.classList.add('hero--cloth-source');
        work.classList.add('work--behind-curtain');
        canvas.classList.add('is-ready','is-active');
      }
      pendingCapture=false;
      deform(progress,velocity);
      renderer.render(scene,camera);
    }catch(error){
      console.warn('[Curtain] Hero texture capture failed.',error);
      if(!ready){document.documentElement.classList.add('curtain-static');canvas.remove();}
    }finally{
      capturing=false;
    }
  }

  rendererSetup();
  clothSetup();
  await capture();
  if(!ready)return;

  ScrollTrigger.create({
    trigger:hero,
    start:'top top',
    end:()=>`+=${Math.max(620,innerHeight*.98)}`,
    scrub:.22,
    pin:true,
    pinSpacing:false,
    anticipatePin:1,
    invalidateOnRefresh:true,
    onEnter:()=>canvas.classList.add('is-active'),
    onEnterBack:()=>canvas.classList.add('is-active'),
    onLeave:()=>{progress=1;velocity=0;deform(1,0);renderer.render(scene,camera);},
    onLeaveBack:()=>{
      progress=0;velocity=0;
      deform(0,0);
      renderer.render(scene,camera);
      canvas.classList.add('is-active');
      if(pendingCapture)capture();
    },
    onUpdate:self=>{
      progress=self.progress;
      velocity=self.getVelocity();
      if(progress<.001){progress=0;velocity=0;}
      if(progress>.999){progress=1;velocity=0;}
      deform(progress,velocity);
      renderer.render(scene,camera);
      canvas.classList.add('is-active');
      if(progress<.01&&pendingCapture&&!capturing)capture();
    }
  });

  if(window.__lenis?.on)window.__lenis.on('scroll',ScrollTrigger.update);

  const observer=new MutationObserver(()=>{
    pendingCapture=true;
    clearTimeout(captureTimer);
    captureTimer=setTimeout(()=>{if(progress<.01&&!capturing)capture();},520);
  });
  observer.observe(hero,{childList:true,characterData:true,subtree:true});

  addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(async()=>{
      rendererSetup();
      clothSetup();
      pendingCapture=true;
      if(progress<.02)await capture();
      else{deform(progress,0);renderer.render(scene,camera);}
      ScrollTrigger.refresh();
    },260);
  },{passive:true});

  deform(0,0);
  renderer.render(scene,camera);
  ScrollTrigger.refresh();
})();