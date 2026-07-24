# Theme Sync Changes

Tracks fixes made to the static HTML site that still need to be ported over to the
WordPress theme (`wp-content/themes/spearpoint/`) in one batch later.

Workflow: fix issues on the HTML files first, log them here, and apply them all to
the theme at once at the end — don't touch theme files in the meantime.

---

## Pending (not yet applied to theme)

- [x] Body-content "Value Acceleration" cards/links pointing to a non-existent
      `services/value-acceleration.html` page — not one of our 7 real services
      (Executive Coaching, Business Growth Consulting, Exit Planning, Business
      Valuation, Succession Planning, Operational Scaling Consulting, Peer
      Advisory Groups, per the navbar). Same icon (`fa-arrow-trend-up`) as the
      real "Business Growth Consulting" card on `index.html`, and same
      "build enterprise value" framing — clearly a stale duplicate from before
      that service page existed. Replaced every occurrence with a real Business
      Growth Consulting card/link (correct relative path per file) in:
      `services.html`, `about.html`, `how-it-works.html` (both the value-card
      grid and a "Services Most Active" credential-tag pill),
      `services/executive-coaching.html`, `industries/professional-services.html`,
      `industries/marketing.html`, `industries/manufacturing.html`,
      `industries/home-services.html`. Left the one legitimate use in
      `services/business-valuation.html` ("Value Acceleration Roadmap" — a
      deliverable name within that service's own process, not a link to a
      missing page). Also fixed the testimonials-section subhead in
      `about.html`, `services.html`, `how-it-works.html` — it said "HVAC,
      plumbing, electrical, landscaping, pest control" (sub-trades, not our
      actual industries) where `index.html`'s already-correct version says
      "Professional Services, Construction, Home Services, Manufacturing,
      Marketing" (the real navbar industries). Needs the same fixes ported to
      `page-about.php`, `page-services.php`, `page-how-it-works.php`,
      `page-executive-coaching.php`, and the industry templates.
      **Separately flagged, then fixed:** every page's navbar "Audience" and
      "Industries" trigger links (`href="audience.html"` /
      `href="industries.html"`, or `../audience.html` / `../industries.html`
      from nested pages) pointed to hub pages that don't exist anywhere in the
      site — only the dropdown sub-items (e.g. `audience/for-founders.html`)
      are real. Set both triggers to `href="javascript:void(0)"` sitewide (88
      occurrences across all 22 pages — 4 each: desktop nav trigger + mobile
      nav link, ×2 for Audience/Industries) so clicking the trigger text no
      longer 404s; the dropdown/submenu still opens via the existing
      hover/caret-button behavior in `app.js`. Needs the same `href` swap
      applied to `header.php` in the WordPress theme once it exists (or,
      better, build the two hub pages/templates if that's the intended fix
      long-term instead of a void link).
- [x] Navbar "About" dropdown: removed the "Testimonial" link (pointed to a
      non-existent `about/testimonials.html`) and replaced it with a "Why"
      link (`about/why.html`). Created `about/why.html` on the HTML side, along with
      its page-specific stylesheet `assets/css/why.css`. Need to port the "Why"
      page content and create the corresponding `page-why.php` template in the
      WordPress theme, and ensure navigation menu reflects the changes.
- [x] `about/why.html` was rewritten — first pass had real bugs, not just rough
      copy: (1) hero showed the internal script's literal title "GrowthScript /
      Mike Wolfgang / Spearpoint Advisors" as visitor-facing preheader text;
      (2) `.question-text`/`.warning-callout`/the "Here's why" stat line were
      all `color: var(--color-white)` on light section backgrounds — invisible
      text; (3) `.quote-block`/`.quote-block__mark` were used but never defined
      anywhere reachable from this page (only exists page-scoped in
      the-5-ds.css), so the pull-quote had no box/background at all; (4) the
      `.split-panel__visual-icon` had an inline override (`font-size: 8rem`,
      15%-opacity orange) that blew past the shared component's actual design
      (a 132px circle chip) into a giant near-invisible icon. Fixed all four in
      `assets/css/why.css` + `about/why.html`, replaced choppy script-fragment
      sentences with normal prose (same facts/story from why.docx, no content
      changes), and added a "5 Ds" icon row cross-linking to
      `about/the-5-ds.html` for visual richness/site cohesion. Needs the same
      fixes ported to `page-why.php` in the WordPress theme once that template
      exists.

- [x] Sitewide: the `mid-page-cta` pattern (a standalone `<section class="section
      mid-page-cta">` inserted every ~2 sections, holding just the "Schedule a
      Conversation" button) rendered as its own isolated floating strip — the
      `.section + .section::before` divider line applied above AND below it
      (since it sat between two `.section` siblings), plus its own
      `var(--space-24) 0` section padding, made the button look disconnected
      from the content above it instead of part of that section. Merged all 90
      occurrences across every page into the `.container` of the section
      directly above them (same `.reveal.center-cta` div and button markup,
      just no longer wrapped in its own `<section>`; added `margin-top:
      var(--space-12)` to keep the spacing). Removed the now-dead `.mid-page-cta`
      rule from `assets/css/style.css`. Touched: `index.html`, `about.html`,
      `how-it-works.html`, `services.html`, `about/the-5-ds.html`,
      `audience/for-ceos.html`, `audience/for-founders.html`,
      `audience/for-small-business-owners.html`, `industries/construction.html`,
      `industries/home-services.html`, `industries/manufacturing.html`,
      `industries/marketing.html`, `industries/professional-services.html`,
      `services/business-growth-consulting.html`,
      `services/business-valuation.html`, `services/executive-coaching.html`,
      `services/exit-planning.html`, `services/operational-scaling-consulting.html`,
      `services/peer-advisory-groups.html`, `services/succession-planning.html`.
      Needs the same merge applied to every corresponding `page-*.php` /
      `single-*.php` template in the WordPress theme once those exist.

- [x] Sitewide "our services" listings that used the flat `.drivers-list`
      component (icon circle + title/text/link in a plain row, no card
      boundary — matches the "before" screenshot the site owner flagged) read
      as visually weaker than the boxed `.value-card` grid already used for
      the same kind of services list elsewhere on the site (`industries/
      home-services.html`, `industries/construction.html`, `services.html`,
      `about.html`, etc. — the "after" screenshot). Converted the 3 remaining
      industry pages whose services section still used `.drivers-list` over
      to `.stats-grid.stats-grid--3col` + `.value-card` (same icon/title/
      text/link content, no copy changes): `industries/professional-services.html`,
      `industries/marketing.html`, `industries/manufacturing.html`. Left every
      other `.drivers-list` usage on the site alone — those are a different
      content type reusing the same component (the 8 drivers of value, the
      Discover/Prepare/Decide timeline, per-audience focus areas, and each
      industry page's own "where owners get blindsided" challenges list), not
      a listing of our actual services. Needs the same card conversion applied
      to `page-professional-services.php`, `page-marketing.php`,
      `page-manufacturing.php` once those theme templates exist.

- [x] Sitewide: hero sections showing two CTA buttons (a primary "Schedule
      a [Whatever] Consultation" + an outline "See How It Works"/"Learn
      More"/etc.) collapsed down to a single primary "Schedule a
      Conversation →" button per the site owner's flagged screenshot.
      Touched (18 hero sections): `services.html`, `about.html`,
      `how-it-works.html`, `about/the-5-ds.html`,
      `services/succession-planning.html`, `services/peer-advisory-groups.html`,
      `services/business-valuation.html`, `services/operational-scaling-consulting.html`,
      `services/business-growth-consulting.html`, `services/exit-planning.html`,
      `audience/for-small-business-owners.html`, `audience/for-founders.html`,
      `audience/for-ceos.html`, `industries/professional-services.html`,
      `industries/home-services.html`, `industries/manufacturing.html`,
      `industries/marketing.html`, `industries/construction.html`. Left alone
      (already single-button, or not actually a hero): `index.html`'s and
      `about/why.html`'s hero (both already single-button, different CTA
      text), and `services/executive-coaching.html`'s two-button CTA group at
      line 645 — that one lives in the body content
      (`.exit-strategy-grid__left`), not the hero. Needs the same button
      collapse applied to every corresponding `page-*.php` template in the
      WordPress theme once those exist.

- [x] `industries/professional-services.html` — "What Makes Professional
      Services Firms Hard to Value — and What Fixes It" section (3 items:
      The Personal Goodwill Problem, The Billable Hours Ceiling, The
      Concentration Risk) converted from always-visible stacked
      `.practice-block` divider sections into a click-to-switch tab layout,
      matching the tab style already used on the homepage's "By Industry"
      section. Reused the existing shared `.trades-tabs`/`.trade-panel`
      component (style.css + `initTradesTabs()` in app.js, already generic —
      no JS changes needed) rather than building a new tab component; each
      tab panel wraps the same `.practice-block` icon/heading/paragraph markup
      that was already there. Content is unchanged — same headings, same
      paragraphs, word for word — only the wrapping structure changed (stacked
      divider blocks → tab panels). Updated the stale comment in
      `assets/css/professional-services.css` (`.practice-blocks` rule) that
      said this section was "always-visible," since that's no longer true —
      only the "Coaching by Practice Type" accordion section still is. Needs
      the same tab conversion applied to `page-professional-services.php` in
      the WordPress theme once it exists.

- [x] Sitewide: the 5 Ds icon boxes (Death/Divorce/Disability/Disagreement/
      Disruption, `.risk-grid`/`.risk-item`) were `<a>` tags — most linking
      out to `https://spearpoint.technadigital.com/the-5-ds/` (a different,
      live production domain, not this site), `about/why.html`'s linking
      locally to `the-5-ds.html`. Site owner wants these non-clickable.
      Changed every `<a href="..." class="risk-item">...</a>` to
      `<div class="risk-item">...</div>` (same icon/title markup inside,
      same `.risk-item` styling/hover — just no navigation and no pointer
      cursor now). 80 occurrences across 16 files: `how-it-works.html`,
      `about/why.html`, `industries/construction.html`,
      `industries/manufacturing.html`, `industries/professional-services.html`,
      `industries/home-services.html`, `industries/marketing.html`,
      `audience/for-small-business-owners.html`, `audience/for-ceos.html`,
      `audience/for-founders.html`, `services/exit-planning.html` (2 separate
      grids on that page), `services/succession-planning.html`,
      `services/operational-scaling-consulting.html`,
      `services/peer-advisory-groups.html`, `services/business-valuation.html`,
      `services/business-growth-consulting.html`. `index.html`/`about.html`
      don't have this grid (checked — not applicable). Needs the same
      anchor→div swap applied to every corresponding `page-*.php` template in
      the WordPress theme once those exist.

- [x] Fallout from the earlier `mid-page-cta` merge (see above): on pages
      where a Discover/Prepare/Decide process section already ended in its
      own "See the Full Process →" primary button, merging the
      "Schedule a Conversation" mid-page-cta into that same section produced
      two solid-orange primary buttons stacked back to back — reads as two
      competing equal-weight CTAs instead of one clear action. Per the site
      owner's direction: "Schedule a Conversation" always stays the solid
      orange primary button; the other button in the pair becomes
      `btn--outline`. Changed "See the Full Process" to `btn--outline
      btn--large` (was `btn--primary btn--large`) and tightened the gap
      between the two buttons (`margin-top: var(--space-12)` →
      `var(--space-6)` on the second one) so they read as a deliberate
      primary/secondary pair rather than two disconnected blocks. Touched:
      `index.html`, `services/succession-planning.html`,
      `services/operational-scaling-consulting.html`,
      `services/business-growth-consulting.html`,
      `services/business-valuation.html`,
      `industries/professional-services.html`, `industries/construction.html`.
      Checked every other page with a "See the Full Process" button
      (`services.html`, `services/exit-planning.html`,
      `audience/for-small-business-owners.html`, `audience/for-ceos.html`,
      `audience/for-founders.html`, `industries/home-services.html`,
      `industries/manufacturing.html`, `industries/marketing.html`,
      `about/the-5-ds.html`) — none of those have a second button directly
      after it in the same section, so left untouched. Needs the same
      outline swap applied to the corresponding `page-*.php` templates in the
      WordPress theme once those exist.
      Same fix, flagged separately by the site owner: `audience/for-founders.html`
      also had "If That's You, You're in the Right Place" stacked as a second
      solid-orange primary button right above the merged "Schedule a
      Conversation" button (in `#this-is-for-you`, right after the reality
      table/quote). Changed it to `btn--outline btn--large` and tightened the
      gap the same way.

- [x] `audience/for-founders.html` — removed the "Peer accountability — CFO
      Circles" card from the "Founder Coaching & Advisory Services" drivers-list
      grid (`#founder-coaching-services`), per site owner's direction. No
      heading/count reference needed updating (the intro copy says "typically
      covers:" with no number). Needs the same card removed from
      `page-for-founders.php` in the WordPress theme once it exists.

- [x] `audience/for-founders.html` — "What You Want vs. What You Need"
      section (`#this-is-for-you`) converted from a two-column div grid
      (`.reality-check`/`.reality-check__item`) into a real `<table>`
      (`.reality-table`), per site owner's request. Confirmed via
      clarifying question: header row reads "What You Want" | "What You
      Need" (both columns get headers); the bolded intro line on each side
      stays as one row (it reads as two sentences but wasn't split into two
      rows); the "On Paper"/"In Reality" label + paragraph is the second
      row. Content unchanged — same text, word for word. Replaced
      `.reality-check`/`.reality-check__item`/`.reality-check__label`/
      `.reality-check__intro` CSS in `assets/css/for-founders.css` with
      `.reality-table`/`.reality-table__label`/`.reality-table__intro` (incl.
      a mobile breakpoint that forces the table elements to `display: block`
      so it stacks instead of squeezing side by side). Needs the same table
      conversion applied to `page-for-founders.php` in the WordPress theme
      once it exists.

- [x] Sitewide: replaced the generic gradient-tile + icon-chip
      `.split-panel__visual` placeholder (style.css's own comment calls it
      "the generic dot-grid + icon placeholder") with a real photo from
      `assets/images/images-for-sections/` on every page that had one — 16
      occurrences across 16 pages (one placeholder per page, so no
      same-page-repeat risk): `services.html`, `how-it-works.html`,
      `about/why.html`, `about/the-5-ds.html`,
      `services/business-valuation.html`, `services/executive-coaching.html`,
      `services/peer-advisory-groups.html`,
      `services/business-growth-consulting.html`,
      `industries/construction.html`, `industries/home-services.html`,
      `industries/professional-services.html`, `industries/manufacturing.html`,
      `industries/marketing.html`, `audience/for-ceos.html`,
      `audience/for-small-business-owners.html`, `audience/for-founders.html`.
      Used the existing `.split-panel__visual--photo` variant (already
      defined in style.css, already used once on `index.html`) — added that
      class alongside `.split-panel__visual` and swapped the icon `<span>`
      for an `<img>`. All 12 images in the folder got used at least once;
      4 pages repeat one (spread out — never two industries pages or two
      audience pages share the same image, and never adjacent in the
      services/about group either). Left alone: About page's 4 story-chapter
      images (`assets/images/founder-2.jpeg` etc.) — those are a different,
      unrelated placeholder (real bio photos standing in for real bio
      photos, marked "swap with a real Chapter N photo" in the HTML
      comments), not the generic gradient/icon placeholder from the
      screenshot. Needs the same photo swap applied to every corresponding
      `page-*.php` template in the WordPress theme once those exist, and the
      `images-for-sections` folder copied into the theme's assets.

- [x] Sitewide: removed the merged "Schedule a Conversation" `.reveal.center-cta`
      button wherever it sat as the very last thing in the section
      immediately before the page's own Final CTA section — right below it
      was another, near-identical "Schedule a Conversation" button in the
      Final CTA itself, so it read as two CTAs stacked back to back.
      Confirmed per-file (right before `<section class="section cta-section">`)
      rather than trusting a single sitewide regex — a bulk `perl -0777`
      pass silently matched 0 files despite reporting success (the pattern
      was correct in isolation but failed against the full multi-KB file,
      most likely backtracking-related), so this was done as verified,
      individual edits instead. Removed from: `audience/for-ceos.html`,
      `audience/for-small-business-owners.html`, `how-it-works.html`,
      `industries/home-services.html`, `industries/manufacturing.html`,
      `industries/marketing.html`, `services/executive-coaching.html`,
      `services/exit-planning.html`, `services/peer-advisory-groups.html`,
      `services.html`. Checked the other 10 pages with a Final CTA
      (`about/the-5-ds.html`, `about.html`, `audience/for-founders.html`,
      `index.html`, `industries/construction.html`,
      `industries/professional-services.html`,
      `services/business-growth-consulting.html`,
      `services/business-valuation.html`,
      `services/operational-scaling-consulting.html`,
      `services/succession-planning.html`) — those already end their prior
      section with something else ("Read Mike's Full Story," a stats/quote
      block, etc.), not a duplicate Schedule-a-Conversation button, so
      nothing needed removing there. Needs the same removal applied to the
      corresponding `page-*.php` templates in the WordPress theme once those
      exist.

- [x] Trust logos section (`index.html`, `about.html`) — 10 new partner/client
      logos were added to `assets/images/logos/` (`logo-5.jpeg` through
      `logo-14.jpeg`: 3Q Digital, CGS ORIS, Choice Healthy Kitchen + Juice
      Bar, Corporate Color Printing, HR On-Call, Maui Plumbing, Moxie, Out
      West Buildings, Securian Financial, Thomson Reuters), bringing the
      total to 14 alongside the original 4 (EOS, EPI, CEPA, USMC). Static
      wrapped `.trust-logos__row` (flex-wrap grid) replaced with a
      continuously scrolling marquee: `.trust-logos__marquee` (masked-edge
      viewport, `overflow: hidden`) > `.trust-logos__track` (flex row,
      `animation: trust-logos-scroll` translateX 0 → -50%) > one authored
      `.trust-logos__group` holding all 14 logos. `initLogoMarquee()` in
      `app.js` clones that group and appends it (`aria-hidden="true"`)
      inside the track so the loop is seamless — CSS/JS changes are shared
      (`assets/css/style.css`, `assets/js/app.js`), so both pages picked up
      the marquee with no per-page CSS/JS needed. Pauses on hover
      (`.trust-logos__marquee:hover .trust-logos__track`); respects
      `prefers-reduced-motion` (JS skips the clone, CSS drops the animation
      and makes the strip horizontally scrollable instead of looping).
      Responsive: track animation duration and item/gap sizing both step
      down at the existing 768px breakpoint (26s duration, 64px logos,
      tighter gap) same as the old mobile rule. Needs the same 10 new logo
      assets copied into the theme and the row→marquee markup/CSS/JS ported
      to `page.php`/`page-about.php` (or wherever the theme's trust-logos
      section lives) once that template work happens.

- [x] `about/why.html` — "I Help Owners Make the Best-Possible Exit Scenario
      Happen" section's 4 `.example-card` items (`.examples-grid`) were
      wrapping 2-per-row on desktop; site owner wants all 4 in a single row,
      matching a reference screenshot of a similar 4-across card row.
      Changed `.examples-grid` in `assets/css/why.css` from
      `grid-template-columns: repeat(2, 1fr)` to `repeat(4, 1fr)`, and
      adjusted the responsive breakpoints so it steps down gracefully
      instead of jumping straight to 1 column: 2-per-row at ≤992px
      (new rule), 1-per-row at ≤576px (was the ≤992px behavior). No HTML
      changes, no content changes. Needs the same `.examples-grid` column
      change ported to `page-why.php`'s stylesheet in the WordPress theme
      once that template exists.
      **Follow-up, same section:** reference screenshot's cards are plain
      (no accent bar), but `.example-card` still had its orange left-edge
      `::before` gradient bar from before this change. Removed that
      `::before` rule entirely from `assets/css/why.css` so the cards match
      the reference exactly — flat white card, icon chip, heading, text,
      no side border. Needs the same removal ported to the theme once
      `page-why.php` exists.

- [x] `about/why.html` — site owner wants the whole page to be simple text
      (no card grids, icon chips, photos, gradient boxes, or decorative
      orbs/glows), matching `why.docx` (Mike's original script) exactly —
      **except** the "I Help Owners Make the Best-Possible Exit Scenario
      Happen" examples section (`#examples`: eyebrow/heading/intro,
      `.examples-grid` of 4 `.example-card`s, `.callout-banner`), which the
      site owner explicitly said to leave exactly as currently designed —
      that section was left byte-for-byte untouched. Re-read `why.docx`
      (unzipped `word/document.xml`) run-by-run to confirm exactly which
      phrases are bold/underlined vs. plain before touching anything, since
      the docx has no Heading styles at all (Normal paragraphs only, with
      bold/underline/italic run overrides) — bold/underline in the new copy
      matches the docx's actual `<w:b/>`/`<w:u/>` runs verbatim, nothing
      added or dropped (e.g. only "Here's why:" is bold in that paragraph,
      not the two lines after it; only the word "and" is bold+underlined in
      the "Want to know what your business is actually worth" line; etc.).
      Rewrote every other section (`#why-hero`, `#why-exit`,
      `#play-your-hand`, `#mike-story`, `#blindsided`, `#reasons`,
      `#assessment-offer`) to plain `<p>`/`<strong>`/`<u>`/`<ul><li>` inside
      a shared `.why-simple` prose wrapper (new class in `assets/css/
      why.css`, replacing the page's old card/grid/photo components).
      Dropped: the invented eyebrow labels and paraphrased marketing
      headlines that weren't in the docx (e.g. "Here's Where Most Owners
      Get Blindsided," "Why Your Company's Value Is Lower Than You Think")
      in favor of the docx's own wording reformatted as plain paragraphs;
      the 5 Ds icon grid (now one plain sentence: "death, divorce,
      disability, disagreement, disruption"); the split-panel pull-quote +
      stock photo; the founder photo + credential-tag pills (kept the two
      story paragraphs, dropped the visual); the gradient "offer box" card
      with icon-feature pairs (now three plain paragraphs); the `section--
      charcoal` alternating background (page is now one consistent
      background); the hero's decorative orbs and the final-CTA section's
      glow decor. Also dropped the "Start with a Free Assessment" hero
      button, the "See How Each Force Plays Out" 5-Ds cross-link button,
      and the "Read Mike's Full Story" about.html link — none are in the
      docx script, and each target page is still reachable from the main
      nav, so only the single final "Schedule a Conversation" button
      remains (matches the docx's own closing line, "Let's hop on a call,"
      and every other page's final-CTA pattern). Trimmed `assets/css/
      why.css` down to: `.why-hero` (top padding under the fixed nav),
      the new `.why-simple` prose rules, and the untouched `.examples-grid
      /.example-card/.callout-banner/.cta-section` rules the kept section
      still needs — removed every now-orphaned rule (`.why-hero__content`,
      `.why-exit__stat/__lede`, `.five-ds-cta`, `.question-text/.answer-
      text/.warning-callout`, `.quote-block*`, `.highlight-text`,
      `.reasons-list/.reason-item*`, `.offer-box` and its children,
      `.story-p`). Confirmed the shared components this page used to
      reference (`.risk-grid`, `.split-panel__grid`, `.founder-section__
      grid`, `.hero-decor`) are untouched in `style.css` and still used by
      21 other pages, so nothing else on the site was affected. Needs the
      same plain-text rewrite applied to `page-why.php` in the WordPress
      theme once that template exists.

- [x] `about/why.html` follow-up refinements to the plain-text sections
      added above: (1) removed `<u>` from every bold+underlined line in the
      plain-text sections (kept `<strong>` only) — 5 occurrences across
      `#why-hero`, `#play-your-hand`, `#blindsided`, `#assessment-offer`
      (×2). Left the one remaining `<u>` alone: the callout-banner inside
      the untouched `#examples` section, since that section keeps its
      original design as-is. (2) Removed the sitewide `.section + .section
      ::before` divider line between this page's sections so it reads as
      one continuous page instead of stacked blocks — scoped to `#main-
      content .section + .section::before { display: none; }` in
      `assets/css/why.css` (only loads on this page) rather than touching
      the shared rule in `style.css`, which every other page still uses.
      (3) Left-aligned text to match the docx: added `text-align: left` to
      `.why-simple` (was already left by default with no override, but made
      explicit) and to `.cta-section h2`/`.cta-section p` for this page
      only (both selectors live in why.css, so no other page's centered
      final-CTA is affected) — the "Schedule a Conversation" button stays
      centered (`.cta-section__buttons` flex `justify-content: center`),
      since that's a functional CTA, not body text. `#examples`'s own
      centered header/callout-banner left untouched per the "keep as
      designed" instruction. Needs the same 3 fixes ported to `page-why.php`
      in the WordPress theme once that template exists.

- [x] `about/why.html` — site owner caught that the final-CTA's opening
      line ("An exit is never just money, multipliers, or math. / It's the
      plan for your employees, your family, and the life you want after.")
      was still an `<h2>`, but the docx (`why.docx` P24) has it as a plain
      paragraph — no bold, no heading style, same as the paragraph right
      after it ("All of that goes into exit planning..."). Changed it from
      `<h2>` to `<p>` so both lines render as equal plain paragraphs,
      matching the docx. Removed the now-dead `.cta-section h2` rule from
      `assets/css/why.css` (only that page-scoped selector — style.css's
      shared `.cta-section h2` is untouched and still used by every other
      page's final CTA); `.cta-section p`'s existing 900px max-width
      override now applies to both paragraphs in this section. Needs the
      same `<h2>`→`<p>` fix ported to `page-why.php` in the WordPress
      theme once that template exists.

- [x] `about/why.html` — widened the plain-text sections and made every
      section's width consistent. `.why-simple` (hero, why-exit, play-your-
      hand, mike-story, blindsided, reasons, assessment-offer) was 760px;
      `.cta-section p` (final CTA) was 900px; the untouched `#examples`
      section's own header uses the shared `.about-section__header` at
      1040px. Set both `.why-simple` and this page's `.cta-section p`
      override to 1040px in `assets/css/why.css` to match that existing
      width, so every section on the page now lines up at the same column
      width instead of each being a different size. Needs the same 1040px
      width applied to `page-why.php`'s stylesheet in the WordPress theme
      once that template exists.

- [x] `about/why.html` — the shared `.section` padding (`var(--space-24)`,
      96px top+bottom) meant ~192px of empty space between every section
      on this page, which read as far too much gap for what's meant to be
      one continuous document (matching `why.docx`), not a stack of
      separated blocks. Added `#main-content .section { padding:
      var(--space-8) 0; }` (32px) to `assets/css/why.css`, scoped so only
      this page is affected — every other page keeps the full 96px
      `.section` padding. The hero still needs extra top clearance under
      the fixed nav, so that's a separate higher-specificity override
      (`#main-content .section.why-hero { padding-top: calc(var(--nav-
      height) + var(--space-8)); }`) rather than the old flat `.why-hero`
      rule, which otherwise would have lost to the new general rule's
      specificity. Applies uniformly to every section including the
      untouched `#examples` block (tighter outer spacing only — its
      internal card design/content is unchanged). Needs the same tighter
      section padding applied to `page-why.php` in the WordPress theme
      once that template exists.

- [x] `about/why.html` — site owner asked to add a "Schedule a
      Conversation" CTA button (same markup as the page's existing final
      CTA: `.reveal.center-cta` wrapper, `.btn.btn--primary.btn--large`
      linking to `../contact.html`) right after three specific lines: (1)
      "Don't feel ready? Then today is exactly the right time to start."
      in `#why-hero`, (2) "Don't be 1 in 2." in `#play-your-hand`, (3) the
      callout-banner text in the untouched `#examples` section ("Today is
      the best time to start that exit plan and work towards it.
      Especially if you don't feel ready.") — this is the one exception to
      that section's "leave completely as-is" rule from earlier, since the
      site owner explicitly asked for it here. Each button sits in its own
      `margin-top: var(--space-6)` wrapper right after the paragraph it
      follows. Needs the same 3 buttons added to `page-why.php` in the
      WordPress theme once that template exists.

- [x] `about/why.html` follow-up on the 3 new CTA buttons above: removed
      the one after "Don't be 1 in 2." (`#play-your-hand`) entirely per
      site owner's direction. Left-aligned the one after "Don't feel ready?
      Then today is exactly the right time to start." (`#why-hero`) by
      dropping its `center-cta` class — the wrapper div now just inherits
      `.why-simple`'s `text-align: left`, so the button sits at the left
      edge like the surrounding text instead of centered. The third button
      (Examples section callout-banner) is unchanged. Needs the same 2
      fixes ported to `page-why.php` in the WordPress theme once that
      template exists.

- [x] `about/why.html` — re-added the "Schedule a Conversation" CTA button
      after "Don't be 1 in 2." (`#play-your-hand`), reversing the removal
      logged directly above. Same markup/pattern as the `#why-hero` button:
      `.reveal` wrapper (no `center-cta`) so it inherits `.why-simple`'s
      left alignment, `.btn.btn--primary.btn--large` linking to
      `../contact.html`. Needs the same button added to `page-why.php` in
      the WordPress theme once that template exists.

- [x] `about/why.html` — added a photo of Mike to the right side of
      `#why-hero`. Wrapped the existing hero text in the shared
      `.split-panel__grid` > `.split-panel__content`/`.split-panel__visual`
      component (same one already used for real photos on 16 other pages,
      per an earlier entry above) rather than building new one-off CSS —
      text stays as `.split-panel__content.why-simple` on the left, photo
      sits in `.split-panel__visual.split-panel__visual--photo` (the photo
      variant, so no gradient/icon placeholder shows) on the right using
      `assets/images/founder.jpg` (the same real bio photo already used in
      `index.html`'s hero). No new CSS needed — `.split-panel__grid`
      already collapses to a single stacked column on mobile/tablet. Needs
      the same two-column hero markup ported to `page-why.php` in the
      WordPress theme once that template exists.
      **Follow-up:** site owner flagged (via screenshot) that the hero was
      visibly wider than every other section — `.split-panel__grid` has no
      max-width of its own, so it filled the full `.container` (wider than
      1040px) while every other section is capped at 1040px via
      `.why-simple`. Added `.why-hero .split-panel__grid { max-width:
      1040px; margin: 0 auto; }` in `assets/css/why.css` so the hero now
      lines up at the same width as the rest of the page. Needs the same
      width cap ported to `page-why.php` in the WordPress theme once that
      template exists.

- [x] `about/why.html` — the "reasons" section's 3 `<li>` items (main
      salesperson / client concentration / no leadership team) were
      already markup as a real `<ul><li>` list, but rendered with no
      visible bullet marker — the sitewide reset in `assets/css/style.css`
      (`ul, ol { list-style: none; }`) killed it. Added `list-style: disc`
      on `.why-simple ul` and `display: list-item` on `.why-simple ul li`
      in `assets/css/why.css`, scoped to this page only. Needs the same
      bullet-restore ported to `page-why.php` in the WordPress theme once
      that template exists.
      **Follow-up:** site owner asked for more width overall. Widened all
      3 of this page's width caps together (still kept in sync so nothing
      goes back out of alignment): `.why-hero .split-panel__grid`,
      `.why-simple`, and `.cta-section p` all went from 1040px → 1200px in
      `assets/css/why.css`. Needs the same 1200px width ported to
      `page-why.php` in the WordPress theme once that template exists.

- [x] Sitewide (`index.html`, `about.html`) — trust-logos section heading
      replaced. Was "2,500+ Awesome Company Growing With Us" (with an
      animated `[data-count]` counter on the "2,500+" — the shared
      `initCounters()` in `app.js` queries all `[data-count]` elements
      globally, so removing this one doesn't affect any other counter on
      the site), now plain text "Trusted by Business Owners and Certified
      Excellence" per site owner's direction — no number in the new copy,
      so the counter span was dropped entirely. Kept the same
      `.text-accent` orange-highlight pattern the old copy used (was on
      "Growing", now on "Certified Excellence") for visual consistency.
      Needs the same heading swap applied to `page.php`/`page-about.php`
      (or wherever the theme's trust-logos section lives) once that
      template work happens.

- [x] Sitewide: added a small "Don't be 1 of 2" hint line directly above
      every "Schedule a Conversation" CTA button, per site owner's
      direction — except each page's own bottom/final CTA section (the
      one wrapped in `.cta-section__buttons`), which was explicitly
      excluded. New shared `.cta-hint` class in `assets/css/style.css`
      (orange, small, semibold — inherits text-align from whichever
      wrapper it's in, so it centers under `.center-cta` buttons and
      stays left-aligned under hero/left-aligned ones). 100 insertions
      across 21 pages: `index.html`, `about.html`, `about/why.html`,
      `about/the-5-ds.html`, `how-it-works.html`, `services.html`, all 7
      `services/*.html`, all 5 `industries/*.html`, all 3
      `audience/*.html`. Left untouched: any button whose text isn't
      literally "Schedule a Conversation" (`index.html`'s hero "Start
      with a Free Business Assessment", `services/executive-coaching.html`'s
      hero "Schedule a Coaching Conversation", `services/peer-advisory-
      groups.html`'s final "Apply for CFO Circles") — none of those are
      the button referred to. Needs the same `.cta-hint` insertions
      applied to every corresponding `page-*.php` template in the
      WordPress theme once those exist.
      **Follow-up:** site owner flagged the hint wasn't actually following
      the button's alignment (centered under center-cta buttons, left
      under hero ones). Root cause: the sitewide `p { max-width: 65ch }`
      rule capped `.cta-hint`'s own box narrower than its container with
      no `margin: auto`, so the box stayed pinned to the left edge
      regardless of `text-align` (text-align only centers the text inside
      a box, not the box itself). Added `max-width: none` to `.cta-hint`
      to fix it. Also bumped it up per request: `var(--fs-sm)` →
      `var(--fs-md)` (bigger), `var(--fw-semibold)` → `var(--fw-bold)`,
      and `var(--color-orange)` → `var(--color-text)` (black, matches
      heading color). All in `assets/css/style.css`. Needs the same
      `.cta-hint` fix ported to the theme once the templates from the
      entry above exist.

## Applied to theme already

- Footer Services column (details logged in an earlier version of this file).

---

## How to use this file

Every time a fix is made to a static HTML page, add a bullet under "Pending"
describing: what changed, which HTML file(s), and which theme file(s)
(`page-*.php` / `footer.php` / `header.php` / etc.) will need the same fix.
When we do the batch theme sync, move finished items to "Applied to theme
already" and check them off.
