(function () {
    'use strict';

    const IGNORAR = [
        'sidebar-close',
        'header-nav-close',
        'admin-sidebar-close',
        'close-cadastro-modal',
        'close-login-modal',
        'close-logout-modal',
        'close-user-modal',
        'close-edit-user-modal',
        'close-notificacoes-modal',
        'modal-loader',

    ];

    function deveIgnorar(elemento) {
        for (const classe of IGNORAR) {
            if (elemento.classList.contains(classe)) return true;
        }
        if (elemento.dataset.semSpinner === 'true') return true;
        if (elemento.dataset.spinner === 'true') return false;
        if (elemento.disabled) return true;
        return false;
    }

    function aplicarSpinner(elemento) {
        if (elemento.dataset.spinnerAplicado === 'true') return;
        elemento.dataset.spinnerAplicado = 'true';

        const icon = elemento.querySelector('i');

        if (icon) {
            icon.dataset.originalClass = icon.className;
            icon.className = 'fas fa-spinner fa-spin';
        } else {
            elemento.dataset.originalContent = elemento.innerHTML;
            elemento.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }

        elemento.style.pointerEvents = 'none';
        elemento.style.opacity = '0.7';
    }

    function restaurarSpinner(elemento) {
        if (elemento.dataset.spinnerAplicado !== 'true') return;

        const icon = elemento.querySelector('i');

        if (icon && icon.dataset.originalClass) {
            icon.className = icon.dataset.originalClass;
        } else if (elemento.dataset.originalContent) {
            elemento.innerHTML = elemento.dataset.originalContent;
        }

        elemento.style.pointerEvents = '';
        elemento.style.opacity = '';

        delete elemento.dataset.spinnerAplicado;
    }

    document.addEventListener('click', function (event) {
        const alvo = event.target.closest(
            'button, a, [role="button"], .header-user-profile, .header-logout-btn, .header-notification-btn, .header-logout-sidebar, .header-notification-nav, .header-notification-sidebar'
        );
        if (!alvo) return;
        if (deveIgnorar(alvo)) return;
        if (alvo.dataset.spinnerAplicado === 'true') return;

        if (alvo.tagName === 'A') {
            const href = alvo.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('#')) {
                return;
            }
            aplicarSpinner(alvo);
            return;
        }

        if (alvo.tagName === 'BUTTON' || alvo.tagName === 'INPUT') {
            const tipo = (alvo.getAttribute('type') || '').toLowerCase();

            if (alvo.dataset.spinner === 'true') {
                aplicarSpinner(alvo);
                return;
            }

            if (tipo === 'submit') {
                return;
            }

            if (tipo === 'button' || tipo === '' || tipo === 'reset') {
                return;
            }
        }
        aplicarSpinner(alvo);
    }, true);

    document.addEventListener('submit', function (event) {
        const form = event.target;

        if (!form.reportValidity()) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn && !deveIgnorar(submitBtn)) aplicarSpinner(submitBtn);
    }, true);

    window.addEventListener('pageshow', function () {
        document.querySelectorAll('[data-spinner-aplicado="true"]').forEach(restaurarSpinner);
    });
})();