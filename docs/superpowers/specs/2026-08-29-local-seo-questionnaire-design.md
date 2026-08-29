# Republic HVAC — Local SEO + Questionnaire + Schema Improvements

Date: 2026-08-29

## Goal

Implement the P3 improvements the owner selected and the no-safe-data P1 wiring, without
inventing any business facts. The site remains in preview (noindex) mode until the owner
supplies real data — that behavior is preserved and respected throughout.

## Scope

### A. Interactive service questionnaire (new)
A multi-step, client-side questionnaire rendered on the homepage. Funnels a visitor to a
concise summary of their situation, then lets them submit the composed message to the
business.

Flow (adaptive, one screen at a time, progress indicator, Back/Next):
1. **Main concern** — Cooling / Heating / Maintenance / Commercial / Not sure yet
2. **Follow-up** (branching based on choice):
   - Cooling → Cooling symptom (Warm air, Weak airflow, Strange noises, Not turning on,
     Other)
   - Heating/Heat problems → Heating symptom (No heat, Uneven rooms, Short cycling,
     Other)
   - Maintenance → Recently inspected? (Yes / No / Not sure)
   - Commercial → Building type (Retail, Office, Restaurant, Warehouse, Other)
   - Not sure → open description textarea
3. **Contact info** — name, phone, email, ZIP/service area
4. **Review & submit** — full summary of answers + contact, editable via back, submit button

Behavior:
- Rendered as static markup in the build script; interactivity in a new module in `app.js`
  or inline (single screen toggled via JS with hidden state). Accessible: `fieldset`/
  `legend`, `aria-live` for progress/status, keyboard navigable, focus management on step
  change.
- Submit composes a readable plain-text message (all answers + contact + timestamp) and
  POSTs to the same `FORM_ENDPOINT` the contact form uses. On success show confirmation;
  on failure show a friendly error with phone/email fallback.
- **Preview mode:** when `FORM_ENDPOINT`/`business.formEndpoint` is empty, the submit shows
  the existing-style "preview mode" notice instead of inventing a fake recipient. No false
  claims, site stays noindex.

### B. LocalBusiness JSON-LD enrichment
Current schema (build.mjs lines 75-85) only emits a bare LocalBusiness. Enrich so it emits
only what is present (nothing fabricated):
- Add `@id`, `name`, `description`, optional `url`/`telephone`/`email` (as today).
- Add a `hasOfferCatalog` or separate `Service` graph entries for each enabled service
  (`services`) with `serviceType`, `areaServed` (City of College Station), and description.
- Add `faqPage` graph entry for the homepage FAQ Q&A (already exists in content).
- When values exist: `address` (from city/state/zip), `geo` (from lat/lng), `openingHours`
  (from hours), `sameAs`, `aggregateRating`. All gated — no invented data.
- Emit as a proper `@graph` with `@type` LocalBusiness plus `Service` and `FAQPage` nodes,
  all referencing a shared `@id`.

### C. Dedicated /service-area/ page (new)
- New page at `/service-area/` with richer, location-focused copy: primary location
  (College Station, TX), general service-area wording, a templated list of what to mention,
  and clear "can be added once the owner confirms exact cities/ZIPs" placeholders (not fake
  city names).
- Wire into: header nav, footer Company column, and sitemap (when configured). Ensure
  404/robots behaviors unchanged.
- Improve the homepage service-area section copy so it reads naturally while staying
  truthful (no invented cities).

### D. Contact form wiring (shared endpoint)
- Keep the existing endpoint-driven submit. Ensure the questionnaire and the standard
  contact form both derive `action` from the same `business.formEndpoint` so one real
  endpoint routes everything once provided. No invented endpoint; preview-mode fallback
  shown until set.

### E. Minor visual polish
- Consistent focus/hover states for quiz controls.
- Refine FAQ glyph and form spacing.
- Small hero-note and quiz container polish so the new quiz feels native to the design
  system.

## Constraints
- Dependency-free static build (Node `scripts/build.mjs`). No new packages.
- No fabricated business facts: phone is the only verified identifier; city/state are
  verified; everything else must remain gated/placeholder.
- Preview/noindex behavior stays until `SITE_URL`, `email`, and `FORM_ENDPOINT` are set.
- Reuse existing design tokens and component patterns (`service-card`, `area-box`,
  `button`, etc.); add minimal new CSS.

## Verification
- `npm run build` succeeds; 10 HTML pages (9 + service-area).
- Run local preview and interact with the questionnaire (all branches) and confirm
  preview-mode notice on submit without an endpoint.
- Inspect `index.html` + service pages for correct JSON-LD (`@graph` LocalBusiness/Service/
  FAQPage) that omits unset fields.
- Confirm noindex + blocking robots unchanged in preview mode.
