const progressRoot = document.querySelector('.scroll-progress');
const progressBar = document.querySelector('.scroll-progress__bar');

if (progressRoot && progressBar) {
  let scrollIdleTimer;

  const setProgress = (progress) => {
    const clamped = Math.min(1, Math.max(0, progress || 0));
    progressBar.style.transform = `scaleX(${clamped})`;
    progressRoot.classList.add('is-scrolling');

    window.clearTimeout(scrollIdleTimer);
    scrollIdleTimer = window.setTimeout(() => {
      progressRoot.classList.remove('is-scrolling');
    }, 180);
  };

  const getNativeProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    return scrollable > 0 ? scrollTop / scrollable : 0;
  };

  const updateFromNativeScroll = () => setProgress(getNativeProgress());

  if (window.__lenis) {
    window.__lenis.on('scroll', ({ progress }) => {
      setProgress(progress);
    });
  } else {
    window.addEventListener('scroll', updateFromNativeScroll, { passive: true });
  }

  window.addEventListener('resize', updateFromNativeScroll, { passive: true });
  setProgress(getNativeProgress());

  window.setTimeout(() => {
    progressRoot.classList.remove('is-scrolling');
  }, 220);
}
