# MMMPharma website: content notes and items to confirm

Audit of https://mmmpharma.com carried out on 30 September 2026. The site had 7 pages: Home, Products, About, FAQ, Contact, Oxytocin and Amrokort.

Every fact on the new site comes from the current website or from the product cartons shown on it. **Please check the items below with the company before launch.** Running `npm run build` prints the open items again.

---

## 1. Contact details differ between pages ⚠ HIGH

| Where on the current site | Phone | Email |
|---|---|---|
| Home page contact section | +95 9 769 767 666, +95 9 966 766 666 | info@mmmpharma.com |
| Contact page and every footer | +95 9 421 025 146, +95 9 204 4035 | maungmaungmyintmmm7@gmail.com |
| Contact page, "Urgent help" | +95 9 769 767 666 | none |

- The new site shows **all** numbers and emails and marks them "To be confirmed". None was chosen silently.
- "+95 9 204 4035" has fewer digits than the others. Please check it.
- The company's Facebook page artwork (cover photo and posts) lists **+959 421 025 146** and **+959 204 4035**, which supports the Contact-page numbers. The Facebook cover also prints the web address as "www.mmpharma.com" (two m's). Please check that too.
- The contact form currently falls back to **info@mmmpharma.com**.
- **To fix:** edit `src/data/site.config.js` → `contact.phones` / `contact.emails`. Delete any wrong entries and set `confirmed: true`. Confirmed numbers are then added automatically to Google structured data.

## 2. Oxytocin storage ✅ resolved from packaging

- The home-page FAQ said "Store below 25 °C, protected from light".
- The product page said "2 °C to 8 °C".
- The printed carton (`images/oxytocin.jpg`) says **"Store between 2 to 8 °C"** and **"Protect from light"**.
- The new site uses the carton wording. The 25 °C FAQ answer was not carried over.

## 3. Oxytocin pack size ✅ resolved from packaging

- The product page read "1 ml <= 50 Ampoules / Box".
- The carton reads **"1mL x 50 Ampoules"**. The new site shows "1 mL ampoules · 50 ampoules per box".

## 4. Amrokort storage unit ⚠

- The source says "below 30 degrees" with no unit.
- The new site shows "Below 30 °C" with a "To be confirmed" chip. Please confirm it against the carton or leaflet.

## 5. "FDA-approved" wording

- The general copy says "FDA-approved". The product pages say "Regulatory: FDA Myanmar, WHO-GMP".
- To avoid confusion with the US FDA, the new site says **"approved by FDA Myanmar"** wherever it refers to product approval.
- The About-page strength ("Our key products meet high international & local FDA standards") is kept as written. Please confirm this claim.

## 6. "For Export Only" printed on product cartons ⚠ REGULATORY

- Both carton images (`oxytocin.jpg`, `amrokort.jpg`) carry a "For Export Only" label, and the Amrokort slide shows the same.
- The Oxytocin carton also says "Imported & Distributed by Maung Maung Myint Co., Ltd, Myanmar".
- Please confirm with regulatory affairs that these are the correct images for products sold in Myanmar.
- The new site does not repeat the label.

## 7. Claims NOT carried over (unsupported)

| Claim | Where it appeared | Why it was left out |
|---|---|---|
| "Myanmar's Leading Oxytocin Distributor" / "Myanmar's leading distributor" | Home page title and meta description | Contradicts the vision ("to *become* Myanmar's leading…") and is unverifiable. |
| "Fast action for critical care cases" | Amrokort card, Products page | Clinical claim not on the product page. |
| "Backed by medical professionals" | Amrokort benefits | Unsubstantiated endorsement. |
| "High-efficacy products" and "Trusted by hospitals, clinics and healthcare professionals nationwide" | Text inside the hero banner images | Unverifiable. The banner images are not used on the new site. |
| Hospitals Served / Pharmacies Reached / Years Experience counters | About page (all showed "0") | No real figures exist. Add them to the site only when verified. |

## 8. Regulator logos shown as "clients"

- `fda.png` and `ministry-of-health.jpg` had the alt text "Client Hospital 1/2".
- These are regulators, not clients. Showing them as "Trusted by" would imply an endorsement, so they are not used.
- The "Trusted by" section is ready. It appears automatically once real, permission-cleared client logos are added to `clients` in `site.config.js`.

## 9. FAQ page

- The old FAQ page had 20 general oxytocin questions for consumers, such as "love hormone", autism, anxiety, "natural ways to increase oxytocin" and veterinary use.
- The new FAQ keeps the product, safety, storage, distribution and company questions, grouped into categories.
- **11 questions are kept in `src/data/faqs.js` but not published** (`published: false`). They are off-topic for a B2B distributor and make clinical statements. A pharmacist should review them before any are published.
- Wording changes:
  - The US brand name "Pitocin" was removed; the answers now say "synthetic oxytocin".
  - The answer to "Do you sell directly to individuals?" is kept exactly as written ("We distribute **Oxytocin** to licensed hospitals, clinics and pharmacies only"). Please confirm whether this applies to all products.

## 10. News items have no dates

- The three news links on the current site have no publication dates: MDN, GNLM and the Ministry of Health Facebook post.
- No dates are shown. Add them in `src/data/news.js` once known.
- The current site mislabels "GNLM" as "GNLN". This is corrected.

## 11. Health & Knowledge articles are samples

- The four articles in `src/content/articles/` are **layout samples** (`status: demo`). They contain no medical guidance, show a "Sample" label, are set to `noindex` and are left out of the sitemap.
- Replace them with articles written or reviewed by a qualified professional, then set `status: published`.
- Take awareness-day dates and themes from the official WHO announcement each year. None are hard-coded.

## 12. Editorial choices

- **Product categories:** "Maternal & obstetric care" and "Corticosteroid" are editorial groupings for the cards, not regulatory classifications.
- **Typos corrected:** Responsibililty, quallty, nnanufacturerrs, Myannmar, respon-siveness, "Distributing Network" (now "Distribution network"), "I.M, / I.V", "Store at 2*C to 8*C".
- **Copyright year:** now calculated automatically. It said 2025.

## 12b. Burmese translation ⚠ REVIEW BEFORE LAUNCH

- The Burmese version (`/my/`, dictionary in `src/i18n/my.json`) is a **first draft**.
- A native Burmese speaker should review it, and **a pharmacist should check the medical wording** (FAQs, product uses, safety text) before launch.
- Drug names, strengths and units are kept in English to match the cartons. The company name is kept as "Maung Maung Myint Co., Ltd".

## 13. Brand

- **Colours:** taken from the live site CSS (`--secondary-color: #DDA11D`, `--accent-color: #B10012`, navbar/footer #F2EBE2) and from the logo and packaging.
  - Crimson #B10012 is the primary colour.
  - Gold #DDA11D is used for icons and decoration only. It is too light for text on white; dark gold #8A6212 is used for small gold text.
  - Warm cream is used for section backgrounds, and deep burgundy for dark sections.
- **Fonts:** Manrope for headings, IBM Plex Sans for body text, IBM Plex Mono for product data.
- **Logo:** `favicon/favicon.png` is the gold leaf mark (header), and `logo2.png` is the white mark (footer). If the company has an SVG version of the logo, use that instead.
- **Facebook page:** the company's Facebook artwork (facebook.com/profile.php?id=61586896157506) uses a white, gold and slate look. A version of the site in that style was built on 2 Oct 2026 and set aside at the company's request in favour of this first design.

## 14. Images

- The new site uses the existing photos from `https://mmmpharma.com/images/`.
- Before launch, save local copies in `src/images/` (the file list is in `src/images/README.txt`) and set `imageBase: 'images'` in `site.config.js`. The build then copies them into the site.
- Convert the photos to WebP (keep the same names) to improve load speed.
- The hero banners (`medicine-hero.jpg`, `oxytocin-hero.jpg`, `amrokort-hero.jpg`) have text baked into the image. They are not used, because baked-in text can't be translated, read by search engines or scaled for mobile.

## 15. Pages added on 27 October 2026 ⚠

- **Report a side effect** (`/report-side-effect/`): a form for side effects, quality problems and suspected counterfeits, with an emergency notice. It is linked from the footer and from each product's safety box.
  - Reports go to `safetyReports.email` (currently info@mmmpharma.com). Please confirm who should receive them, ideally a named pharmacovigilance contact.
  - Please confirm the company's obligation to forward reports to manufacturers and to FDA Myanmar, and whether FDA Myanmar has an official reporting link to add.
- **Privacy Policy** (`/privacy/`) and **Terms of Use** (`/terms/`): drafts written for this site. They show a "Draft for review" notice and are `noindex` until `legal.reviewed: true`. **A lawyer must review them.** Their body text is still in English on the Burmese site.
- **Chat on Viber** button (every page, plus the Contact page): it uses +95 9 421 025 146, the number on the Contact page and the Facebook artwork. Please confirm which number has Viber.
- **Burmese menu fix:** on laptops, the full Burmese menu didn't fit the header and pushed the language switch and Contact button off the screen. The menu now stays visible on laptops, as in English. Long labels wrap onto two lines at the space, and below 1360 px the labels get a little smaller and may wrap between syllables. Below 1100 px both languages use the menu button.
