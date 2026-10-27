/**
 * Company strengths and values — text from the current About / Home pages
 * (typos corrected: "nnanufacturerrs", "Myannmar", "quallty",
 * "respon-siveness", "Responsibililty").
 */
module.exports = {
  strengths: [
    { icon: 'calendar', title: 'Serving since 2013', short: 'Licensed distributor in Myanmar', text: 'A licensed pharmaceutical distributor serving Myanmar’s healthcare sector since 2013.' },
    { icon: 'shield', title: 'GMP-certified sourcing', short: 'From GMP-certified manufacturers', text: 'We source our products from GMP-certified manufacturers to ensure the highest quality standards.' },
    { icon: 'badge', title: 'FDA-approved products', short: 'International and local FDA standards', text: 'Our key products meet international and local FDA standards for trusted quality and safety.' },
    { icon: 'truck', title: 'Distribution network', short: 'Timely deliveries across Myanmar', text: 'Our extensive distribution network ensures timely deliveries across Myanmar.' },
    { icon: 'clipboard', title: 'Regulatory compliance', short: 'Myanmar pharmaceutical regulations', text: 'We adhere strictly to Myanmar’s pharmaceutical regulations for full legal and ethical compliance.' },
    { icon: 'handshake', title: 'Customer care', text: 'We are committed to exceptional service, responsiveness and long-term customer care.' },
  ],
  values: [
    { icon: 'microscope', title: 'Quality', text: 'We uphold the highest standards in pharmaceutical manufacturing to ensure safety and effectiveness.' },
    { icon: 'scale', title: 'Integrity', text: 'We operate with transparency, ethics and accountability in all aspects of our business.' },
    { icon: 'link', title: 'Reliability', text: 'We ensure dependable supply through robust quality control and efficient operations.' },
    { icon: 'heart', title: 'Responsibility', text: 'We are committed to ethical practices and contributing positively to our communities.' },
  ],
  healthCategories: [
    'Medicine Safety', 'Maternal Health', 'Pharmaceutical Awareness', 'Medicine Storage',
    'Patient Safety', 'Public Health', 'World Health Awareness', 'Healthcare Education',
  ],
  // Occasion TYPES the Health & Knowledge section is designed to support.
  // Dates deliberately not hard-coded — add them per article when published.
  awarenessOccasions: [
    'World Health Day', 'World Patient Safety Day', 'World Pharmacists Day',
    'Maternal Health Awareness', 'Medicine Safety Awareness', 'Antimicrobial Awareness',
  ],
};
