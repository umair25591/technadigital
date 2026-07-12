/* ==========================================================================
   SPEARPOINT ADVISORS — Operational Scaling Consulting Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, process timeline line-draw, section-decor
   parallax, nav, testimonials slider) is already wired up and applies
   automatically to this page's matching classes/attributes.

   Only page-specific interaction: the "What Business Operations Consulting
   Addresses at Every Level" accordion — ported from
   peer-advisory-groups.js's initDynamicsAccordion. Expansion itself is
   pure CSS (grid-template-rows transition on .ops-accordion__panel, see
   operational-scaling-consulting.css) — this just toggles the .is-active
   class and keeps aria-expanded in sync, and closes any other open item
   so only one is open at a time.
   ========================================================================== */

(function initOpsAccordion() {
  const accordion = document.querySelector('[data-ops-accordion]');
  if (!accordion) return;

  const items = accordion.querySelectorAll('[data-ops-item]');

  items.forEach((item) => {
    const trigger = item.querySelector('.ops-accordion__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      items.forEach((other) => {
        other.classList.remove('is-active');
        const otherTrigger = other.querySelector('.ops-accordion__trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
