/* ==========================================================================
   SPEARPOINT ADVISORS — For Small Business Owners Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, process timeline line-draw, section-decor
   parallax, nav, testimonials slider) is already wired up and applies
   automatically to this page's matching classes/attributes.

   ========================================================================== */

/* --- Accordions — "What Makes Small Business Coaching Different at This
   Stage" and "What the $2M–$150M Stage Actually Requires" — same
   click-toggle + max-height-from-scrollHeight technique as
   home-services.js's/professional-services.js's accordion. Selector
   covers both .accordion-blocks instances on this page generically (like
   home-services.js's own `.accordion-blocks .accordion-block` scoping)
   rather than naming each container, so a third one needs no JS change.
   Each item is independent (no auto-close of siblings) and starts closed,
   since no .accordion-block carries is-open in the markup. --- */
(() => {
  const items = document.querySelectorAll('.accordion-blocks .accordion-block');

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-block__trigger');
    const content = item.querySelector('.accordion-block__content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '';
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
})();
