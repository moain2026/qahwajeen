/*!
 * القهوة الملكية — front-end behaviour.
 * Vanilla, no dependencies, progressive enhancement: every page works without JS.
 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IO = 'IntersectionObserver' in window;

  /* ── toast ── */
  var toast = (function () {
    var el = $('#toast'), msg = $('#toastMsg'), t;
    return function (text) {
      if (!el || !msg) return;
      msg.textContent = text;
      el.classList.add('show');
      clearTimeout(t);
      t = setTimeout(function () { el.classList.remove('show'); }, 3000);
    };
  })();

  /* ── header: shadow once scrolled ── */
  (function () {
    var hdr = $('#hdr');
    if (!hdr) return;
    var ticking = false;
    var apply = function () { hdr.classList.toggle('stuck', window.scrollY > 14); ticking = false; };
    apply();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
  })();

  /* ── header menu (mobile sheet) ── */
  (function () {
    var btn = $('#menuBtn'), nav = $('#topNav');
    if (!btn || !nav) return;
    var set = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'القائمة');
    };
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      set(!nav.classList.contains('open'));
      if (nav.classList.contains('open')) { var a = $('a', nav); if (a) a.focus({ preventScroll: true }); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) set(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024) set(false); }, { passive: true });
  })();

  /* ── reveal on scroll (.rv → .in) — content is visible without JS ── */
  (function () {
    var els = $$('.rv');
    if (!els.length) return;
    if (REDUCE || !IO) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ── FAQ: one open at a time ── */
  (function () {
    $$('.faq').forEach(function (box) {
      var items = $$('details', box);
      items.forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
        });
      });
    });
  })();

  /* ── share + copy ── */
  (function () {
    var copyText = function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
      return new Promise(function (res, rej) {
        try {
          var ta = document.createElement('textarea');
          ta.value = text; ta.setAttribute('readonly', '');
          ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta); res();
        } catch (e) { rej(e); }
      });
    };
    $$('[data-share]').forEach(function (b) {
      b.addEventListener('click', function () {
        var url = new URL(b.getAttribute('data-share') || location.pathname, location.origin).href;
        if (navigator.share) {
          navigator.share({ title: document.title, url: url }).catch(function () {});
        } else {
          copyText(url).then(function () { toast('تم نسخ رابط الصفحة'); }, function () { toast('تعذّر النسخ'); });
        }
      });
    });
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        copyText(b.getAttribute('data-copy') || '').then(function () { toast('تم نسخ الرقم'); }, function () { toast('تعذّر النسخ'); });
      });
    });
  })();

  /* ── bottom bar hidden while the hero's own buttons are on screen ── */
  (function () {
    var bar = $('.bnav'), hero = $('.hero-cta');
    if (!bar || !hero || !IO) return;
    new IntersectionObserver(function (e) { bar.classList.toggle('hide', e[0].isIntersecting); }, { threshold: 0.2 }).observe(hero);
  })();

  /* ── home menu tabs (roving tabindex, RTL arrows) ── */
  (function () {
    var tabs = $$('.tab');
    if (!tabs.length) return;
    var show = function (t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    };
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { show(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        var j = tabs.indexOf(t);
        var n = tabs[(j + (e.key === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length];
        n.focus(); show(n);
      });
    });
  })();

  /* ── gallery: "show all" + category filter ── */
  var more = $('#galMore'), gal = $('#galx');
  var openGal = function (open) {
    if (!gal) return;
    gal.hidden = !open;
    if (more) {
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.firstChild.nodeValue = open ? 'إخفاء الصور الإضافية ' : more.getAttribute('data-label') + ' ';
    }
  };
  if (more && gal) {
    more.setAttribute('data-label', more.firstChild.nodeValue.trim());
    more.addEventListener('click', function () {
      var open = gal.hidden;
      openGal(open);
      if (!open) { var w = $('#works'); if (w) w.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' }); }
    });
  }
  (function () {
    var bar = $('#worksFilters');
    if (!bar) return;
    var pills = $$('.w-pill', bar), cards = $$('#works .k-work-card');
    pills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-wcat') || 'all';
        pills.forEach(function (p) {
          var on = p === btn;
          p.classList.toggle('on', on);
          p.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        if (cat !== 'all' && gal && gal.hidden) openGal(true);
        cards.forEach(function (c) { c.hidden = !(cat === 'all' || c.getAttribute('data-wcat') === cat); });
      });
    });
  })();

  /* ── lightbox ── */
  (function () {
    var lb = $('#lbx');
    if (!lb || !lb.showModal) return;
    var im = $('img', lb), cap = $('#lbxCap', lb), items = $$('.galx-it'), idx = 0;
    var visible = function () { return items.filter(function (b) { return !b.hidden; }); };
    var openAt = function (i) {
      var list = visible();
      if (!list.length) return;
      idx = (i + list.length) % list.length;
      var b = list[idx], src = b.querySelector('img');
      if (src) { im.src = src.currentSrc || src.src; im.alt = src.alt || ''; }
      if (cap) cap.textContent = b.getAttribute('data-cap') || '';
      if (!lb.open) lb.showModal();
    };
    items.forEach(function (b) {
      b.addEventListener('click', function () { openAt(visible().indexOf(b)); });
    });
    $('.lbx-x', lb).addEventListener('click', function () { lb.close(); });
    $('.lbx-prev', lb).addEventListener('click', function (e) { e.stopPropagation(); openAt(idx - 1); });
    $('.lbx-next', lb).addEventListener('click', function (e) { e.stopPropagation(); openAt(idx + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); openAt(idx + 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); openAt(idx - 1); }
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  })();

  /* ── rails: prev/next buttons + gentle auto-advance (only while on screen) ── */
  (function () {
    var step = function (rail) {
      var card = rail.firstElementChild;
      return card ? card.getBoundingClientRect().width + 14 : 240;
    };
    $$('.rail-btn[data-rail-target]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var rail = document.getElementById(btn.getAttribute('data-rail-target'));
        if (!rail) return;
        rail.scrollBy({ left: btn.getAttribute('data-dir') === 'next' ? -step(rail) : step(rail), behavior: REDUCE ? 'auto' : 'smooth' });
        rail._pause = Date.now() + 6000;
      });
    });
    if (REDUCE || !IO) return;
    $$('[data-auto-rail]').forEach(function (rail) {
      var onScreen = false, dir = -1;
      rail._pause = 0;
      new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; }, { threshold: 0.4 }).observe(rail);
      ['pointerdown', 'touchstart', 'wheel', 'focusin'].forEach(function (ev) {
        rail.addEventListener(ev, function () { rail._pause = Date.now() + 6000; }, { passive: true });
      });
      rail.addEventListener('mouseenter', function () { rail._pause = Date.now() + 60000; });
      rail.addEventListener('mouseleave', function () { rail._pause = Date.now() + 1500; });
      setInterval(function () {
        if (!onScreen || document.hidden || Date.now() < rail._pause) return;
        var max = rail.scrollWidth - rail.clientWidth;
        if (max <= 10) return;
        var cur = Math.abs(rail.scrollLeft), s = step(rail);
        if (cur + s >= max - 8) dir = 1; else if (cur <= 8) dir = -1;
        rail.scrollBy({ left: dir * s, behavior: 'smooth' });
      }, 3400);
    });
  })();

  /* ── quick booking: build the WhatsApp message from the 3 choices ── */
  (function () {
    var box = $('#concBox');
    if (!box) return;
    var btn = $('#concWaBtn', box), recEl = $('#concRecText', box);
    var wa = box.getAttribute('data-wa'), place = box.getAttribute('data-place'), brand = box.getAttribute('data-brand');
    var val = function (g) { var b = $('.conc-pills[data-conc-group="' + g + '"] .conc-pill.on', box); return b; };
    var update = function () {
      var o = val('occ'), c = val('crew'), g = val('guest');
      var crew = c ? c.getAttribute('data-val') : '';
      var rec = g ? g.getAttribute('data-rec') : '';
      if (rec && crew.indexOf('نسائي') !== -1 && crew.indexOf('رجالي') === -1) {
        rec = rec.replace('قهوجيين وصبّابين', 'قهوجيات وصبّابات').replace('قهوجي وصبّاب', 'قهوجية وصبّابة')
          .replace('مباشر تنظيم', 'مباشرة تنظيم').replace('مشرف ميداني', 'مشرفة ميدانية');
      }
      if (recEl) recEl.textContent = rec;
      var msg = 'السلام عليكم، أرغب في عرض سعر من ' + brand + ' في ' + place + ':\n' +
        '• نوع المناسبة: ' + (o ? o.getAttribute('data-val') : '') + '\n' +
        '• الطاقم المطلوب: ' + crew + '\n' +
        '• عدد الضيوف: ' + (g ? g.getAttribute('data-val') : '') +
        (rec ? '\n• الترتيب المقترح: ' + rec : '');
      if (btn && wa) btn.href = wa + '?text=' + encodeURIComponent(msg);
    };
    $$('.conc-pills', box).forEach(function (grp) {
      var pills = $$('.conc-pill', grp);
      pills.forEach(function (b) {
        b.addEventListener('click', function () {
          pills.forEach(function (p) { var on = p === b; p.classList.toggle('on', on); p.setAttribute('aria-pressed', on ? 'true' : 'false'); });
          update();
        });
      });
    });
  })();

  /* ── conversion tracking: click_call · click_whatsapp · booking_submit · click_email ── */
  (function () {
    var EV = { call: 'click_call', whatsapp: 'click_whatsapp', booking: 'booking_submit', email: 'click_email' };
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-track]') : null;
      if (!a) return;
      var kind = a.getAttribute('data-track'), name = EV[kind];
      if (!name) return;
      var loc = a.getAttribute('data-location') || 'page';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, link_location: loc, page_path: location.pathname });
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', name, { link_location: loc });
      var t = window.__trk, label = t && t.ads && t.labels && t.labels[kind];
      if (label) window.gtag('event', 'conversion', { send_to: t.ads + '/' + label });
    }, { capture: true, passive: true });
  })();
})();
