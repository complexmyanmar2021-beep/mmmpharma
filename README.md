# MMMPharma website

This is the corporate website for **Maung Maung Myint Co., Ltd (MMMPharma)**, a licensed pharmaceutical distributor in Myanmar since 2013.

- The site is plain static HTML, CSS and a small JavaScript file (about 8 KB). There is no framework and no npm dependencies.
- It is built by a small Node script, so it can be hosted anywhere: cPanel/Apache, Netlify, Vercel, Cloudflare Pages or S3.

> **Before launch, read `CONTENT-NOTES.md`.** It lists every inconsistency found on the old site and everything that needs the company's confirmation.

## Build

```bash
node build.js            # production build → dist/  (clean URLs: /about/)
node build.js --preview --out preview  # preview/ with index.html links, for opening from disk (npm run preview)
npx serve dist           # optional local server at http://localhost:3000
```

The build prints a list of items still waiting for confirmation.

- To view the site straight from disk, run `npm run preview` and open `preview/index.html` in a browser.
- Never upload `preview/`. Its links only work from disk. Upload `dist/`.
- Photos and logos live in `src/images/` and are copied into the build.

## Where to edit things

| What | File |
|---|---|
| Company name, contact details, phone/email, hours, map, social links, form endpoint, navigation | `src/data/site.config.js` |
| Viber button number, side-effect report inbox, legal-page review flag and date | `src/data/site.config.js` → `viber`, `safetyReports`, `legal` |
| Privacy Policy and Terms of Use text | `privacy()` and `terms()` in `src/pages.js` |
| Products (specs, uses, storage, regulatory) | `src/data/products.js` |
| FAQs (with categories) | `src/data/faqs.js` |
| News (company and media) | `src/data/news.js` |
| Strengths, core values, health categories, awareness days | `src/data/company.js` |
| Health & Knowledge articles | `src/content/articles/*.md` (copy `_TEMPLATE.md`) |
| Brand colours, fonts, spacing | top of `src/assets/css/styles.css` (`:root`) |

Contact details exist in **one place only**. The header, footer, contact page, CTA bands, forms and structured data all read from `site.config.js`.

### Languages (English / မြန်မာ)

- The site is built in English, and a Burmese copy of every page is published under `/my/`. For example, `/products/oxytocin/` becomes `/my/products/oxytocin/`.
- The **EN | မြန်မာ** switch in the header (and in the phone menu) links each page to the same page in the other language. It plays a sliding animation and fades the page between languages.
- All Burmese text lives in **`src/i18n/my.json`**, a simple list of `"English text": "Burmese text"` pairs. To change a translation, edit the right-hand side and rebuild.
- When you add or change English text, the build lists any sentences that have no Burmese translation yet. Those sentences show in English until you add them. Run `node build.js --missing` to save the full list to `missing-translations.json`.
- Product names, strengths and units (Oxytocin, Amrokort, 10 IU/mL, °C) are kept in English, as on the packaging.
- Languages are set in `site.config.js` → `languages`.

### Adding a product

1. Copy one product object in `src/data/products.js` and give it a new `slug`.
2. Add its photos to the image folder.
3. Rebuild.

The listing page, detail page, footer link, inquiry-form subject, sitemap and structured data update automatically.

### Adding a Health & Knowledge article

1. Copy `src/content/articles/_TEMPLATE.md` to `my-article.md`.
2. Fill in the front matter and write the body in Markdown.
3. Set `status: published` once a qualified professional has reviewed it.
4. For awareness-day posts, set `awareness: World Pharmacists Day` (or similar) and link the article to that occasion.

### "To be confirmed" chips

- In data files, a value written as `{ value: '…', confirmed: false, note: '…' }` shows a small "To be confirmed" chip on the page.
- Set `showPendingFlags: false` in `site.config.js` to hide all chips for launch. The build still warns about anything unconfirmed.

### Contact form

- The site is static, so the form needs a form service.
- Create a form on Formspree, Web3Forms or Getform, then paste its endpoint URL into `form.endpoint` in `site.config.js`.
- Until then, "Send Inquiry" validates the form and opens the visitor's email app with the message pre-filled and addressed to `form.fallbackEmail`.

## Structure

```
build.js                 static site generator (no dependencies)
src/
  data/                  all content and configuration
  content/articles/      Markdown articles
  components/
    ui.js                Button, SectionHeading, Image (with fallback), Breadcrumb, "To be confirmed" chip
    layout.js            <head>/SEO, Header + mobile menu, Footer, PageHero, Logo
    blocks.js            ProductCard, SpecSheet, ArticleCard, NewsCard, FaqAccordion,
                         ContactList, InquiryForm, CtaBand, LogoStrip
  pages.js               Home, About, Products, Product detail, Health & Knowledge,
                         Article, News, FAQs, Contact, 404
  assets/css/styles.css  design system and all styles
  assets/js/main.js      menu, sticky header, scroll reveal, filters, form, map
dist/                    production build (clean URLs). Upload this folder.
preview/                 same site with index.html links — double-click preview/index.html
```

## Built in

**SEO**
- Unique titles and descriptions, canonical URLs, Open Graph and Twitter cards.
- JSON-LD: Organization, WebSite, BreadcrumbList, Drug, FAQPage and Article.
- `sitemap.xml` and `robots.txt`.
- 301 redirects from old URLs (`/pages/oxytocin` → `/products/oxytocin/` etc.) in `_redirects` (Netlify/Cloudflare) and `.htaccess` (Apache), plus HTML fallbacks.

**Accessibility**
- Semantic landmarks and a skip link.
- Keyboard-friendly menu (Esc closes it) and visible focus states.
- Native `<details>` FAQ that works without JavaScript.
- Labelled form fields with inline errors linked through `aria-describedby`.
- AA colour contrast (brand gold is used only decoratively on white).
- `prefers-reduced-motion` respected.

**Performance**
- One CSS file, one deferred JS file and system-font fallbacks.
- Lazy-loaded images with fixed dimensions (no layout shift).
- The Google Map loads only when the visitor clicks "Show map".

## Hosting

`dist/` is the whole website. It contains plain files only, so any static host works.

**GitHub Pages (already set up).** `.github/workflows/pages.yml` rebuilds and publishes the site on every push to `main`.
1. On GitHub, open the repo's **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. The site appears at `https://complexmyanmar2021-beep.github.io/mmmpharma/`.
3. To use mmmpharma.com, enter it under **Settings → Pages → Custom domain** and tick **Enforce HTTPS**. At the domain registrar, add:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `complexmyanmar2021-beep.github.io`

GitHub Pages ignores `_redirects` and `.htaccess`. Old URLs (`/pages/...`) still redirect through the HTML fallback pages.

**cPanel / Apache.** Run `node build.js`, then upload the *contents* of `dist/` into `public_html/`. Include the hidden `.htaccess` file. It handles the 404 page and the old-URL redirects.

**Netlify / Cloudflare Pages.** Set the build command to `node build.js` and the output directory to `dist`. `_redirects` is picked up automatically.

## Launch checklist

- [x] Contact details, Viber number, safety-report inbox and Amrokort storage confirmed by the company (2026-11-04).
- [x] Photos hosted locally in `src/images/` (2026-11-04).
- [x] Privacy Policy and Terms of Use approved (`legal.reviewed: true`).
- [x] "To be confirmed" chips hidden (`showPendingFlags: false`).
- [x] Sample articles hidden (`status: draft`). To publish an article, set `status: published`.
- [ ] Optional: set `form.endpoint` so inquiries arrive by email without opening the visitor's email app.
- [ ] Point mmmpharma.com at the host (see **Hosting** above).
- [ ] Submit `https://mmmpharma.com/sitemap.xml` in Google Search Console.
