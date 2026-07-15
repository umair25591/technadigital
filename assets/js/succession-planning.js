/* ==========================================================================
   SPEARPOINT ADVISORS — Succession Planning Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, process timeline line-draw, section-decor
   parallax, nav, testimonials slider) is already wired up and applies
   automatically to this page's matching classes/attributes.
   ========================================================================== */

(function initSuccessionAccordion() {
  'use strict';

  const accordion = document.querySelector('[data-ops-accordion]');
  if (!accordion) return;

  const items = accordion.querySelectorAll('[data-ops-item]');

  items.forEach((item) => {
    const trigger = item.querySelector('.ops-accordion__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      // Close all other panels
      items.forEach((other) => {
        other.classList.remove('is-active');
        const otherTrigger = other.querySelector('.ops-accordion__trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      // Toggle active state on current panel
      if (!isActive) {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
