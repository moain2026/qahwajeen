/*!
 * قهوجيين — front-end behaviour
 * Vanilla, zero dependencies. Progressive enhancement only:
 * every page works fully with JS disabled.
 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = window.matchMedia('(hover: none)').matches;

  /* ─── 0. Toast (shared) ─────────────────────────────────── */
  var toast = (function () {
    var el = $('#toast'), msg = $('#toastMsg'), t;
    return function (text) {
      if (!el || !msg) return;
      msg.textContent = text;
      el.classList.add('show');
      clearTimeout(t);
      t = setTimeout(function () { el.classList.remove('show'); }, 3200);
    };
  })();

  /* ─── 1. Sticky header ──────────────────────────────────── */
  (function stickyHeader() {
    var hdr = $('#hdr');
    if (!hdr) return;
    var ticking = false;
    var apply = function () {
      hdr.classList.toggle('stuck', window.scrollY > 14);
      ticking = false;
    };
    apply();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
  })();

  /* ─── 2. Mobile bottom sheet ────────────────────────────── */
  (function sheet() {
    var btn = $('#burger'), sh = $('#sheet'), bd = $('#sheetBd');
    if (!btn || !sh || !bd) return;
    var open = false;

    var set = function (state) {
      open = state;
      sh.classList.toggle('open', state);
      bd.classList.toggle('open', state);
      sh.setAttribute('aria-hidden', state ? 'false' : 'true');
      btn.setAttribute('aria-expanded', state ? 'true' : 'false');
      btn.setAttribute('aria-label', state ? 'إغلاق القائمة' : 'فتح القائمة');
      document.documentElement.style.overflow = state ? 'hidden' : '';
      if (state) { bd.hidden = false; }
      else { setTimeout(function () { if (!open) bd.hidden = true; }, 420); }
      if (state) { var f = sh.querySelector('a'); if (f) f.focus({ preventScroll: true }); }
      else if (sh.contains(document.activeElement)) { document.activeElement.blur(); }
    };

    btn.addEventListener('click', function () { set(!open); });
    var x = $('#sheetX'); if (x) x.addEventListener('click', function () { set(false); btn.focus(); });
    bd.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { set(false); btn.focus(); }
    });
    $$('a', sh).forEach(function (a) {
      a.addEventListener('click', function () { set(false); });
    });
    var y0 = null;
    sh.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientX; }, { passive: true });
    sh.addEventListener('touchmove', function (e) {
      if (y0 === null) return;
      if (e.touches[0].clientX - y0 > 70) { set(false); y0 = null; }
    }, { passive: true });
    sh.addEventListener('touchend', function () { y0 = null; }, { passive: true });
  })();

  /* ─── 3. Reveal on scroll (.rv → .in) ───────────────────── */
  (function reveal() {
    var sel = '.rv, .gal figure.flip';
    var els = $$(sel);
    if (!els.length) return;
    if (REDUCE || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ─── 4. Page-transition line ───────────────────────────── */
  (function pgline() {
    var line = $('#pgline');
    if (!line) return;
    var going = false;

    var samePage = function (a) {
      try {
        var u = new URL(a.href, location.href);
        return u.origin === location.origin &&
               u.pathname === location.pathname &&
               (u.hash || !u.search);
      } catch (e) { return false; }
    };

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (href.charAt(0) === '#' || /^(tel:|mailto:|https?:\/\/wa\.me)/i.test(href)) return;
      var u;
      try { u = new URL(a.href, location.href); } catch (err) { return; }
      if (u.origin !== location.origin) return;
      if (samePage(a)) return;
      if (going) return;
      going = true;
      line.classList.add('on');
    }, true);

    // Reset when returning via back/forward cache
    window.addEventListener('pageshow', function () {
      going = false;
      line.classList.remove('on');
    });
  })();

  /* ─── 5. 3D tilt (.tilt) ────────────────────────────────── */
  (function tilt() {
    var els = $$('.tilt');
    if (!els.length || REDUCE) return;

    var MAX = 9; // degrees

    var bind = function (el) {
      var raf = null, rect = null;

      var measure = function () { rect = el.getBoundingClientRect(); };

      var move = function (x, y) {
        if (!rect) measure();
        var px = (x - rect.left) / rect.width;
        var py = (y - rect.top) / rect.height;
        px = Math.min(1, Math.max(0, px));
        py = Math.min(1, Math.max(0, py));
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          el.style.setProperty('--ry', ((px - 0.5) * MAX * 2).toFixed(2) + 'deg');
          el.style.setProperty('--rx', ((0.5 - py) * MAX * 2).toFixed(2) + 'deg');
          el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      };

      var reset = function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
        rect = null;
      };

      if (TOUCH) {
        // Touch: a short 3D "press" so the tap still feels physical
        el.addEventListener('touchstart', function (e) {
          measure();
          move(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        el.addEventListener('touchend', reset, { passive: true });
        el.addEventListener('touchcancel', reset, { passive: true });
      } else {
        el.addEventListener('pointerenter', measure);
        el.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY); });
        el.addEventListener('pointerleave', reset);
        el.addEventListener('focus', measure);
        el.addEventListener('blur', reset);
      }
    };

    els.forEach(bind);
    window.addEventListener('resize', function () {
      els.forEach(function (el) {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    }, { passive: true });
  })();

  /* ─── 6. Gallery filter ─────────────────────────────────── */
  (function galleryFilter() {
    var bar = $('#galFilters'), grid = $('#galGrid');
    if (!bar || !grid) return;
    var btns = $$('button[data-cat]', bar);
    var figs = $$('figure[data-cat]', grid);
    if (!btns.length || !figs.length) return;

    var apply = function (cat) {
      btns.forEach(function (b) {
        var on = b.getAttribute('data-cat') === cat;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var shown = 0;
      figs.forEach(function (f) {
        var ok = cat === 'all' || f.getAttribute('data-cat') === cat;
        if (ok) {
          f.hidden = false;
          f.style.setProperty('--d', (shown * 45) + 'ms');
          shown++;
          // re-trigger the flip
          f.classList.remove('in');
          void f.offsetWidth;
          f.classList.add('in');
        } else {
          f.hidden = true;
          f.classList.remove('in');
        }
      });
      var empty = $('#galEmpty');
      if (empty) empty.hidden = shown > 0;
    };

    btns.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-cat')); });
    });
  })();

  /* ─── 7. Booking form → WhatsApp deep link ──────────────── */
  (function bookForm() {
    var form = $('#bookForm');
    if (!form) return;

    var val = function (n) {
      var f = form.elements[n];
      return f && f.value ? String(f.value).trim() : '';
    };

    var flag = function (n, msg) {
      var f = form.elements[n];
      if (f) {
        f.focus({ preventScroll: false });
        f.style.borderColor = 'var(--gold)';
      }
      toast(msg);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = val('name'), tel = val('tel'), city = val('city');
      if (!name) return flag('name', 'الرجاء كتابة الاسم');
      if (!tel) return flag('tel', 'الرجاء كتابة رقم الجوال');
      if (tel.replace(/\D/g, '').length < 9) return flag('tel', 'رقم الجوال غير مكتمل');
      if (!city) return flag('city', 'الرجاء اختيار المدينة');

      var lines = [
        'السلام عليكم، أرغب في حجز ضيافة:',
        '',
        '• الاسم: ' + name,
        '• الجوال: ' + tel,
        '• المدينة: ' + city
      ];
      if (val('kind')) lines.push('• المناسبة: ' + val('kind'));
      if (val('date')) lines.push('• التاريخ: ' + val('date'));
      if (val('guests')) lines.push('• عدد الضيوف: ' + val('guests'));
      if (val('service')) lines.push('• الخدمة: ' + val('service'));
      if (val('note')) lines.push('• ملاحظات: ' + val('note'));
      lines.push('', 'أرجو تزويدي بعرض سعر مفصّل. شكراً لكم.');

      var base = form.getAttribute('data-wa') || 'https://wa.me/966504968113';
      var sep = base.indexOf('?') === -1 ? '?' : '&';
      var href = base + sep + 'text=' + encodeURIComponent(lines.join('\n'));

      toast('جاري تحويلك إلى واتساب…');
      setTimeout(function () { window.open(href, '_blank', 'noopener'); }, 450);
    });

    $$('input,select,textarea', form).forEach(function (f) {
      var clear = function () { f.style.borderColor = ''; };
      f.addEventListener('input', clear);
      f.addEventListener('change', clear);
    });
  })();

  /* ─── 8. FAQ — single-open accordion ────────────────────── */
  (function faq() {
    var items = $$('.faq details');
    if (items.length < 2) return;
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  })();

  /* ─── 9. Share + copy buttons ───────────────────────────── */
  (function shareCopy() {
    var copyText = function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (res, rej) {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          res();
        } catch (e) { rej(e); }
      });
    };

    $$('[data-share]').forEach(function (b) {
      b.addEventListener('click', function () {
        var path = b.getAttribute('data-share') || location.pathname;
        var url = new URL(path, location.origin).href;
        var data = {
          title: document.title,
          text: 'كل حساباتنا وأرقامنا في صفحة واحدة',
          url: url
        };
        if (navigator.share) {
          navigator.share(data).catch(function () { /* user cancelled */ });
        } else {
          copyText(url).then(
            function () { toast('تم نسخ رابط الصفحة'); },
            function () { toast('تعذّر النسخ — انسخ الرابط من شريط العنوان'); }
          );
        }
      });
    });

    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        copyText(b.getAttribute('data-copy') || '').then(
          function () { toast('تم النسخ بنجاح'); },
          function () { toast('تعذّر النسخ'); }
        );
      });
    });

    // Desktop: tap-to-copy phone links instead of firing tel:
    if (!TOUCH) {
      $$('.cta-phone').forEach(function (a) {
        a.addEventListener('click', function (e) {
          if (!navigator.clipboard) return;
          e.preventDefault();
          copyText(a.textContent.trim()).then(
            function () { toast('تم نسخ رقم التواصل'); },
            function () { window.location.href = a.href; }
          );
        });
      });
    }
  })();

  /* ─── 10. Floating dock ──────────────────────────────────
   * Appears after the first fold. Retracts while the visitor
   * scrolls DOWN (reading) so it never sits on top of content,
   * and returns the instant they scroll UP (deciding) or stop.
   * ──────────────────────────────────────────────────────── */
  (function dock() {
    var dk = $('#dock');
    if (!dk) return;

    var last = window.scrollY;
    var ticking = false;
    var idle = null;

    var apply = function () {
      var y = window.scrollY;
      var past = y > 420;
      var down = y > last + 6;
      var up = y < last - 6;

      if (!past) dk.classList.remove('on', 'tuck');
      else {
        dk.classList.add('on');
        if (down) dk.classList.add('tuck');
        else if (up) dk.classList.remove('tuck');
      }

      last = y;
      ticking = false;

      // once scrolling settles, always show it again
      clearTimeout(idle);
      idle = setTimeout(function () {
        if (window.scrollY > 420) dk.classList.remove('tuck');
      }, 620);
    };

    apply();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
  })();

  /* ─── 11. Coin — pause the spin when off-screen ─────────── */
  (function coin() {
    var c = $('#coin');
    if (!c || REDUCE || !('IntersectionObserver' in window)) return;
    var inner = c.querySelector('.coin-in');
    var shade = c.querySelector('.coin-shadow');
    var io = new IntersectionObserver(function (entries) {
      var vis = entries[0].isIntersecting;
      [inner, shade].forEach(function (el) {
        if (el) el.style.animationPlayState = vis ? 'running' : 'paused';
      });
    }, { threshold: 0.05 });
    io.observe(c);
  })();

  /* ─── 12. Footer city mesh: open by default on desktop ─── */
  (function mesh() {
    var d = $('.ftr-mesh');
    if (d && window.matchMedia('(min-width:1024px)').matches) d.open = true;
  })();
})();

/* bottom bar: hidden while the first screen (with its own buttons) is visible */
(function () {
  var bar = document.querySelector('.bnav');
  var hero = document.querySelector('.hero-art .hero-cta, .hx .hx-cta');
  if (!bar || !hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (e) { bar.classList.toggle('hide', e[0].isIntersecting); }, { threshold: 0.2 }).observe(hero);
})();

/* ═══ one-page interactions ═══════════════════════════════════ */
(function () {
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* menu tabs (roving, keyboard-accessible) */
  var tabs = $$('.tab');
  function show(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: REDUCE ? 'auto' : 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', function () { show(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, j = tabs.indexOf(t);
      if (k === 'ArrowLeft' || k === 'ArrowRight') {
        e.preventDefault();
        var n = tabs[(j + (k === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length]; /* RTL */
        n.focus(); show(n);
      }
    });
  });

  /* gallery: inline "show more" */
  var more = $('#galMore'), gal = $('#galx');
  if (more && gal) {
    var total = $$('.galx-it').length;
    more.addEventListener('click', function () {
      var open = gal.hidden;
      gal.hidden = !open;
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.firstChild.nodeValue = open ? 'إخفاء الصور الإضافية ' : 'معرض الأعمال الكامل (' + total + ' صورة) ';
      if (!open) {
        var wSec = $('#works');
        if (wSec) wSec.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
      }
    });
  }

  /* partners of success: inline "show more" */
  var ptnMore = $('#ptnMore'), ptnGrid = $('#ptnGrid');
  if (ptnMore && ptnGrid) {
    var ptnTotal = $$('.ptn-card', ptnGrid).length;
    ptnMore.addEventListener('click', function () {
      var open = ptnGrid.classList.toggle('open');
      ptnMore.setAttribute('aria-expanded', open ? 'true' : 'false');
      ptnMore.firstChild.nodeValue = open ? 'عرض أقل ' : 'عرض كل الشركاء · ' + ptnTotal + ' جهة ';
      if (!open) ptnGrid.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
    });
  }

  /* Royal 10-Second Concierge (مُحدّد الضيافة الملكي السريع للزبون المستعجل) */
  var concBox = $('#concBox');
  if (concBox) {
    var concWaBtn = $('#concWaBtn', concBox);
    var concRecText = $('#concRecText', concBox);
    var placeName = concBox.getAttribute('data-place') || 'جدة';
    var brandName = concBox.getAttribute('data-brand') || 'القهوة الملكية';

    var updateConcierge = function () {
      var occBtn = $('.conc-pills[data-conc-group="occ"] .conc-pill.on', concBox);
      var crewBtn = $('.conc-pills[data-conc-group="crew"] .conc-pill.on', concBox);
      var guestBtn = $('.conc-pills[data-conc-group="guest"] .conc-pill.on', concBox);

      var occ = occBtn ? occBtn.getAttribute('data-val') : 'زواج أو ملكة';
      var crew = crewBtn ? crewBtn.getAttribute('data-val') : 'طاقم رجالي';
      var guest = guestBtn ? guestBtn.getAttribute('data-val') : '٥٠ إلى ١٢٠ ضيفاً';
      var rec = guestBtn ? guestBtn.getAttribute('data-rec') : '';

      if (concRecText && rec) {
        if (crew.indexOf('نسائي') !== -1 && crew.indexOf('رجالي') === -1) {
          rec = rec.replace('قهوجيين وصبّابين', 'قهوجيات وصبّابات').replace('قهوجي وصبّاب', 'قهوجية وصبّابة').replace('مباشر تنظيم', 'مباشرة تنظيم').replace('مشرف ميداني', 'مشرفة ميدانية');
        }
        concRecText.textContent = rec;
      }

      if (concWaBtn) {
        var msg = 'السلام عليكم، أرغب في عرض سعر فوري من ' + brandName + ' في ' + placeName + ':\n' +
                  '• نوع المناسبة: ' + occ + '\n' +
                  '• الطاقم المطلوب: ' + crew + '\n' +
                  '• عدد الضيوف: ' + guest +
                  (concRecText ? '\n• الترتيب المقترح: ' + concRecText.textContent : '');
        concWaBtn.href = 'https://wa.me/966504968113?text=' + encodeURIComponent(msg);
      }
    };

    $$('.conc-pills', concBox).forEach(function (grp) {
      var pills = $$('.conc-pill', grp);
      pills.forEach(function (btn) {
        btn.addEventListener('click', function () {
          pills.forEach(function (p) {
            var active = p === btn;
            p.classList.toggle('on', active);
            p.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          updateConcierge();
        });
      });
    });
  }

  /* Works inline category filter (#worksFilters) */
  var wBar = $('#worksFilters');
  if (wBar) {
    var wPills = $$('.w-pill', wBar);
    var wCards = $$('#works .k-work-card');
    wPills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-wcat') || 'all';
        wPills.forEach(function (p) {
          var on = p === btn;
          p.classList.toggle('on', on);
          p.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        if (cat !== 'all' && gal && gal.hidden) {
          gal.hidden = false;
          if (more) {
            more.setAttribute('aria-expanded', 'true');
            more.firstChild.nodeValue = 'إخفاء الصور الإضافية ';
          }
        }
        wCards.forEach(function (c) {
          var match = cat === 'all' || c.getAttribute('data-wcat') === cat;
          c.hidden = !match;
          c.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* lightbox with next/prev & caption */
  var lb = $('#lbx');
  if (lb && lb.showModal) {
    var im = $('img', lb);
    var cap = $('#lbxCap', lb);
    var items = $$('.galx-it');
    var idx = 0;

    function openAt(i) {
      if (!items.length) return;
      idx = (i + items.length) % items.length;
      var b = items[idx];
      var src = b.querySelector('img');
      if (src) {
        im.src = src.currentSrc || src.src;
        im.alt = src.alt || '';
      }
      if (cap) {
        cap.textContent = b.getAttribute('data-cap') || (src ? src.alt : '');
      }
      if (!lb.open) lb.showModal();
    }

    items.forEach(function (b, i) {
      b.addEventListener('click', function () { openAt(i); });
    });
    var closeBtn = $('.lbx-x', lb);
    if (closeBtn) closeBtn.addEventListener('click', function () { lb.close(); });
    var prevBtn = $('.lbx-prev', lb);
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); openAt(idx - 1); });
    var nextBtn = $('.lbx-next', lb);
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); openAt(idx + 1); });

    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); openAt(idx + 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); openAt(idx - 1); }
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* hero parallax + scroll progress (transform only, rAF-throttled) */
  var bg = $('.hero-art .hero-bg, .hx-bg'), prog = $('#sprog'), tick = false;
  if (!prog) {
    prog = document.createElement('i');
    prog.className = 'sprog';
    document.body.appendChild(prog);
  }
  function frame() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (bg && !REDUCE && y < innerHeight * 1.2) bg.style.transform = 'translate3d(0,' + (y * 0.24) + 'px,0) scale(' + (1 + y / 6000) + ')';
    tick = false;
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();

  /* ─── 13. Auto-Scrolling & Touch-Draggable Rails (Partners Ticker, Crew, Works) ─── */
  (function autoRails() {
    var rails = $$('[data-auto-rail]');
    if (!rails.length) return;

    /* Prev / Next buttons for rails */
    $$('.rail-btn[data-rail-target]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-rail-target');
        var dir = btn.getAttribute('data-dir');
        var rail = document.getElementById(targetId);
        if (!rail) return;
        var card = rail.firstElementChild;
        var step = card ? (card.getBoundingClientRect().width + 16) : 240;
        /* In RTL, scrolling left means negative scrollLeft in modern browsers */
        var delta = dir === 'next' ? -step : step;
        rail.scrollBy({ left: delta, behavior: REDUCE ? 'auto' : 'smooth' });
        rail.setAttribute('data-user-pause', String(Date.now() + 5000));
      });
    });

    rails.forEach(function (rail) {
      var mode = rail.getAttribute('data-auto-rail');
      var paused = false;
      var dragging = false;
      var startX = 0;
      var startScroll = 0;
      var dir = -1; /* RTL: -1 scrolls toward left (end of Arabic list), +1 scrolls back right */

      var pauseTmp = function (ms) {
        rail.setAttribute('data-user-pause', String(Date.now() + (ms || 4000)));
      };

      rail.addEventListener('mouseenter', function () { paused = true; });
      rail.addEventListener('mouseleave', function () { paused = false; dragging = false; });
      rail.addEventListener('touchstart', function () { paused = true; pauseTmp(5000); }, { passive: true });
      rail.addEventListener('touchend', function () { paused = false; pauseTmp(4000); }, { passive: true });

      /* Mouse drag-to-scroll support for desktop */
      rail.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        dragging = true;
        paused = true;
        startX = e.pageX;
        startScroll = rail.scrollLeft;
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        var dx = e.pageX - startX;
        rail.scrollLeft = startScroll - dx;
      }, { passive: true });
      window.addEventListener('mouseup', function () {
        if (!dragging) return;
        dragging = false;
        paused = false;
        pauseTmp(3500);
      });

      if (REDUCE) return;

      if (mode === 'continuous') {
        /* Smooth continuous ticker for #partners */
        var speed = 0.65;
        var stepCont = function () {
          var until = Number(rail.getAttribute('data-user-pause') || 0);
          if (!paused && !dragging && Date.now() > until) {
            rail.scrollLeft -= speed;
            var maxScroll = rail.scrollWidth - rail.clientWidth;
            if (Math.abs(rail.scrollLeft) >= maxScroll * 0.5) {
              rail.scrollLeft = 0;
            }
          }
          requestAnimationFrame(stepCont);
        };
        requestAnimationFrame(stepCont);
      } else {
        /* Step-based ping-pong left & right carousel for #crew and #works */
        var intervalMs = mode === 'pingpong' ? 2800 : 3400;
        setInterval(function () {
          var until = Number(rail.getAttribute('data-user-pause') || 0);
          if (paused || dragging || Date.now() < until) return;
          var maxScroll = rail.scrollWidth - rail.clientWidth;
          if (maxScroll <= 10) return;
          var card = rail.firstElementChild;
          var step = card ? (card.getBoundingClientRect().width + 14) : 220;
          var cur = Math.abs(rail.scrollLeft);
          if (cur + step >= maxScroll - 8) {
            dir = 1; /* reverse direction to right */
          } else if (cur <= 8) {
            dir = -1; /* forward direction to left */
          }
          rail.scrollBy({ left: dir * step, behavior: 'smooth' });
        }, intervalMs);
      }
    });
  })();

  /* Google Ads / GA4 conversion tracking hooks on Call & WhatsApp clicks */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-track]') : null;
    if (!a) return;
    var kind = a.getAttribute('data-track');
    var loc = a.getAttribute('data-location') || 'page';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'lead_' + kind,
      lead_type: kind,
      lead_location: loc,
      page_path: location.pathname
    });
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'engagement',
        event_label: kind + ':' + loc,
        value: 1
      });
    }
  }, { passive: true });
})();
