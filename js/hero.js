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

const isMobile = window.innerWidth <= 767;
  const activeCta = isMobile ? ctaHeroMobile : ctaHero;

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
      y:     (navCenterY - heroCenterY) + (isMobileNow ? -22 : 0),
      scale: navRect.height / heroRect.height
    };
  }

  // ─────────────────────────────────────────
  // MASTER TIMELINE
  // ─────────────────────────────────────────
  const master = gsap.timeline({ paused: true });

  gsap.set(logoHeroWrap, { transformOrigin: 'center center' });

  // 1. Logo fade in hasta 70%
  master.to(logoHero, {
    opacity: 0.7,
    duration: 2.2,
    ease: 'power1.inOut'
  });

  // 2. Pausa medio segundo
  master.to({}, { duration: 0.5 });

  // 3. Logo completa 70 → 100%
  master.to(logoHero, {
    opacity: 1,
    duration: 1.2,
    ease: 'power1.inOut'
  });

  // 4. Pequeña pausa antes del vuelo
  master.to({}, { duration: 0.3 });

  // 5. Logo vuela + línea horizontal + gif en simultáneo
  master.add(function () {
    const target = getNavLogoTarget();

    // Logo vuela al nav
    gsap.to(logoHeroWrap, {
      x: target.x,
      y: target.y,
      scale: target.scale,
      duration: 1.6,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.to(headerWrap, { opacity: 1, duration: 0 });
        gsap.set(logoHeroWrap, { display: 'none' });
      }
    });

    // Línea horizontal de derecha a izquierda
    gsap.fromTo(lineH,
      { width: '0%', right: '0', left: 'auto' },
      {
        width: '100%',
        duration: 1.4,
        ease: 'power2.inOut',
        onComplete: () => {
          const logoRect    = headerLogo.getBoundingClientRect();
          const headerRect  = document.getElementById('site-header').getBoundingClientRect();
          const isMobileNow = window.innerWidth <= 767;
          const margin      = isMobileNow ? 10 : 16;
          const leftPos     = logoRect.right - headerRect.left + margin;
          lineV.style.left  = leftPos + 'px';

          const navHeight   = document.getElementById('site-header').offsetHeight;
          gsap.to(lineV, {
            height: navHeight + 'px',
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      }
    );

    // Gif/video crece desde pequeño
    gsap.to(mediaWrap, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'back.out(1.2)',
      delay: 0.15
    });
  });

  // 6. Esperar animaciones anteriores
  master.to({}, { duration: 1.8 });

  // 7. Texto línea 1
  master.to(line1, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'back.out(1.3)'
  });

  // 8. Texto línea 2
  master.to(line2, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'back.out(1.3)'
  }, '-=0.5');

  // 9. Texto línea 3
  master.to(line3, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'back.out(1.3)'
  }, '-=0.5');

  // 10. Verde en líneas 2 y 3
  master.add(function () {
    line2.classList.add('green');
    line3.classList.add('green');
  }, '-=0.1');

// 11. CTA aparece — animamos ambos por seguridad
  master.to(ctaHero, {
    opacity: 1,
    duration: 0.8,
    ease: 'back.out(1.4)'
  }, '-=0.3');

  master.to(ctaHeroMobile, {
    opacity: 1,
    duration: 0.8,
    ease: 'back.out(1.4)'
  }, '-=0.8');

  // Arrancar
  master.play();

  // ─────────────────────────────────────────
  // SCROLL — verde reverso si vuelve arriba
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: '#hero-scroll-space',
    start: 'top 99%',
    onLeaveBack: () => {
      line2.classList.remove('green');
      line3.classList.remove('green');
    },
    onEnterBack: () => {
      line2.classList.add('green');
      line3.classList.add('green');
    }
  });

  // ─────────────────────────────────────────
  // CTA HEADER — aparece solo cuando el hero
  // completo sale del viewport
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom top',
    onEnter:     () => ctaHeader.classList.add('visible'),
    onLeaveBack: () => ctaHeader.classList.remove('visible')
  });

  // ─────────────────────────────────────────
  // VIDEO SCRUBBING
  // ─────────────────────────────────────────
  const video = document.getElementById('hero-video');

  if (video) {
    video.addEventListener('loadedmetadata', () => {
      ScrollTrigger.create({
        trigger: '#hero-scroll-space',
        start: 'top 99%',
        end: 'bottom bottom',
        onUpdate: (self) => {
          video.currentTime = self.progress * video.duration;
        }
      });
    });
  }

  // ─────────────────────────────────────────
  // FLECHA DE INACTIVIDAD
  // ─────────────────────────────────────────
  let hintCycle  = null;
  let hideTimer  = null;
  let heroActive = true;

  function showHint() {
    if (!heroActive) return;
    hint.classList.add('visible');
    hideTimer = setTimeout(() => {
      hint.classList.remove('visible');
      if (heroActive) {
        hintCycle = setTimeout(showHint, 2000);
      }
    }, 6000);
  }

  function stopHint() {
    clearTimeout(hintCycle);
    clearTimeout(hideTimer);
    hint.classList.remove('visible');
  }

  master.eventCallback('onComplete', () => {
    hintCycle = setTimeout(showHint, 2000);
  });

  window.addEventListener('scroll', function () {
    stopHint();
    clearTimeout(window._hintRestartTimer);
    if (heroActive) {
      window._hintRestartTimer = setTimeout(() => {
        if (heroActive) hintCycle = setTimeout(showHint, 2000);
      }, 1000);
    }
    const space = document.getElementById('hero-scroll-space');
    if (window.scrollY >= space.offsetHeight * 0.95) {
      heroActive = false;
      stopHint();
    }
  });

});
