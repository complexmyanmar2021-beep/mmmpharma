// Page templates. Each returns a full HTML document string.
const { head, header, footer, pageHero } = require('./components/layout');
const { esc, icon, img, val, button, sectionHeading, tbc, formatDate } = require('./components/ui');
const B = require('./components/blocks');
const company = require('./data/company');
const { categories: faqCats, faqs } = require('./data/faqs');

/* ---------- Structured data helpers ---------- */
function orgLd(ctx) {
  const { cfg } = ctx;
  const c = cfg.contact;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': cfg.siteUrl + '/#organization',
    name: cfg.company.legalName,
    alternateName: cfg.company.brand,
    url: cfg.siteUrl + '/',
    logo: `${ctx.absImageBase}/${cfg.company.logo}`,
    foundingDate: String(cfg.company.foundingYear),
    description: cfg.company.summary,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address.lines.slice(0, 2).join(', '),
      addressLocality: c.address.locality,
      addressCountry: c.address.country,
    },
    sameAs: cfg.social.map((s) => s.url),
  };
  // Only CONFIRMED phone numbers / emails go into structured data.
  const phones = c.phones.filter((p) => p.confirmed);
  const emails = c.emails.filter((e) => e.confirmed);
  if (phones.length || emails.length) {
    ld.contactPoint = [{ '@type': 'ContactPoint', contactType: 'customer service', areaServed: 'MM', availableLanguage: ['en', 'my'], ...(phones[0] && { telephone: phones[0].tel }), ...(emails[0] && { email: emails[0].address }) }];
  }
  return ld;
}
function crumbsLd(ctx, items) {
  const all = [{ label: 'Home', href: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: ctx.cfg.siteUrl + it.href })),
  };
}
const page = (ctx, meta, body) => head(ctx, meta) + header(ctx) + body + footer(ctx);

/* =====================================================================
   HOME
   ===================================================================== */
function home(ctx) {
  const { cfg, products, articles, news } = ctx;
  const ox = products[0];
  const creds = company.strengths.filter((s) => s.icon !== 'handshake');
  const sv = (label) => { const s = ox.specs.find((x) => x.label === label); return s ? (typeof s.value === 'object' ? s.value.value : s.value) : ''; };

  const body = `
<section class="hero">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="container hero__grid">
    <div class="hero__text">
      <p class="eyebrow eyebrow--pill">${icon('shield')}Licensed pharmaceutical distributor · Since ${cfg.company.foundingYear}</p>
      <h1 class="hero__title">Your health is <span>our priority.</span></h1>
      <p class="hero__lead">${esc(cfg.company.legalName)} is a trusted supplier of high-quality pharmaceutical products, serving Myanmar’s healthcare sector since ${cfg.company.foundingYear}.</p>
      <div class="hero__actions">
        ${button(ctx, { href: '/products/', label: 'Explore Our Products', iconName: 'arrow' })}
        ${button(ctx, { href: '/about/', label: 'About MMMPharma', variant: 'secondary' })}
      </div>
      <p class="hero__audience">${icon('hospital')}Supplying licensed hospitals, clinics and pharmacies</p>
    </div>
    <div class="hero__visual">
      <div class="hero__stage">
        <span class="hero__leaf" aria-hidden="true"><img src="${ctx.imageBase}/${cfg.company.logo}" alt="" width="215" height="266"></span>
        ${img(ctx, products[1].image, products[1].imageAlt, { w: 600, h: 600, eager: true, cls: 'hero__pack hero__pack--b', label: '' })}
        ${img(ctx, products[0].image, products[0].imageAlt, { w: 800, h: 800, eager: true, cls: 'hero__pack hero__pack--a', label: '' })}
      </div>
      <div class="sheet" aria-label="Example product specification">
        <p class="sheet__head"><span>Product sheet</span><span class="sheet__rx">Rx</span></p>
        <p class="sheet__name">${esc(ox.fullName)}</p>
        <dl class="sheet__grid">
          <div><dt>Strength</dt><dd>${esc(sv('Strength'))}</dd></div>
          <div><dt>Route</dt><dd>${esc(sv('Route'))}</dd></div>
          <div><dt>Form</dt><dd>Injection</dd></div>
          <div><dt>Status</dt><dd>FDA Myanmar</dd></div>
        </dl>
        <a class="sheet__link" href="${ctx.url('/products/oxytocin/')}">View specification ${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>

<section class="creds" aria-label="Company credentials">
  <div class="container">
    <ul class="creds__list">
      ${creds.map((s) => `<li class="reveal">${icon(s.icon, 'creds__icon')}<div><h2 class="creds__title">${esc(s.title)}</h2><p>${esc(s.short)}</p></div></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="about-title">
  <div class="container split">
    <div class="split__media reveal">
      ${img(ctx, 'productimage.png', 'MMMPharma pharmaceutical products', { w: 800, h: 800, cls: 'media--frame', label: 'Maung Maung Myint Co., Ltd' })}
      <div class="since"><span class="since__year">${cfg.company.foundingYear}</span><span class="since__label">Serving Myanmar’s<br>healthcare sector since</span></div>
    </div>
    <div class="split__text reveal">
      ${sectionHeading({ eyebrow: 'About MMMPharma', title: 'A licensed distributor for Myanmar’s healthcare sector', id: 'about-title' })}
      <p class="lead">${esc(cfg.company.since)}</p>
      <p>${esc(cfg.company.story)} We work with licensed hospitals, clinics and pharmacies, and focus on:</p>
      <ul class="checks">
        <li>${icon('check')}Pharmaceutical distribution</li>
        <li>${icon('check')}Product quality and safety</li>
        <li>${icon('check')}Reliable, dependable supply</li>
        <li>${icon('check')}Access to healthcare</li>
        <li>${icon('check')}Long-term relationships</li>
        <li>${icon('check')}Regulatory responsibility</li>
      </ul>
      ${button(ctx, { href: '/about/', label: 'Discover Our Story', iconName: 'arrow' })}
    </div>
  </div>
</section>

<section class="section section--cream" aria-labelledby="products-title">
  <div class="container">
    <div class="section__head">
      ${sectionHeading({ eyebrow: 'Our products', title: 'Quality pharmaceuticals for professional use', lead: 'Approved by FDA Myanmar and sourced from WHO-GMP certified manufacturers. Supplied to licensed healthcare institutions only.', id: 'products-title' })}
      ${button(ctx, { href: '/products/', label: 'View all products', variant: 'ghost', iconName: 'arrow' })}
    </div>
    <div class="pgrid">${products.map((p) => B.productCard(ctx, p)).join('')}</div>
  </div>
</section>

<section class="section section--dark" aria-labelledby="why-title">
  <div class="container">
    ${sectionHeading({ eyebrow: 'Why choose MMMPharma', title: 'Built on quality, compliance and dependable supply', id: 'why-title', light: true })}
    <ul class="why">
      ${company.strengths.map((s) => `<li class="why__item reveal">${icon(s.icon, 'why__icon')}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}
    </ul>
  </div>
</section>

${valuesSection(ctx)}

${B.logoStrip(ctx)}

<section class="section section--cream" aria-labelledby="hk-title">
  <div class="container">
    <div class="section__head">
      ${sectionHeading({ eyebrow: 'Health & Knowledge', title: 'Trustworthy information on medicines and public health', lead: 'Articles on medicine safety, storage, maternal health and international health-awareness days.', id: 'hk-title' })}
      ${button(ctx, { href: '/health-knowledge/', label: 'Explore Health & Knowledge', variant: 'ghost', iconName: 'arrow' })}
    </div>
    <div class="agrid">${articles.slice(0, 3).map((a) => B.articleCard(ctx, a)).join('')}</div>
  </div>
</section>

<section class="section" aria-labelledby="news-title">
  <div class="container">
    <div class="section__head">
      ${sectionHeading({ eyebrow: 'Latest news', title: 'News and regulatory updates', id: 'news-title' })}
      ${button(ctx, { href: '/news/', label: 'All news', variant: 'ghost', iconName: 'arrow' })}
    </div>
    <div class="ngrid">${news.slice(0, 3).map((n) => B.newsCard(ctx, n)).join('')}</div>
  </div>
</section>

<section class="section section--cream" aria-labelledby="faq-title">
  <div class="container faq-split">
    <div class="reveal">
      ${sectionHeading({ eyebrow: 'FAQs', title: 'Frequently asked questions', id: 'faq-title' })}
      <p>Answers about our products, storage, distribution and company. For clinical questions, please consult a qualified healthcare professional.</p>
      ${button(ctx, { href: '/faqs/', label: 'View all FAQs', variant: 'secondary', iconName: 'arrow' })}
    </div>
    <div class="reveal">${B.faqList(ctx, faqs.filter((f) => f.home), { idPrefix: 'home-faq' })}</div>
  </div>
</section>

${B.ctaBand(ctx)}`;

  return page(ctx, {
    title: 'MMMPharma | Pharmaceutical Distributor in Myanmar – Maung Maung Myint Co., Ltd',
    description: `Maung Maung Myint Co., Ltd (MMMPharma) is a licensed pharmaceutical distributor in Myanmar since ${cfg.company.foundingYear}, supplying FDA Myanmar-approved, GMP-certified products to hospitals, clinics and pharmacies.`,
    jsonld: [orgLd(ctx), { '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.company.brand, url: cfg.siteUrl + '/', publisher: { '@id': cfg.siteUrl + '/#organization' } }],
  }, body);
}

function valuesSection(ctx) {
  return `<section class="section values" aria-labelledby="values-title">
  <div class="container">
    ${sectionHeading({ eyebrow: 'Our core values', title: 'Four values guide how we source, store and supply medicines', align: 'center', id: 'values-title' })}
    <ul class="values__list">
      ${company.values.map((v) => `<li class="values__item reveal"><span class="values__icon">${icon(v.icon)}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></li>`).join('')}
    </ul>
  </div>
</section>`;
}

/* =====================================================================
   ABOUT
   ===================================================================== */
function about(ctx) {
  const { cfg } = ctx;
  const crumbs = [{ label: 'About Us', href: '/about/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'About us', title: 'Serving Myanmar’s healthcare sector since 2013', lead: cfg.company.since })}

<section class="section" aria-labelledby="story-title">
  <div class="container split">
    <div class="split__text reveal">
      ${sectionHeading({ eyebrow: 'Our story', title: 'Safe, effective and trusted pharmaceutical products', id: 'story-title' })}
      <p class="lead">${esc(cfg.company.story)}</p>
      <p>${esc(cfg.company.summary)}</p>
      <p>We supply our products to ${esc(cfg.company.customers.toLowerCase())}, and we do not sell directly to individuals.</p>
    </div>
    <div class="split__media reveal">
      ${img(ctx, 'productimage.png', 'MMMPharma pharmaceutical products', { w: 800, h: 800, cls: 'media--frame', label: 'Maung Maung Myint Co., Ltd' })}
      <div class="since"><span class="since__year">${cfg.company.foundingYear}</span><span class="since__label">Established<br>in Yangon</span></div>
    </div>
  </div>
</section>

<section class="section section--cream" aria-label="Mission and vision">
  <div class="container mv">
    <article class="mv__card reveal">
      <p class="eyebrow">Our mission</p>
      <p class="mv__text">${esc(cfg.company.mission)}</p>
    </article>
    <article class="mv__card mv__card--dark reveal">
      <p class="eyebrow">Our vision</p>
      <p class="mv__text">${esc(cfg.company.vision)}</p>
    </article>
  </div>
</section>

${valuesSection(ctx)}

<section class="section section--dark" aria-labelledby="strengths-title">
  <div class="container">
    ${sectionHeading({ eyebrow: 'What we stand for', title: 'How we work', id: 'strengths-title', light: true })}
    <ul class="why">
      ${company.strengths.map((s) => `<li class="why__item reveal">${icon(s.icon, 'why__icon')}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="serve-title">
  <div class="container">
    ${sectionHeading({ eyebrow: 'Who we serve', title: 'A business-to-business distributor', lead: 'Our products are prescription medicines for professional use. We supply them only to licensed healthcare institutions.', id: 'serve-title', align: 'center' })}
    <ul class="serve">
      <li class="reveal">${icon('hospital')}<h3>Hospitals</h3></li>
      <li class="reveal">${icon('heart')}<h3>Clinics</h3></li>
      <li class="reveal">${icon('pill')}<h3>Pharmacies</h3></li>
    </ul>
  </div>
</section>

${B.logoStrip(ctx)}
${B.ctaBand(ctx)}`;
  return page(ctx, {
    title: 'About Us',
    description: `Learn about Maung Maung Myint Co., Ltd (MMMPharma), a licensed pharmaceutical company in Myanmar serving the healthcare sector since ${cfg.company.foundingYear}. Our mission, vision and core values.`,
    jsonld: [orgLd(ctx), crumbsLd(ctx, crumbs)],
  }, body);
}

/* =====================================================================
   PRODUCTS
   ===================================================================== */
function productsIndex(ctx) {
  const crumbs = [{ label: 'Products', href: '/products/' }];
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Our products', title: 'Pharmaceutical products', lead: 'All products offered by Maung Maung Myint Co., Ltd are approved by FDA Myanmar and sourced from GMP-certified manufacturers, to meet high standards of safety and quality.' })}
<section class="section" aria-labelledby="catalogue-title">
  <div class="container">
    <div class="notice reveal">${icon('info')}<p><strong>For healthcare professionals.</strong> These are prescription medicines, supplied only to licensed hospitals, clinics and pharmacies. Always refer to the approved product leaflet for full prescribing information.</p></div>
    <h2 class="sr-only" id="catalogue-title">Product catalogue</h2>
    <div class="pgrid">${ctx.products.map((p) => B.productCard(ctx, p)).join('')}</div>
  </div>
</section>
<section class="section section--cream section--tight" aria-labelledby="quality-title">
  <div class="container quality">
    ${sectionHeading({ eyebrow: 'Quality & compliance', title: 'Every product, sourced with care', id: 'quality-title' })}
    <ul class="quality__list">
      ${company.strengths.filter((s) => ['shield', 'badge', 'clipboard'].includes(s.icon)).map((s) => `<li class="reveal">${icon(s.icon)}<div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}
    </ul>
  </div>
</section>
${B.ctaBand(ctx, { title: 'Need product information?', text: 'Our team can help hospitals, clinics and pharmacies with product details and supply inquiries.' })}`;
  return page(ctx, {
    title: 'Products',
    description: 'Pharmaceutical products distributed by MMMPharma in Myanmar, including Oxytocin Injection USP and Amrokort (triamcinolone acetonide) injection, for licensed healthcare institutions.',
    jsonld: [crumbsLd(ctx, crumbs)],
  }, body);
}

function productDetail(ctx, p) {
  const crumbs = [{ label: 'Products', href: '/products/' }, { label: p.name, href: `/products/${p.slug}/` }];
  const others = ctx.products.filter((x) => x.slug !== p.slug);
  const storageSpec = p.specs.find((s) => s.label === 'Storage');
  const body = `
<section class="page-hero page-hero--product">
  <div class="container pd-hero">
    <div class="pd-hero__text">
      ${require('./components/ui').breadcrumb(ctx, crumbs)}
      <p class="chip">${esc(p.category)}</p>
      <h1>${esc(p.fullName)}</h1>
      <p class="lead">${esc(p.cardSummary)}</p>
      <ul class="pd-badges">
        ${p.regulatory.map((r) => `<li>${icon('check')}${esc(r)}</li>`).join('')}
      </ul>
      <div class="hero__actions">
        ${button(ctx, { href: `/contact/?subject=${encodeURIComponent('Product inquiry: ' + p.name)}`, label: 'Request product information', iconName: 'arrow' })}
      </div>
    </div>
    <div class="pd-hero__media">
      ${img(ctx, p.image, p.imageAlt, { w: 900, h: 700, eager: true, cls: 'media--frame', label: p.fullName })}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="info-title">
  <div class="container pd">
    <div class="pd__main">
      <h2 id="info-title" class="pd__h">Product information</h2>
      ${B.specSheet(ctx, p)}

      <h2 class="pd__h">Overview</h2>
      <p>${esc(p.overview)}</p>

      <h2 class="pd__h">Therapeutic use</h2>
      <p class="muted">As stated in the product information:</p>
      <ul class="checks checks--list">${p.uses.map((u) => `<li>${icon('check')}${esc(u)}</li>`).join('')}</ul>

      <h2 class="pd__h">Storage</h2>
      <div class="storage">${icon('thermo', 'storage__icon')}<div><p class="storage__value">${val(ctx, storageSpec.value)}</p><p>Follow the storage instructions printed on the box, or consult a licensed pharmacist.</p></div></div>

      <h2 class="pd__h">Quality &amp; regulatory information</h2>
      <ul class="checks checks--list">${p.regulatory.map((r) => `<li>${icon('shield')}${esc(r)}</li>`).join('')}</ul>

      <aside class="safety" aria-labelledby="safety-title">
        <h2 id="safety-title">${icon('alert')}Important safety information</h2>
        <p>${esc(p.fullName)} is a prescription medicine. It must only be used by, or under the supervision of, a qualified healthcare professional.</p>
        <p>This page is not a substitute for the approved product leaflet. Refer to the package insert for full prescribing information, including dosage, contraindications, warnings and side effects.</p>
        <p><a class="link-arrow" href="${ctx.url('/report-side-effect/')}">Report a side effect ${icon('arrow')}</a></p>
      </aside>
    </div>

    <aside class="pd__side">
      <div class="inquiry-card">
        <p class="eyebrow">Distribution inquiry</p>
        <h2>Order or request information</h2>
        <p>We supply ${esc(p.name)} to licensed hospitals, clinics and pharmacies in Myanmar.</p>
        ${button(ctx, { href: `/contact/?subject=${encodeURIComponent('Product inquiry: ' + p.name)}`, label: 'Send an inquiry', iconName: 'arrow', attrs: '' }).replace('class="btn', 'class="btn btn--block')}
        <p class="inquiry-card__hours">${icon('clock')}${esc(ctx.cfg.contact.hours)}</p>
      </div>
      <div class="pd__photo">${img(ctx, p.heroImage, p.heroImageAlt, { w: 700, h: 500, label: p.name })}</div>
    </aside>
  </div>
</section>

${others.length ? `<section class="section section--cream" aria-labelledby="more-title">
  <div class="container">
    ${sectionHeading({ eyebrow: 'Our products', title: 'Other products', id: 'more-title' })}
    <div class="pgrid">${others.map((o) => B.productCard(ctx, o)).join('')}</div>
  </div>
</section>` : ''}
${B.ctaBand(ctx)}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: p.fullName,
    nonProprietaryName: p.genericName,
    image: `${ctx.absImageBase}/${p.image}`,
    url: ctx.cfg.siteUrl + `/products/${p.slug}/`,
    prescriptionStatus: 'https://schema.org/PrescriptionOnly',
    dosageForm: (p.specs.find((s) => s.label === 'Dosage form') || {}).value,
  };
  return page(ctx, {
    title: `${p.fullName}`,
    description: `${p.fullName} — ${p.cardSummary} Distributed in Myanmar by Maung Maung Myint Co., Ltd to licensed healthcare institutions.`,
    type: 'product',
    image: `${ctx.absImageBase}/${p.image}`,
    jsonld: [ld, crumbsLd(ctx, crumbs)],
  }, body);
}

/* =====================================================================
   HEALTH & KNOWLEDGE
   ===================================================================== */
function healthIndex(ctx) {
  const crumbs = [{ label: 'Health & Knowledge', href: '/health-knowledge/' }];
  const [feat, ...rest] = ctx.articles;
  const used = new Set(ctx.articles.map((a) => a.category));
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Health & Knowledge', title: 'Health information you can trust', lead: 'Articles on medicine safety, storage, maternal health and public health from MMMPharma. General information only; it does not replace advice from a healthcare professional.' })}

<section class="section" aria-labelledby="articles-title">
  <div class="container">
    <h2 class="sr-only" id="articles-title">Articles</h2>
    ${ctx.articles.some((a) => a.status === 'demo') ? `<div class="notice notice--demo">${icon('info')}<p><strong>Sample content.</strong> The articles below are layout samples. They will be replaced with articles written or reviewed by qualified healthcare professionals.</p></div>` : ''}
    <div class="filters" role="group" aria-label="Filter articles by category" data-filters>
      <button type="button" class="filter" aria-pressed="true" data-filter="all">All topics</button>
      ${company.healthCategories.map((c) => `<button type="button" class="filter" aria-pressed="false" data-filter="${esc(c)}"${used.has(c) ? '' : ' data-empty'}>${esc(c)}</button>`).join('')}
    </div>
    ${feat ? B.articleCard(ctx, feat, { featured: true }) : ''}
    <div class="agrid" data-article-grid>${rest.map((a) => B.articleCard(ctx, a)).join('')}</div>
    <p class="empty" data-empty-msg hidden>No articles in this category yet. New articles are added regularly.</p>
  </div>
</section>

<section class="section section--cream" id="awareness" aria-labelledby="aw-title">
  <div class="container aw">
    <div class="reveal">
      ${sectionHeading({ eyebrow: 'World health awareness', title: 'Marking international health occasions', id: 'aw-title' })}
      <p>MMMPharma publishes content around major international health-awareness occasions, with themes and dates taken from the official announcements each year.</p>
    </div>
    <ul class="aw__list">
      ${company.awarenessOccasions.map((o) => {
        const a = ctx.articles.find((x) => x.awareness === o);
        return `<li class="reveal">${icon('calendar')}<span>${esc(o)}</span>${a ? `<a class="link-arrow" href="${ctx.url(`/health-knowledge/${a.slug}/`)}" aria-label="Read: ${esc(a.title)}">Read ${icon('arrow')}</a>` : '<span class="aw__soon">Coming soon</span>'}</li>`;
      }).join('')}
    </ul>
  </div>
</section>
${B.ctaBand(ctx)}`;
  return page(ctx, {
    title: 'Health & Knowledge',
    description: 'Health and medicine information from MMMPharma: medicine safety, medicine storage, maternal health, patient safety and world health-awareness days in Myanmar.',
    jsonld: [crumbsLd(ctx, crumbs)],
  }, body);
}

function article(ctx, a) {
  const crumbs = [{ label: 'Health & Knowledge', href: '/health-knowledge/' }, { label: a.title, href: `/health-knowledge/${a.slug}/` }];
  const related = ctx.articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const date = formatDate(a.date);
  const body = `
<article>
  <header class="page-hero page-hero--article">
    <div class="container article__head">
      ${require('./components/ui').breadcrumb(ctx, crumbs)}
      <p class="acard__meta"><span class="chip">${esc(a.category)}</span>${a.awareness ? `<span class="chip chip--gold">${esc(a.awareness)}</span>` : ''}${a.status === 'demo' ? '<span class="chip chip--demo">Sample article</span>' : ''}</p>
      <h1>${esc(a.title)}</h1>
      <p class="lead">${esc(a.summary)}</p>
      <p class="article__byline">${esc(a.author || 'MMMPharma')}${date && a.status !== 'demo' ? ` · <time datetime="${a.date}">${date}</time>` : ''}${a.reviewedBy ? ` · Reviewed by ${esc(a.reviewedBy)}` : ''} · ${a.readMins} min read</p>
    </div>
  </header>
  <div class="container article">
    <div class="article__cover">${B.articleCover(ctx, a, { eager: true })}</div>
    <div class="prose">${a.html}</div>
    <aside class="safety safety--soft">
      <h2>${icon('info')}Medical disclaimer</h2>
      <p>${esc(ctx.cfg.medicalDisclaimer)}</p>
    </aside>
  </div>
</article>
${related.length ? `<section class="section section--cream" aria-labelledby="rel-title"><div class="container">${sectionHeading({ eyebrow: 'Keep reading', title: 'More from Health & Knowledge', id: 'rel-title' })}<div class="agrid">${related.map((r) => B.articleCard(ctx, r)).join('')}</div></div></section>` : ''}`;
  const jsonld = [crumbsLd(ctx, crumbs)];
  if (a.status === 'published') {
    jsonld.push({ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.summary, datePublished: a.date, author: { '@type': 'Organization', name: ctx.cfg.company.legalName }, publisher: { '@id': ctx.cfg.siteUrl + '/#organization' } });
  }
  return page(ctx, { title: a.title, description: a.summary, type: 'article', noindex: a.status !== 'published', jsonld }, body);
}

/* =====================================================================
   NEWS
   ===================================================================== */
function newsIndex(ctx) {
  const crumbs = [{ label: 'News', href: '/news/' }];
  const companyNews = ctx.news.filter((n) => n.type === 'company');
  const media = ctx.news.filter((n) => n.type === 'media');
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'News', title: 'News and updates', lead: 'Company announcements from MMMPharma, plus regulatory and public-health news relevant to pharmaceutical supply in Myanmar.' })}
<section class="section" aria-labelledby="company-news-title">
  <div class="container">
    ${sectionHeading({ eyebrow: 'Company', title: 'Company announcements', id: 'company-news-title' })}
    ${companyNews.length ? `<div class="ngrid">${companyNews.map((n) => B.newsCard(ctx, n)).join('')}</div>` : `<div class="empty-state reveal">${icon('news')}<p>Company announcements will be published here.</p></div>`}
  </div>
</section>
<section class="section section--cream" aria-labelledby="media-title">
  <div class="container">
    ${sectionHeading({ eyebrow: 'In the news', title: 'Regulatory and public-health news', lead: 'Links to news published by other organisations. They open on the original website.', id: 'media-title' })}
    <div class="ngrid">${media.map((n) => B.newsCard(ctx, n)).join('')}</div>
  </div>
</section>
${B.ctaBand(ctx)}`;
  return page(ctx, {
    title: 'News',
    description: 'News from MMMPharma and regulatory updates on pharmaceutical products in Myanmar, including public notices on unregistered oxytocin.',
    jsonld: [crumbsLd(ctx, crumbs)],
  }, body);
}

/* =====================================================================
   FAQs
   ===================================================================== */
function faqPage(ctx) {
  const crumbs = [{ label: 'FAQs', href: '/faqs/' }];
  const cats = faqCats.filter((c) => faqs.some((f) => f.cat === c.id));
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'FAQs', title: 'Frequently asked questions', lead: 'Answers about our products, safety, storage, distribution and company.' })}
<section class="section">
  <div class="container faqp">
    <nav class="faqp__nav" aria-label="FAQ categories">
      <p class="faqp__navtitle">Categories</p>
      <ul>${cats.map((c) => `<li><a href="#${c.id}">${esc(c.label)}<span>${faqs.filter((f) => f.cat === c.id).length}</span></a></li>`).join('')}</ul>
    </nav>
    <div class="faqp__main">
      <div class="notice">${icon('info')}<p>${esc(ctx.cfg.medicalDisclaimer)}</p></div>
      ${cats.map((c) => `<section class="faqp__group" id="${c.id}" aria-labelledby="${c.id}-title"><h2 id="${c.id}-title">${esc(c.label)}</h2>${B.faqList(ctx, faqs.filter((f) => f.cat === c.id), { idPrefix: c.id })}</section>`).join('')}
      <div class="faqp__more">
        <h2>Still have a question?</h2>
        <p>Our team is available ${esc(ctx.cfg.contact.hours)}.</p>
        ${button(ctx, { href: '/contact/', label: 'Contact Us', iconName: 'arrow' })}
      </div>
    </div>
  </div>
</section>`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.filter((f) => !f.pending).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return page(ctx, {
    title: 'FAQs',
    description: 'Frequently asked questions about MMMPharma products, oxytocin, storage, safety and pharmaceutical distribution to hospitals, clinics and pharmacies in Myanmar.',
    jsonld: [ld, crumbsLd(ctx, crumbs)],
  }, body);
}

/* =====================================================================
   CONTACT
   ===================================================================== */
function contact(ctx) {
  const crumbs = [{ label: 'Contact Us', href: '/contact/' }];
  const c = ctx.cfg.contact;
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Contact us', title: 'Get in touch with MMMPharma', lead: 'For product information, distribution and supply inquiries from hospitals, clinics and pharmacies.' })}
<section class="section">
  <div class="container contact">
    <div class="contact__info">
      <h2 class="pd__h">Contact details</h2>
      ${B.contactList(ctx)}
      <div class="urgent">${icon('phone')}<div><p class="urgent__label">Urgent inquiries ${c.urgentPhone.confirmed ? '' : tbc(ctx)}</p><a href="tel:${c.urgentPhone.tel}">${esc(c.urgentPhone.number)}</a></div></div>
    </div>
    <div class="contact__form">
      <h2 class="pd__h">Send an inquiry</h2>
      <p class="muted">We’ll reply by email or phone during office hours.</p>
      ${B.inquiryForm(ctx)}
    </div>
  </div>
</section>
<section class="map" aria-label="Office location">
  <div class="map__frame" data-map data-src="${esc(c.map.embed)}">
    <div class="map__placeholder">
      ${icon('pin', 'map__pin')}
      <p><strong>${esc(ctx.cfg.company.legalName)}</strong><br>${c.address.lines.map(esc).join(', ')}</p>
      <div class="map__actions">
        <button class="btn btn--primary" type="button" data-map-load><span>Show map</span></button>
        <a class="btn btn--secondary" href="${c.map.link}" target="_blank" rel="noopener"><span>Open in Google Maps</span>${icon('external', 'btn__icon')}</a>
      </div>
    </div>
  </div>
</section>`;
  return page(ctx, {
    title: 'Contact Us',
    description: 'Contact Maung Maung Myint Co., Ltd (MMMPharma) in Yangon, Myanmar for pharmaceutical product and distribution inquiries. Office hours Monday–Friday, 9 AM–5 PM.',
    jsonld: [orgLd(ctx), crumbsLd(ctx, crumbs)],
  }, body);
}

/* =====================================================================
   REPORT A SIDE EFFECT
   ===================================================================== */
function reportSideEffect(ctx) {
  const crumbs = [{ label: 'Report a side effect', href: '/report-side-effect/' }];
  const c = ctx.cfg.contact;
  const sr = ctx.cfg.safetyReports;
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Medicine safety', title: 'Report a side effect', lead: 'If you think one of our products has caused a side effect or another problem, please tell us. Every report helps keep medicines safe.' })}
<section class="section">
  <div class="container contact">
    <div class="contact__info">
      <div class="emergency" role="note">${icon('alert')}<div><p class="emergency__title">Is this an emergency?</p><p>If someone is seriously unwell, get medical help now. Go to the nearest hospital emergency department. Don’t wait for a reply from us.</p></div></div>

      <h2 class="pd__h">What to report</h2>
      <ul class="checks checks--list">
        <li>${icon('check')}Any unwanted or unexpected reaction after using one of our products</li>
        <li>${icon('check')}A product that didn’t work as expected</li>
        <li>${icon('check')}Damaged, discoloured or unusual packaging or contents</li>
        <li>${icon('check')}A product you think may be counterfeit</li>
      </ul>
      <p class="muted">You don’t need to be sure the medicine caused the problem. Report it anyway.</p>

      <h2 class="pd__h">What happens next</h2>
      <ol class="steps">
        <li><strong>We review your report</strong><span>A member of our team will read it and may contact you for more details.</span></li>
        <li><strong>We share it with the manufacturer</strong><span>Where required, the report is passed to the manufacturer and the health authorities. Your contact details are kept confidential.</span></li>
        <li><strong>We keep a record</strong><span>Reports help us and the manufacturer spot safety problems early.</span></li>
      </ol>

      <h2 class="pd__h">Other ways to report</h2>
      <ul class="contact-list">
        <li>${icon('phone')}<div><p class="contact-list__label">Phone ${c.urgentPhone.confirmed ? '' : tbc(ctx)}</p><a class="contact-list__value" href="tel:${c.urgentPhone.tel}">${esc(c.urgentPhone.number)}</a></div></li>
        <li>${icon('mail')}<div><p class="contact-list__label">Email ${sr.confirmed ? '' : tbc(ctx, 'Confirm who receives safety reports.')}</p><a class="contact-list__value" href="mailto:${sr.email}?subject=${encodeURIComponent('[Side effect report]')}">${esc(sr.email)}</a></div></li>
      </ul>
      <p class="muted small">You can also report side effects directly to the Department of Food and Drug Administration (FDA Myanmar).</p>
    </div>
    <div class="contact__form">
      <h2 class="pd__h">Report form</h2>
      <p class="muted">Fill in what you know. Only the fields marked * are required.</p>
      ${B.sideEffectForm(ctx)}
    </div>
  </div>
</section>`;
  return page(ctx, {
    title: 'Report a side effect',
    description: 'Report a side effect, quality problem or suspected counterfeit of an MMMPharma product. For emergencies, seek medical help immediately.',
    jsonld: [crumbsLd(ctx, crumbs)],
  }, body);
}

/* =====================================================================
   LEGAL (Privacy Policy, Terms of Use)
   ===================================================================== */
function legalPage(ctx, { slug, title, lead, description, sections }) {
  const crumbs = [{ label: title, href: `/${slug}/` }];
  const { legal } = ctx.cfg;
  const body = `
${pageHero(ctx, { crumbs, eyebrow: 'Legal', title, lead })}
<section class="section">
  <div class="container legal">
    <nav class="legal__toc" aria-label="On this page">
      <p class="faqp__navtitle">On this page</p>
      <ol>${sections.map((s, i) => `<li><a href="#s${i + 1}">${esc(s.h)}</a></li>`).join('')}</ol>
    </nav>
    <div class="legal__body">
      ${legal.reviewed ? '' : `<div class="notice notice--demo">${icon('info')}<p>Draft for review. This page must be checked by the company’s legal adviser before launch.</p></div>`}
      <p class="article__byline">Last updated: <time datetime="${legal.updated}">${formatDate(legal.updated)}</time></p>
      <div class="prose">${sections.map((s, i) => `<h2 id="s${i + 1}">${esc(s.h)}</h2>${s.p.map((x) => (Array.isArray(x) ? `<ul>${x.map((li) => `<li>${li}</li>`).join('')}</ul>` : `<p>${x}</p>`)).join('')}`).join('')}</div>
    </div>
  </div>
</section>`;
  return page(ctx, { title, description, noindex: !legal.reviewed, jsonld: [crumbsLd(ctx, crumbs)] }, body);
}

function privacy(ctx) {
  const { cfg } = ctx;
  const co = esc(cfg.company.legalName);
  const mail = `<a href="mailto:${cfg.form.fallbackEmail}">${esc(cfg.form.fallbackEmail)}</a>`;
  return legalPage(ctx, {
    slug: 'privacy',
    title: 'Privacy Policy',
    lead: 'How we collect, use and protect the information you give us through this website.',
    description: `How ${cfg.company.legalName} (MMMPharma) collects, uses and protects personal information shared through this website.`,
    sections: [
      { h: 'Who we are', p: [`This website is run by ${co} (“MMMPharma”, “we”, “us”), a pharmaceutical distributor based in Yangon, Myanmar.`] },
      { h: 'Information we collect', p: ['We only collect information you choose to send us:', ['<strong>Inquiries:</strong> your name, organization, phone number, email address and message.', '<strong>Side-effect reports:</strong> your name and contact details, your role, the product and batch number, and a description of the reaction.'], 'We don’t ask for, and you shouldn’t send, a patient’s full name or other details that identify a patient.', 'This website doesn’t use advertising or tracking cookies.'] },
      { h: 'How we use it', p: [['To reply to your inquiry and supply our products.', 'To assess side-effect reports and, where required, share them with the manufacturer and the health authorities.', 'To meet our legal and regulatory obligations.'], 'We don’t sell your information or use it for marketing without your agreement.'] },
      { h: 'Who we share it with', p: ['We share information only when needed:', ['Manufacturers of the products we distribute, for safety reports and product complaints.', 'Health authorities in Myanmar, when the law requires it.', 'Service providers that deliver our website forms and email, who may only use it to provide that service.']] },
      { h: 'How long we keep it', p: ['We keep inquiries for as long as needed to deal with them and maintain our business records. Safety reports may be kept for longer, because medicine safety rules require it.'] },
      { h: 'Third-party services', p: ['The map on our Contact page is provided by Google Maps and only loads when you click “Show map”. Links to Facebook, Viber and other websites are covered by those services’ own privacy policies.'] },
      { h: 'Your choices', p: [`You can ask to see, correct or delete the information we hold about you. Email us at ${mail}. We may need to keep some safety information where the law requires it.`] },
      { h: 'Changes to this policy', p: ['We may update this policy from time to time. The date at the top shows when it last changed.'] },
      { h: 'Contact', p: [`${co}, ${cfg.contact.address.lines.map(esc).join(', ')}. Email: ${mail}.`] },
    ],
  });
}

function terms(ctx) {
  const { cfg } = ctx;
  const co = esc(cfg.company.legalName);
  return legalPage(ctx, {
    slug: 'terms',
    title: 'Terms of Use',
    lead: 'The rules for using this website.',
    description: `Terms of use for the ${cfg.company.legalName} (MMMPharma) website, including the medical information disclaimer.`,
    sections: [
      { h: 'About these terms', p: [`This website is run by ${co}. By using it, you agree to these terms. If you don’t agree, please don’t use the website.`] },
      { h: 'Medical information', p: [esc(cfg.medicalDisclaimer), 'Product information on this website is a summary. Always refer to the approved package insert. Don’t start, stop or change any treatment based on this website.'] },
      { h: 'Who we supply', p: [`We supply ${esc(cfg.company.customers.toLowerCase())}. Information on this website is not an offer to sell prescription medicines to the public.`] },
      { h: 'Accuracy', p: ['We work to keep the information on this website accurate and up to date, but we can’t guarantee it is complete or free of errors. Product details may change; the printed packaging and package insert take priority.'] },
      { h: 'Intellectual property', p: [`The text, design, logos and images on this website belong to ${co} or are used with permission. You may view and print pages for your own reference. Please ask us before reusing any content.`] },
      { h: 'Links to other websites', p: ['We link to news sites, social media and other services for convenience. We aren’t responsible for their content.'] },
      { h: 'Liability', p: ['To the extent the law allows, we aren’t liable for any loss that results from using this website or relying on its content.'] },
      { h: 'Governing law', p: ['These terms are governed by the laws of the Republic of the Union of Myanmar.'] },
      { h: 'Changes', p: ['We may update these terms. The date at the top shows when they last changed.'] },
    ],
  });
}

/* =====================================================================
   404
   ===================================================================== */
function notFound(ctx) {
  const body = `<section class="section nf"><div class="container nf__inner">
  <p class="nf__code">404</p>
  <h1>Page not found</h1>
  <p class="lead">The page you’re looking for has moved or no longer exists.</p>
  <div class="hero__actions">${button(ctx, { href: '/', label: 'Back to home', iconName: 'arrow' })}${button(ctx, { href: '/products/', label: 'View products', variant: 'secondary' })}</div>
</div></section>`;
  return page(ctx, { title: 'Page not found', description: 'The page you are looking for could not be found.', noindex: true }, body);
}

module.exports = { home, about, productsIndex, productDetail, healthIndex, article, newsIndex, faqPage, contact, reportSideEffect, privacy, terms, notFound };
