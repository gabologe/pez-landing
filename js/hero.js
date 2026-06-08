document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  const logoHero      = document.getElementById('logo-hero');
  const logoHeroWrap  = document.getElementById('logo-hero-wrap');
  const headerLogo    = document.getElementById('header-logo');
  const headerWrap    = document.querySelector('.header-logo-wrap');
  const mediaWrap     = document.getElementById('hero-media-wrap');
  const line1         = document.querySelector('#line-1 .display-text');
  const line2         = document.querySelector('#line-2 .display-text');
  const line3         = document.querySelector('#line-3 .display-text');
  const ctaHero       = document.getElementById('cta-hero');
  const ctaHeroMobile = document.getElementById('cta-hero-mobile');
  const ctaHeader     = document.getElementById('cta-header');
  const hint          = document.getElementById('scroll-hint');
  const heroSpace     = document.getElementById('hero-scroll-space');
  const heroWrap      = document.getElementById('hero-sticky-wrap');

  const isMobile = window.innerWidth <= 767;

  // Si existe intropez, el hero debe salir antes de esa sección.
  const nextSectionSelector = document.getElementById('intropez') ? '#intropez' : '#decision';

  // ─────────────────────────────────────────
  // ESTADOS DE CONTROL
  // ─────────────────────────────────────────
  let navTarget = null;
  let heroRevealPlayed = false;
  let logoIntroReady = false;
  let pendingReveal = false;
  let heroScaledOut = false;
  let scaleOutTween = null;

  // ─────────────────────────────────────────
  // FLECHA — fase hero
  // ─────────────────────────────────────────
  let hintCycle  = null;
  let hideTimer  = null;
  let hintActive = false;

  function setHintPosition(phase) {
    if (!hint) return;

    // Cuando el hero toma control, sale del modo global.
    hint.classList.remove('is-global');

    if (isMobile) {
      hint.classList.remove('position-left');
      return;
    }

    if (phase === 'left') {
      hint.classList.add('position-left');
    } else {
      hint.classList.remove('position-left');
    }
  }

  function showHint() {
    if (!hintActive || !hint) return;

    hint.classList.add('visible');

    hideTimer = setTimeout(() => {
      if (!hint) return;

      hint.classList.remove('visible');

      if (hintActive) {
        hintCycle = setTimeout(showHint, 2200);
      }
    }, 2400);
  }

  function stopHintCycle() {
    clearTimeout(hintCycle);
    clearTimeout(hideTimer);

    if (hint) {
      hint.classList.remove('visible');
    }

    hintActive = false;
  }

  function startHintCycle() {
    if (hintActive || !hint) return;

    hintActive = true;
    clearTimeout(hintCycle);
    clearTimeout(hideTimer);

    hintCycle = setTimeout(showHint, 1200);
  }

  // ─────────────────────────────────────────
  // DESTINO DEL LOGO EN EL NAV
  // ─────────────────────────────────────────
  function getNavLogoTarget() {
    if (!headerLogo || !logoHero) {
      return { x: 0, y: 0, scale: 1 };
    }

    const navRect  = headerLogo.getBoundingClientRect();
    const heroRect = logoHero.getBoundingClientRect();

    const navCenterX  = navRect.left + navRect.width / 2;
    const navCenterY  = navRect.top + navRect.height / 2;

    const heroCenterX = heroRect.left + heroRect.width / 2;
    const heroCenterY = heroRect.top + heroRect.height / 2;

    const isMobileNow = window.innerWidth <= 767;

    return {
      x: navCenterX - heroCenterX,
      y: (navCenterY - heroCenterY) + (isMobileNow ? -24 : 0),
      scale: navRect.height / heroRect.height
    };
  }

  function refreshNavTarget() {
    navTarget = getNavLogoTarget();
  }

  window.addEventListener('load', refreshNavTarget);

  window.addEventListener('resize', () => {
    refreshNavTarget();

    if (heroRevealPlayed && logoHeroWrap) {
      const target = getNavLogoTarget();

      gsap.set(logoHeroWrap, {
        x: target.x,
        y: target.y,
        scale: target.scale
      });
    }
  });

  // ─────────────────────────────────────────
  // SETUP INICIAL
  // ─────────────────────────────────────────
  if (logoHeroWrap) {
    gsap.set(logoHeroWrap, {
      transformOrigin: 'center center'
    });
  }

  if (headerWrap) {
    gsap.set(headerWrap, {
      opacity: 0
    });
  }

  if (heroWrap) {
    gsap.set(heroWrap, {
      transformOrigin: 'center center',
      scale: 1,
      opacity: 1
    });
  }

  if (mediaWrap) {
    gsap.set(mediaWrap, {
      opacity: 0,
      scale: 1
    });
  }

  gsap.set([line1, line2, line3].filter(Boolean), {
    y: '110%',
    opacity: 0
  });

  gsap.set([ctaHero, ctaHeroMobile].filter(Boolean), {
    opacity: 0
  });

  if (line2) line2.classList.remove('green');
  if (line3) line3.classList.remove('green');

  // ─────────────────────────────────────────
  // INTRO INICIAL DEL LOGO
  // ─────────────────────────────────────────
  if (logoHero) {
    gsap.fromTo(logoHero,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.2,
        onComplete: () => {
          logoIntroReady = true;

          setHintPosition('center');
          startHintCycle();

          if (pendingReveal) {
            playHeroReveal();
          }
        }
      }
    );
  }

  // ─────────────────────────────────────────
  // HERO REVEAL — disparado por scroll
  // ─────────────────────────────────────────
  function playHeroReveal() {
    if (heroRevealPlayed) return;

    if (!logoIntroReady) {
      pendingReveal = true;
      return;
    }

    heroRevealPlayed = true;
    pendingReveal = false;

    refreshNavTarget();
    stopHintCycle();

    const target = navTarget || getNavLogoTarget();

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      },
      onComplete: () => {
        setHintPosition('left');
        startHintCycle();
      }
    });

    if (logoHeroWrap) {
      tl.to(logoHeroWrap, {
        x: target.x,
        y: target.y,
        scale: target.scale,
        ease: 'power3.inOut',
        duration: 1.05
      }, 0);
    }

    if (headerWrap) {
      tl.to(headerWrap, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out'
      }, 0.65);
    }

    if (mediaWrap) {
      tl.to(mediaWrap, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: 'power2.out'
      }, 0.35);
    }

    if (line1) {
      tl.to(line1, {
        y: 0,
        opacity: 1,
        duration: 0.65
      }, 0.45);
    }

    if (line2) {
      tl.to(line2, {
        y: 0,
        opacity: 1,
        duration: 0.65
      }, 0.55);
    }

    if (line3) {
      tl.to(line3, {
        y: 0,
        opacity: 1,
        duration: 0.65
      }, 0.65);
    }

    tl.to([ctaHero, ctaHeroMobile].filter(Boolean), {
      opacity: 1,
      duration: 0.45,
      ease: 'power2.out'
    }, 0.95);

    tl.add(() => {
      if (line2) line2.classList.add('green');
      if (line3) line3.classList.add('green');
    }, 1.05);
  }

  // ─────────────────────────────────────────
  // PRIMER SCROLL — dispara el hero reveal
  // ─────────────────────────────────────────
  function handleFirstScroll() {
    if (heroRevealPlayed) return;

    if (window.scrollY > 8) {
      playHeroReveal();
    }
  }

  window.addEventListener('scroll', handleFirstScroll, { passive: true });

  if (window.scrollY > 8) {
    pendingReveal = true;
  }

  // ─────────────────────────────────────────
  // HERO SCALE OUT — scroll dispara, animación sigue sola
  // ─────────────────────────────────────────
  function scaleHeroOut() {
    if (!heroWrap || heroScaledOut) return;

    heroScaledOut = true;
    stopHintCycle();

    if (scaleOutTween) {
      scaleOutTween.kill();
    }

    scaleOutTween = gsap.to(heroWrap, {
      scale: 0,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        heroWrap.style.position = 'relative';
        heroWrap.style.zIndex = '0';
        heroWrap.style.pointerEvents = 'none';
      }
    });
  }

  function scaleHeroIn() {
    if (!heroWrap) return;

    heroScaledOut = false;

    if (scaleOutTween) {
      scaleOutTween.kill();
    }

    heroWrap.style.position = 'sticky';
    heroWrap.style.zIndex = '2';
    heroWrap.style.pointerEvents = 'auto';

    gsap.to(heroWrap, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  if (heroWrap) {
    ScrollTrigger.create({
      trigger: '#hero-scroll-space',
      start: '75% top',

      onEnter: () => {
        if (!heroRevealPlayed) {
          playHeroReveal();
          setTimeout(scaleHeroOut, 800);
        } else {
          scaleHeroOut();
        }
      },

      onLeaveBack: () => {
        scaleHeroIn();

        if (heroRevealPlayed) {
          setHintPosition('left');
          startHintCycle();
        }
      }
    });
  }

  // ─────────────────────────────────────────
  // AL TERMINAR EL HERO — cede control a hint.js
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: '#hero-scroll-space',
    start: 'bottom bottom',

    onEnter: () => {
      stopHintCycle();

      if (hint) {
        hint.classList.remove('position-left');
        hint.classList.add('is-global');
      }

      if (window.HintGlobal) {
        window.HintGlobal.start();
      }
    },

    onLeaveBack: () => {
      if (window.HintGlobal) {
        window.HintGlobal.stop();
      }

      if (hint) {
        hint.classList.remove('is-global');
      }

      if (heroRevealPlayed && !heroScaledOut) {
        setHintPosition('left');
        startHintCycle();
      }
    }
  });

  // ─────────────────────────────────────────
  // LOGO HERO — desaparece al entrar en la siguiente sección
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: nextSectionSelector,
    start: 'top 90%',

    onEnter: () => {
      if (!logoHeroWrap) return;

      gsap.to(logoHeroWrap, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(logoHeroWrap, { display: 'none' });
        }
      });
    },

    onLeaveBack: () => {
      if (!logoHeroWrap) return;

      gsap.set(logoHeroWrap, { display: 'block' });

      gsap.to(logoHeroWrap, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out'
      });
    }
  });

  // ─────────────────────────────────────────
  // CTA HEADER
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: '#hero-scroll-space',
    start: 'bottom top',

    onEnter: () => {
      if (ctaHeader) ctaHeader.classList.add('visible');
    },

    onLeaveBack: () => {
      if (ctaHeader) ctaHeader.classList.remove('visible');
    }
  });

  // ─────────────────────────────────────────
  // SCROLL LISTENER — interrumpe flecha en fase hero
  // ─────────────────────────────────────────
  window.addEventListener('scroll', () => {
    if (!heroSpace || !hint) return;

    const spaceBottom = heroSpace.getBoundingClientRect().bottom;
    const phaseHeroActive = spaceBottom > window.innerHeight * 0.4;

    if (hintActive && phaseHeroActive && !heroScaledOut) {
      hint.classList.remove('visible');

      clearTimeout(hintCycle);
      clearTimeout(hideTimer);

      hintCycle = setTimeout(showHint, 2200);
    }
  }, { passive: true });

  // ─────────────────────────────────────────
  // PERSPECTIVE TILT EN EL VIDEO
  // ─────────────────────────────────────────
  const tiltWrap = document.querySelector('.hero-right');
  const tiltEl   = document.getElementById('hero-media-wrap');

  if (tiltWrap && tiltEl && !isMobile) {
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let tiltRaf = null;

    tiltWrap.addEventListener('mousemove', (e) => {
      const rect = tiltWrap.getBoundingClientRect();

      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      tx = -dy * 4;
      ty = dx * 4;

      if (!tiltRaf) tiltLoop();
    });

    tiltWrap.addEventListener('mouseleave', () => {
      tx = 0;
      ty = 0;

      if (!tiltRaf) tiltLoop();
    });

    function tiltLoop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;

      tiltEl.style.transform = `perspective(900px) rotateX(${cx}deg) rotateY(${cy}deg)`;

      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
        tiltRaf = requestAnimationFrame(tiltLoop);
      } else {
        tiltEl.style.transform = `perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg)`;
        tiltRaf = null;
      }
    }
  }

});

// ─────────────────────────────────────────
// HEADER — hide on scroll down, show on scroll up, auto-hide after 3s
// ─────────────────────────────────────────
let lastScrollY = window.scrollY;
let ticking = false;
let headerHideTimer = null;
const siteHeader = document.getElementById('site-header');

function scheduleHeaderHide() {
  if (!siteHeader) return;

  clearTimeout(headerHideTimer);

  headerHideTimer = setTimeout(() => {
    siteHeader.style.transform = 'translateY(-100%)';
  }, 3000);
}

window.addEventListener('scroll', () => {
  if (!siteHeader) return;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        siteHeader.style.transform = 'translateY(-100%)';
        clearTimeout(headerHideTimer);
      } else {
        siteHeader.style.transform = 'translateY(0)';
        scheduleHeaderHide();
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });

    ticking = true;
  }
}, { passive: true });