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

    /* Every glyph owns a ~500ms bounce, while the stagger is normalized by the
       selected language so EN and 中文 keep a similar total intro length. */
    const glyphDuration=500;
    const targetSequence=2200;
    const count=animated.length;
    const stagger=count>1?Math.max(55,Math.min(120,(targetSequence-glyphDuration)/(count-1))):0;
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

    /* One painted frame guarantees all glyphs exist at their hidden start pose
       before the pending curtain is released. */
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      root.classList.remove('is-home-intro-pending');
      root.classList.add('is-home-intro-running');
    }));

    await wait(Math.ceil(built.duration)+70);

    /* Supporting information comes in only after the title has become the focal
       point. Left/right groups cross toward their final edges quickly. */
    root.classList.add('is-home-intro-meta');

    /* Let the lateral UI complete its own UI beat before the brand enters. The
       logo therefore reads as a separate final punctuation, not another item in
       the same group motion. */
    await wait(Math.max(MOTION.ui,320)+40);
    root.classList.add('is-home-intro-logo');

    await wait(Math.max(MOTION.content,560)+80);

    /* Return the title to normal semantic text so the existing language system
       can keep updating it later without knowing about the intro glyph wrappers. */
    unwrap(built.lines);
    root.classList.remove('is-home-intro-running','is-home-intro-meta','is-home-intro-logo');
    root.classList.add('is-home-intro-complete');
    clearTimers();
  }

  addEventListener('bn0u0:entry-complete',run,{once:true});

  /* Defensive path for cached/restored documents where the gate is already gone
     before this script attaches. */
  if(!document.querySelector('.entry-gate')&&!root.classList.contains('is-entry-gated')){
    queueMicrotask(run);
  }
})();
