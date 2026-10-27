#!/usr/bin/env node
/**
 * MMMPharma static site builder — zero dependencies (Node 16+).
 *
 *   node build.js              → production build in ./dist (clean URLs: /about/)
 *   node build.js --preview    → ./dist with explicit index.html links, so the
 *                                site can be opened straight from disk
 */
const fs = require('fs');
const path = require('path');

const PREVIEW = process.argv.includes('--preview');
const OUT = path.resolve(__dirname, process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'dist');
const SRC = path.join(__dirname, 'src');

const cfg = require('./src/data/site.config');
const products = require('./src/data/products');
const news = require('./src/data/news');
const { parseFrontMatter, render } = require('./src/lib/markdown');
const { translateHtml } = require('./src/lib/i18n');
const LANGS = cfg.languages || [{ code: 'en', prefix: '' }];
const pages = require('./src/pages');

/* ---------- Articles ---------- */
const articleDir = path.join(SRC, 'content/articles');
const articles = fs
  .readdirSync(articleDir)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .map((f) => {
    const { data, body } = parseFrontMatter(fs.readFileSync(path.join(articleDir, f), 'utf8'));
    const words = body.split(/\s+/).length;
    return { ...data, slug: data.slug || f.replace(/\.md$/, ''), html: render(body), readMins: Math.max(1, Math.round(words / 200)) };
  })
  .filter((a) => a.status === 'published' || a.status === 'demo')
  // published first, then newest
  .sort((a, b) => (a.status === b.status ? String(b.date).localeCompare(String(a.date)) : a.status === 'published' ? -1 : 1));

/* ---------- URL helpers ---------- */
// pagePath is the logical (English) path, e.g. '/about/'. Each language is
// written under its prefix: '/about/' (en) and '/my/about/' (my).
function makeCtx(pagePath, lang = LANGS[0]) {
  const outPath = (lang.prefix || '') + pagePath;
  const depth = outPath.split('/').filter(Boolean).length;
  const up = depth ? '../'.repeat(depth) : './';
  const toRel = (target) => {
    let rel = up + target.replace(/^\//, '');
    if (PREVIEW && rel.endsWith('/')) rel += 'index.html';
    return rel;
  };
  const url = (href) => {
    if (/^(https?:|mailto:|tel:)/.test(href)) return href;
    const [p, hash = ''] = href.split('#');
    const [pathname, query = ''] = p.split('?');
    return toRel((lang.prefix || '') + pathname) + (query ? '?' + query : '') + (hash ? '#' + hash : '');
  };
  // Links to this same page in every language (for the switch + hreflang)
  const alternates = LANGS.map((l) => ({ code: l.code, label: l.label, href: toRel((l.prefix || '') + pagePath), abs: cfg.siteUrl + (l.prefix || '') + pagePath }));
  const remote = /^(https?:)?\/\//.test(cfg.imageBase) || cfg.imageBase.startsWith('/');
  const imageBase = remote ? cfg.imageBase.replace(/\/$/, '') : up + cfg.imageBase.replace(/^\.?\/?|\/$/g, '');
  const absImageBase = /^https?:/.test(cfg.imageBase) ? cfg.imageBase : cfg.siteUrl + '/' + cfg.imageBase.replace(/^\.?\/?|\/$/g, '');
  return { cfg, products, articles, news, path: pagePath, outPath, lang: lang.code, langs: LANGS, alternates, url, imageBase, absImageBase, asset: (p) => up + 'assets/' + p };
}

/* ---------- Write ---------- */
function write(pagePath, html) {
  const file = path.join(OUT, pagePath, pagePath.endsWith('.html') ? '' : 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
fs.rmSync(OUT, { recursive: true, force: true });

const routes = [
  ['/', pages.home],
  ['/about/', pages.about],
  ['/products/', pages.productsIndex],
  ...products.map((p) => [`/products/${p.slug}/`, (ctx) => pages.productDetail(ctx, p)]),
  ['/health-knowledge/', pages.healthIndex],
  ...articles.map((a) => [`/health-knowledge/${a.slug}/`, (ctx) => pages.article(ctx, a)]),
  ['/news/', pages.newsIndex],
  ['/faqs/', pages.faqPage],
  ['/contact/', pages.contact],
  ['/report-side-effect/', pages.reportSideEffect],
  ['/privacy/', pages.privacy],
  ['/terms/', pages.terms],
];
const missing = {};
for (const lang of LANGS) {
  const dict = lang.code === 'en' ? null : JSON.parse(fs.readFileSync(path.join(SRC, 'i18n', lang.code + '.json'), 'utf8'));
  const miss = new Set();
  for (const [p, fn] of routes) {
    let html = fn(makeCtx(p, lang));
    if (dict) html = translateHtml(html, dict, miss);
    // Keep each word of a menu label together, so long labels only wrap at spaces.
    html = html.replace(/(<ul class="nav__list">)([\s\S]*?)(<\/ul>)/, (m, a, list, c) => a + list.replace(/>([^<>]+)<\/a>/g, (mm, t) => '>' + t.trim().split(/\s+/).map((w) => `<span class="nw">${w}</span>`).join(' ') + '</a>') + c);
    write((lang.prefix || '') + p, html);
  }
  if (miss.size) missing[lang.code] = [...miss];
}
// 404 at root (served by most static hosts for missing pages)
fs.writeFileSync(path.join(OUT, '404.html'), pages.notFound({ ...makeCtx('/'), path: '/404.html' }).replace(/(href|src)="\.\//g, '$1="/'));

/* ---------- Redirects from the old site's URLs ---------- */
const legacy = {
  '/pages/products': '/products/',
  '/pages/about-us': '/about/',
  '/pages/contact-us': '/contact/',
  '/pages/faq': '/faqs/',
  '/pages/oxytocin': '/products/oxytocin/',
  '/pages/amrokort': '/products/amrokort/',
};
fs.writeFileSync(path.join(OUT, '_redirects'), Object.entries(legacy).map(([a, b]) => `${a}  ${b}  301`).join('\n') + '\n');
fs.writeFileSync(
  path.join(OUT, '.htaccess'),
  'ErrorDocument 404 /404.html\nRewriteEngine On\n' + Object.entries(legacy).map(([a, b]) => `RedirectMatch 301 ^${a}/?$ ${b}`).join('\n') + '\n'
);
// HTML fallbacks for hosts without redirect support
for (const [from, to] of Object.entries(legacy)) {
  write(from + '/', `<!doctype html><meta charset="utf-8"><title>Moved</title><link rel="canonical" href="${cfg.siteUrl}${to}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}"><p>This page has moved to <a href="${to}">${cfg.siteUrl}${to}</a>.</p>`);
}

/* ---------- Assets ---------- */
function copyDir(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const e of fs.readdirSync(a, { withFileTypes: true })) {
    const s = path.join(a, e.name), d = path.join(b, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}
copyDir(path.join(SRC, 'assets'), path.join(OUT, 'assets'));
// Local photos (src/images) are copied into the build when present.
if (fs.existsSync(path.join(SRC, 'images'))) copyDir(path.join(SRC, 'images'), path.join(OUT, 'images'));
fs.rmSync(path.join(OUT, 'images', 'README.txt'), { force: true });
// Light minification of CSS (strip comments / whitespace)
const cssFile = path.join(OUT, 'assets/css/styles.css');
fs.writeFileSync(cssFile, fs.readFileSync(cssFile, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '\n').replace(/\n+/g, '\n'));

/* ---------- SEO files ---------- */
const today = new Date().toISOString().slice(0, 10);
const indexable = LANGS.flatMap((l) => routes.map(([p]) => (l.prefix || '') + p))
  .filter((p) => !articles.some((a) => a.status !== 'published' && p.endsWith(`/health-knowledge/${a.slug}/`)))
  .filter((p) => cfg.legal.reviewed || !/\/(privacy|terms)\/$/.test(p));
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((p) => `  <url><loc>${cfg.siteUrl}${p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : p.split('/').length > 3 ? '0.6' : '0.8'}</priority></url>`)
    .join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`);

/* ---------- Content checks ---------- */
const warn = [];
cfg.contact.phones.filter((p) => !p.confirmed).forEach((p) => warn.push(`Phone not confirmed: ${p.number} (${p.source})`));
cfg.contact.emails.filter((e) => !e.confirmed).forEach((e) => warn.push(`Email not confirmed: ${e.address} (${e.source})`));
products.forEach((p) => p.specs.forEach((s) => s.value && s.value.confirmed === false && warn.push(`${p.name} · ${s.label}: ${s.note || s.value.note}`)));
if (cfg.viber && !cfg.viber.confirmed) warn.push(`Viber number not confirmed: ${cfg.viber.number}`);
if (!cfg.safetyReports.confirmed) warn.push(`Side-effect reports go to ${cfg.safetyReports.email} — confirm the safety-report inbox.`);
if (!cfg.legal.reviewed) warn.push('Privacy Policy and Terms of Use are drafts (noindex) — have them reviewed, then set legal.reviewed: true.');
if (!cfg.form.endpoint) warn.push('Contact form has no endpoint — falls back to opening the visitor’s email app.');
for (const [code, list] of Object.entries(missing)) warn.push(`${list.length} text(s) have no ${code} translation yet (shown in English). Add them to src/i18n/${code}.json:\n      - ` + list.slice(0, 15).join('\n      - ') + (list.length > 15 ? `\n      … and ${list.length - 15} more (run: node build.js --missing)` : ''));
if (process.argv.includes('--missing')) fs.writeFileSync(path.join(__dirname, 'missing-translations.json'), JSON.stringify(missing, null, 2));
if (LANGS.length > 1) warn.push('Burmese (မြန်မာ) translation is a first draft — have a native speaker and a pharmacist review src/i18n/my.json before launch.');
if (articles.some((a) => a.status === 'demo')) warn.push(`${articles.filter((a) => a.status === 'demo').length} Health & Knowledge articles are demo placeholders (noindex).`);
if (cfg.imageBase.startsWith('http')) warn.push(`Images load from ${cfg.imageBase} — put local copies in src/images and set imageBase to 'images' before launch.`);

console.log(`\n✔ Built ${routes.length * LANGS.length} pages (${LANGS.map((l) => l.code).join(' + ')}) → ${path.relative(process.cwd(), OUT) || '.'}${PREVIEW ? ' (preview mode)' : ''}`);
if (warn.length) console.log('\n⚠ Needs confirmation before launch:\n' + warn.map((w) => '  • ' + w).join('\n'));
console.log('');
