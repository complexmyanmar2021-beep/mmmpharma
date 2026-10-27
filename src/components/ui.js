// Small UI primitives shared by every page.
const { esc } = require('../lib/markdown');
const { icon } = require('../lib/icons');

/** "To be confirmed" chip — only rendered while cfg.showPendingFlags is on. */
function tbc(ctx, note = '') {
  if (!ctx.cfg.showPendingFlags) return '';
  return `<span class="tbc"${note ? ` title="${esc(note)}"` : ''}>To be confirmed</span>`;
}

/** Render a value that may be a plain string or { value, confirmed, note }. */
function val(ctx, v) {
  if (v && typeof v === 'object') return `${esc(v.value)}${v.confirmed === false ? ' ' + tbc(ctx, v.note) : ''}`;
  return esc(v);
}

/** Button / link-button. variant: primary | secondary | ghost | light */
function button(ctx, { href, label, variant = 'primary', iconName = '', external = false, attrs = '' }) {
  const h = external ? href : ctx.url(href);
  return `<a class="btn btn--${variant}" href="${h}"${external ? ' target="_blank" rel="noopener"' : ''} ${attrs}><span>${esc(label)}</span>${iconName ? icon(iconName, 'btn__icon') : ''}</a>`;
}

/** Section heading with optional eyebrow and lead. */
function sectionHeading({ eyebrow = '', title, lead = '', align = 'left', id = '', level = 2, light = false }) {
  return `<header class="sh sh--${align}${light ? ' sh--light' : ''}">
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
  <h${level} class="sh__title"${id ? ` id="${id}"` : ''}>${esc(title)}</h${level}>
  ${lead ? `<p class="sh__lead">${esc(lead)}</p>` : ''}
</header>`;
}

/**
 * Image with graceful fallback. If the file fails to load, the wrapper
 * shows a branded placeholder (see .media.is-broken in CSS).
 */
function img(ctx, file, alt, { w = 800, h = 600, cls = '', eager = false, sizes = '', label = '' } = {}) {
  if (!file) return `<span class="media is-broken ${cls}" data-label="${esc(label || alt)}"></span>`;
  const src = /^https?:|^\//.test(file) ? file : `${ctx.imageBase}/${file}`;
  return `<span class="media ${cls}" data-label="${esc(label || alt)}"><img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}></span>`;
}

function breadcrumb(ctx, items) {
  const all = [{ label: 'Home', href: '/' }, ...items];
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${all
    .map((it, i) => (i === all.length - 1 ? `<li aria-current="page">${esc(it.label)}</li>` : `<li><a href="${ctx.url(it.href)}">${esc(it.label)}</a></li>`))
    .join('')}</ol></nav>`;
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00Z');
  if (isNaN(dt)) return '';
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

module.exports = { tbc, val, button, sectionHeading, img, breadcrumb, formatDate, esc, icon };
