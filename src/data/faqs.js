/**
 * FAQs — sourced from the current mmmpharma.com (home page FAQ block
 * and /pages/faq). Grammar tidied; factual meaning preserved.
 *
 * `published: false` = kept for the record but NOT shown. These were
 * consumer / general-interest items on the old FAQ page (e.g. "love
 * hormone", autism, anxiety) that are off-topic for a B2B distributor
 * and make clinical statements that should be reviewed by a pharmacist
 * before any publication. See CONTENT-NOTES.md #9.
 */

const categories = [
  { id: 'products', label: 'Products' },
  { id: 'safety', label: 'Safety' },
  { id: 'storage', label: 'Storage' },
  { id: 'distribution', label: 'Distribution' },
  { id: 'company', label: 'Company' },
];

const faqs = [
  // ---- Products
  { cat: 'products', home: true, q: 'What is oxytocin used for?',
    a: 'Oxytocin is commonly used to induce or strengthen labour contractions during childbirth, to manage postpartum bleeding, and to support uterine recovery.' },
  { cat: 'products', q: 'How is oxytocin administered?',
    a: 'In clinical settings, oxytocin is typically given by intravenous (IV) infusion or by intramuscular (IM) injection.' },
  { cat: 'products', q: 'Can oxytocin be used to induce labour?',
    a: 'Yes. Synthetic oxytocin is commonly used in hospitals to stimulate uterine contractions and induce labour.' },
  { cat: 'products', q: 'Can oxytocin be used for postpartum bleeding?',
    a: 'Yes. It helps the uterus contract after birth, which reduces bleeding and helps prevent postpartum haemorrhage.' },
  { cat: 'products', q: 'Is oxytocin a prescription medicine?',
    a: 'Yes. Synthetic oxytocin is a prescription medicine used under medical supervision, especially during labour and postpartum care.' },
  { cat: 'products', q: 'Is synthetic oxytocin different from natural oxytocin?',
    a: 'Synthetic oxytocin is chemically identical to natural oxytocin, but it is given in higher, controlled doses for medical purposes.' },

  // ---- Safety
  { cat: 'safety', home: true, q: 'Is oxytocin safe for all mothers?',
    a: 'Oxytocin should only be used under the supervision of a medical professional. It is not recommended for people with certain medical conditions without a doctor’s approval.' },
  { cat: 'safety', q: 'What are the side effects of oxytocin?',
    a: 'Side effects may include nausea, vomiting, increased blood pressure and irregular heartbeat. During labour, it can cause overly strong contractions.' },
  { cat: 'safety', q: 'What precautions should be taken when using oxytocin?',
    a: 'Oxytocin should only be used with medical guidance, especially during pregnancy, because of the risk of strong uterine contractions and fetal distress.' },
  { cat: 'safety', q: 'What are the risks of an oxytocin overdose?',
    a: 'Overdose can lead to uterine rupture, fetal distress, water intoxication or cardiac problems. It must always be used under professional supervision.' },
  { cat: 'safety', q: 'Is it safe to use oxytocin for non-medical purposes?',
    a: 'No. Using oxytocin without medical oversight can be dangerous and is not recommended.' },

  // ---- Storage
  { cat: 'storage', home: true, q: 'How should your products be stored?',
    a: 'Storage conditions are specific to each product and are printed on the box. Oxytocin Injection is stored between 2 °C and 8 °C and protected from light. Amrokort is stored below 30 °C. Always follow the instructions printed on the box, or consult a licensed pharmacist.',
    // Old home-page FAQ said "below 25 °C, protected from light" — superseded by the printed carton (2–8 °C).
    pending: 'Amrokort storage unit (°C) not stated on the current site.' },

  // ---- Distribution
  { cat: 'distribution', home: true, q: 'Do you sell directly to individuals?',
    a: 'No. We distribute Oxytocin to licensed hospitals, clinics and pharmacies only.' },
  { cat: 'distribution', q: 'How can a hospital, clinic or pharmacy contact you?',
    a: 'Send us an inquiry through the Contact page, or call or email our office during business hours (Monday to Friday, 9:00 AM to 5:00 PM).' },

  // ---- Company
  { cat: 'company', home: true, q: 'Are your products FDA-approved?',
    a: 'Yes. Our pharmaceutical products are approved by FDA Myanmar and are GMP-certified for quality and safety. The regulatory status of each product is listed on its product page.' },
  { cat: 'company', q: 'How long has Maung Maung Myint Co., Ltd been operating?',
    a: 'We have served Myanmar’s healthcare sector as a licensed pharmaceutical distributor since 2013.' },

  // ---- Not published (pending medical review / off-topic for B2B audience)
  { published: false, q: 'What is oxytocin and what does it do in the body?', a: 'Oxytocin is a hormone and neurotransmitter involved in childbirth, breastfeeding, social bonding, and emotional regulation.' },
  { published: false, q: 'Is oxytocin only related to childbirth?', a: 'No, it also plays a role in emotional bonding, trust, empathy, and sexual reproduction.' },
  { published: false, q: 'Is oxytocin the same as the "love hormone"?', a: 'Yes, it is often called the "love hormone" because it promotes bonding, intimacy, and trust between people.' },
  { published: false, q: 'Does oxytocin affect emotional bonding?', a: 'Yes, oxytocin plays a significant role in forming emotional connections, particularly between mothers and infants and romantic partners.' },
  { published: false, q: 'Can oxytocin help with anxiety or depression?', a: 'Research is ongoing, but oxytocin may have potential in treating anxiety and mood disorders. It is not yet an approved treatment.' },
  { published: false, q: 'Can men benefit from oxytocin treatment?', a: "In certain cases, oxytocin may help with social bonding or psychological disorders, but it's not widely prescribed for men." },
  { published: false, q: 'Are there natural ways to increase oxytocin levels?', a: 'Yes. Physical touch, hugging, breastfeeding, listening to music, and social bonding naturally boost oxytocin levels.' },
  { published: false, q: 'How long does oxytocin stay in the system?', a: 'Oxytocin has a short half-life of about 3–5 minutes when injected, but its effects can last longer depending on context.' },
  { published: false, q: 'Is oxytocin used in veterinary medicine?', a: 'Yes, oxytocin is used in animals to induce labor, stimulate milk release, or treat postpartum issues.' },
  { published: false, q: 'Can oxytocin be used for autism therapy?', a: 'Some studies suggest oxytocin may help improve social skills in individuals with autism, but more research is needed before it becomes a standard treatment.' },
  { published: false, q: 'Is oxytocin addictive or habit-forming?', a: 'Oxytocin is not chemically addictive, but overreliance on its emotional effects may pose psychological risks if misused.' },
];

module.exports = { categories, faqs: faqs.filter((f) => f.published !== false), unpublished: faqs.filter((f) => f.published === false) };
