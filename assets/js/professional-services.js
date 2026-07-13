/* ==========================================================================
   SPEARPOINT ADVISORS — Professional Services Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, process timeline line-draw, section-decor
   parallax, nav, testimonials slider) is already wired up and applies
   automatically to this page's matching classes/attributes.

   "By Practice Type" accordion — same click-toggle + max-height-from-
   scrollHeight technique app.js already uses for the mobile nav's dropdown
   accordion, scoped here to .practice-blocks--accordion since the other
   .practice-block section on this page ("Hard to Value") stays
   always-visible. Each item is independent (no auto-close of siblings) —
   unlike the mobile nav, comparing multiple practice types side by side
   is a reasonable thing to want, so opening one shouldn't punish reading
   another.
   ========================================================================== */
(() => {
  const items = document.querySelectorAll('.practice-blocks--accordion .practice-block');

  items.forEach((item) => {
    const trigger = item.querySelector('.practice-block__trigger');
    const content = item.querySelector('.practice-block__content');
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
