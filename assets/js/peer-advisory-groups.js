/* ==========================================================================
   SPEARPOINT ADVISORS — Peer Advisory Groups (CFO Circles) Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, section-decor parallax, nav, testimonials
   slider) is already wired up and applies automatically to this page's
   matching classes/attributes.

   Only page-specific interaction: the "Six Dynamics" accordion. Expansion
   itself is pure CSS (grid-template-rows transition on .dynamics-accordion__panel,
   see peer-advisory-groups.css) — this just toggles the .is-active class
   and keeps aria-expanded in sync, and closes any other open item so only
   one is open at a time.
   ========================================================================== */

(function initDynamicsAccordion() {
  const accordion = document.querySelector('[data-dynamics-accordion]');
  if (!accordion) return;

  const items = accordion.querySelectorAll('[data-dynamics-item]');

  items.forEach((item) => {
    const trigger = item.querySelector('.dynamics-accordion__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      items.forEach((other) => {
        other.classList.remove('is-active');
        const otherTrigger = other.querySelector('.dynamics-accordion__trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
