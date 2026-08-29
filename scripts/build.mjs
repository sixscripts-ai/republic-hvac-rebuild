import { mkdir, rm, readFile, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { business } from '../src/data/business.mjs';
import { services } from '../src/data/services.mjs';

const root = path.resolve('.');
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const css = await readFile(path.join(root, 'src/styles.css'), 'utf8');
const js = await readFile(path.join(root, 'src/app.js'), 'utf8');
await writeFile(path.join(out, 'styles.css'), css);
await writeFile(path.join(out, 'app.js'), js);

const esc = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[ch]));
const has = (value) => Boolean(value && !String(value).includes('['));
const configured = has(business.siteUrl) && has(business.phone) && has(business.email) && has(business.city) && has(business.state);
const locationLabel = `${business.city}, ${business.state}`;
const serviceAreaLabel = business.serviceAreaLabel || `${locationLabel} and surrounding areas`;
const pageUrl = (pathname) => has(business.siteUrl) ? `${business.siteUrl.replace(/\/$/, '')}${pathname === '/' ? '' : pathname}` : '';

const icons = {
  flame: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.5 2.5c.3 3-1.4 4.3-2.8 5.8-1.2 1.2-2.2 2.5-1.8 4.7.6-1.4 1.6-2.1 2.8-2.8-.2 2.2 1 3.7 2.4 4.6 1.8 1.2 4.1.4 5.5-1.2 1.7-2 2-5.9-1.8-9.9.1 2-1 3.1-1.7 3.8.3-3.4-1.2-5.8-3.3-7.8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v20M4.2 6.5l15.6 11M19.8 6.5l-15.6 11M8.8 4 12 6l3.2-2M8.8 20 12 18l3.2 2M4.7 10.4l.3-3.8 3.6-1.2M19.3 13.6l-.3 3.8-3.6 1.2M19.3 10.4l-.3-3.8-3.6-1.2M4.7 13.6l.3 3.8 3.6 1.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.6 6.2a4.5 4.5 0 0 0-5.8 5.7L3.5 17.2a2.2 2.2 0 1 0 3.1 3.1l5.3-5.3a4.5 4.5 0 0 0 5.8-5.8l-2.8 2.8-2.8-.7-.7-2.8 3.2-2.3Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21V5.5L12 2v19M12 7h8v14M7.5 8h1M7.5 12h1M7.5 16h1M15.5 11h1M15.5 15h1M15.5 19h1M2 21h20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.3 4.2L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3H5.7A1.7 1.7 0 0 0 4 4.7C4 13.2 10.8 20 19.3 20a1.7 1.7 0 0 0 1.7-1.7V16l-4.1-1-1.1 2.1c-3.9-1.7-6.2-4-7.9-7.9L10 8.1 8 3Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.8 20 6v5.2c0 4.9-3.1 8.6-8 10-4.9-1.4-8-5.1-8-10V6l8-3.2Z" stroke="currentColor" stroke-width="1.7"/><path d="m8.4 12 2.3 2.3 4.9-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3 11 9-8 9 8M5 9.5V21h14V9.5M9 21v-7h6v7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wave: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 4-2.5M4 12c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 4-2.5M4 16c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 4-2.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
};

function logo() {
  return `<a class="logo" href="/" aria-label="${esc(business.name)} home"><span class="logo-mark">${icons.wave}</span><span>Republic <small>HVAC Services</small></span></a>`;
}

function contactButton(label = 'Schedule Service', kind = 'primary') {
  return `<a class="button button--${kind}" href="#contact">${esc(label)}</a>`;
}

function phoneButton(labelPrefix = 'Call', kind = 'secondary') {
  if (has(business.phone)) return `<a class="button button--${kind}" href="tel:${esc(business.phone)}">${icons.phone}${esc(labelPrefix)} ${esc(business.phoneDisplay)}</a>`;
  return `<span class="button button--${kind}" aria-disabled="true">${icons.phone}${esc(business.phoneDisplay)}</span>`;
}

function header() {
  const emergencyText = business.emergencyServiceVerified ? 'Verified emergency HVAC service available' : 'Residential & commercial heating and cooling';
  return `<div class="utility-bar"><div class="container utility-inner"><span>${esc(emergencyText)}</span><span>Service area: ${esc(serviceAreaLabel)}</span></div></div>
<header class="site-header"><div class="container header-inner">${logo()}
<button class="menu-button" type="button" data-menu-button aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
<nav class="nav" id="primary-nav" data-menu aria-label="Primary navigation">
<a href="/#services">Services</a><a href="/#why">Why Republic</a>${business.googleReviewCount ? '<a href="/#reviews">Reviews</a>' : ''}<a href="/service-area/">Service Area</a><a href="/#contact">Contact</a>${contactButton('Schedule Service')}
</nav></div></header>`;
}

function footer() {
  const serviceLinks = services.slice(0,6).map(s => `<li><a href="/${s.slug}/">${esc(s.name)}</a></li>`).join('');
  const phone = has(business.phone) ? `<a href="tel:${esc(business.phone)}">${esc(business.phoneDisplay)}</a>` : esc(business.phoneDisplay);
  const email = has(business.email) ? `<a href="mailto:${esc(business.email)}">${esc(business.emailDisplay)}</a>` : esc(business.emailDisplay);
  return `<footer class="site-footer"><div class="container"><div class="footer-grid">
<div class="footer-brand">${logo()}<p>Heating and cooling service for residential and commercial properties. Final business details must be verified before production launch.</p></div>
<div class="footer-col"><h3>Services</h3><ul>${serviceLinks}</ul></div>
<div class="footer-col"><h3>Company</h3><ul><li><a href="/#why">Why Republic</a></li><li><a href="/service-area/">Service Area</a></li><li><a href="/#faq">FAQ</a></li><li><a href="/#contact">Contact</a></li></ul></div>
<div class="footer-col"><h3>Contact</h3><ul><li>${phone}</li><li>${email}</li><li>${esc(serviceAreaLabel)}</li></ul></div>
</div><div class="footer-bottom"><span>© <span data-year></span> ${esc(business.name)}. All rights reserved.</span><span>Production launch requires verified owner information.</span></div></div></footer>
${!configured ? '<div class="preview-flag">Owner details required before launch</div>' : ''}
<div class="mobile-conversion">${phoneButton('Call Now','secondary')}${contactButton('Request Service','primary')}</div>`;
}

function localBusinessJsonLd() {
  const baseId = has(business.siteUrl) ? business.siteUrl.replace(/\/$/, '') : '';
  const localId = baseId ? `${baseId}/#${business.shortName.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  const areaServed = (business.serviceAreas?.length ? business.serviceAreas : [business.city]).filter(Boolean)
    .map(name => ({ '@type':'City', name }));

  const localBusiness = { '@id': localId, '@type':'LocalBusiness', name: business.name, description:'Residential and commercial heating and cooling services.' };
  if (baseId) localBusiness.url = baseId;
  if (has(business.phone)) localBusiness.telephone = business.phone;
  if (has(business.email)) localBusiness.email = business.email;
  if (areaServed.length) localBusiness.areaServed = areaServed;
  if (business.address || (business.city && business.state)) {
    localBusiness.address = {
      '@type':'PostalAddress',
      streetAddress: has(business.address) ? business.address : undefined,
      addressLocality: has(business.city) ? business.city : undefined,
      addressRegion: has(business.state) ? business.state : undefined,
      postalCode: has(business.zip) ? business.zip : undefined,
      addressCountry:'US'
    };
    Object.keys(localBusiness.address).forEach(k => localBusiness.address[k] === undefined && delete localBusiness.address[k]);
  }
  if (business.latitude && business.longitude) {
    localBusiness.geo = { '@type':'GeoCoordinates', latitude: business.latitude, longitude: business.longitude };
  }
  if (business.hours?.length) {
    localBusiness.openingHours = business.hours.map(h => (h.days || []).map(d => `${d} ${h.open || ''}-${h.close || ''}`)).flat().filter(Boolean);
  }
  if (business.googleBusinessProfileUrl) localBusiness.sameAs = [business.googleBusinessProfileUrl, business.facebookUrl, business.instagramUrl].filter(Boolean);
  if (business.googleRating && business.googleReviewCount) localBusiness.aggregateRating = { '@type':'AggregateRating', ratingValue: business.googleRating, reviewCount: business.googleReviewCount };
  if (services.length) localBusiness.makesOffer = { '@type':'OfferCatalog', name:`${business.name} services`, itemListElement: services.map(s => ({ '@type':'Offer', itemOffered: { '@type':'Service', name: s.name, serviceType: s.name, description: s.summary, areaServed: areaServed.length ? areaServed : undefined, provider: localId ? { '@id': localId } : undefined } })) };

  const graph = [localBusiness];

  const faqItems = [
    ['What HVAC services does Republic HVAC provide?', 'The current service offering includes AC repair and installation, heating and furnace service, heat-pump service, preventive HVAC maintenance, and residential and commercial heating and cooling work.'],
    ['How do I know whether to repair or replace my system?', 'The right choice depends on the equipment condition, age, repair history, comfort performance, and the cost and scope of the current issue. A diagnosis should come before a replacement recommendation.'],
    ['How often should HVAC equipment be maintained?', 'Maintenance frequency depends on the equipment and manufacturer guidance. Seasonal inspections are commonly used to identify airflow, operating, and wear issues before periods of heavy use.'],
    ['What information should I provide when requesting service?', 'Your contact information, service address or ZIP code, equipment type if known, and a short description of the symptoms help make the first follow-up more useful.'],
    ['Does Republic HVAC work with commercial properties?', 'Yes. The existing Republic HVAC website describes its heating and cooling services as serving both residential and commercial spaces.']
  ];
  if (business.emergencyServiceVerified) faqItems.push(['Do you offer emergency HVAC service?', 'Yes. Emergency HVAC service availability has been verified for the business.']);

  graph.push({
    '@type':'FAQPage',
    mainEntity: faqItems.map(([q, a]) => ({ '@type':'Question', name: q, acceptedAnswer: { '@type':'Answer', text: a } }))
  });

  return `<script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org', '@graph': graph })}</script>`;
}

function shell({ title, description, pathname='/', body }) {
  const canonical = pageUrl(pathname);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${configured ? 'index,follow' : 'noindex,nofollow'}">${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}<meta name="theme-color" content="#0a1730"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css">${localBusinessJsonLd()}</head><body>${header()}<main>${body}</main>${footer()}<script src="/app.js" defer></script></body></html>`;
}

function serviceIcon(service) {
  if (service.slug.includes('ac')) return icons.snow;
  if (service.slug.includes('heat') || service.slug.includes('furnace')) return icons.flame;
  if (service.slug.includes('commercial')) return icons.building;
  return icons.tool;
}

function faqList() {
  const base = `<details><summary>What HVAC services does Republic HVAC provide?</summary><p>The current service offering includes AC repair and installation, heating and furnace service, heat-pump service, preventive HVAC maintenance, and residential and commercial heating and cooling work.</p></details><details><summary>How do I know whether to repair or replace my system?</summary><p>The right choice depends on the equipment condition, age, repair history, comfort performance, and the cost and scope of the current issue. A diagnosis should come before a replacement recommendation.</p></details><details><summary>How often should HVAC equipment be maintained?</summary><p>Maintenance frequency depends on the equipment and manufacturer guidance. Seasonal inspections are commonly used to identify airflow, operating, and wear issues before periods of heavy use.</p></details><details><summary>What information should I provide when requesting service?</summary><p>Your contact information, service address or ZIP code, equipment type if known, and a short description of the symptoms help make the first follow-up more useful.</p></details><details><summary>Does Republic HVAC work with commercial properties?</summary><p>Yes. The existing Republic HVAC website describes its heating and cooling services as serving both residential and commercial spaces.</p></details>`;
  return business.emergencyServiceVerified ? base + '<details><summary>Do you offer emergency HVAC service?</summary><p>Yes. Emergency HVAC service availability has been verified for the business.</p></details>' : base;
}

function questionnaireSection() {
  const endpoint = has(business.formEndpoint) ? business.formEndpoint : '#';
  return `<section class="section section--soft" id="quiz"><div class="container"><div class="section-head center"><p class="eyebrow">Quick triage</p><h2>Tell us what’s going on in under a minute.</h2><p class="lede">Answer a few short questions. We’ll put together a clear summary of your situation that you can send straight to the Republic HVAC team.</p></div>
<div class="quiz-panel">
  <form data-quiz-form action="${esc(endpoint)}" method="post">
    <div class="quiz-progress" data-quiz-progress aria-live="polite"><span>Step <b data-quiz-step>1</b> of 5</span><i data-quiz-bar></i></div>

    <div class="quiz-step" data-step="1" data-quiz-step-panel>
      <fieldset class="quiz-fieldset">
        <legend>What is your main concern?</legend>
        <div class="quiz-options">
          <label class="quiz-option"><input type="radio" name="concern" value="Cooling problem"><span>${icons.snow}</span><strong>Cooling</strong><small>AC that isn’t cooling or acting up</small></label>
          <label class="quiz-option"><input type="radio" name="concern" value="Heating problem"><span>${icons.flame}</span><strong>Heating</strong><small>Furnace or heat not working</small></label>
          <label class="quiz-option"><input type="radio" name="concern" value="Maintenance"><span>${icons.tool}</span><strong>Maintenance</strong><small>Routine tune-up or check-up</small></label>
          <label class="quiz-option"><input type="radio" name="concern" value="Commercial"><span>${icons.building}</span><strong>Commercial</strong><small>A business space</small></label>
          <label class="quiz-option"><input type="radio" name="concern" value="Not sure"><span>${icons.wave}</span><strong>Not sure</strong><small>Just describe the problem</small></label>
        </div>
      </fieldset>
    </div>

    <div class="quiz-step" data-step="2" data-quiz-step-panel hidden>
      <fieldset class="quiz-fieldset">
        <legend>Tell us a little more.</legend>
        <div class="quiz-options" data-quiz-branch="cooling" hidden>
          <label class="quiz-option"><input type="radio" name="detail" value="Warm or weak airflow"><span>${icons.snow}</span><strong>Warm / weak airflow</strong><small>Not cooling like it should</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Strange noises"><span>${icons.wave}</span><strong>Strange noises</strong><small>Rattling, hissing, or banging</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Won’t turn on"><span>${icons.tool}</span><strong>Won’t turn on</strong><small>No power or response</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Odd smell"><span>${icons.flame}</span><strong>Odd smell</strong><small>A burning or musty odor</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Something else"><span>${icons.wave}</span><strong>Something else</strong><small>Describe it on the next page</small></label>
        </div>
        <div class="quiz-options" data-quiz-branch="heating" hidden>
          <label class="quiz-option"><input type="radio" name="detail" value="No heat"><span>${icons.flame}</span><strong>No heat</strong><small>The system runs but doesn’t warm up</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Uneven rooms"><span>${icons.wave}</span><strong>Uneven rooms</strong><small>Some rooms stay cold</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Short cycling"><span>${icons.tool}</span><strong>Short cycling</strong><small>Turns on and off constantly</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Strange noises"><span>${icons.wave}</span><strong>Strange noises</strong><small>Rattling, hissing, or banging</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Something else"><span>${icons.wave}</span><strong>Something else</strong><small>Describe it on the next page</small></label>
        </div>
        <div class="quiz-options" data-quiz-branch="maintenance" hidden>
          <label class="quiz-option"><input type="radio" name="detail" value="Routine tune-up"><span>${icons.tool}</span><strong>Routine tune-up</strong><small>Before the peak season</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Not sure it needs service"><span>${icons.wave}</span><strong>Not sure</strong><small>Help me figure out what’s needed</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Something else"><span>${icons.wave}</span><strong>Something else</strong><small>Describe it on the next page</small></label>
        </div>
        <div class="quiz-options" data-quiz-branch="commercial" hidden>
          <label class="quiz-option"><input type="radio" name="detail" value="Retail / office"><span>${icons.building}</span><strong>Retail / office</strong><small>A storefront or office space</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Restaurant / food service"><span>${icons.flame}</span><strong>Restaurant / food</strong><small>Kitchens and dining areas</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Warehouse / industrial"><span>${icons.building}</span><strong>Warehouse</strong><small>Larger or open spaces</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Other"><span>${icons.wave}</span><strong>Other</strong><small>Describe it on the next page</small></label>
        </div>
        <div class="quiz-options" data-quiz-branch="not-sure" hidden>
          <label class="quiz-option"><input type="radio" name="detail" value="Just needs a look"><span>${icons.wave}</span><strong>Just needs a look</strong><small>I’m not sure what’s wrong</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Second opinion"><span>${icons.wave}</span><strong>Second opinion</strong><small>I want another diagnosis</small></label>
          <label class="quiz-option"><input type="radio" name="detail" value="Something else"><span>${icons.wave}</span><strong>Something else</strong><small>Describe it on the next page</small></label>
        </div>
      </fieldset>
    </div>

    <div class="quiz-step" data-step="3" data-quiz-step-panel hidden>
      <fieldset class="quiz-fieldset">
        <legend>Anything you want to add?</legend>
        <textarea name="description" data-quiz-desc placeholder="Optional: describe the equipment, when it started, or any recent changes. Your answer from the previous step is included automatically."></textarea>
      </fieldset>
    </div>

    <div class="quiz-step" data-step="4" data-quiz-step-panel hidden>
      <fieldset class="quiz-fieldset">
        <legend>Where can the team reach you?</legend>
        <div class="form-grid quiz-contact">
          <div class="field"><label for="quiz-name">Full name</label><input id="quiz-name" name="name" autocomplete="name" data-quiz-contact required></div>
          <div class="field"><label for="quiz-phone">Phone</label><input id="quiz-phone" name="phone" type="tel" autocomplete="tel" data-quiz-contact required></div>
          <div class="field"><label for="quiz-email">Email</label><input id="quiz-email" name="email" type="email" autocomplete="email" data-quiz-contact required></div>
          <div class="field"><label for="quiz-zip">ZIP / city</label><input id="quiz-zip" name="zip" inputmode="numeric" autocomplete="postal-code" data-quiz-contact></div>
        </div>
      </fieldset>
    </div>

    <div class="quiz-step" data-step="5" data-quiz-step-panel hidden>
      <fieldset class="quiz-fieldset">
        <legend>Review your request</legend>
        <dl class="quiz-summary">
          <div><dt>Concern</dt><dd data-quiz-s-concern>—</dd></div>
          <div><dt>Detail</dt><dd data-quiz-s-detail>—</dd></div>
          <div><dt>Notes</dt><dd data-quiz-s-desc>—</dd></div>
          <div><dt>Name</dt><dd data-quiz-s-name>—</dd></div>
          <div><dt>Contact</dt><dd data-quiz-s-contact>—</dd></div>
          <div><dt>Service area</dt><dd data-quiz-s-zip>—</dd></div>
        </dl>
      </fieldset>
    </div>

    <div class="quiz-nav">
      <button class="button button--secondary" type="button" data-quiz-back disabled>Back</button>
      <button class="button button--primary" type="button" data-quiz-next>Next</button>
      <button class="button button--primary" type="submit" data-quiz-submit hidden>Craft & send summary</button>
      <p class="form-status" data-quiz-status aria-live="polite"></p>
    </div>
  </form>
</div>
</div></section>`;
}

function contactSection() {
  const options = services.map(s => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('');
  const endpoint = has(business.formEndpoint) ? business.formEndpoint : '#';
  const phone = has(business.phone) ? `<a href="tel:${esc(business.phone)}">${esc(business.phoneDisplay)}</a>` : esc(business.phoneDisplay);
  const email = has(business.email) ? `<a href="mailto:${esc(business.email)}">${esc(business.emailDisplay)}</a>` : esc(business.emailDisplay);
  return `<section class="section" id="contact"><div class="container contact-grid"><div class="contact-card"><p class="eyebrow">Request service</p><h2>Tell us what your system is doing.</h2><p>Share the basic details and the team can follow up once the production contact workflow is connected.</p><div class="contact-methods"><div class="contact-method"><small>Call</small><strong>${phone}</strong></div><div class="contact-method"><small>Email</small><strong>${email}</strong></div><div class="contact-method"><small>Primary service area</small><strong>${esc(locationLabel)}</strong></div></div></div>
<div class="form-panel"><form data-service-form action="${esc(endpoint)}" method="post"><div class="form-grid"><div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" required></div><div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" required></div><div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="field"><label for="zip">ZIP code</label><input id="zip" name="zip" inputmode="numeric" autocomplete="postal-code"></div><div class="field field--full"><label for="service">Service needed</label><select id="service" name="service" required><option value="">Choose a service</option>${options}<option value="Other">Other</option></select></div><div class="field field--full"><label for="message">What's going on?</label><textarea id="message" name="message" placeholder="Describe the issue, equipment, and anything you've noticed." required></textarea></div></div><div class="form-actions"><button class="button button--primary" type="submit">Request Service</button><p class="form-status" data-form-status aria-live="polite">${has(business.formEndpoint) ? 'We use your details only to respond to this service request.' : 'Preview mode: connect FORM_ENDPOINT before launch.'}</p></div></form></div></div></section>`;
}

function homepage() {
  const serviceCards = services.map(s => `<article class="service-card"><div class="service-icon">${serviceIcon(s)}</div><h3>${esc(s.name)}</h3><p>${esc(s.summary)}</p><a class="link" href="/${s.slug}/">Learn about ${esc(s.name)} ${icons.arrow}</a></article>`).join('');
  const reviewCards = (business.reviews || []).slice(0,3).map(r => `<article class="service-card"><div class="service-icon">${icons.check}</div><h3>${esc(r.name || 'Customer')}</h3><p>${esc(r.text || '')}</p>${r.sourceUrl ? `<a class="link" href="${esc(r.sourceUrl)}" rel="noopener noreferrer">View source ${icons.arrow}</a>` : ''}</article>`).join('');
  const reviewSection = business.googleRating && business.googleReviewCount && reviewCards ? `<section class="section" id="reviews"><div class="container"><div class="section-head center"><p class="eyebrow">Customer feedback</p><h2>Verified customer reviews</h2><p class="lede">Google rating: ${esc(business.googleRating)} from ${esc(business.googleReviewCount)} reviews.</p></div><div class="service-grid">${reviewCards}</div></div></section>` : '';
  const projectCards = (business.projectImages || []).map(img => `<figure class="service-card" style="min-height:auto"><img src="${esc(img.src || '')}" alt="${esc(img.alt || '')}" width="800" height="600" loading="lazy" style="border-radius:14px;aspect-ratio:4/3;object-fit:cover;margin-bottom:18px"><figcaption><strong>${esc(img.caption || 'Republic HVAC project')}</strong></figcaption></figure>`).join('');
  const projectSection = projectCards ? `<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Recent work</p><h2>Real Republic HVAC project photos.</h2></div><div class="service-grid">${projectCards}</div></div></section>` : '';
  const emergencyCta = business.emergencyServiceVerified ? `<section class="section"><div class="container"><div class="cta-band"><div><h2>Need HVAC help now?</h2><p>Emergency service availability is verified for Republic HVAC Services.</p></div><div class="cta-actions">${phoneButton('Call','ghost')}${contactButton('Request Service','primary')}</div></div></div></section>` : '';
  const serviceAreaBody = business.serviceAreas?.length ? business.serviceAreas.map(area => `<span class="area-tag">${icons.pin}${esc(area)}</span>`).join(' ') : `<span class="area-tag">${icons.pin}${esc(locationLabel)}</span>`;

  return `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="eyebrow">Heating • Cooling • Maintenance</p><h1>HVAC service built around <strong>clear next steps.</strong></h1><p class="lede">AC repair and installation, heating and heat-pump service, preventive maintenance, and commercial HVAC support in ${esc(serviceAreaLabel)}.</p><div class="hero-actions">${contactButton('Schedule Service','primary')}${phoneButton('Call','ghost')}</div><p class="hero-note">${icons.shield} Additional business credentials and verified review information will display here once owner-provided.</p></div><div class="hero-panel" aria-hidden="true"><div class="hvac-visual"><div class="thermo"><strong>72°</strong><span>Comfort target</span></div><div class="duct-line one"></div><div class="duct-line two"></div><div class="metric-card"><span class="mini">System check</span><strong>Diagnose → explain → act</strong><div class="bars"><i></i><i></i><i></i><i></i><i></i></div></div></div></div></div></section>
<section class="trust-strip"><div class="container trust-grid"><div class="trust-item"><div class="trust-icon">${icons.snow}</div><div><strong>Cooling</strong><span>Repair & installation</span></div></div><div class="trust-item"><div class="trust-icon">${icons.flame}</div><div><strong>Heating</strong><span>Furnaces & heat pumps</span></div></div><div class="trust-item"><div class="trust-icon">${icons.tool}</div><div><strong>Maintenance</strong><span>Preventive HVAC service</span></div></div><div class="trust-item"><div class="trust-icon">${icons.building}</div><div><strong>Residential + Commercial</strong><span>Both are currently advertised</span></div></div></div></section>
${emergencyCta}
<section class="section" id="services"><div class="container"><div class="section-head"><p class="eyebrow">HVAC services</p><h2>Get to the right service without digging.</h2><p class="lede">Each major service now has its own focused page instead of sending every visitor to a generic contact form.</p></div><div class="service-grid">${serviceCards}</div></div></section>
<section class="section section--soft" id="why"><div class="container split"><div class="value-panel"><p class="eyebrow">Why Republic</p><div class="number">3</div><p class="caption">A simpler service experience: identify the problem, understand the options, then decide what happens next.</p><ul class="value-checks"><li>${icons.check}<span>Diagnosis before recommendation</span></li><li>${icons.check}<span>Clear explanation of service options</span></li><li>${icons.check}<span>Residential and commercial HVAC pathways</span></li></ul></div><div><p class="eyebrow">What to expect</p><h2>Less generic marketing. More useful information.</h2><p class="lede" style="margin-top:18px">The rebuilt site avoids unsupported statistics and focuses on helping a customer understand the next step.</p><div class="expect-list"><div class="expect-item"><span class="step">01</span><div><h3>Choose the service</h3><p>Start from a dedicated cooling, heating, maintenance, or commercial page.</p></div></div><div class="expect-item"><span class="step">02</span><div><h3>Describe the issue</h3><p>Share contact information, ZIP code, service type, and what the equipment is doing.</p></div></div><div class="expect-item"><span class="step">03</span><div><h3>Get a clear follow-up</h3><p>The production form should route the request to the real business workflow once connected.</p></div></div></div></div></div></section>
${reviewSection}
${projectSection}
<section class="section" id="service-area"><div class="container"><div class="area-box"><div><p class="eyebrow">Service area</p><h2>Proudly serving ${esc(serviceAreaLabel)}</h2><p>Republic HVAC Services is based in ${esc(locationLabel)} and provides heating and cooling service across the surrounding area. If your property is in or near ${esc(business.city)}, it is likely within reach. Additional cities and ZIP codes are added to this page once the owner confirms them.</p><a class="link" style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;color:var(--blue);font-weight:800" href="/service-area/">See the full service area ${icons.arrow}</a></div><div>${serviceAreaBody}</div></div></div></section>
<section class="section section--soft" id="faq"><div class="container"><div class="section-head center"><p class="eyebrow">HVAC questions</p><h2>Useful answers before you request service.</h2></div><div class="faq-list">${faqList()}</div></div></section>
${questionnaireSection()}
${contactSection()}`;
}

function servicePage(service) {
  const related = service.related.map(slug => services.find(s => s.slug === slug)).filter(Boolean).map(s => `<a class="related-card" href="/${s.slug}/"><h3>${esc(s.name)}</h3><p>${esc(s.summary)}</p><span>View service →</span></a>`).join('');
  const symptomList = service.symptoms.map(item => `<li>${icons.check}<span>${esc(item)}</span></li>`).join('');
  const includesList = service.includes.map(item => `<li>${icons.check}<span>${esc(item)}</span></li>`).join('');
  const title = `${service.name} in ${locationLabel} | ${business.shortName}`;
  const description = `${service.summary} Request ${service.name.toLowerCase()} from ${business.shortName} in ${locationLabel}.`;
  const body = `<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="/">Home</a> / ${esc(service.name)}</div><p class="eyebrow">${esc(service.eyebrow)}</p><h1>${esc(service.name)} in ${esc(locationLabel)}</h1><p class="lede">${esc(service.intro)}</p><div class="page-actions">${contactButton('Request Service','primary')}${phoneButton('Call','ghost')}</div></div></section>
<section class="section"><div class="container"><div class="info-grid"><article class="info-card"><p class="eyebrow">Common reasons to call</p><h2 style="font-size:2rem">When this service may help</h2><ul>${symptomList}</ul></article><article class="info-card"><p class="eyebrow">Service approach</p><h2 style="font-size:2rem">What the visit can include</h2><ul>${includesList}</ul></article></div></div></section>
<section class="section section--soft"><div class="container split"><div><p class="eyebrow">Clear next steps</p><h2>Start with the problem—not a sales pitch.</h2><p class="lede" style="margin-top:18px">Describe what the system is doing, when the issue started, and any recent changes. That gives the service request enough context for a productive follow-up.</p></div><div class="area-box" style="background:white"><div><p class="eyebrow">Local service</p><h3 style="font-size:1.6rem">${esc(locationLabel)}</h3><p>Service is available in ${esc(serviceAreaLabel)}. Specific additional cities and ZIP codes can be added once confirmed.</p></div><span class="area-tag">${icons.pin}${esc(locationLabel)}</span></div></div></section>
<section class="section section--ink"><div class="container"><div class="section-head"><p class="eyebrow">Related HVAC services</p><h2>Other service paths</h2></div><div class="related-grid">${related}</div></div></section>
${contactSection()}`;
  return shell({ title, description, pathname:`/${service.slug}/`, body });
}

function serviceAreaPage() {
  const areaTags = business.serviceAreas?.length ? business.serviceAreas.map(area => `<span class="area-tag">${icons.pin}${esc(area)}</span>`).join(' ') : `<span class="area-tag">${icons.pin}${esc(locationLabel)}</span>`;
  const body = `<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="/">Home</a> / Service Area</div><p class="eyebrow">Where we work</p><h1>Heating & cooling service across ${esc(serviceAreaLabel)}</h1><p class="lede">Republic HVAC Services is based in ${esc(locationLabel)} and provides residential and commercial heating and cooling service across the surrounding area.</p><div class="page-actions">${contactButton('Request Service','primary')}${phoneButton('Call','ghost')}</div></div></section>
<section class="section"><div class="container"><div class="info-grid">
<article class="info-card"><p class="eyebrow">Primary location</p><h2 style="font-size:2rem">Based in ${esc(locationLabel)}</h2><p style="color:var(--muted);margin-top:12px">Republic HVAC Services operates out of ${esc(locationLabel)}. The service area is described as ${esc(serviceAreaLabel)}.</p><div style="margin-top:20px"><span class="area-tag">${icons.pin}${esc(locationLabel)}</span></div></article>
<article class="info-card"><p class="eyebrow">Service area</p><h2 style="font-size:2rem">${esc(serviceAreaLabel)}</h2><p style="color:var(--muted);margin-top:12px">Heating, cooling, and maintenance service is available for residential and commercial properties in the area. If your property is in or near ${esc(business.city)}, it is likely within reach.</p><div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:8px">${areaTags}</div></article>
</div></div></section>
<section class="section section--soft"><div class="container split"><div><p class="eyebrow">Local & nearby service</p><h2>A local HVAC partner in ${esc(business.city)}.</h2><p class="lede" style="margin-top:18px">Local heating and cooling service starts with a clear picture of the equipment and the property. Sharing your ZIP or city when you request service helps the team confirm availability and plan a visit.</p></div><div class="area-box" style="background:white"><div><p class="eyebrow">Request service</p><h3 style="font-size:1.6rem">Tell us where you are</h3><p>Include your city or ZIP code when you request service so the team can confirm coverage and route your request.</p></div><span class="area-tag">${icons.pin}${esc(locationLabel)}</span></div></div></section>
<section class="section"><div class="container"><div class="section-head center"><p class="eyebrow">What to send</p><h2>Helpful details when requesting service.</h2></div><div class="service-grid"><article class="service-card"><div class="service-icon">${icons.home}</div><h3>Property location</h3><p>Your city and ZIP code help confirm service coverage and scheduling.</p></article><article class="service-card"><div class="service-icon">${icons.tool}</div><h3>Equipment type</h3><p>Whether it is central AC, a furnace, a heat pump, or a commercial unit.</p></article><article class="service-card"><div class="service-icon">${icons.check}</div><h3>Symptoms</h3><p>A short description of what the system is doing (or not doing) helps a productive first call.</p></article></div><div style="margin-top:34px;text-align:center">${contactButton('Request Service','primary')}</div></div></section>
${questionnaireSection()}
${contactSection()}`;
  return shell({ title:`Service Area | ${business.shortName}`, description:`${business.name} provides heating and cooling service in ${serviceAreaLabel}. Request local HVAC service today.`, pathname:'/service-area/', body });
}

const homeTitle = `HVAC Repair & Installation in ${locationLabel} | ${business.shortName}`;
const homeDescription = `${business.name} provides AC repair, heating service, HVAC installation, maintenance, and commercial HVAC support in ${serviceAreaLabel}. Request service today.`;
await writeFile(path.join(out, 'index.html'), shell({ title:homeTitle, description:homeDescription, pathname:'/', body:homepage() }));

for (const service of services) {
  const dir = path.join(out, service.slug);
  await mkdir(dir, { recursive:true });
  await writeFile(path.join(dir, 'index.html'), servicePage(service));
}

await mkdir(path.join(out, 'service-area'), { recursive:true });
await writeFile(path.join(out, 'service-area/index.html'), serviceAreaPage());

const notFound = shell({ title:`Page Not Found | ${business.shortName}`, description:'The requested page could not be found.', pathname:'/404', body:`<section class="page-hero"><div class="container"><p class="eyebrow">404</p><h1>That page is not here.</h1><p class="lede">Return to the Republic HVAC homepage or choose a service.</p><div class="page-actions"><a class="button button--primary" href="/">Back to Home</a><a class="button button--ghost" href="/#services">View Services</a></div></div></section>` });
await writeFile(path.join(out, '404.html'), notFound);

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0a1730"/><path d="M14 22c6-7 12-7 18 0s12 7 18 0M14 32c6-7 12-7 18 0s12 7 18 0M14 42c6-7 12-7 18 0s12 7 18 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`;
await writeFile(path.join(out, 'favicon.svg'), favicon);

const robots = configured ? `User-agent: *\nAllow: /\nSitemap: ${business.siteUrl.replace(/\/$/, '')}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n# Preview mode. Add verified business details and SITE_URL before launch.\n';
await writeFile(path.join(out, 'robots.txt'), robots);

if (configured) {
  const urls = ['/', '/service-area/', ...services.map(s => `/${s.slug}/`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${esc(pageUrl(u))}</loc></url>`).join('')}</urlset>`;
  await writeFile(path.join(out, 'sitemap.xml'), sitemap);
}

console.log(`Built ${services.length + 3} HTML pages into dist/`);
console.log(configured ? 'Production indexing enabled.' : 'Preview safety mode: noindex + robots disallow until owner data is configured.');
