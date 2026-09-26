/* Bottone chiaro/scuro condiviso da tutte le pagine.
   Senza scelta salvata la pagina segue il tema di sistema; la scelta
   del visitatore imposta data-theme su <html> e resta tra le pagine. */
(function () {
  var KEY = 'i2e-theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(t) { try { localStorage.setItem(KEY, t); } catch (e) {} }
  function current() { return root.getAttribute('data-theme') || (mq && mq.matches ? 'dark' : 'light'); }

  var saved = load();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  var MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21 14.5A8.5 8.5 0 0 1 9.5 3a.6.6 0 0 0-.8-.7A9.7 9.7 0 1 0 21.7 15.3a.6.6 0 0 0-.7-.8Z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></g></svg>';

  var css = '.theme-bar{display:flex;justify-content:flex-end;padding:12px 16px 0}' +
    '.theme-toggle{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;padding:0;border-radius:50%;cursor:pointer;' +
    'background:var(--surface,#fff);color:var(--ink,#122027);border:1px solid var(--line,#d8dfde);box-shadow:0 1px 3px rgba(0,0,0,.08);transition:border-color .15s}' +
    '.theme-toggle:hover{border-color:var(--accent,#0e6e6a)}' +
    '.theme-toggle:focus-visible{outline:2px solid var(--accent,#0e6e6a);outline-offset:2px}';

  var btn;

  /* Il logo I2E usa <picture>: allinea la sua versione al tema scelto. */
  function syncLogos() {
    var dark = current() === 'dark';
    var sources = document.querySelectorAll('.brand picture source');
    for (var i = 0; i < sources.length; i++) sources[i].media = dark ? 'all' : 'not all';
  }

  function syncButton() {
    if (!btn) return;
    var dark = current() === 'dark';
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute('aria-label', dark ? 'Passa al tema chiaro' : 'Passa al tema scuro');
    btn.title = btn.getAttribute('aria-label');
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      syncLogos();
      syncButton();
    });
    var bar = document.createElement('div');
    bar.className = 'theme-bar';
    bar.appendChild(btn);
    document.body.insertBefore(bar, document.body.firstChild);
    syncLogos();
    syncButton();
  }

  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function () { if (!root.getAttribute('data-theme')) { syncLogos(); syncButton(); } });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
