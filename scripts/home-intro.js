(()=>{
  const root=document.documentElement;
  const hero=document.querySelector('.hero');
  const title=hero?.querySelector('.hero__title');
  if(!hero||!title){
    root.classList.remove('is-home-intro-pending');
    return;
  }

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION=window.__motion||{ui:320,content:560,scene:1000};
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

    /* Each glyph still owns roughly half a second, but the motion is now a soft
       focus-and-rise rather than a cartoon bounce. Stagger is normalized by the
       selected language so the focal sentence resolves in about 1.7 seconds. */
    const glyphDuration=520;
    const targetSequence=1700;
    const count=animated.length;
    const stagger=count>1?Math.max(44,Math.min(88,(targetSequence-glyphDuration)/(count-1))):0;
    animated.forEach((glyph,index)=>glyph.style.setProperty('--home-intro-delay',`${Math.round(index*stagger)}ms`));

    return {
      lines,
      duration:glyphDuration+Math.max(0,count-1)*stagger
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

    /* Two painted frames guarantee the invisible glyph poses are committed before
       the first one starts. This prevents the first frame from flashing the full
       sentence and keeps the title as the immediate visual centre. */
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      root.classList.remove('is-home-intro-pending');
      root.classList.add('is-home-intro-running');
    }));

    await wait(Math.ceil(built.duration)+40);

    /* Supporting information only arrives after the title has resolved. */
    root.classList.add('is-home-intro-meta');
    await wait(Math.max(MOTION.ui,320)+36);
    root.classList.add('is-home-intro-logo');

    await wait(Math.max(MOTION.content,560)+60);

    unwrap(built.lines);
    root.classList.remove('is-home-intro-running','is-home-intro-meta','is-home-intro-logo');
    root.classList.add('is-home-intro-complete');
    clearTimers();
  }

  addEventListener('bn0u0:home-intro-start',run,{once:true});
  /* Backward-compatible fallback if a cached entry script only emits complete. */
  addEventListener('bn0u0:entry-complete',run,{once:true});

  if(!document.querySelector('.entry-gate')&&!root.classList.contains('is-entry-gated')){
    queueMicrotask(run);
  }
})();
