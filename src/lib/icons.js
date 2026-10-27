// Inline SVG icon set (24×24, 1.75 stroke). Decorative by default (aria-hidden).
const paths = {
  calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path d="M8 14h3v3H8z"/>',
  shield: '<path d="M12 2.8 4.5 5.6v6.1c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V5.6L12 2.8Z"/><path d="m8.8 12.1 2.3 2.3 4.3-4.6"/>',
  badge: '<circle cx="12" cy="9.5" r="6"/><path d="m9.6 9.6 1.7 1.7 3.2-3.4"/><path d="M8.2 14.2 7 21.5l5-2.6 5 2.6-1.2-7.3"/>',
  truck: '<path d="M2.5 6.5h11v9.5h-11z"/><path d="M13.5 9.5h4l3 3.2v3.3h-7"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17.5" rx="2"/><path d="M9 4V2.8h6V4"/><path d="M8.5 10h7M8.5 13.5h7M8.5 17h4"/>',
  handshake: '<path d="m11 17.5 1.6 1.4a1.6 1.6 0 0 0 2.3-2.2"/><path d="m14.9 16.7 1 .8a1.6 1.6 0 0 0 2.2-2.3l-3.7-3.9"/><path d="m2.5 11.5 4-5 4.3 1.3L13 6.2h3.3l5.2 5.3"/><path d="M18 15.2 21.5 12M2.5 11.5l6.7 6.6a1.6 1.6 0 0 0 2.3-2.2"/><path d="m10.8 7.8-2.6 2.6a1.6 1.6 0 0 0 2.3 2.3l2.2-2"/>',
  microscope: '<path d="M6 20.5h12M9 17.5h6"/><path d="M12 17.5a5.5 5.5 0 0 0 5.3-7"/><path d="m8.5 3.5 4 6.8-2.6 1.5-4-6.8z"/><path d="m11 8.3-1.6.9"/>',
  scale: '<path d="M12 3v18M7 21h10M4 7h16"/><path d="m4 7-2.5 6a3 3 0 0 0 5 0Z"/><path d="m20 7-2.5 6a3 3 0 0 0 5 0Z"/>',
  link: '<path d="M10 13.5a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10.5a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
  heart: '<path d="M12 20.5s-8.5-4.8-8.5-11A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 2.9c0 6.2-8.5 11-8.5 11Z"/><path d="M7.5 12h2.2l1.3-2.5 2 5 1.3-2.5h2.2"/>',
  phone: '<path d="M5 3.5h3.3l1.7 4.3-2.2 1.4a11 11 0 0 0 5 5l1.4-2.2 4.3 1.7V17a2.5 2.5 0 0 1-2.5 2.5A15.5 15.5 0 0 1 2.5 6 2.5 2.5 0 0 1 5 3.5Z"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6.5 9 6.5 9-6.5"/>',
  pin: '<path d="M12 21.5s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  facebook: '<path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6H10"/>',
  menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  thermo: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z"/><path d="M12 10v7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
  alert: '<path d="M12 3.5 2.5 20h19Z"/><path d="M12 10v4.5M12 17.2v.2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  vial: '<path d="M9 2.5h6M10 2.5v4.2L5.2 16.5A3 3 0 0 0 7.9 21h8.2a3 3 0 0 0 2.7-4.5L14 6.7V2.5"/><path d="M7 14h10"/>',
  hospital: '<path d="M3.5 21V8.5L12 3.5l8.5 5V21"/><path d="M12 9v5M9.5 11.5h5"/><path d="M9.5 21v-3.5h5V21M2 21h20"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15.5H5.5A1.5 1.5 0 0 0 4 20Z"/><path d="M4 20a1.5 1.5 0 0 0 1.5 1.5H20M8.5 7.5h7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.7 5.5 3.7 9s-1.2 6.5-3.7 9c-2.5-2.5-3.7-5.5-3.7-9S9.5 5.5 12 3Z"/>',
  news: '<rect x="3" y="4" width="15" height="16.5" rx="1.5"/><path d="M18 8h2.5v11a1.5 1.5 0 0 1-3 0M6.5 8h8M6.5 11.5h8M6.5 15h5"/>',
  send: '<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5Z"/>',
  chat: '<path d="M12 3c5 0 9 3.3 9 7.6 0 4.2-4 7.5-9 7.5-.9 0-1.8-.1-2.6-.3L4.5 20.5l1.2-4C4 15.1 3 13 3 10.6 3 6.3 7 3 12 3Z"/><path d="M9.6 8.2h1.2l.6 1.6-.8.6a4 4 0 0 0 1.6 1.6l.6-.8 1.6.6v1.2a.9.9 0 0 1-.9.9A5.3 5.3 0 0 1 8.7 9.1a.9.9 0 0 1 .9-.9Z"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>',
  pill: '<rect x="2.8" y="8.2" width="18.4" height="7.6" rx="3.8" transform="rotate(-45 12 12)"/><path d="m8.8 8.8 6.4 6.4"/>',
};

function icon(name, cls = '', label = '') {
  const p = paths[name];
  if (!p) throw new Error('Unknown icon: ' + name);
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${p}</svg>`;
}

module.exports = { icon };
