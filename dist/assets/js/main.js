/* MMMPharma — progressive enhancement. The site works without JavaScript. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var LANG = doc.lang === 'my' ? 'my' : 'en';

  /* ---------- Language switch (animated) ---------- */
  try {
    if (sessionStorage.getItem('mmm-lang-switch')) {
      sessionStorage.removeItem('mmm-lang-switch');
      doc.classList.add('is-lang-arriving');
      setTimeout(function () { doc.classList.remove('is-lang-arriving'); }, 700);
    }
  } catch (e) { /* storage unavailable */ }
  document.querySelectorAll('[data-lang-switch]').forEach(function (sw) {
    sw.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      var href = sw.getAttribute('href') + location.hash;
      try {
        localStorage.setItem('mmm-lang', sw.getAttribute('data-target'));
        sessionStorage.setItem('mmm-lang-switch', '1');
      } catch (err) { /* ignore */ }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { location.href = href; return; }
      sw.classList.add('is-switching');
      setTimeout(function () { doc.classList.add('is-lang-leaving'); }, 180);
      setTimeout(function () { location.href = href; }, 480);
    });
  });
  // Restore the switch if the page comes back from the back/forward cache
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      doc.classList.remove('is-lang-leaving');
      document.querySelectorAll('[data-lang-switch]').forEach(function (sw) { sw.classList.remove('is-switching'); });
    }
  });

  /* ---------- UI messages ---------- */
  var MSG = {
    en: {
      name: 'Enter your full name.',
      organization: 'Enter your hospital, clinic, pharmacy or company name.',
      phone: 'Enter a phone number, for example +95 9 123 456 789.',
      email: 'Enter an email address, for example name@hospital.com.',
      subject: 'Choose a subject.',
      message: 'Write a message of at least 10 characters.',
      check: 'Please check the highlighted fields.',
      mailto: 'Your email app should open with your inquiry ready to send.',
      mailtoMore: 'If it doesn’t, email us at {to} or call during office hours.',
      sending: 'Sending…',
      send: 'Send Inquiry',
      sendReport: 'Send report',
      required: 'Please fill in this field.',
      sent: 'Thank you, your inquiry has been sent.',
      sentMore: 'Our team will reply during office hours.',
      failed: 'Your inquiry couldn’t be sent.',
      failedMore: 'Check your connection and try again, or contact us by phone or email.',
      mapTitle: 'Map showing the MMMPharma office at Gonyi Residence, Yangon',
    },
    my: {
      name: 'သင့်အမည် အပြည့်အစုံကို ထည့်ပါ။',
      organization: 'ဆေးရုံ၊ ဆေးခန်း၊ ဆေးဆိုင် သို့မဟုတ် ကုမ္ပဏီအမည်ကို ထည့်ပါ။',
      phone: 'ဖုန်းနံပါတ် ထည့်ပါ။ ဥပမာ +95 9 123 456 789',
      email: 'အီးမေးလ်လိပ်စာ ထည့်ပါ။ ဥပမာ name@hospital.com',
      subject: 'အကြောင်းအရာ တစ်ခု ရွေးပါ။',
      message: 'အနည်းဆုံး စာလုံး ၁၀ လုံးပါသော စာတိုကို ရေးပါ။',
      check: 'အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပါ။',
      mailto: 'သင့်အီးမေးလ် app တွင် စုံစမ်းချက်ကို ပို့ရန် အသင့်ဖွင့်ပေးပါမည်။',
      mailtoMore: 'မပွင့်ပါက {to} သို့ အီးမေးလ်ပို့ပါ သို့မဟုတ် ရုံးချိန်အတွင်း ဖုန်းဆက်ပါ။',
      sending: 'ပို့နေသည်…',
      send: 'စုံစမ်းချက် ပို့မည်',
      sendReport: 'အစီရင်ခံစာ ပို့မည်',
      required: 'ဤအကွက်ကို ဖြည့်ပါ။',
      sent: 'ကျေးဇူးတင်ပါသည်။ သင့်စုံစမ်းချက်ကို ပို့ပြီးပါပြီ။',
      sentMore: 'ကျွန်ုပ်တို့အဖွဲ့မှ ရုံးချိန်အတွင်း ပြန်လည်ဆက်သွယ်ပါမည်။',
      failed: 'သင့်စုံစမ်းချက်ကို ပို့၍ မရပါ။',
      failedMore: 'အင်တာနက်ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ သို့မဟုတ် ဖုန်း၊ အီးမေးလ်ဖြင့် ဆက်သွယ်ပါ။',
      mapTitle: 'ရန်ကုန်မြို့၊ ဂုံးညီ ရက်စ်ဒင့်ရှိ MMMPharma ရုံးတည်နေရာပြ မြေပုံ',
    },
  }[LANG];

  /* ---------- Image fallbacks ---------- */
  function markBroken(img) {
    var wrap = img.closest('.media');
    if (wrap) wrap.classList.add('is-broken');
    var logo = img.closest('.logo');
    if (logo) logo.classList.add('is-fallback');
  }
  document.querySelectorAll('.media img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) markBroken(img);
    img.addEventListener('error', function () { markBroken(img); });
  });

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-mobile-nav]');
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1120) setOpen(false); });
  }

  /* ---------- Scroll reveal (only for content below the first screen) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.remove('is-pending'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    var vh = window.innerHeight;
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      if (el.getBoundingClientRect().top > vh) {
        el.classList.add('is-pending');
        // stagger siblings slightly
        var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = Math.min(idx, 5) * 60 + 'ms';
        io.observe(el);
      }
    });
  }

  /* ---------- Health & Knowledge filters ---------- */
  var filters = document.querySelector('[data-filters]');
  if (filters) {
    var cards = document.querySelectorAll('.acard[data-category]');
    var emptyMsg = document.querySelector('[data-empty-msg]');
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      filters.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      cards.forEach(function (c) {
        var match = f === 'all' || c.getAttribute('data-category') === f;
        c.hidden = !match;
        c.classList.remove('is-pending');
        if (match) shown++;
      });
      if (emptyMsg) emptyMsg.hidden = shown > 0;
    });
  }

  /* ---------- FAQ: open item from URL hash ---------- */
  function openFromHash() {
    if (!location.hash) return;
    var t = document.getElementById(location.hash.slice(1));
    if (t && t.tagName === 'DETAILS') t.open = true;
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* ---------- FAQ page: highlight current category ---------- */
  var faqNav = document.querySelector('.faqp__nav');
  if (faqNav && 'IntersectionObserver' in window) {
    var links = faqNav.querySelectorAll('a');
    var groupIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.faqp__group').forEach(function (g) { groupIO.observe(g); });
  }

  /* ---------- Map: load Google Maps only on request (performance + privacy) ---------- */
  var mapBtn = document.querySelector('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var frame = document.querySelector('[data-map]');
      var iframe = document.createElement('iframe');
      iframe.src = frame.getAttribute('data-src');
      iframe.title = MSG.mapTitle;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      frame.appendChild(iframe);
      frame.querySelector('.map__placeholder').hidden = true;
    });
  }

  /* ---------- Forms (inquiry + side-effect report) ---------- */
  document.querySelectorAll('[data-inquiry-form]').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var submit = form.querySelector('[type="submit"]');
    var sendLabel = submit.getAttribute('data-label') ? MSG.sendReport : MSG.send;

    // Pre-fill subject from ?subject=… (product pages link here)
    try {
      var qs = new URLSearchParams(location.search).get('subject');
      var sel = form.querySelector('#subject');
      if (qs && sel) {
        Array.prototype.forEach.call(sel.options, function (o) { if (o.value === qs) sel.value = o.value; });
      }
    } catch (e) { /* ignore */ }

    var rules = {
      name: function (v) { return v.trim().length >= 2 || MSG.name; },
      organization: function (v) { return v.trim().length >= 2 || MSG.organization; },
      phone: function (v) { return /^[+\d][\d\s\-()]{6,}$/.test(v.trim()) || MSG.phone; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || MSG.email; },
      subject: function (v) { return !!v || MSG.subject; },
      message: function (v) { return v.trim().length >= 10 || MSG.message; },
    };
    function check(field) {
      if (!field.name) return true;
      var v = field.value;
      var res = true;
      // Optional fields are only checked when filled in.
      if (field.required || v.trim()) {
        if (rules[field.name]) res = rules[field.name](v);
        else if (field.required && !v.trim()) res = MSG.required;
      }
      var err = form.querySelector('#' + field.name + '-error');
      var ok = res === true;
      field.setAttribute('aria-invalid', String(!ok));
      var desc = (field.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== field.name + '-error'; });
      if (!ok) desc.push(field.name + '-error');
      if (desc.length) field.setAttribute('aria-describedby', desc.join(' ')); else field.removeAttribute('aria-describedby');
      if (err) { err.textContent = ok ? '' : res; err.hidden = ok; }
      return ok;
    }
    var fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value) check(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(f); });
    });

    var icons = {
      success: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
      error: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16v.2"/></svg>',
      info: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/></svg>',
    };
    function show(type, html) {
      status.className = 'form__status is-' + type;
      status.innerHTML = icons[type] + '<div>' + html + '</div>';
      status.hidden = false;
      status.focus();
    }
    function labelOf(f) {
      var l = form.querySelector('label[for="' + f.id + '"]');
      return l ? l.firstChild.textContent.trim() : f.name;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
      if (firstBad) {
        show('error', '<strong>' + MSG.check + '</strong>');
        firstBad.focus();
        return;
      }
      var data = {};
      fields.forEach(function (f) { if (f.name) data[f.name] = f.value.trim(); });
      var mailSubject = form.getAttribute('data-mail-subject');
      if (mailSubject) data.subject = mailSubject + (data.product ? ' ' + data.product : '');
      var endpoint = form.getAttribute('data-endpoint');

      if (!endpoint) {
        // No form service configured: hand the message to the visitor's email app.
        var to = form.getAttribute('data-fallback-email');
        var body = '';
        fields.forEach(function (f) { if (f.name && f.name !== 'message' && f.name !== 'subject' && f.value.trim()) body += labelOf(f) + ': ' + f.value.trim() + '\n'; });
        body += '\n' + data.message;
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(mailSubject ? data.subject : '[Website inquiry] ' + data.subject) + '&body=' + encodeURIComponent(body);
        show('info', '<strong>' + MSG.mailto + '</strong> ' + MSG.mailtoMore.replace('{to}', '<a href="mailto:' + to + '">' + to + '</a>'));
        return;
      }

      submit.setAttribute('aria-busy', 'true');
      submit.querySelector('span').textContent = MSG.sending;
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); })
        .then(function () {
          form.reset();
          fields.forEach(function (f) { f.removeAttribute('aria-invalid'); });
          show('success', '<strong>' + MSG.sent + '</strong> ' + MSG.sentMore);
        })
        .catch(function () {
          show('error', '<strong>' + MSG.failed + '</strong> ' + MSG.failedMore);
        })
        .then(function () {
          submit.removeAttribute('aria-busy');
          submit.querySelector('span').textContent = sendLabel;
        });
    });
  });
})();
