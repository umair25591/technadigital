/* ==========================================================================
   SPEARPOINT ADVISORS — Marketing Agency Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, process timeline line-draw, section-decor
   parallax, nav, testimonials slider) is already wired up and applies
   automatically to this page's matching classes/attributes.

   Accordion — drives BOTH accordion groups on this page ("The Metrics
   That Actually Drive Marketing Agency Value" and "Building the
   Organizational Infrastructure That Sets Agency Founders Free"). Same
   click-toggle + max-height-from-scrollHeight technique as
   professional-services.js/home-services.js. Each item tracks its own
   open/closed state independently — no auto-close of siblings, and the
   two groups don't interact with each other.
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
