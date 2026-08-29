# Republic HVAC Services — Rebuild Package

This is a dependency-free static rebuild of the Republic HVAC website based on the live site's verified public service claims and the agreed conversion/SEO plan.

## Run locally

```bash
npm run build
npm run preview
```

Then open `http://127.0.0.1:4173`.

## Owner configuration

Edit `src/data/business.mjs` and replace only verified information:

- email / emailDisplay
- ZIP (if desired)
- additional verified service-area cities
- address, if publicly listed
- serviceAreas
- business hours
- emergency/licensed/insured verification flags
- Google Business Profile URL and verified rating/review count
- social URLs
- financing or maintenance links if real

Set `SITE_URL` at build time for the real production domain:

```bash
SITE_URL=https://your-real-domain.com npm run build
```

Set `FORM_ENDPOINT` to the real form handler when available:

```bash
FORM_ENDPOINT=https://your-form-endpoint.example SITE_URL=https://your-real-domain.com npm run build
```

## Indexing safety

The site intentionally renders `noindex,nofollow` and a blocking `robots.txt` until the core business details and production `SITE_URL` are configured. This prevents the placeholder build from being indexed accidentally. When the required data is configured, the build switches to `index,follow`, writes the production sitemap, and adds canonical URLs.

## Built pages

- `/`
- `/ac-repair/`
- `/ac-installation/`
- `/heating-repair/`
- `/furnace-repair/`
- `/heat-pumps/`
- `/hvac-maintenance/`
- `/commercial-hvac/`
- custom `404.html`

## Not fabricated

The rebuild now uses the owner-provided phone number `(832) 306-2015` and primary location `College Station, TX`, with the service area described as College Station and surrounding areas. It does not invent a physical address, additional service-area cities, reviews, ratings, licensing, insurance, emergency availability, years in business, financing, or guarantees. Those sections/claims activate only after verified owner data is supplied.
