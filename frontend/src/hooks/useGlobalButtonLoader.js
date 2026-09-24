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
  'carousel-control',
  'carousel-indicator',
  'tab-button',
  'minhas-tab',
  'admin-recipe-tab',
  'filter-icon',
  'user-password-toggle',
  'cadastro-password-toggle',
  'login-password-toggle',
  'switch',
  'slider',
  'card-favorite-btn',
  'detalhe-favorite-btn'
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
  elemento.dataset.spinnerTime = Date.now();

  const icon = elemento.querySelector('i');

  if (icon) {
    icon.dataset.originalClass = icon.className;
    icon.className = 'pi pi-spin pi-spinner';
  } else {
    elemento.dataset.originalContent = elemento.innerHTML;
    elemento.innerHTML = '<i class="pi pi-spin pi-spinner"></i>';
  }

  elemento.style.pointerEvents = 'none';
  elemento.style.opacity = '0.7';

  console.log('[loader] aplicado em:', elemento.tagName, elemento.className);
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
  delete elemento.dataset.spinnerTime;

  console.log('[loader] restaurado em:', elemento.tagName);
}

function restaurarTodos() {
  document.querySelectorAll('[data-spinner-aplicado="true"]').forEach(restaurarSpinner);
}

function useGlobalButtonLoader() {
  useEffect(() => {
    console.log('[loader] hook ativado');

    function handleClick(event) {
      const alvo = event.target.closest(
        'button, a[href], [role="button"], .header-user-profile, .admin-sidebar-btn, .header-logout-btn, .header-notification-btn'
      );

      if (!alvo) return;

      if (deveIgnorar(alvo)) {
        console.log('[loader] ignorado:', alvo.tagName, alvo.className);
        return;
      }

      if (alvo.dataset.spinnerAplicado === 'true') return;

      if (alvo.tagName === 'A') {
        const href = alvo.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('#')) {
          return;
        }
      }

      aplicarSpinner(alvo);
    }

    const interval = setInterval(() => {
      const botoes = document.querySelectorAll('[data-spinner-aplicado="true"]');
      if (botoes.length === 0) return;

      const agora = Date.now();

      botoes.forEach(botao => {
        const tempoAplicado = Number(botao.dataset.spinnerTime || 0);
        if (tempoAplicado && agora - tempoAplicado > 3000) {
          restaurarSpinner(botao);
        }
      });
    }, 500);

    document.addEventListener('click', handleClick, true);
    window.addEventListener('pageshow', restaurarTodos);

    return () => {
      console.log('[loader] hook desativado');
      clearInterval(interval);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('pageshow', restaurarTodos);
    };
  }, []);
}

export default useGlobalButtonLoader;
