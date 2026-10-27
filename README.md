# MMMPharma website

This is the corporate website for **Maung Maung Myint Co., Ltd (MMMPharma)**, a licensed pharmaceutical distributor in Myanmar since 2013.

- The site is plain static HTML, CSS and a small JavaScript file (about 8 KB). There is no framework and no npm dependencies.
- It is built by a small Node script, so it can be hosted anywhere: cPanel/Apache, Netlify, Vercel, Cloudflare Pages or S3.

> **Before launch, read `CONTENT-NOTES.md`.** It lists every inconsistency found on the old site and everything that needs the company's confirmation.

## Build

```bash
node build.js            # production build → dist/  (clean URLs: /about/)
node build.js --preview  # dist/ with explicit index.html links, for opening from disk
npx serve dist           # optional local server at http://localhost:3000
```

The build prints a list of items still waiting for confirmation.

- To view the site straight from disk, run `node build.js --preview` and open `dist/index.html` in a browser.
- Photos load from the live mmmpharma.com while `imageBase` points there.

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

## Launch checklist

- [ ] Resolve the items in `CONTENT-NOTES.md` (contacts, Amrokort storage unit, "For Export Only" cartons).
- [ ] Download the photos listed in `src/images/README.txt` into `src/images/`, set `imageBase: 'images'`, and rebuild. The build copies them into the site.
- [ ] Set `form.endpoint`.
- [ ] Confirm the Viber number (`viber`) and the side-effect report inbox (`safetyReports`).
- [ ] Have a lawyer review `/privacy/` and `/terms/`, then set `legal.reviewed: true`. Until then they are `noindex` and left out of the sitemap.
- [ ] Replace the sample articles, or leave them unlinked until real ones exist.
- [ ] Set `showPendingFlags: false`.
- [ ] Run `node build.js` and upload `dist/`.
- [ ] Submit `https://mmmpharma.com/sitemap.xml` in Google Search Console.
