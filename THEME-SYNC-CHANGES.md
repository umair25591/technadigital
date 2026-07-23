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

## Applied to theme already

- Footer Services column (details logged in an earlier version of this file).

---

## How to use this file

Every time a fix is made to a static HTML page, add a bullet under "Pending"
describing: what changed, which HTML file(s), and which theme file(s)
(`page-*.php` / `footer.php` / `header.php` / etc.) will need the same fix.
When we do the batch theme sync, move finished items to "Applied to theme
already" and check them off.
