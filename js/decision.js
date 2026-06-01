document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector('#decision');
  if (!section) return;

  // ── Borde animado ──
  const borderEl = document.getElementById('border-animated');
  const card = document.getElementById('card-personas');
  let perimeter = 1000;

  function initBorder() {
    if (!borderEl || !card) return;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const r = 16;
    perimeter = 2 * (w + h) - 8 * r + 2 * Math.PI * r;
    borderEl.setAttribute('width', w);
    borderEl.setAttribute('height', h);
    borderEl.style.strokeDasharray = perimeter;
    borderEl.style.strokeDashoffset = perimeter;

    const bgRect = document.querySelector('#card-border-svg rect:first-child');
    if (bgRect) {
      bgRect.setAttribute('width', w);
      bgRect.setAttribute('height', h);
    }
  }

  initBorder();
  window.addEventListener('resize', initBorder);

  // ── Estados iniciales ──
  gsap.set('.decision-titulo', { y: 120, opacity: 0 });
  gsap.set('.decision-grid', { opacity: 0 });
  gsap.set('.decision-circulo', { scale: 0 });
  gsap.set('.barra-fill', { height: '1px', opacity: 0 });
  gsap.set('.persona', { opacity: 0 });
  gsap.set('.card-texto', { opacity: 0, x: -12 });
  gsap.set('.decision-bloque', { opacity: 0, y: 16 });

  // ── Timeline principal ──
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.decision-scroll-space',
      start: 'top 80%',
      end: 'bottom bottom',
      scrub: 2.5,
    }
  });

  tl

  // 1. Título vuela desde abajo
  .to('.decision-titulo', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  }, 0)

  // 2. Grid aparece
  .to('.decision-grid', {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out'
  }, 0.8)

  // 3. Círculo scale in
  .to('.decision-circulo', {
    scale: 1,
    duration: 0.8,
    ease: 'back.out(1.4)'
  }, 1)

  // 4. Barras aparecen desde 1px opacity 0 → crecen todas a la vez
  .to('.barra-fill', {
    opacity: 1,
    duration: 0.3,
    ease: 'none'
  }, 1.2)
  .to('.barra-fill', {
    height: (i, el) => el.dataset.height + '%',
    duration: 2,
    stagger: 0,
    ease: 'power2.inOut'
  }, 1.4)

  // 5. Border card se dibuja en verde
  .to(borderEl, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: 'power2.inOut'
  }, 2.5)

  // 6. Figuritas aparecen suavemente
  .to('.persona', {
    opacity: 1,
    duration: 0.4,
    stagger: 0.15,
    ease: 'power2.out'
  }, 3.2)

  // 7. Texto card
  .to('.card-texto', {
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, 4.2)

  // 8. Bloque 67%
  .to('.decision-bloque', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, 5);

  // ── Círculo parallax ──
  gsap.to('.decision-circulo', {
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.decision-scroll-space',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 3,
    }
  });

});