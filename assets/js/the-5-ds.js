/* ==========================================================================
   SPEARPOINT ADVISORS — The 5 D's Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, nav, testimonials slider) is already wired up and
   applies automatically to this page's matching classes/attributes.

   Accordion — drives the "One D at a Time" section. Same click-toggle +
   max-height-from-scrollHeight technique as marketing.js's/
   home-services.js's .accordion-blocks. Each item tracks its own
   open/closed state independently — no auto-close of siblings.

   Deep links — each item keeps its original #d-death style id, so if the
   page loads with one of those in the URL hash, that item opens
   automatically and scrolls into view instead of landing on a collapsed,
   empty-looking panel.
   ========================================================================== */
(() => {
  const items = document.querySelectorAll('.d-accordion .d-accordion__item');

  const open = (item, trigger, content) => {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  const close = (item, trigger, content) => {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '';
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.d-accordion__trigger');
    const content = item.querySelector('.d-accordion__content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      isOpen ? close(item, trigger, content) : open(item, trigger, content);
    });
  });

  if (location.hash) {
    const target = document.querySelector(`.d-accordion__item${location.hash}`);
    if (target) {
      const trigger = target.querySelector('.d-accordion__trigger');
      const content = target.querySelector('.d-accordion__content');
      if (trigger && content) {
        open(target, trigger, content);
        target.scrollIntoView({ block: 'start' });
      }
    }
  }
})();
