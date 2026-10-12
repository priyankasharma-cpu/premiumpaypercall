# UI/UX enhancement delivery

Enhanced the existing React/Vite website. All original routes, sections, three business verticals, SEO metadata, approved contact wording, fields, schema, submission service, and Express API remain in place.

## Files and components

- `frontend/src/components/AnimatedIcon.jsx` — shared visibility-aware SVG animations and expanding call signal waves.
- `frontend/src/components/UI.jsx` — animated call CTAs, arrow links, staggered reveal timing, reduced-motion handling.
- `frontend/src/components/HeroHeadline.jsx` — staggered headline entrance using the original headline.
- `frontend/src/components/Layout.jsx` — responsive logo, centered desktop navigation, scroll-aware sticky header, animated mobile menu, Escape/Tab support, four-column footer, call CTAs, conditional social icons.
- `frontend/src/components/Illustrations.jsx` — floating people illustrations and visibility-aware call-scene animation.
- `frontend/src/pages/Home.jsx` — animated icons, staggered cards/process, headline enhancement, additional vertical partnership CTA.
- `frontend/src/pages/Pages.jsx` — animated vertical/404 icons; existing About, Verticals, Privacy and Terms content retained.
- `frontend/src/pages/Contact.jsx` — animated submit/success icons; validation and submission logic retained.
- `frontend/src/enhancements.css` — typography, gradient borders, layered shadows, 20–24px cards, responsive layouts, focus/tap interactions, touch animations, reduced-motion rules.
- `frontend/src/main.jsx` — loads the enhancement stylesheet.
- `frontend/src/data/brand.js` — official social profile configuration, empty until verified URLs are supplied.
- `frontend/public/brand/logo.svg`, `logo-compact.svg`, `logo-white.svg`, and `frontend/public/favicon.svg` — original scalable incoming-phone/P brand mark and wordmarks.
- `frontend/vite.config.js` — normalizes annotation tokens inside Zod prose documentation comments to avoid Rollup warnings; actual pure annotations remain intact.
- `frontend/responsive-qa.html` — local development QA page with an iframe for checking widths below the desktop browser's minimum native window size. It is not a production build entry point.

The original stylesheet remains available; the enhancement stylesheet provides a separate, maintainable presentation layer. No backend or shared validation files changed.

## Motion and interaction

Phone ringing and signal waves; house/headset float; shield scale; document reveal; check stroke drawing; scanning/search motion; communication pulse; arrow nudges; staggered card/heading entrances; connecting-line motion; hover lift/image zoom; tap feedback; animated mobile menu. Icons and the hero call scene pause when outside the viewport. Nonessential motion is disabled by `prefers-reduced-motion`.

## CTA and social behavior

Incoming-call partnership buttons link to `/contact`; the submit button continues to post the advertiser inquiry. There are no invented numbers or `tel:` links. No approved business phone number or official social URLs were supplied. Add verified HTTPS profiles to `frontend/src/data/brand.js` to display social links; empty values display nothing.

## Verification

- Production build passes without warnings after normalizing the dependency documentation comments.
- Existing backend tests pass: validation, invalid schemes, honeypot rejection, persistence, idempotency, changed-payload conflicts, and storage failures.
- All seven routes checked at nine target widths: 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920. Windows display scaling produced measured frame widths within 1px of the targets. No document horizontal overflow or out-of-bounds content was detected.
- Mobile menu opens, Escape closes it, and navigation closes it after route selection.
- Exact approved contact copy is retained. Required-field errors are displayed.
- A clearly labeled local test inquiry was successfully submitted and its accepted ID was verified in the backend's stored JSON record.
- Existing production CRM/hosting configuration remains the responsibility described in README.md; these checks verify the local application.

Run `npm run dev:backend` and `npm run dev` for development, `npm run build` for deployment files, and `npm test` for backend checks.
