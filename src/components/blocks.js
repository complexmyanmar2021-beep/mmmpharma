// Content blocks: cards, spec table, FAQ accordion, contact info, form, CTA band.
const { esc, icon, img, val, button, formatDate, tbc } = require('./ui');
const { viberHref } = require('./layout');

/* ---------- Product card ---------- */
function productCard(ctx, p, { headingLevel = 3 } = {}) {
  const pick = (label) => p.specs.find((s) => s.label === label);
  const specLine = ['Strength', 'Route']
    .map(pick)
    .filter(Boolean)
    .map((s) => `<span><abbr title="${s.label}">${s.label}</abbr> ${esc(typeof s.value === 'object' ? s.value.value : s.value)}</span>`)
    .join('');
  const href = ctx.url(`/products/${p.slug}/`);
  return `<article class="pcard reveal">
  <a class="pcard__media" href="${href}" tabindex="-1" aria-hidden="true">${img(ctx, p.image, p.imageAlt, { w: 800, h: 600, label: p.fullName })}</a>
  <div class="pcard__body">
    <p class="chip">${esc(p.category)}</p>
    <h${headingLevel} class="pcard__title"><a href="${href}">${esc(p.name)}</a></h${headingLevel}>
    <p class="pcard__generic">${esc(p.fullName)}</p>
    <p class="pcard__text">${esc(p.cardSummary)}</p>
    <p class="pcard__specs">${specLine}</p>
    <div class="pcard__foot">
      <span class="pcard__rx">${icon('shield')}Professional use</span>
      <a class="link-arrow" href="${href}" aria-label="View product: ${esc(p.name)}">View Product ${icon('arrow')}</a>
    </div>
  </div>
</article>`;
}

/* ---------- Spec sheet (product detail) ---------- */
function specSheet(ctx, p) {
  return `<dl class="specs">${p.specs
    .map((s) => `<div class="specs__row"><dt>${esc(s.label)}</dt><dd>${val(ctx, s.value)}</dd></div>`)
    .join('')}</dl>`;
}

/* ---------- Article card (Health & Knowledge) ---------- */
const catIcon = {
  'Medicine Safety': 'shield', 'Maternal Health': 'heart', 'Pharmaceutical Awareness': 'pill', 'Medicine Storage': 'thermo',
  'Patient Safety': 'hospital', 'Public Health': 'globe', 'World Health Awareness': 'calendar', 'Healthcare Education': 'book',
};
function articleCover(ctx, a, { eager = false } = {}) {
  if (a.cover) return img(ctx, a.cover, a.coverAlt || '', { w: 800, h: 500, eager });
  // Designed typographic cover used until a real photo is supplied.
  return `<span class="cover cover--${slugify(a.category)}" aria-hidden="true">${icon(catIcon[a.category] || 'book', 'cover__icon')}<span class="cover__cat">${esc(a.category)}</span></span>`;
}
function articleCard(ctx, a, { featured = false } = {}) {
  const href = ctx.url(`/health-knowledge/${a.slug}/`);
  return `<article class="acard${featured ? ' acard--featured' : ''} reveal" data-category="${esc(a.category)}">
  <a class="acard__media" href="${href}" tabindex="-1" aria-hidden="true">${articleCover(ctx, a)}</a>
  <div class="acard__body">
    <p class="acard__meta"><span class="chip chip--soft">${esc(a.category)}</span>${a.awareness ? `<span class="chip chip--gold">${esc(a.awareness)}</span>` : ''}${a.status === 'demo' ? '<span class="chip chip--demo">Sample</span>' : ''}</p>
    <h3 class="acard__title"><a href="${href}">${esc(a.title)}</a></h3>
    <p class="acard__text">${esc(a.summary)}</p>
    <a class="link-arrow" href="${href}" aria-label="Read more: ${esc(a.title)}">Read More ${icon('arrow')}</a>
  </div>
</article>`;
}

/* ---------- News card ---------- */
function newsCard(ctx, n) {
  const ext = n.type === 'media';
  const date = formatDate(n.date);
  return `<article class="ncard reveal">
  <p class="ncard__meta"><span class="chip chip--soft">${esc(n.category)}</span>${date ? `<time datetime="${n.date}">${date}</time>` : ''}</p>
  <h3 class="ncard__title"><a href="${ext ? n.url : ctx.url(n.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(n.title)}${ext ? `<span class="sr-only"> (opens external site)</span>` : ''}</a></h3>
  <p class="ncard__text">${esc(n.summary)}</p>
  <p class="ncard__source">${icon(ext ? 'news' : 'info')}<span>${esc(n.source || 'MMMPharma')}</span>${ext ? icon('external', 'ncard__ext') : ''}</p>
</article>`;
}

/* ---------- FAQ accordion (native <details>, works without JS) ---------- */
function faqList(ctx, items, { idPrefix = 'faq' } = {}) {
  return `<div class="faq">${items
    .map(
      (f, i) => `<details class="faq__item" id="${idPrefix}-${i + 1}">
  <summary><span>${esc(f.q)}</span>${icon('chevron', 'faq__chev')}</summary>
  <div class="faq__a"><p>${esc(f.a)}${f.pending ? ' ' + tbc(ctx, f.pending) : ''}</p></div>
</details>`
    )
    .join('')}</div>`;
}

/* ---------- Contact details ---------- */
function contactList(ctx, { compact = false } = {}) {
  const c = ctx.cfg.contact;
  const anyPending = (arr) => arr.some((x) => x.confirmed === false);
  return `<ul class="contact-list${compact ? ' contact-list--compact' : ''}">
  <li>${icon('pin')}<div><p class="contact-list__label">Office</p><address>${esc(ctx.cfg.company.legalName)}<br>${c.address.lines.map(esc).join('<br>')}</address><a class="link-arrow" href="${c.map.link}" target="_blank" rel="noopener">Open in Google Maps ${icon('external')}</a></div></li>
  <li>${icon('phone')}<div><p class="contact-list__label">Phone ${anyPending(c.phones) ? tbc(ctx, 'Different numbers appear on different pages of the current site.') : ''}</p>${c.phones.map((p) => `<a class="contact-list__value" href="tel:${p.tel}">${esc(p.number)}</a>`).join('')}</div></li>
  <li>${icon('mail')}<div><p class="contact-list__label">Email ${anyPending(c.emails) ? tbc(ctx, 'Different emails appear on different pages of the current site.') : ''}</p>${c.emails.map((e) => `<a class="contact-list__value" href="mailto:${e.address}">${esc(e.address)}</a>`).join('')}</div></li>
  <li>${icon('clock')}<div><p class="contact-list__label">Office hours</p><p class="contact-list__value">${esc(c.hours)}</p></div></li>
  ${ctx.cfg.viber ? `<li>${icon('chat')}<div><p class="contact-list__label">Viber ${ctx.cfg.viber.confirmed === false ? tbc(ctx, 'Confirm which number has Viber.') : ''}</p><a class="contact-list__value" href="${viberHref(ctx.cfg.viber)}">Chat on Viber · ${esc(ctx.cfg.viber.number)}</a></div></li>` : ''}
  ${ctx.cfg.social.map((s) => `<li>${icon(s.icon)}<div><p class="contact-list__label">${s.name}</p><a class="contact-list__value" href="${s.url}" target="_blank" rel="noopener">Message us on ${s.name}</a></div></li>`).join('')}
</ul>`;
}

/* ---------- Inquiry form ---------- */
function inquiryForm(ctx) {
  const f = ctx.cfg.form;
  const field = (id, label, { type = 'text', required = true, auto = '', hint = '' } = {}) => `<div class="field">
    <label for="${id}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(optional)</span>'}</label>
    <input id="${id}" name="${id}" type="${type}"${required ? ' required' : ''}${auto ? ` autocomplete="${auto}"` : ''}${hint ? ` aria-describedby="${id}-hint"` : ''}>
    ${hint ? `<p class="field__hint" id="${id}-hint">${hint}</p>` : ''}
    <p class="field__error" id="${id}-error" hidden></p>
  </div>`;
  return `<form class="form" novalidate data-inquiry-form data-endpoint="${esc(f.endpoint)}" data-fallback-email="${esc(f.fallbackEmail)}">
  <div class="form__grid">
    ${field('name', 'Full name', { auto: 'name' })}
    ${field('organization', 'Organization', { auto: 'organization', hint: 'Hospital, clinic, pharmacy or company' })}
    ${field('phone', 'Phone', { type: 'tel', auto: 'tel' })}
    ${field('email', 'Email', { type: 'email', auto: 'email' })}
  </div>
  <div class="field">
    <label for="subject">Subject <span class="req" aria-hidden="true">*</span></label>
    <select id="subject" name="subject" required>
      <option value="">Select a subject</option>
      ${['Product information', 'Distribution / supply inquiry', ...ctx.products.map((p) => `Product inquiry: ${p.name}`), 'Partnership', 'Other']
        .map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}
    </select>
    <p class="field__error" id="subject-error" hidden></p>
  </div>
  <div class="field">
    <label for="message">Message <span class="req" aria-hidden="true">*</span></label>
    <textarea id="message" name="message" rows="5" required minlength="10"></textarea>
    <p class="field__error" id="message-error" hidden></p>
  </div>
  <p class="form__note">${icon('info')}<span>We supply licensed hospitals, clinics and pharmacies. Please don’t include patient details. For medical advice, speak to a healthcare professional.</span></p>
  <div class="form__actions">
    <button class="btn btn--primary" type="submit"><span>Send Inquiry</span>${icon('send', 'btn__icon')}</button>
    <p class="form__req"><span aria-hidden="true">*</span> Required</p>
  </div>
  <div class="form__status" role="status" aria-live="polite" tabindex="-1" hidden></div>
</form>`;
}

/* ---------- CTA band ---------- */
/** Side-effect (adverse reaction) report form. Uses the same JS as the inquiry form. */
function sideEffectForm(ctx) {
  const f = ctx.cfg.form;
  const req = ' <span class="req" aria-hidden="true">*</span>';
  const opt = ' <span class="opt">(optional)</span>';
  const input = (id, label, { type = 'text', required = true, auto = '', hint = '' } = {}) => `<div class="field">
    <label for="${id}">${label}${required ? req : opt}</label>
    <input id="${id}" name="${id}" type="${type}"${required ? ' required' : ''}${auto ? ` autocomplete="${auto}"` : ''}${hint ? ` aria-describedby="${id}-hint"` : ''}>
    ${hint ? `<p class="field__hint" id="${id}-hint">${hint}</p>` : ''}
    <p class="field__error" id="${id}-error" hidden></p>
  </div>`;
  const select = (id, label, options, { required = true } = {}) => `<div class="field">
    <label for="${id}">${label}${required ? req : opt}</label>
    <select id="${id}" name="${id}"${required ? ' required' : ''}>
      <option value="">Select</option>
      ${options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}
    </select>
    <p class="field__error" id="${id}-error" hidden></p>
  </div>`;
  return `<form class="form" novalidate data-inquiry-form data-mail-subject="[Side effect report]" data-endpoint="${esc(f.endpoint)}" data-fallback-email="${esc(ctx.cfg.safetyReports.email)}">
  <fieldset class="form__set">
    <legend>About you</legend>
    <div class="form__grid">
      ${input('name', 'Full name', { auto: 'name' })}
      ${select('reporter', 'You are a', ['Doctor', 'Nurse or midwife', 'Pharmacist', 'Other healthcare professional', 'Patient', 'Family member or carer'])}
      ${input('phone', 'Phone', { type: 'tel', auto: 'tel' })}
      ${input('email', 'Email', { type: 'email', auto: 'email', required: false })}
    </div>
    ${input('organization', 'Hospital, clinic or pharmacy', { auto: 'organization', required: false })}
  </fieldset>
  <fieldset class="form__set">
    <legend>The medicine</legend>
    <div class="form__grid">
      ${select('product', 'Product', [...ctx.products.map((p) => p.name), 'Not sure'])}
      ${input('batch', 'Batch / lot number', { required: false, hint: 'Printed on the box or ampoule, often after “Batch No.” or “Lot”.' })}
    </div>
  </fieldset>
  <fieldset class="form__set">
    <legend>The reaction</legend>
    <div class="form__grid">
      ${input('started', 'When did it start?', { type: 'date', required: false })}
      ${select('serious', 'How serious is it?', ['Mild', 'Needed medical treatment', 'Needed hospital care', 'Life-threatening', 'Not sure'])}
    </div>
    <div class="field">
      <label for="message">What happened?${req}</label>
      <textarea id="message" name="message" rows="5" required minlength="10" aria-describedby="message-hint"></textarea>
      <p class="field__hint" id="message-hint">Describe the reaction, what was done, and how the person is now. Don’t include the patient’s full name.</p>
      <p class="field__error" id="message-error" hidden></p>
    </div>
  </fieldset>
  <p class="form__note">${icon('lock')}<span>We use this report only to assess the safety of the medicine and, where required, to inform the manufacturer and the health authorities. See our <a href="${ctx.url('/privacy/')}">Privacy Policy</a>.</span></p>
  <div class="form__actions">
    <button class="btn btn--primary" type="submit" data-label="Send report"><span>Send report</span>${icon('send', 'btn__icon')}</button>
    <p class="form__req"><span aria-hidden="true">*</span> Required</p>
  </div>
  <div class="form__status" role="status" aria-live="polite" tabindex="-1" hidden></div>
</form>`;
}
function ctaBand(ctx, { title = 'Work with MMMPharma', text = 'Contact our team for product information and distribution inquiries from hospitals, clinics and pharmacies.' } = {}) {
  const p = ctx.cfg.contact.phones[0];
  return `<section class="cta-band" aria-labelledby="cta-title">
  <div class="container cta-band__inner reveal">
    <div>
      <h2 id="cta-title">${esc(title)}</h2>
      <p>${esc(text)}</p>
    </div>
    <div class="cta-band__actions">
      ${button(ctx, { href: '/contact/', label: 'Contact Us', variant: 'light', iconName: 'arrow' })}
      <a class="btn btn--outline-light" href="tel:${p.tel}">${icon('phone', 'btn__icon')}<span>${esc(p.number)}</span></a>
    </div>
  </div>
</section>`;
}

/* ---------- Trusted-by logo strip (renders only with real logos) ---------- */
function logoStrip(ctx) {
  const list = ctx.cfg.clients;
  if (!list || !list.length) return '';
  return `<section class="section section--tight" aria-labelledby="trusted-title">
  <div class="container">
    <h2 class="logos__title" id="trusted-title">Trusted by healthcare organisations across Myanmar</h2>
    <ul class="logos">${list.map((c) => `<li>${img(ctx, c.logo, c.name, { w: 160, h: 64 })}</li>`).join('')}</ul>
  </div>
</section>`;
}

function slugify(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

module.exports = { productCard, specSheet, articleCard, articleCover, newsCard, faqList, contactList, inquiryForm, sideEffectForm, ctaBand, logoStrip, slugify };
