/* ==========================================================================
   SPEARPOINT ADVISORS — Home Services Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, process timeline line-draw, section-decor
   parallax, nav, testimonials slider) is already wired up and applies
   automatically to this page's matching classes/attributes.

   "By Trade" accordion — same click-toggle + max-height-from-scrollHeight
   technique as professional-services.js's practice-type accordion and
   app.js's mobile nav dropdown. Each item is independent (no auto-close
   of siblings) so comparing multiple trades side by side stays possible.
   ========================================================================== */
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
