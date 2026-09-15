(function () {
  'use strict';

  const LOADER_ID = 'page-loader';
  const MIN_VISIBLE_MS = 300;   
  const MAX_WAIT_MS = 8000;     

  const loader = document.getElementById(LOADER_ID);
  if (!loader) return;

  const startTime = performance.now();
  let hidden = false;

  function hideLoader(reason) {
    if (hidden) return;
    hidden = true;

    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    setTimeout(() => {
      loader.classList.add('is-hidden');
      // Remove do DOM depois da transição pra não atrapalhar cliques/scroll
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      // Fallback caso transitionend não dispare (ex: aba em background)
      setTimeout(() => loader.remove(), 600);
    }, remaining);

    if (reason) {
    }
  }

  if (document.readyState === 'complete') {
    hideLoader('already-complete');
    return;
  }

  window.addEventListener('load', () => hideLoader('window-load'));

  setTimeout(() => hideLoader('timeout'), MAX_WAIT_MS);

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) hideLoader('bfcache');
  });
})();