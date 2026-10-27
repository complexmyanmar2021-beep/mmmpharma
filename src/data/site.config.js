/**
 * MMMPharma — central site configuration
 * ---------------------------------------------------------------
 * Every piece of company / contact information used anywhere on the
 * website comes from THIS file. Edit here once; every page updates.
 *
 * Fields marked `confirmed: false` were found to be INCONSISTENT or
 * UNCLEAR on the current mmmpharma.com. They are shown on the site
 * exactly as found, but they are:
 *   - listed in the build log as warnings,
 *   - excluded from structured data (JSON-LD) until confirmed,
 *   - documented in CONTENT-NOTES.md.
 * When the company confirms a value, set `confirmed: true` (and delete
 * any value that is wrong).
 */

module.exports = {
  // Brand colours (from the current site CSS, logo and packaging):
  // crimson #B10012 · gold #DDA11D · cream #F2EBE2 · white. Defined in src/assets/css/styles.css :root.
  // Production URL — used for canonical links, Open Graph, sitemap.
  siteUrl: 'https://mmmpharma.com',

  // Where product photos and logo files live.
  //  - 'https://mmmpharma.com/images' → load them from the current live site
  //  - 'images' → use local copies in src/images (copied into the build).
  //    Download the files listed in src/images/README.txt into that folder,
  //    then switch this to 'images' before launch.
  imageBase: process.env.IMAGE_BASE || 'https://mmmpharma.com/images',

  // Show a small amber "To be confirmed" chip beside unconfirmed facts.
  // Keep `true` while the company reviews the site; set `false` for launch
  // (the build will still warn about anything unconfirmed).
  showPendingFlags: true,

  company: {
    legalName: 'Maung Maung Myint Co., Ltd',
    brand: 'MMMPharma',
    shortName: 'mmmpharma',
    foundingYear: 2013,
    tagline: 'Your Health is Our Priority',
    // Source: About page / footer (typos corrected, meaning unchanged)
    summary:
      'Maung Maung Myint Co., Ltd is a trusted pharmaceutical distributor dedicated to improving healthcare access across Myanmar. We specialise in high-quality, GMP-certified and FDA-approved products.',
    // Source: Home page "About" block
    since:
      "Since 2013, Maung Maung Myint Co., Ltd has proudly served Myanmar's healthcare sector as a licensed distributor of high-quality pharmaceutical products.",
    // Source: About page "Our Story"
    story:
      "Maung Maung Myint Co., Ltd (MMMPharma) was established to serve Myanmar's growing need for safe, effective and trusted pharmaceutical products.",
    // Source: About page
    mission:
      "To improve the health and well-being of Myanmar's people through accessible, high-quality and affordable medicines.",
    vision: "To become Myanmar's leading and most trusted pharmaceutical supplier.",
    // Source: Home FAQ ("Do you sell directly to individuals?")
    customers: 'Licensed hospitals, clinics and pharmacies',
    // Brand leaf mark (relative to imageBase). favicon.png is the GOLD mark,
    // logo2.png is the WHITE mark (for dark backgrounds).
    logo: 'favicon/favicon.png',
    logoLight: 'logo2.png',
    favicon: 'favicon/favicon.png',
    ogImage: 'oxytocin.jpg', // social-sharing preview image
  },

  contact: {
    address: {
      lines: [
        'Tower (C)-PO2, Gonyi Residence',
        'Corner of Myanmar Gonyi Road & Upper Pansodan Road',
        'Mingalar Taungnyunt Township',
        'Yangon, Myanmar',
      ],
      locality: 'Yangon',
      country: 'MM',
      confirmed: true, // identical on every page of the current site
    },

    // ⚠ INCONSISTENT on current site — see CONTENT-NOTES.md #1
    phones: [
      { number: '+95 9 769 767 666', tel: '+959769767666', source: 'Home page contact section; Contact page "Urgent help"', confirmed: false },
      { number: '+95 9 966 766 666', tel: '+959966766666', source: 'Home page contact section', confirmed: false },
      { number: '+95 9 421 025 146', tel: '+959421025146', source: 'Contact page & site footer', confirmed: false },
      { number: '+95 9 204 4035', tel: '+9592044035', source: 'Contact page & site footer — number looks short, please verify', confirmed: false },
    ],

    // ⚠ INCONSISTENT on current site — see CONTENT-NOTES.md #1
    emails: [
      { address: 'info@mmmpharma.com', source: 'Home page contact section', confirmed: false },
      { address: 'maungmaungmyintmmm7@gmail.com', source: 'Contact page & site footer', confirmed: false },
    ],

    // Contact page, "Urgent help"
    urgentPhone: { number: '+95 9 769 767 666', tel: '+959769767666', confirmed: false },

    hours: 'Monday – Friday, 9:00 AM – 5:00 PM',

    map: {
      // Embed URL copied from the current Contact page (pin: Gonyi Residence)
      embed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.8059752381528!2d96.16060511110624!3d16.786326019774783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1edd4f2d32165%3A0xb905b32085af0b71!2sGonyi%20Residence!5e0!3m2!1sen!2sth!4v1752946796378!5m2!1sen!2sth',
      link: 'https://www.google.com/maps/search/?api=1&query=Gonyi+Residence+Yangon',
      lat: 16.786326,
      lng: 96.160605,
    },
  },

  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61577323186947', icon: 'facebook' },
  ],

  // Chat apps. Viber is the main business messenger in Myanmar.
  // Shows a "Chat on Viber" button on every page and on the Contact page.
  // ⚠ Confirm which number has Viber. Set `viber: null` to hide the button.
  viber: { number: '+95 9 421 025 146', tel: '+959421025146', confirmed: false },

  // Side-effect (adverse reaction) reports. Reports go to this inbox through
  // the same form service as the inquiry form (or the visitor's email app).
  // ⚠ Confirm who receives safety reports (ideally a named pharmacovigilance contact).
  safetyReports: {
    email: 'info@mmmpharma.com',
    confirmed: false,
  },

  // Legal pages are DRAFTS until reviewed by the company's legal adviser.
  legal: {
    reviewed: false,
    updated: '2026-10-27', // "Last updated" date shown on Privacy and Terms
  },

  // Contact form delivery.
  // The site is static, so it needs a form service to deliver messages.
  // Paste an endpoint from Formspree / Web3Forms / Getform / your own API here.
  // While empty, "Send Inquiry" opens the visitor's email app with the
  // message pre-filled and addressed to `form.fallbackEmail`.
  form: {
    endpoint: '',
    fallbackEmail: 'info@mmmpharma.com', // ⚠ confirm which inbox should receive inquiries
  },

  // Site languages. English is the source; other languages are translated
  // with the dictionary in src/i18n/<code>.json and published under /<code>/.
  languages: [
    { code: 'en', prefix: '', label: 'EN', name: 'English' },
    { code: 'my', prefix: '/my', label: 'မြန်မာ', name: 'Burmese' },
  ],

  nav: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about/' },
    { label: 'Products', href: '/products/' },
    { label: 'Health & Knowledge', href: '/health-knowledge/' },
    { label: 'News', href: '/news/' },
    { label: 'FAQs', href: '/faqs/' },
    { label: 'Contact Us', href: '/contact/' },
  ],

  // Client / partner logos. Leave EMPTY until the company supplies
  // real, permission-cleared logos. The "Trusted by" section only
  // renders when this list has entries.
  // Example: { name: 'Hospital name', logo: 'clients/hospital.svg', url: '' }
  clients: [],

  medicalDisclaimer:
    'Information on this website is provided for general information and for healthcare professionals. It does not replace professional medical advice, diagnosis or treatment. Prescription medicines must only be used under the supervision of a qualified healthcare professional.',
};
