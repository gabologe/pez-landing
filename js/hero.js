document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  // ─────────────────────────────────────────
  // REFERENCIAS
  // ─────────────────────────────────────────
  const logoHero      = document.getElementById('logo-hero');
  const logoHeroWrap  = document.getElementById('logo-hero-wrap');
  const headerLogo    = document.getElementById('header-logo');
  const headerWrap    = document.querySelector('.header-logo-wrap');
  const lineH         = document.getElementById('header-line-h');
  const lineV         = document.getElementById('header-line-v');
  const mediaWrap     = document.getElementById('hero-media-wrap');
  const line1         = document.querySelector('#line-1 .display-text');
  const line2         = document.querySelector('#line-2 .display-text');
  const line3         = document.querySelector('#line-3 .display-text');
  const ctaHero       = document.getElementById('cta-hero');
  const ctaHeroMobile = document.getElementById('cta-hero-mobile');
  const ctaHeader     = document.getElementById('cta-header');
  const hint          = document.getElementById('scroll-hint');
  const hintCenter    = document.getElementById('scroll-hint-center');
  const video         = document.getElementById('hero-video');
  const heroSpace     = document.getElementById('hero-scroll-space');
  const heroWrap      = document.getElementById('hero-sticky-wrap');

  // ─────────────────────────────────────────
  // DESTINO DEL LOGO EN EL NAV
  // ─────────────────────────────────────────
  function getNavLogoTarget() {
    document.getElementById('site-header').getBoundingClientRect();
    const navRect     = headerLogo.getBoundingClientRect();
    const heroRect    = logoHero.getBoundingClientRect();
    const navCenterX  = navRect.left  + navRect.width  / 2;
    const navCenterY  = navRect.top   + navRect.height / 2;
    const heroCenterX = heroRect.left + heroRect.width  / 2;
    const heroCenterY = heroRect.top  + heroRect.height / 2;
    const isMobileNow = window.innerWidth <= 767;
    return {
      x:     navCenterX - heroCenterX,
      y:     (navCenterY - heroCenterY) + (isMobileNow ? -24 : 0),
      scale: navRect.height / heroRect.height
    };
  }

  // ─────────────────────────────────────────
  // POSICIÓN LÍNEA VERTICAL
  // ─────────────────────────────────────────
  function positionLineV() {
    const logoRect   = headerLogo.getBoundingClientRect();
    const headerRect = document.getElementById('site-header').getBoundingClientRect();
    const margin     = window.innerWidth <= 767 ? 10 : 16;
    lineV.style.left = (logoRect.right - headerRect.left + margin) + 'px';
  }

  // ─────────────────────────────────────────
  // FASE 1 — Logo fade in automático
  // ─────────────────────────────────────────
  gsap.set(logoHeroWrap, { transformOrigin: 'center center' });
  gsap.set(headerWrap,   { opacity: 0 });
  if (heroWrap) gsap.set(heroWrap, { transformOrigin: 'center center' });

  gsap.fromTo(logoHero,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 2.2,
      ease: 'power1.inOut',
      delay: 0.3,
      onComplete: () => {
        hintCenter.classList.add('visible');
        gsap.to(hintCenter, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    }
  );

  // ─────────────────────────────────────────
  // FASE 2 — Timeline atado al scroll
  // ─────────────────────────────────────────
  let navTarget   = null;
  let logoArrived = false;

  window.addEventListener('load', () => {
    navTarget = getNavLogoTarget();
    positionLineV();
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-scroll-space',
      start: 'top top',
      end: '60% top',
      scrub: 2.5,
      onEnter: () => {
        gsap.to(hintCenter, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => hintCenter.classList.remove('visible')
        });
      },
      onLeaveBack: () => {
        hintCenter.classList.add('visible');
        gsap.to(hintCenter, { opacity: 1, duration: 0.4 });
        stopHintCycle();
        logoArrived = false;
        gsap.set(logoHeroWrap, { opacity: 1, display: 'block' });
        gsap.set(headerWrap,   { opacity: 0 });
        line2.classList.remove('green');
        line3.classList.remove('green');
      },
      onUpdate: (self) => {
        const p = self.progress;

        if (p >= 0.95 && !logoArrived) {
          logoArrived = true;
          positionLineV();
          gsap.set(headerWrap,   { opacity: 1 });
          gsap.set(logoHeroWrap, { opacity: 0, display: 'none' });
        } else if (p < 0.95 && logoArrived) {
          logoArrived = false;
          gsap.set(headerWrap,   { opacity: 0 });
          gsap.set(logoHeroWrap, { opacity: 1, display: 'block' });
        }

        if (p >= 0.98 && !hintActive) startHintCycle();
        if (p < 0.98)                  stopHintCycle();
      }
    }
  });

  tl.to(logoHeroWrap, {
    x: () => navTarget ? navTarget.x : getNavLogoTarget().x,
    y: () => navTarget ? navTarget.y : getNavLogoTarget().y,
    scale: () => navTarget ? navTarget.scale : getNavLogoTarget().scale,
    ease: 'power2.inOut',
    duration: 4
  }, 0);

  tl.fromTo(lineH,
    { width: '0%' },
    { width: '100%', ease: 'power2.inOut', duration: 3 },
    0.5
  );

  tl.to(lineV, {
    height: () => {
      positionLineV();
      return document.getElementById('site-header').offsetHeight + 'px';
    },
    ease: 'power3.out',
    duration: 1.5
  }, 3.2);

  tl.to(mediaWrap, {
    opacity: 1,
    scale: 1,
    ease: 'power2.out',
    duration: 3
  }, 2);

  tl.to(line1, { y: 0, opacity: 1, ease: 'power3.out', duration: 2 }, 2.5);
  tl.to(line2, { y: 0, opacity: 1, ease: 'power3.out', duration: 2 }, 3);
  tl.to(line3, { y: 0, opacity: 1, ease: 'power3.out', duration: 2 }, 3.5);

  tl.to([ctaHero, ctaHeroMobile], {
    opacity: 1,
    ease: 'power2.out',
    duration: 1.5
  }, 4.5);

  tl.add(() => {
    line2.classList.add('green');
    line3.classList.add('green');
  }, 5);

  // ─────────────────────────────────────────
  // FASE 4 — Video scrubbing
  // ─────────────────────────────────────────
  if (video) {
    video.addEventListener('loadedmetadata', () => {
      ScrollTrigger.create({
        trigger: '#hero-scroll-space',
        start: '60% top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          video.currentTime = self.progress * video.duration;
        }
      });
    });
  }

  // ─────────────────────────────────────────
  // HERO SCALE DOWN
  // El wrap es sticky — sigue visible mientras
  // verdades sube por debajo
  // ─────────────────────────────────────────
  if (heroWrap) {
    gsap.to(heroWrap, {
      scale: 0.85,
      opacity: 0,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: '#verdades',
        start: 'top 90%',
        end: 'top 10%',
        scrub: 1.5
      }
    });
  }

  // ─────────────────────────────────────────
  // CTA HEADER
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: '#hero-scroll-space',
    start: 'bottom top',
    onEnter:     () => ctaHeader.classList.add('visible'),
    onLeaveBack: () => ctaHeader.classList.remove('visible')
  });

  // ─────────────────────────────────────────
  // FLECHA LATERAL
  // ─────────────────────────────────────────
  let hintCycle  = null;
  let hideTimer  = null;
  let hintActive = false;

  function showHint() {
    if (!hintActive) return;
    hint.classList.add('visible');
    hideTimer = setTimeout(() => {
      hint.classList.remove('visible');
      if (hintActive) {
        hintCycle = setTimeout(showHint, 2000);
      }
    }, 6000);
  }

  function stopHintCycle() {
    clearTimeout(hintCycle);
    clearTimeout(hideTimer);
    hint.classList.remove('visible');
    hintActive = false;
  }

  function startHintCycle() {
    if (hintActive) return;
    hintActive = true;
    hintCycle = setTimeout(showHint, 1000);
  }

  window.addEventListener('scroll', () => {
    if (hintActive) {
      hint.classList.remove('visible');
      clearTimeout(hintCycle);
      clearTimeout(hideTimer);
      hintCycle = setTimeout(showHint, 2000);
    }
    if (window.scrollY >= heroSpace.offsetHeight * 0.95) {
      stopHintCycle();
    }
  });

});
