/* ORİMAK sayfa turu (driver.js 1.14.0 üzerine). Her sayfada window.ORIMAK_TOUR tanımlanır. */
(function () {
  var cfg = window.ORIMAK_TOUR || {};
  var KEY = 'orimakTour:' + location.pathname;

  function lang() {
    var sel = document.getElementById('langSelect');
    var v = (sel && sel.value) || document.documentElement.lang || 'tr';
    return v.indexOf('en') === 0 ? 'en' : 'tr';
  }

  function labels(l) {
    return l === 'en'
      ? { next: 'Next', prev: 'Back', done: 'Finish' }
      : { next: 'İleri', prev: 'Geri', done: 'Bitir' };
  }

  function isVisible(el) {
    return !!(el.offsetParent || getComputedStyle(el).position === 'fixed');
  }

  function buildSteps(l) {
    var out = [];
    (cfg.steps || []).forEach(function (s) {
      var step = {
        popover: {
          title: s.title ? (s.title[l] || s.title.tr) : '',
          description: s[l] || s.tr || '',
          side: s.side || 'bottom',
          align: 'start'
        }
      };
      if (s.sel) {
        var el = document.querySelector(s.sel);
        if (!el || !isVisible(el)) return;
        step.element = s.sel;
      }
      out.push(step);
    });
    return out;
  }

  function start() {
    var l = lang();
    var b = labels(l);
    var d = window.driver.js.driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: b.next,
      prevBtnText: b.prev,
      doneBtnText: b.done,
      steps: buildSteps(l),
      onDestroyed: function () {
        try { localStorage.setItem(KEY, '1'); } catch (e) {}
      }
    });
    d.drive();
  }

  function addButton() {
    var btn = document.createElement('button');
    btn.id = 'orimakTourBtn';
    btn.textContent = '🎓';
    btn.title = 'Sayfa turunu göster / Show page tour';
    btn.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:9999;width:38px;height:38px;border-radius:50%;border:1px solid #444;background:#f08c00;color:#fff;font-size:18px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.4);';
    btn.onclick = start;
    document.body.appendChild(btn);
  }

  function init() {
    if (!window.driver || !cfg.steps) return;
    addButton();
    var seen = false;
    try { seen = !!localStorage.getItem(KEY); } catch (e) {}
    if (!seen) setTimeout(start, 900);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
