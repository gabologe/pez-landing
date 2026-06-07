document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  const logoHero      = document.getElementById('logo-hero');
  const logoHeroWrap  = document.getElementById('logo-hero-wrap');
  const headerLogo    = document.getElementById('header-logo');
  const headerWrap    = document.querySelector('.header-logo-wrap');
  const lineH         = document.getElementById('header-line-h');
  const mediaWrap     = document.getElementById('hero-media-wrap');
  const line1         = document.querySelector('#line-1 .display-text');
  const line2         = document.querySelector('#line-2 .display-text');
  const line3         = document.querySelector('#line-3 .display-text');
  const ctaHero       = document.getElementById('cta-hero');
  const ctaHeroMobile = document.getElementById('cta-hero-mobile');
  const ctaHeader     = document.getElementById('cta-header');
  const hint          = document.getElementById('scroll-hint');
  const video         = document.getElementById('hero-video');
  const heroSpace     = document.getElementById('hero-scroll-space');
  const heroWrap      = document.getElementById('hero-sticky-wrap');

  const isMobile = window.innerWidth <= 767;

  // ─────────────────────────────────────────
  // FLECHA — solo fase hero
  // ─────────────────────────────────────────
  let hintCycle  = null;
  let hideTimer  = null;
  let hintActive = false;

  function setHintPosition(phase) {
    if (isMobile) return;
    if (phase === 'left') {
      hint.classList.add('position-left');
    } else {
      hint.classList.remove('position-left');
    }
  }

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
  // FASE 1 — Logo fade in + flecha centrada
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
        setHintPosition('center');
        startHintCycle();
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
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-scroll-space',
      start: 'top top',
      end: '60% top',
      scrub: true,
      onEnter: () => {
        stopHintCycle();
      },
      onLeaveBack: () => {
        setHintPosition('center');
        logoArrived = false;
        gsap.set(logoHeroWrap, { opacity: 1, display: 'block' });
        gsap.set(headerWrap,   { opacity: 0 });
        line2.classList.remove('green');
        line3.classList.remove('green');
        startHintCycle();
      },
      onUpdate: (self) => {
        const p = self.progress;

        if (p >= 0.95 && !logoArrived) {
          logoArrived = true;
          gsap.set(headerWrap, { opacity: 1 });
        } else if (p < 0.95 && logoArrived) {
          logoArrived = false;
          gsap.set(headerWrap, { opacity: 0 });
        }

        if (p >= 0.7) {
          setHintPosition('left');
          if (!hintActive) {
            hintActive = true;
            clearTimeout(hintCycle);
            clearTimeout(hideTimer);
            hintCycle = setTimeout(showHint, 1500);
          }
        } else {
          stopHintCycle();
          setHintPosition('center');
        }
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
// AL TERMINAR EL HERO — cede control a hint.js
// ─────────────────────────────────────────
ScrollTrigger.create({
  trigger: '#hero-scroll-space',
  start: 'bottom bottom',

  onEnter: () => {
    stopHintCycle();

    if (hint) {
      hint.classList.remove('position-left');
    }

    if (window.HintGlobal) {
      window.HintGlobal.start();
    }
  },

  onLeaveBack: () => {
    if (window.HintGlobal) {
      window.HintGlobal.stop();
    }

    setHintPosition('left');

    if (!hintActive) {
      hintActive = true;
      clearTimeout(hintCycle);
      clearTimeout(hideTimer);
      hintCycle = setTimeout(showHint, 1500);
    }
  }
});

  // ─────────────────────────────────────────
  // LOGO HERO — desaparece al entrar verdades
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: '#verdades',
    start: 'top 90%',
    onEnter: () => {
      gsap.to(logoHeroWrap, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(logoHeroWrap, { display: 'none' });
        }
      });
    },
    onLeaveBack: () => {
      gsap.set(logoHeroWrap, { display: 'block' });
      gsap.to(logoHeroWrap, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  });

  // ─────────────────────────────────────────
  // HERO SCALE DOWN
  // ─────────────────────────────────────────
  if (heroWrap) {
    gsap.to(heroWrap, {
      scale: 0.3,
      opacity: 0,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: '#verdades',
        start: 'top 90%',
        end: 'top 30%',
        scrub: 1.5,
        onLeave: () => {
          heroWrap.style.position = 'relative';
          heroWrap.style.zIndex = '0';
        },
        onEnterBack: () => {
          heroWrap.style.position = 'sticky';
          heroWrap.style.zIndex = '2';
        }
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
  // SCROLL LISTENER — interrumpe flecha en fase hero
  // ─────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const spaceBottom  = heroSpace.getBoundingClientRect().bottom;
    const phase2Active = spaceBottom > window.innerHeight * 0.4;

    if (hintActive && phase2Active) {
      hint.classList.remove('visible');
      clearTimeout(hintCycle);
      clearTimeout(hideTimer);
      hintCycle = setTimeout(showHint, 2000);
    }
  });

  // ─────────────────────────────────────────
  // PERSPECTIVE TILT en el video
  // ─────────────────────────────────────────
  const tiltWrap = document.querySelector('.hero-right');
  const tiltEl   = document.getElementById('hero-media-wrap');

  if (tiltWrap && tiltEl && !isMobile) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let tiltRaf = null;

    tiltWrap.addEventListener('mousemove', (e) => {
      const rect = tiltWrap.getBoundingClientRect();
      const dx   = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
      const dy   = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
      tx = -dy * 4;
      ty =  dx * 4;
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
  clearTimeout(headerHideTimer);
  headerHideTimer = setTimeout(() => {
    siteHeader.style.transform = 'translateY(-100%)';
  }, 3000);
}

window.addEventListener('scroll', () => {
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
});