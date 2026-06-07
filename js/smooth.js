(function () {
  if (typeof Lenis === 'undefined') return;
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger === 'undefined') return;

  const isMobile = window.innerWidth <= 767;

  const lenis = new Lenis({
    duration: 0.45,
    smoothWheel: !isMobile,
    smoothTouch: false
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.PEZLenis = lenis;
})();