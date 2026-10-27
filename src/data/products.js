/**
 * Product catalogue.
 * ---------------------------------------------------------------
 * RULE: every value here must come from the company's own product
 * information (current website product pages or the approved package
 * insert). Never add dosage, contraindications, side-effects or
 * efficacy claims that are not in an approved source.
 *
 * A spec value can be a string, or { value, confirmed: false, note }
 * to mark something that needs confirmation (it renders with a
 * "To be confirmed" chip while showPendingFlags is on).
 *
 * To add a product: copy one object, change the slug and fields, add
 * the images to the image folder, and rebuild. The listing page,
 * detail page, sitemap and structured data are generated automatically.
 */

module.exports = [
  {
    slug: 'oxytocin',
    name: 'Oxytocin',
    fullName: 'Oxytocin Injection USP',
    genericName: 'Oxytocin',
    // Editorial grouping for the product card (not a regulatory classification)
    category: 'Maternal & obstetric care',
    // Source: Products page card ("Powerful labor-inducing agent. Supports postpartum recovery.")
    cardSummary: 'Injectable oxytocin used in labour and postpartum care in hospital settings.',
    // Source: Oxytocin page
    overview:
      'Maung Maung Myint Co., Ltd is committed to delivering high-quality Oxytocin, approved for hospital and medical use across Myanmar. Oxytocin Injection USP is imported and distributed by Maung Maung Myint Co., Ltd. Each 1 mL contains 10 IU of oxytocin, and the product complies with USP specifications.',
    image: 'oxytocin.jpg',
    imageAlt: 'Oxytocin Injection USP product box and ampoule',
    heroImage: 'oxytocin-hero2.jpg',
    heroImageAlt: 'A doctor holding an ampoule of Oxytocin injection',
    specs: [
      { label: 'Strength', value: '10 IU/mL' },
      { label: 'Dosage form', value: 'Injectable solution' },
      { label: 'Route', value: 'IM / IV' },
      // Pack and storage confirmed from the printed carton (oxytocin.jpg):
      // "1mL x 50 Ampoules", "Store between 2 to 8 °C", "Protect from light".
      { label: 'Pack', value: '1 mL × 50 ampoules' },
      { label: 'Storage', value: '2 °C to 8 °C · protect from light' },
      { label: 'Regulatory', value: 'FDA Myanmar · WHO-GMP' },
    ],
    // Source: Oxytocin page "Benefits" (wording tidied, meaning unchanged)
    uses: ['Facilitates labour induction', 'Enhances labour progress', 'Helps control postpartum bleeding'],
    storage: { value: 'Store between 2 °C and 8 °C. Protect from light.' },
    regulatory: ['Approved by FDA Myanmar', 'WHO-GMP certified manufacturing', 'Complies with USP specifications', 'Sold on the prescription of a registered medical practitioner'],
    professionalUse: true,
  },
  {
    slug: 'amrokort',
    name: 'Amrokort',
    fullName: 'Amrokort (Triamcinolone Acetonide) Injection',
    genericName: 'Triamcinolone acetonide',
    category: 'Corticosteroid',
    // Source: Products page card ("Anti-inflammatory corticosteroid")
    cardSummary: 'Anti-inflammatory corticosteroid injection containing triamcinolone acetonide.',
    overview:
      'Amrokort is an anti-inflammatory corticosteroid injection containing triamcinolone acetonide, supplied by Maung Maung Myint Co., Ltd to healthcare institutions across Myanmar.',
    image: 'amrokort.jpg',
    imageAlt: 'Amrokort (triamcinolone acetonide) injection box and vial',
    heroImage: 'amrokort2.jpg',
    heroImageAlt: 'A doctor holding a vial of Amrokort injection',
    specs: [
      { label: 'Strength', value: '40 mg/mL' },
      { label: 'Dosage form', value: 'Injectable solution' },
      { label: 'Route', value: 'IM' },
      { label: 'Pack', value: '1 mL vial × 1 per box' },
      {
        label: 'Storage',
        value: { value: 'Below 30 °C', confirmed: false, note: 'Source reads "below 30 degrees" — unit not stated.' },
      },
      { label: 'Regulatory', value: 'FDA Myanmar · WHO-GMP' },
    ],
    // Source: Amrokort page "Benefits" (wording tidied, meaning unchanged).
    // "Backed by medical professionals" and "Fast action for critical care
    // cases" were NOT carried over — unsupported claims, see CONTENT-NOTES.md.
    uses: ['Reduces inflammation', 'Relief from osteoarthritis and joint pain', 'Alleviates dermatologic conditions'],
    storage: { value: 'Store below 30 °C.', confirmed: false },
    regulatory: ['Approved by FDA Myanmar', 'WHO-GMP certified manufacturing', 'For professional medical use'],
    professionalUse: true,
  },
];
