(()=>{
  const root=document.documentElement;
  const hero=document.querySelector('.hero');
  const title=hero?.querySelector('.hero__title');
  if(!hero||!title){
    root.classList.remove('is-home-intro-pending');
    return;
  }

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BASE=window.__motion||{ui:320,content:560,scene:1000,staggerTight:40,staggerStandard:80};
  const cssMs=(name,fallback)=>{
    const raw=getComputedStyle(root).getPropertyValue(name).trim();
    const value=parseFloat(raw);
    if(!Number.isFinite(value))return fallback;
    return raw.endsWith('s')&&!raw.endsWith('ms')?value*1000:value;
  };
  const MOTION={
    ...BASE,
    editorial:cssMs('--motion-editorial',760),
    showcase:cssMs('--motion-showcase',920),
    hold:cssMs('--motion-hold',180)
  };

  let started=false;
  let timers=[];

  const wait=ms=>new Promise(resolve=>{
    const id=setTimeout(resolve,ms);
    timers.push(id);
  });
  const nextPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

  function clearTimers(){
    timers.forEach(clearTimeout);
    timers=[];
  }

  function buildGlyphs(){
    const lineNodes=[...title.querySelectorAll(':scope > .hero__line > span')];
    const lines=lineNodes.map(node=>({node,text:node.textContent||''}));
    const animated=[];

    /* The heading owns one accessible label. The per-glyph DOM is purely visual,
       so screen readers get the sentence once instead of ARIA labels on generic spans. */
    title.setAttribute('aria-label',lines.map(({text})=>text).join(' '));

    lines.forEach(({node,text})=>{
      node.textContent='';
      node.setAttribute('aria-hidden','true');
      [...text].forEach(char=>{
        const glyph=document.createElement('span');
        glyph.className='home-intro-char';
        glyph.setAttribute('aria-hidden','true');
        if(char===' '){
          glyph.classList.add('is-space');
          glyph.textContent='\u00A0';
        }else{
          glyph.textContent=char;
          animated.push(glyph);
        }
        node.appendChild(glyph);
      });
    });

    const glyphDuration=MOTION.editorial;
    const stagger=MOTION.staggerTight||40;
    animated.forEach((glyph,index)=>glyph.style.setProperty('--home-intro-delay',`${index*stagger}ms`));

    return {
      duration:glyphDuration+Math.max(0,animated.length-1)*stagger
    };
  }

  async function run(){
    if(started)return;
    started=true;

    if(reduced){
      root.classList.remove('is-home-intro-pending');
      root.classList.add('is-home-intro-complete');
      return;
    }

    const built=buildGlyphs();

    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      root.classList.remove('is-home-intro-pending');
      root.classList.add('is-home-intro-running');
    }));

    await wait(Math.ceil(built.duration)+MOTION.hold);
    root.classList.add('is-home-intro-meta');
    await wait((MOTION.ui||320)+MOTION.hold);
    root.classList.add('is-home-intro-logo');
    await wait(MOTION.showcase+MOTION.hold);

    root.classList.add('is-home-intro-complete');
    await nextPaint();
    root.classList.remove('is-home-intro-running','is-home-intro-meta','is-home-intro-logo');
    clearTimers();
  }

  addEventListener('bn0u0:home-intro-start',run,{once:true});
  addEventListener('bn0u0:entry-complete',run,{once:true});

  if(!document.querySelector('.entry-gate')&&!root.classList.contains('is-entry-gated')){
    queueMicrotask(run);
  }
})();
