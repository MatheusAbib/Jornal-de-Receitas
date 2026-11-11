import { useEffect } from 'react';

const IGNORAR_CLASSES = [
  'modal-close',
  'close-login-modal',
  'close-cadastro-modal',
  'close-logout-modal',
  'close-user-modal',
  'close-edit-user-modal',
  'notificacoes-modal-close',
  'admin-modal-close',
  'carrossel-modal-close',
  'detalhes-modal-close',
  'user-modal-close',
  'login-modal-close',
  'cadastro-modal-close',
  'logout-modal-close',
  'header-nav-close',
  'admin-sidebar-close',
  'menu-icon',
  'admin-sidebar-toggle',
  'header-nav-overlay',
  'admin-sidebar-overlay',
  'carousel-control',
  'carousel-indicator',
  'tab-button',
  'minhas-tab',
  'admin-recipe-tab',
  'filter-icon',
  'user-password-toggle',
  'cadastro-password-toggle',
  'login-password-toggle',
  'input-toggle-senha',
  'switch',
  'slider',
  'card-favorite-btn',
  'detalhe-favorite-btn',
  'carrossel-action-btn',
  'carrossel-btn-novo',
  'nova-add-btn',
  'nova-remove-btn',
  'nova-tempo-toggle',
  'action-btn',
  'admin-btn',
  'modal-btn',
  'btn',
  'p-toast-icon-close',
  'p-toast-icon',
  'p-link',
  'notificacao-marcar-lida',
  'notificacoes-marcar-todas',
  'notificacoes-excluir-todas'
];

const IGNORAR_TIPOS = ['file', 'checkbox', 'radio'];

function deveIgnorar(elemento) {
  if (!elemento) return true;
  if (elemento.dataset.semSpinner === 'true') return true;
  if (elemento.disabled) return true;

  for (const classe of IGNORAR_CLASSES) {
    if (elemento.classList.contains(classe)) return true;
    if (elemento.closest(`.${classe}`)) return true;
  }

  if (elemento.tagName === 'INPUT') {
    const tipo = (elemento.getAttribute('type') || '').toLowerCase();

    if (IGNORAR_TIPOS.includes(tipo)) return true;
  }

  return false;
}

function aplicarSpinner(elemento) {
  if (elemento.dataset.spinnerAplicado === 'true') return;

  elemento.dataset.spinnerAplicado = 'true';
  elemento.dataset.spinnerTime = String(Date.now());

  const icon = elemento.querySelector('i');

  if (icon) {
    icon.dataset.originalClass = icon.className;
    icon.className = 'pi pi-spin pi-spinner';
  } else {
    elemento.dataset.spinnerOriginalPosition = elemento.style.position;
    elemento.dataset.spinnerOriginalColor = elemento.style.color;

    const estilo = window.getComputedStyle(elemento);

    if (estilo.position === 'static') {
      elemento.style.position = 'relative';
    }

    elemento.style.color = 'transparent';

    elemento.dataset.spinnerSemIcone = 'true';
  }

  elemento.style.pointerEvents = 'none';
  elemento.style.opacity = '0.7';

  console.log('[loader] APLICADO em:', elemento.className);
}

function restaurarSpinner(elemento) {
  if (elemento.dataset.spinnerAplicado !== 'true') return;

  const icon = elemento.querySelector('i');

  if (icon && icon.dataset.originalClass) {
    icon.className = icon.dataset.originalClass;
    delete icon.dataset.originalClass;
  }

  if (elemento.dataset.spinnerSemIcone === 'true') {
    elemento.style.position =
      elemento.dataset.spinnerOriginalPosition || '';

    elemento.style.color =
      elemento.dataset.spinnerOriginalColor || '';

    delete elemento.dataset.spinnerOriginalPosition;
    delete elemento.dataset.spinnerOriginalColor;
    delete elemento.dataset.spinnerSemIcone;
  }

  elemento.style.pointerEvents = '';
  elemento.style.opacity = '';

  delete elemento.dataset.spinnerAplicado;
  delete elemento.dataset.spinnerTime;

  console.log('[loader] RESTAURADO em:', elemento.className);
}

function restaurarTodos() {
  document
    .querySelectorAll('[data-spinner-aplicado="true"]')
    .forEach(restaurarSpinner);
}

function useGlobalButtonLoader() {
  useEffect(() => {
    function handleClick(event) {
      if (!(event.target instanceof Element)) return;

      const alvo = event.target.closest(
        'button, a[href], [role="button"], .header-user-profile, .admin-sidebar-btn, .header-logout-btn, .header-notification-btn'
      );

      if (!alvo) return;

      if (deveIgnorar(alvo)) {
        console.log('[loader] IGNORADO:', alvo.className);
        return;
      }

      if (alvo.dataset.spinnerAplicado === 'true') return;

      if (alvo.tagName === 'A') {
        const href = alvo.getAttribute('href');

        if (
          !href ||
          href === '#' ||
          href.startsWith('javascript:') ||
          href.startsWith('#')
        ) {
          return;
        }
      }

      aplicarSpinner(alvo);
    }

    const interval = setInterval(() => {
      const botoes = document.querySelectorAll(
        '[data-spinner-aplicado="true"]'
      );

      if (botoes.length === 0) return;

      const agora = Date.now();

      botoes.forEach(botao => {
        const tempoAplicado = Number(
          botao.dataset.spinnerTime || 0
        );

        if (tempoAplicado && agora - tempoAplicado > 3000) {
          restaurarSpinner(botao);
        }
      });
    }, 500);

    document.addEventListener('click', handleClick, true);
    window.addEventListener('pageshow', restaurarTodos);

    return () => {
      clearInterval(interval);

      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('pageshow', restaurarTodos);

      restaurarTodos();
    };
  }, []);
}

export default useGlobalButtonLoader;