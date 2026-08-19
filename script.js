const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (!prefersReducedMotion && window.Lenis) {
  const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    smoothWheel: true,
    lerp: 0.085,
    wheelMultiplier: 0.9,
  });

  window.__lenis = lenis;
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);

revealItems.forEach((item) => revealObserver.observe(item));

const cursor = document.querySelector('.cursor');
const cursorLabel = document.querySelector('.cursor__label');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

if (finePointer && !prefersReducedMotion && cursor) {
  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const renderCursor = () => {
    cursorX += (mouseX - cursorX) * 0.16;
    cursorY += (mouseY - cursorY) * 0.16;
    document.documentElement.style.setProperty('--cursor-x', `${cursorX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${cursorY}px`);
    requestAnimationFrame(renderCursor);
  };

  renderCursor();

  document.querySelectorAll('[data-cursor], a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      const label = element.dataset.cursor;
      if (label) {
        cursor.classList.add('is-active');
        cursorLabel.textContent = label;
      }
    });

    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active');
    });
  });
}

const projectStage = document.querySelector('.project-stage');
const projectSurface = document.querySelector('.project-stage__surface');
const stageNumber = document.querySelector('.project-stage__number');
const stageName = document.querySelector('.project-stage__name');
const projectRows = document.querySelectorAll('.project-row');

const setStageProject = (row) => {
  if (!projectSurface) return;
  projectSurface.dataset.active = row.dataset.project;
  stageNumber.textContent = row.dataset.number;
  stageName.textContent = row.dataset.title;
};

if (projectSurface && projectRows[0]) {
  setStageProject(projectRows[0]);
}

projectRows.forEach((row) => {
  row.addEventListener('mouseenter', () => {
    setStageProject(row);
    projectStage?.classList.add('is-visible');
  });

  row.addEventListener('focus', () => {
    setStageProject(row);
    projectStage?.classList.add('is-visible');
  });

  row.addEventListener('mouseleave', () => {
    projectStage?.classList.remove('is-visible');
  });

  row.addEventListener('blur', () => {
    projectStage?.classList.remove('is-visible');
  });
});

if (finePointer && !prefersReducedMotion && projectStage && projectSurface) {
  window.addEventListener('mousemove', (event) => {
    if (!projectStage.classList.contains('is-visible')) return;

    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;

    projectSurface.style.setProperty('--stage-ry', `${nx * 5}deg`);
    projectSurface.style.setProperty('--stage-rx', `${ny * -4}deg`);
    projectStage.style.setProperty('--orb-a-x', `${nx * 28}px`);
    projectStage.style.setProperty('--orb-a-y', `${ny * 20}px`);
    projectStage.style.setProperty('--orb-b-x', `${nx * -18}px`);
    projectStage.style.setProperty('--orb-b-y', `${ny * -24}px`);
  });
}

const magneticItems = document.querySelectorAll('.magnetic');

if (finePointer && !prefersReducedMotion) {
  magneticItems.forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate3d(${x * 0.16}px, ${y * 0.2}px, 0)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate3d(0, 0, 0)';
      item.style.transition = 'transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1)';
      window.setTimeout(() => {
        item.style.transition = '';
      }, 430);
    });
  });
}
