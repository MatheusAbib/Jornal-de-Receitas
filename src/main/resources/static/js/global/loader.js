(function () {

    'use strict';

    const LOADER_ID = 'page-loader';
    const LOADER_SESSION_KEY = 'page-loader-shown';
    const LOADER_FORCE_KEY = 'page-loader-force';
    const MIN_VISIBLE_MS = 250;
    const MAX_WAIT_MS = 250;

    const loader = document.getElementById(LOADER_ID);

    if (!loader) return;

    const forceLoader = sessionStorage.getItem(LOADER_FORCE_KEY) === 'true';

    if (!forceLoader && sessionStorage.getItem(LOADER_SESSION_KEY) === 'true') {
        loader.remove();
        return;
    }

    sessionStorage.setItem(LOADER_SESSION_KEY, 'true');
    sessionStorage.removeItem(LOADER_FORCE_KEY);

    const startTime = performance.now();
    let hidden = false;

    function hideLoader() {

        if (hidden) return;

        hidden = true;

        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

        setTimeout(() => {

            loader.classList.add('is-hidden');

            loader.addEventListener('transitionend', () => loader.remove(), {
                once: true
            });

            setTimeout(() => loader.remove(), 600);

        }, remaining);
    }

    if (document.readyState === 'complete') {
        hideLoader();
        return;
    }

    window.addEventListener('load', hideLoader);

    setTimeout(hideLoader, MAX_WAIT_MS);

    window.addEventListener('pageshow', (e) => {

        if (e.persisted) {
            hideLoader();
        }

    });

})();