(async()=>{
  const hero=document.querySelector('.hero');
  const work=document.querySelector('.work');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer: fine)').matches;

  if(!hero||!work||reduced){document.documentElement.classList.add('curtain-static');return;}

  const load=(src,test)=>{
    if(test?.())return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const old=[...document.scripts].find(s=>s.src===src);
      if(old){old.addEventListener('load',resolve,{once:true});old.addEventListener('error',reject,{once:true});return;}
      const s=document.createElement('script');s.src=src;s.async=false;
      s.addEventListener('load',resolve,{once:true});s.addEventListener('error',reject,{once:true});document.head.appendChild(s);
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
    console.warn('[Curtain] WebGL cloth unavailable.',error);
    document.documentElement.classList.add('curtain-static');return;
  }

  const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
  if(!gsap||!ScrollTrigger||!window.html2canvas){document.documentElement.classList.add('curtain-static');return;}
  gsap.registerPlugin(ScrollTrigger);

  const canvas=document.createElement('canvas');
  canvas.className='cloth-canvas';canvas.setAttribute('aria-hidden','true');document.body.appendChild(canvas);

  let renderer,scene,camera,mesh,geometry,material,heroTexture,bumpTexture;
  let pos,prev,rest,pinned,constraints=[];
  let segX=0,segY=0,cols=0,rows=0,w=2,h=2;
  let progress=0,velocity=0,last=performance.now(),ready=false,running=true,capturing=false,pendingCapture=false;
  let resizeTimer,captureTimer;
  const pins=[];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
  const id=(x,y)=>y*cols+x;

  function rendererSetup(){
    renderer?.dispose?.();
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.35:1.8));
    renderer.setSize(innerWidth,innerHeight,false);
    renderer.setClearColor(0x000000,0);
    if('outputColorSpace' in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;

    const aspect=innerWidth/innerHeight;
    scene=new THREE.Scene();
    camera=new THREE.OrthographicCamera(-aspect,aspect,1,-1,.01,20);
    camera.position.z=4;

    const hemi=new THREE.HemisphereLight(0xffffff,0x77746d,1.85);
    const key=new THREE.DirectionalLight(0xffffff,3.35);key.position.set(-2.8,2.5,4.5);
    const side=new THREE.DirectionalLight(0xbac8c4,1.25);side.position.set(3.2,-.8,2.2);
    scene.add(hemi,key,side);
  }

  function weave(){
    const c=document.createElement('canvas');c.width=c.height=256;
    const ctx=c.getContext('2d'),img=ctx.createImageData(256,256),d=img.data;
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){
      const i=(y*256+x)*4;
      const v=clamp(128+Math.sin(x*Math.PI*.54)*12+Math.sin(y*Math.PI*.72)*7+Math.sin((x+y)*.43)*3+(Math.random()-.5)*4,78,180);
      d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;
    }
    ctx.putImageData(img,0,0);
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(innerWidth<700?5:8,innerWidth<700?4:6);return t;
  }

  function restingFold(u,v,gather=0){
    const vertical=.42+.58*Math.sin(Math.PI*clamp(v*.94));
    const primary=Math.sin(u*Math.PI*12+Math.sin(v*Math.PI*1.2)*.32);
    const secondary=Math.sin(u*Math.PI*24-v*1.7)*.28;
    const amplitude=w*((innerWidth<700?.0055:.0068)+gather*(innerWidth<700?.010:.014));
    return (primary+secondary)*amplitude*vertical;
  }

  function constraint(a,b,m=.9){
    const A=a*3,B=b*3,dx=rest[B]-rest[A],dy=rest[B+1]-rest[A+1],dz=rest[B+2]-rest[A+2];
    constraints.push([a,b,Math.hypot(dx,dy,dz),m]);
  }

  function clothSetup(){
    if(mesh){scene.remove(mesh);geometry?.dispose?.();material?.dispose?.();}
    const aspect=innerWidth/innerHeight;
    w=aspect*2;h=2;
    segX=innerWidth<700?28:44;segY=innerWidth<700?20:30;cols=segX+1;rows=segY+1;
    geometry=new THREE.PlaneGeometry(w,h,segX,segY);
    pos=geometry.attributes.position.array;prev=new Float32Array(pos);rest=new Float32Array(pos);
    pinned=new Uint8Array(cols*rows);constraints=[];pins.length=0;

    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const i=id(x,y);if(y===0)pinned[i]=1;
      if(x+1<cols)constraint(i,id(x+1,y),1);
      if(y+1<rows)constraint(i,id(x,y+1),1);
      if(x+1<cols&&y+1<rows){constraint(i,id(x+1,y+1),.82);constraint(id(x+1,y),id(x,y+1),.82);}
      if(x+2<cols)constraint(i,id(x+2,y),.33);
      if(y+2<rows)constraint(i,id(x,y+2),.33);
    }

    bumpTexture?.dispose?.();bumpTexture=weave();
    material=new THREE.MeshStandardMaterial({
      color:0xffffff,map:heroTexture||null,bumpMap:bumpTexture,bumpScale:innerWidth<700?.008:.012,
      roughness:.94,metalness:0,side:THREE.DoubleSide
    });
    mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh);
    reset();
  }

  function reset(){
    if(!pos)return;pos.set(rest);prev.set(rest);
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const i=id(x,y)*3,u=x/segX,v=y/segY;
      const z=restingFold(u,v,0);
      pos[i+2]=prev[i+2]=z;
    }
    geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
  }

  function pinTargets(){
    const gather=smooth(progress/.8);
    const exit=smooth((progress-.72)/.28);
    const span=w*(1-.89*gather);
    const left=-w/2-w*1.12*exit;
    pins.length=cols;
    for(let x=0;x<cols;x++){
      const u=x/segX;
      const ease=u*u*(3-2*u);
      const restingTop=restingFold(u,0,gather)*.58;
      const ring=Math.sin(u*Math.PI*segX*.96)*w*.0055*gather;
      pins[x]=[left+span*(u*.9+ease*.1),h/2,restingTop+ring*(.25+.45*Math.sin(Math.PI*clamp(progress/.9)))];
    }
  }

  function enforcePins(){
    for(let x=0;x<cols;x++){
      const i=id(x,0)*3,t=pins[x];if(!t)continue;
      pos[i]=prev[i]=t[0];pos[i+1]=prev[i+1]=t[1];pos[i+2]=prev[i+2]=t[2];
    }
  }

  function solve(){
    for(let it=0;it<5;it++){
      for(const [a,b,len,m] of constraints){
        const A=a*3,B=b*3;
        let dx=pos[B]-pos[A],dy=pos[B+1]-pos[A+1],dz=pos[B+2]-pos[A+2];
        const dist=Math.hypot(dx,dy,dz)||1e-6;
        const k=((dist-len)/dist)*.93*m;dx*=k;dy*=k;dz*=k;
        const pa=pinned[a],pb=pinned[b];if(pa&&pb)continue;
        if(pa){pos[B]-=dx;pos[B+1]-=dy;pos[B+2]-=dz;}
        else if(pb){pos[A]+=dx;pos[A+1]+=dy;pos[A+2]+=dz;}
        else{
          pos[A]+=dx*.5;pos[A+1]+=dy*.5;pos[A+2]+=dz*.5;
          pos[B]-=dx*.5;pos[B+1]-=dy*.5;pos[B+2]-=dz*.5;
        }
      }
      enforcePins();
    }
  }

  function step(dt,time){
    pinTargets();
    const active=smooth((progress-.01)/.86),gather=smooth(progress/.8),exit=smooth((progress-.72)/.28);
    const wind=clamp(velocity/5200,-.65,.65);
    const sub=2,frame=Math.min(dt,.032)/sub;
    for(let s=0;s<sub;s++){
      const damp=Math.pow(.974,frame*60);
      for(let y=1;y<rows;y++){
        const v=y/segY,vertical=Math.sin(v*Math.PI);
        for(let x=0;x<cols;x++){
          const u=x/segX,i=id(x,y)*3;
          const cx=pos[i],cy=pos[i+1],cz=pos[i+2];
          const vx=(cx-prev[i])*damp,vy=(cy-prev[i+1])*damp,vz=(cz-prev[i+2])*damp;
          prev[i]=cx;prev[i+1]=cy;prev[i+2]=cz;

          const foldTarget=restingFold(u,v,gather);
          const foldSpring=(foldTarget-cz)*(.032+.026*(1-active));
          const wave=Math.sin(u*Math.PI*18+v*7.2+time*.72)*.00014+Math.sin(u*Math.PI*10-v*10-time*.46)*.00007;

          pos[i]=cx+vx-exit*w*.00072;
          pos[i+1]=cy+vy-.000085*(.18+active);
          pos[i+2]=cz+vz+foldSpring+wave*active*vertical+wind*.00016*vertical*(.25+.75*u)*active;

          if(exit>.7){
            const guide=-w/2-w*(.76+1.14*exit);
            pos[i]+=(guide-pos[i])*.0041*exit*(.22+.78*v);
          }
        }
      }
      enforcePins();solve();
    }
    geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
  }

  async function capture(){
    if(capturing)return;capturing=true;
    try{
      try{await document.fonts?.ready;}catch(_e){}
      const shot=await window.html2canvas(hero,{
        backgroundColor:'#f2f0eb',logging:false,useCORS:true,
        scale:Math.min(2.2,Math.max(1.35,(devicePixelRatio||1)*1.15)),
        width:hero.clientWidth,height:hero.clientHeight,
        onclone:doc=>{
          const clone=doc.querySelector('.hero');if(!clone)return;
          clone.classList.remove('hero--cloth-source','hero--curtain');
          clone.style.visibility='visible';clone.style.opacity='1';clone.style.clipPath='none';clone.style.webkitClipPath='none';
          clone.querySelectorAll('.hero__line>span,.reveal').forEach(el=>{
            el.style.animation='none';el.style.transition='none';el.style.transform='none';el.style.opacity='1';el.style.filter='none';
          });
        }
      });
      const tex=new THREE.CanvasTexture(shot);if('colorSpace' in tex)tex.colorSpace=THREE.SRGBColorSpace;
      tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;tex.needsUpdate=true;
      heroTexture?.dispose?.();heroTexture=tex;if(material){material.map=tex;material.needsUpdate=true;}
      if(!ready){
        ready=true;document.documentElement.classList.add('curtain-ready');hero.classList.add('hero--cloth-source');
        work.classList.add('work--behind-curtain');canvas.classList.add('is-ready','is-active');
      }
      pendingCapture=false;
    }catch(error){
      console.warn('[Curtain] Hero texture capture failed.',error);
      if(!ready){document.documentElement.classList.add('curtain-static');canvas.remove();}
    }finally{capturing=false;}
  }

  rendererSetup();clothSetup();await capture();if(!ready)return;

  ScrollTrigger.create({
    trigger:hero,start:'top top',end:()=>`+=${Math.max(620,innerHeight*1.02)}`,
    scrub:.32,pin:true,pinSpacing:false,anticipatePin:1,invalidateOnRefresh:true,
    onEnter:()=>{running=true;canvas.classList.add('is-active');},
    onEnterBack:()=>{running=true;canvas.classList.add('is-active');},
    onLeave:()=>{progress=1;setTimeout(()=>canvas.classList.remove('is-active'),180);},
    onLeaveBack:()=>{progress=0;running=true;canvas.classList.add('is-active');if(pendingCapture)capture();},
    onUpdate:self=>{
      progress=self.progress;velocity=self.getVelocity();running=true;canvas.classList.add('is-active');
      if(progress<.015&&pendingCapture&&!capturing)capture();
    }
  });
  if(window.__lenis?.on)window.__lenis.on('scroll',ScrollTrigger.update);

  const observer=new MutationObserver(()=>{
    pendingCapture=true;clearTimeout(captureTimer);
    captureTimer=setTimeout(()=>{if(progress<.015&&!capturing)capture();},520);
  });
  observer.observe(hero,{childList:true,characterData:true,subtree:true});

  if(fine)addEventListener('pointermove',e=>{
    if(progress<.03||progress>.94||!pos)return;
    const py=e.clientY/innerHeight,px=e.clientX/innerWidth;
    const nudge=Math.sin(py*Math.PI)*(px-.5)*.00008;
    for(let y=1;y<rows;y++)prev[id(cols-1,y)*3+2]-=nudge*Math.sin((y/segY)*Math.PI);
  },{passive:true});

  addEventListener('resize',()=>{
    clearTimeout(resizeTimer);resizeTimer=setTimeout(async()=>{
      rendererSetup();clothSetup();pendingCapture=true;if(progress<.02)await capture();ScrollTrigger.refresh();
    },240);
  },{passive:true});

  function loop(now){
    const dt=Math.min(.034,(now-last)/1000||1/60);last=now;
    if(running&&renderer&&mesh){step(dt,now/1000);renderer.render(scene,camera);if(progress>=.999&&Math.abs(velocity)<8)running=false;}
    velocity*=.82;requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);ScrollTrigger.refresh();
})();