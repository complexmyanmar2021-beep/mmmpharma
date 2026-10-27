// Document shell, header, footer and inner-page hero.
const { esc, icon, breadcrumb, tbc } = require('./ui');

function head(ctx, { title, description, type = 'website', image = '', noindex = false, jsonld = [] }) {
  const { cfg } = ctx;
  const canonical = cfg.siteUrl + (ctx.outPath || ctx.path);
  const ogImage = image || `${ctx.absImageBase}/${cfg.company.ogImage}`;
  const fullTitle = ctx.path === '/' ? title : `${title} | ${cfg.company.brand}`;
  return `<!doctype html>
<html lang="${ctx.lang || 'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${(ctx.alternates || []).length > 1 && !noindex ? ctx.alternates.map((a) => `<link rel="alternate" hreflang="${a.code}" href="${a.abs}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${ctx.alternates[0].abs}">` : ''}
${noindex ? '<meta name="robots" content="noindex, follow">' : ''}
<meta name="theme-color" content="#3a0b11">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(cfg.company.brand)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:locale" content="${ctx.lang === 'my' ? 'my_MM' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="${ctx.imageBase}/${cfg.company.favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
${ctx.lang === 'my'
  ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap">'
  : '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@600&display=swap&text=%E1%80%99%E1%80%BC%E1%80%94%E1%80%BA%E1%80%99%E1%80%AC">'}
<link rel="stylesheet" href="${ctx.asset('css/styles.css')}">
<script defer src="${ctx.asset('js/main.js')}"></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>`;
}

function logo(ctx, { light = false } = {}) {
  const { cfg } = ctx;
  // Brand leaf mark (gold on light backgrounds, white on dark) + wordmark.
  const mark = light ? cfg.company.logoLight : cfg.company.logo;
  return `<a class="logo${light ? ' logo--light' : ''}" href="${ctx.url('/')}" aria-label="${esc(cfg.company.brand)}, ${esc(cfg.company.legalName)}: home">
  <span class="logo__mark media" data-label=""><img src="${ctx.imageBase}/${mark}" alt="" width="38" height="46" decoding="async"></span>
  <span class="logo__text"><span class="logo__brand">MMM<b>Pharma</b></span><span class="logo__legal">${esc(cfg.company.legalName)}</span></span>
</a>`;
}

function langSwitch(ctx, { cls = '' } = {}) {
  const alts = ctx.alternates || [];
  if (alts.length < 2) return '';
  const cur = alts.findIndex((a) => a.code === ctx.lang);
  const other = alts[(cur + 1) % alts.length];
  return `<a class="lang-switch ${cls}" href="${other.href}" hreflang="${other.code}" data-lang-switch data-target="${other.code}" data-active="${ctx.lang}" aria-label="Switch language to ${other.code === 'my' ? 'Burmese' : 'English'}">
    <span class="lang-switch__thumb" aria-hidden="true"></span>
    ${alts.map((a) => `<span class="lang-switch__opt${a.code === ctx.lang ? ' is-active' : ''}" lang="${a.code}" aria-hidden="true">${esc(a.label)}</span>`).join('')}
  </a>`;
}

function header(ctx) {
  const { cfg } = ctx;
  const active = (href) => (href === '/' ? ctx.path === '/' : ctx.path.startsWith(href));
  const links = cfg.nav
    .filter((n) => n.href !== '/contact/')
    .map((n) => `<li><a href="${ctx.url(n.href)}"${active(n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`)
    .join('');
  const phone = cfg.contact.phones[0];
  return `<a class="skip" href="#main">Skip to main content</a>
<header class="site-header" data-header>
  <div class="container site-header__bar">
    ${logo(ctx)}
    <nav class="nav" aria-label="Main">
      <ul class="nav__list">${links}</ul>
    </nav>
    <div class="site-header__cta">
      ${langSwitch(ctx)}
      <a class="btn btn--primary btn--sm" href="${ctx.url('/contact/')}"${active('/contact/') ? ' aria-current="page"' : ''}><span>Contact Us</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-nav-toggle>
        ${icon('menu', 'nav-toggle__open')}${icon('close', 'nav-toggle__close')}<span class="sr-only">Menu</span>
      </button>
    </div>
  </div>
  <div class="mobile-nav" id="mobile-nav" data-mobile-nav hidden>
    <nav aria-label="Mobile">
      <ul>${cfg.nav.map((n) => `<li><a href="${ctx.url(n.href)}"${active(n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}${icon('arrow')}</a></li>`).join('')}</ul>
    </nav>
    <div class="mobile-nav__lang"><span>Language</span>${langSwitch(ctx, { cls: 'lang-switch--lg' })}</div>
    <div class="mobile-nav__contact">
      <p class="mobile-nav__label">Office hours · ${esc(cfg.contact.hours)}</p>
      <a class="btn btn--primary btn--block" href="tel:${phone.tel}">${icon('phone', 'btn__icon')}<span>Call ${esc(phone.number)}</span></a>
    </div>
  </div>
</header>
<main id="main">`;
}

function footer(ctx) {
  const { cfg, products } = ctx;
  const c = cfg.contact;
  const year = new Date().getFullYear();
  const col = (title, items) => `<div class="footer__col"><h2 class="footer__title">${title}</h2><ul>${items.join('')}</ul></div>`;
  const li = (href, label) => `<li><a href="${ctx.url(href)}">${esc(label)}</a></li>`;
  return `</main>
<footer class="site-footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      ${logo(ctx, { light: true })}
      <p>${esc(cfg.company.summary)}</p>
      <ul class="social">${cfg.social.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${esc(cfg.company.brand)} on ${s.name}">${icon(s.icon)}</a></li>`).join('')}</ul>
    </div>
    ${col('Company', [li('/about/', 'About Us'), li('/news/', 'News'), li('/faqs/', 'FAQs'), li('/contact/', 'Contact Us'), li('/report-side-effect/', 'Report a side effect')])}
    ${col('Products', [li('/products/', 'All products'), ...products.map((p) => li(`/products/${p.slug}/`, p.name))])}
    ${col('Health &amp; Knowledge', [li('/health-knowledge/', 'All articles'), li('/health-knowledge/#awareness', 'Health awareness'), li('/faqs/#safety', 'Medicine safety FAQs')])}
    <div class="footer__col footer__contact">
      <h2 class="footer__title">Contact</h2>
      <address>
        <p>${icon('pin')}<span>${c.address.lines.map(esc).join('<br>')}</span></p>
        <p>${icon('phone')}<span>${c.phones.map((p) => `<a href="tel:${p.tel}">${esc(p.number)}</a>`).join('<br>')}</span></p>
        <p>${icon('mail')}<span>${c.emails.map((e) => `<a href="mailto:${e.address}">${esc(e.address)}</a>`).join('<br>')}</span></p>
        <p>${icon('clock')}<span>${esc(c.hours)}</span></p>
      </address>
    </div>
  </div>
  <div class="container footer__legal">
    <p class="footer__disclaimer">${icon('info')}<span>${esc(cfg.medicalDisclaimer)}</span></p>
    <div class="footer__bottom">
      <p>© ${year} <span>${esc(cfg.company.legalName)}. All rights reserved.</span></p>
      <ul class="footer__links">${[li('/privacy/', 'Privacy Policy'), li('/terms/', 'Terms of Use')].join('')}</ul>
      <p>Pharmaceutical distributor · Yangon, Myanmar · Since ${cfg.company.foundingYear}</p>
    </div>
  </div>
</footer>
${viberFab(ctx)}
</body>
</html>`;
}

/** Viber deep link. Opens the chat in the Viber app (phone or desktop). */
function viberHref(v) { return `viber://chat?number=${encodeURIComponent(v.tel)}`; }

/** Floating "Chat on Viber" button, shown on every page when cfg.viber is set. */
function viberFab(ctx) {
  const v = ctx.cfg.viber;
  if (!v) return '';
  return `<a class="chat-fab" href="${viberHref(v)}" aria-label="Chat with ${esc(ctx.cfg.company.brand)} on Viber">${icon('chat')}<span class="chat-fab__label">Chat on Viber</span></a>`;
}

function pageHero(ctx, { crumbs, eyebrow, title, lead, aside = '' }) {
  return `<section class="page-hero">
  <div class="container page-hero__inner${aside ? ' page-hero__inner--split' : ''}">
    <div class="page-hero__text">
      ${breadcrumb(ctx, crumbs)}
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${esc(title)}</h1>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
    </div>
    ${aside}
  </div>
</section>`;
}

module.exports = { head, header, footer, pageHero, logo, viberHref };
