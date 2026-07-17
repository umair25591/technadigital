/* ==========================================================================
   SPEARPOINT ADVISORS — Operational Scaling Consulting Page Script
   ==========================================================================
   Page-specific behavior only. Loaded after app.js, so the shared engine
   (Three.js background, GSAP scroll reveals incl. [data-heading-wipe] and
   .reveal/.reveal-stagger, process timeline line-draw, section-decor
   parallax, nav, testimonials slider) is already wired up and applies
   automatically to this page's matching classes/attributes.

   No page-specific interaction needed. The "What Business Operations
   Consulting Addresses at Every Level" tabs use the shared .trades-tab/
   .trade-panel component (same markup pattern as the homepage's trade
   tabs), so app.js's initTradesTabs already drives them.
   ========================================================================== */
