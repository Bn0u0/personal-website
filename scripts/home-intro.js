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

  function clearTimers(){
    timers.forEach(clearTimeout);
    timers=[];
  }

  function unwrap(lines){
    lines.forEach(({node,text})=>{
      node.textContent=text;
      node.removeAttribute('aria-label');
    });
  }

  function buildGlyphs(){
    const lineNodes=[...title.querySelectorAll(':scope > .hero__line > span')];
    const lines=lineNodes.map(node=>({node,text:node.textContent||''}));
    const animated=[];

    lines.forEach(({node,text})=>{
      node.textContent='';
      node.setAttribute('aria-label',text);
      [...text].forEach(char=>{
        const glyph=document.createElement('i');
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

    /* The glyph itself now gets an EDITORIAL beat. Stagger stays restrained so
       English never turns into a ten-second typewriter sequence. */
    const glyphDuration=MOTION.editorial;
    const stagger=animated.length<=18?(MOTION.staggerStandard||80):(MOTION.staggerTight||40);
    animated.forEach((glyph,index)=>glyph.style.setProperty('--home-intro-delay',`${index*stagger}ms`));

    return {
      lines,
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

    /* Beat 1 — title. Give the resolved phrase one still frame before anything
       else competes for attention. */
    await wait(Math.ceil(built.duration)+MOTION.hold);

    /* Beat 2 — supporting information. It is allowed to almost finish before
       the logo arrives, so the cross-screen motion can actually be read. */
    root.classList.add('is-home-intro-meta');
    await wait((MOTION.ui||320)+MOTION.hold);

    /* Beat 3 — logo punctuation. This gets SHOWCASE timing rather than ordinary
       content timing because it is the final memorable accent of the entrance. */
    root.classList.add('is-home-intro-logo');
    await wait(MOTION.showcase+MOTION.hold);

    unwrap(built.lines);
    root.classList.remove('is-home-intro-running','is-home-intro-meta','is-home-intro-logo');
    root.classList.add('is-home-intro-complete');
    clearTimers();
  }

  addEventListener('bn0u0:home-intro-start',run,{once:true});
  addEventListener('bn0u0:entry-complete',run,{once:true});

  if(!document.querySelector('.entry-gate')&&!root.classList.contains('is-entry-gated')){
    queueMicrotask(run);
  }
})();
