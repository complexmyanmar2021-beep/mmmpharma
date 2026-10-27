// Dictionary-based page translation (no dependencies).
// The English site is the source. For another language, every visible text
// node and translatable attribute is looked up — by its exact (trimmed)
// English text — in src/i18n/<lang>.json. Missing entries stay in English
// and are listed by the build so they can be added to the dictionary.
const ATTRS = ['alt', 'aria-label', 'title', 'placeholder', 'data-label'];
const META = /^(description|og:title|og:description|twitter:title|twitter:description)$/;

function decode(s) { return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }
function encodeText(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function encodeAttr(s) { return encodeText(s).replace(/"/g, '&quot;'); }

// Is this string worth translating (has letters, isn't a phone/email/url/code)?
function translatable(s) {
  if (!/[A-Za-z]/.test(s)) return false;
  if (/^[\w.+-]+@[\w.-]+$/.test(s)) return false;          // email
  if (/^(https?:|www\.)/.test(s)) return false;            // url
  if (/^[+\d][\d\s()+-]*$/.test(s)) return false;          // phone
  if (/^(IM|IV|IM \/ IV|Rx|USP|GMP|FDA|WHO-GMP|MMMPharma|404|EN|MMM|Pharma)$/.test(s)) return false;
  return true;
}

function translateHtml(html, dict, missing) {
  const look = (raw) => {
    const core = raw.trim();
    if (!core || !translatable(decode(core))) return raw;
    const key = decode(core).replace(/\s+/g, ' ');
    const hit = dict[key];
    if (hit == null || hit === '') { missing.add(key); return raw; }
    const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    return lead + encodeText(hit) + trail;
  };
  let out = '', i = 0, skip = null;
  const re = /<!--[\s\S]*?-->|<[^>]+>/g; let m;
  while ((m = re.exec(html))) {
    const text = html.slice(i, m.index);
    out += skip ? text : look(text);
    let tag = m[0];
    const name = (tag.match(/^<\/?\s*([a-zA-Z0-9-]+)/) || [])[1]?.toLowerCase();
    if (!tag.startsWith('</') && (name === 'script' || name === 'style')) skip = name;
    else if (tag.startsWith('</') && name === skip) skip = null;
    if (!tag.startsWith('</') && !tag.startsWith('<!')) {
      tag = tag.replace(/\s([a-z-]+)="([^"]*)"/g, (all, a, v) => {
        if (ATTRS.includes(a)) {
          const t = look(v);
          return t === v ? all : ` ${a}="${encodeAttr(decode(t))}"`;
        }
        return all;
      });
      if (name === 'meta') {
        const key = (tag.match(/(?:name|property)="([^"]+)"/) || [])[1];
        if (key && META.test(key)) tag = tag.replace(/content="([^"]*)"/, (all, v) => { const t = look(v); return `content="${encodeAttr(decode(t))}"`; });
      }
    }
    out += tag; i = re.lastIndex;
  }
  out += look(html.slice(i));
  return out;
}

// Collect every translatable string from a page (used to build dictionaries).
function collect(html, set) { translateHtml(html, {}, set); }

module.exports = { translateHtml, collect };
