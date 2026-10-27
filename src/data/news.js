/**
 * News & updates.
 * ---------------------------------------------------------------
 * type: 'company'  → MMMPharma's own announcements (shown first)
 *       'media'    → external coverage / regulatory news (links out)
 *
 * `date` is optional (YYYY-MM-DD). The three media items below were
 * linked from the current home page WITHOUT dates, so no date is shown.
 * Add the publication date once confirmed.
 */
module.exports = [
  {
    type: 'media',
    category: 'Regulatory update',
    title: 'FDA warns about unregistered oxytocin drugs on the market',
    source: 'Myanmar Digital News',
    summary: 'Myanmar Digital News reports on the FDA’s warning about unregistered oxytocin products.',
    url: 'https://www.mdn.gov.mm/en/fda-warns-unregistered-oxytocin-drugs-market',
    date: null,
  },
  {
    type: 'media',
    category: 'Public health',
    title: 'Ministry highlights the importance of safe oxytocin',
    source: 'The Global New Light of Myanmar',
    summary: 'Coverage of health-authority action on the safe use of oxytocin.',
    url: 'https://www.gnlm.com.mm/249441-2/',
    date: null,
  },
  {
    type: 'media',
    category: 'Awareness',
    title: 'Ministry of Health public awareness notice on unregistered products',
    source: 'Ministry of Health (Facebook)',
    summary: 'A public awareness post from the Ministry of Health about unregistered medicines.',
    url: 'https://www.facebook.com/photo.php?fbid=967959892095772&id=100066453106114&set=a.574693004755798',
    date: null,
  },
];
