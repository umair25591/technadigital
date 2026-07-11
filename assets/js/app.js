/* ==========================================================================
   SPEARPOINT ADVISORS — Main Application Script
   ========================================================================== 
   Handles:
   1. Three.js subtle particle background
   2. GSAP scroll-triggered reveal animations
   3. Navigation (scroll state, mobile menu)
   4. Testimonials slider
   5. Trades tabbed content
   6. Animated stat counters
   7. Glow buttons
   8. Risk (5 D's) accordion

   Dependencies: Three.js (CDN), GSAP + ScrollTrigger (CDN)
   Ready for WordPress integration — all DOM queries use class selectors.
   ========================================================================== */


/* ==========================================================================
   1. THREE.JS — SUBTLE PARTICLE BACKGROUND
   ========================================================================== 
   Professional, slow-moving particle field using brand colors.
   Minimal opacity — never competes with content.
   ========================================================================== */
(function initThreeBackground() {
  'use strict';

  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  // --- Renderer setup ---
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,           // Transparent background
    antialias: false,      // Performance: particles don't need AA
    powerPreference: 'low-power' // Save battery
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // --- Scene & Camera ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 300;

  // --- Particle Geometry ---
  const PARTICLE_COUNT = 600;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  // Brand colors for particles (subtle variations)
  const brandColors = [
    new THREE.Color(0xE8530E),  // Vivid Orange
    new THREE.Color(0x2D7BF6),  // Bright Blue
    new THREE.Color(0x555555),  // Neutral gray
    new THREE.Color(0x333333),  // Dark gray
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Spread particles across a wide volume
    positions[i * 3]     = (Math.random() - 0.5) * 800;  // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 800;  // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400;  // z

    // Assign a random brand color with low saturation
    const color = brandColors[Math.floor(Math.random() * brandColors.length)];
    colors[i * 3]     = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Random particle sizes
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // --- Particle Material ---
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.25,        // Very subtle — key to professional feel
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // --- Soft ambient lines (abstract geometry complement) ---
  const lineCount = 8;
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xE8530E,
    transparent: true,
    opacity: 0.04
  });

  for (let i = 0; i < lineCount; i++) {
    const lineGeometry = new THREE.BufferGeometry();
    const linePoints = [];
    const startX = (Math.random() - 0.5) * 600;
    const startY = (Math.random() - 0.5) * 600;
    const startZ = (Math.random() - 0.5) * 200;

    for (let j = 0; j < 20; j++) {
      linePoints.push(
        startX + j * (Math.random() * 40 - 20),
        startY + j * (Math.random() * 40 - 20),
        startZ + j * (Math.random() * 20 - 10)
      );
    }

    lineGeometry.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array(linePoints), 3)
    );
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
  }

  // --- Mouse interaction (very subtle parallax) ---
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- Animation loop ---
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.001;

    // Slow rotation
    particles.rotation.y = time * 0.3;
    particles.rotation.x = time * 0.1;

    // Subtle mouse-follow parallax
    camera.position.x += (mouseX * 15 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 15 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // --- Responsive resize handler ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

})();


/* ==========================================================================
   1b. SCROLL-REACTIVE HERO DECORATIONS ENGINE
   ==========================================================================
   Drives all elements with data-scroll-speed / data-scroll-rotate attributes.
   Uses requestAnimationFrame + lerp for silky-smooth motion.

   How it works:
   - Each element's data-scroll-speed controls vertical parallax magnitude
   - data-scroll-rotate controls rotation magnitude per scroll pixel
   - Gradient orbs shift position based on scroll
   - Three.js scene (if present) adjusts camera Z and rotation speed
   ========================================================================== */
(function initScrollReactiveDecorations() {
  'use strict';

  const hero = document.querySelector('.hero');
  if (!hero) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Gather all scroll-reactive elements (not just the hero orbs — any
  // element on the page can opt in via data-scroll-speed)
  const scrollElements = document.querySelectorAll('[data-scroll-speed]');
  const threeCanvas = document.getElementById('three-canvas');

  // --- Lerp utility (linear interpolation for smooth motion) ---
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // --- State tracking for smooth interpolation ---
  const state = {
    currentScroll: 0,
    targetScroll: 0,
    lerpFactor: 0.08  // Lower = smoother but more lag; 0.08 is silky
  };

  // Store per-element transform state
  const elementStates = new Map();
  scrollElements.forEach((el) => {
    elementStates.set(el, {
      currentY: 0,
      targetY: 0,
      currentRotation: 0,
      targetRotation: 0
    });
  });

  // --- Update target scroll on scroll events ---
  window.addEventListener('scroll', () => {
    state.targetScroll = window.pageYOffset;
  }, { passive: true });

  // --- Animation loop using rAF ---
  function updateDecorations() {
    // Smooth the scroll value
    state.currentScroll = lerp(state.currentScroll, state.targetScroll, state.lerpFactor);

    // Normalized scroll (0 to 1) within the hero viewport
    const heroHeight = hero.offsetHeight || window.innerHeight;
    const scrollProgress = Math.min(state.currentScroll / heroHeight, 1.5);

    // --- Transform each scroll-reactive element ---
    scrollElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-scroll-speed')) || 0;
      const rotateSpeed = parseFloat(el.getAttribute('data-scroll-rotate')) || 0;
      const scale = parseFloat(el.getAttribute('data-scroll-scale')) || 1;

      const elState = elementStates.get(el);
      if (!elState) return;

      // Calculate targets relative to the element's own position in the
      // viewport (not absolute page scroll) so the effect stays bounded
      // no matter where on the page the element sits.
      const rect = el.getBoundingClientRect();
      const distanceFromCenter = (rect.top + rect.height / 2) - (window.innerHeight / 2);
      elState.targetY = distanceFromCenter * speed * -1;
      elState.targetRotation = state.currentScroll * rotateSpeed;

      // Lerp to smooth values
      elState.currentY = lerp(elState.currentY, elState.targetY, state.lerpFactor);
      elState.currentRotation = lerp(elState.currentRotation, elState.targetRotation, state.lerpFactor);

      // Apply transform (translate + rotate + optional static scale buffer)
      el.style.transform = `translateY(${elState.currentY}px) rotate(${elState.currentRotation}deg) scale(${scale})`;
    });

    // --- Fade the entire decor layer as user scrolls past hero ---
    const decorLayer = hero.querySelector('.hero-decor');
    if (decorLayer) {
      const fadeOpacity = Math.max(0, 1 - scrollProgress * 0.8);
      decorLayer.style.opacity = fadeOpacity;
    }

    requestAnimationFrame(updateDecorations);
  }

  // Kick off the animation loop
  requestAnimationFrame(updateDecorations);

})();


/* ==========================================================================
   2. GSAP SCROLL-TRIGGERED ANIMATIONS
   ========================================================================== 
   Reveals content on scroll with stagger and parallax effects.
   Uses GSAP ScrollTrigger for performance.
   ========================================================================== */
(function initScrollAnimations() {
  'use strict';

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Default reveal animation for all .reveal elements ---
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((el) => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- Staggered grid reveals (stat cards, service cards, etc.) ---
  // Pops in with a slight scale on top of the fade/slide for more presence.
  const staggerGrids = document.querySelectorAll('.reveal-stagger');
  staggerGrids.forEach((grid) => {
    const children = grid.children;
    gsap.fromTo(children,
      { y: 60, opacity: 0, scale: 0.92 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- Hero-specific animations (more dramatic entrance) ---
  const heroTimeline = gsap.timeline({
    defaults: { ease: 'power4.out' }
  });

  heroTimeline
    .fromTo('.hero__eyebrow',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, delay: 0.3 }
    )
    .fromTo('.hero__title',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      '-=0.4'
    )
    // Kinetic wipe, same node/timing as the fade above but a disjoint
    // property (clipPath vs. y/opacity) so the two tweens don't fight.
    // Collapses to a no-op when reduced motion is requested.
    .fromTo('.hero__title',
      { clipPath: prefersReducedMotion ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: prefersReducedMotion ? 0 : 0.9, ease: 'power4.out' },
      '<'
    )
    .fromTo('.hero__description',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      '-=0.4'
    )
    .fromTo('.hero__cta-group',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      '-=0.3'
    )
    .fromTo('.hero__trust',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.2'
    )
    .fromTo('.hero__trust-tag',
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.06 },
      '-=0.3'
    );

  // Section headers (.services-section__header etc.) already carry the
  // `.reveal` class, so the generic handler above animates them — a second,
  // near-identical ScrollTrigger tween here fought it and caused the
  // headers' entrance to stutter/restart mid-animation.

  // --- Process step reveal ---
  const processSteps = document.querySelectorAll('.process-step');
  processSteps.forEach((step, i) => {
    gsap.fromTo(step,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- Process timeline line-draw ---
  // Fills the orange progress bar over the static track as the three
  // Discover/Prepare/Decide gates scroll through view.
  const processProgress = document.querySelector('.process-grid__progress');
  if (processProgress) {
    gsap.to(processProgress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-grid',
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.5
      }
    });
  }

  // --- Section blush parallax drift ---
  // Extends the hero's orb parallax to the ambient glows on other sections —
  // orange and blue drift in opposite directions as their section scrolls.
  document.querySelectorAll('.section-decor').forEach((decor) => {
    const glows = decor.querySelectorAll('.section-decor__glow');
    if (!glows.length) return;
    gsap.to(glows, {
      yPercent: (i) => (i % 2 === 0 ? 16 : -16),
      ease: 'none',
      scrollTrigger: {
        trigger: decor.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  // --- Quote line-draw ---
  // Draws the orange accent bar downward as the risk-quote scrolls into
  // view, mirroring the process timeline fill above.
  const quoteBars = [
    { bar: '.risk-quote__bar', trigger: '.risk-quote blockquote' }
  ];
  quoteBars.forEach(({ bar, trigger }) => {
    const el = document.querySelector(bar);
    if (!el) return;
    gsap.to(el, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top 85%',
        end: 'bottom 65%',
        scrub: 0.6
      }
    });
  });

  // --- CTA finale: heading wipe reveal ---
  const ctaHeading = document.querySelector('.cta-section h2');
  if (ctaHeading) {
    gsap.fromTo(ctaHeading,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // --- Section heading kinetic wipes (same clipPath pattern as the CTA
  // heading above, extended to the major section headers) ---
  const headingWipes = [
    { heading: '.services-section__header h2', trigger: '.services-section__header' },
    { heading: '.process-section__header h2', trigger: '.process-section__header' },
    { heading: '.risk-section__header h2', trigger: '.risk-section__header' },
    { heading: '.founder-section__content h2', trigger: '.founder-section__content' },
    { heading: '.testimonials-section__header h2', trigger: '.testimonials-section__header' }
  ];
  headingWipes.forEach(({ heading, trigger }) => {
    const el = document.querySelector(heading);
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el, { clipPath: 'inset(0 0% 0 0)' });
      return;
    }

    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- Founder photo reveal ---
  // Only clipPath is animated here (never transform) — the scroll-parallax
  // engine (initScrollReactiveDecorations) already owns this element's
  // transform via its data-scroll-speed attribute, and the two must not
  // write to the same property.
  const founderImage = document.querySelector('.founder-section__image');
  if (founderImage) {
    if (prefersReducedMotion) {
      gsap.set(founderImage, { clipPath: 'inset(0 0 0% 0)' });
    } else {
      gsap.fromTo(founderImage,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.founder-section__image-wrap',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

})();


/* ==========================================================================
   2b. GLOW BUTTONS
   ==========================================================================
   Desktop/mouse only. Buttons show a cursor-tracked glow highlight (via
   --mx/--my custom properties consumed in CSS). No JS-side lerp loop — the
   button's own CSS transition (--transition-snap) smooths between
   mousemove-driven writes, since nothing else touches .btn's transform.
   ========================================================================== */
(function initButtonGlow() {
  'use strict';

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const buttons = document.querySelectorAll('.btn--primary, .btn--outline');

  buttons.forEach((btn) => {
    let pending = false;
    let lastEvent = null;

    // Cursor-tracked glow only — the button itself no longer shifts
    // toward the cursor (--tx/--ty magnetic pull removed).
    function applyGlow() {
      pending = false;
      if (!lastEvent) return;

      const rect = btn.getBoundingClientRect();
      const relX = lastEvent.clientX - rect.left;
      const relY = lastEvent.clientY - rect.top;

      btn.style.setProperty('--mx', `${(relX / rect.width) * 100}%`);
      btn.style.setProperty('--my', `${(relY / rect.height) * 100}%`);
    }

    btn.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (!pending) {
        pending = true;
        requestAnimationFrame(applyGlow);
      }
    });

    btn.addEventListener('mouseleave', () => {
      lastEvent = null;
      btn.style.setProperty('--mx', '50%');
      btn.style.setProperty('--my', '50%');
    });
  });

})();


/* ==========================================================================
   3. NAVIGATION — Scroll State & Mobile Menu
   ========================================================================== */
(function initNavigation() {
  'use strict';

  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  // --- Add scrolled state to nav ---
  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // --- Mobile menu toggle ---
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('is-open');

      if (isOpen) {
        mobileNav.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      } else {
        mobileNav.classList.add('is-open');
        mobileToggle.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active nav link tracking (IntersectionObserver) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu__link');

  const observerOptions = {
    rootMargin: '-20% 0px -80% 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

})();


/* ==========================================================================
   4. TESTIMONIALS SLIDER
   ========================================================================== 
   Simple, performant slider for testimonial cards.
   Uses CSS transforms for smooth sliding.
   ========================================================================== */
(function initTestimonialsSlider() {
  'use strict';

  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-btn--prev');
  const nextBtn = document.querySelector('.slider-btn--next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  const cardsPerView = 1;
  let maxIndex = 0;

  // --- Calculate slide bounds (one card per view at all viewport sizes) ---
  function calculateLayout() {
    maxIndex = Math.max(0, cards.length - cardsPerView);

    // Rebuild dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === currentIndex) dot.classList.add('is-active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }
  }

  // --- Slide to specific index ---
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateDots();
  }

  // --- Update active dot ---
  function updateDots() {
    const dots = dotsContainer?.querySelectorAll('.slider-dot');
    if (!dots) return;
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  // --- Event listeners ---
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }, { passive: true });

  // Initialize layout
  calculateLayout();
  window.addEventListener('resize', () => {
    calculateLayout();
    goToSlide(Math.min(currentIndex, maxIndex));
  });

})();


/* ==========================================================================
   5. TRADES TABBED CONTENT
   ========================================================================== */
(function initTradesTabs() {
  'use strict';

  const tabs = document.querySelectorAll('.trades-tab');
  const panels = document.querySelectorAll('.trade-panel');

  if (tabs.length === 0 || panels.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.getAttribute('data-tab');

      // Deactivate all
      tabs.forEach((t) => t.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-active'));

      // Activate clicked
      tab.classList.add('is-active');
      const panel = document.getElementById(targetPanel);
      if (panel) panel.classList.add('is-active');
    });
  });

})();


/* ==========================================================================
   6. ANIMATED STAT COUNTERS
   ========================================================================== 
   Counts up numbers when they scroll into view.
   Uses IntersectionObserver for performance.
   ========================================================================== */
(function initCounters() {
  'use strict';

  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-count');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        // Parse numeric value (handle 'B', 'M', etc.)
        const numericTarget = parseFloat(target);

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing: ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.floor(eased * numericTarget);

          el.textContent = prefix + currentValue + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            // Set final value with original formatting
            el.textContent = prefix + target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterObserver.observe(counter));

})();


/* ==========================================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================================== */
(function initSmoothScroll() {
  'use strict';

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();
