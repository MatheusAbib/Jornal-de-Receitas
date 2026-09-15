function confirmAction(action, button) {
  event.preventDefault();
  const form = button.closest('form');
  const formAction = form.getAttribute('action');

  if (action === 'approve') {
    document.getElementById('approveForm').setAttribute('action', formAction);
    openModal('approveModal');
} else if (action === 'reject') {
  document.getElementById('rejectForm').setAttribute('action', formAction);
  const textarea = document.getElementById('rejectMotivo');
  if (textarea) textarea.value = '';
  openModal('rejectModal');
}
  return false;
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = 'auto';

  if (modalId === 'rejectModal') {
    const textarea = document.getElementById('rejectMotivo');
    if (textarea) textarea.value = '';
  }
}

function showUserNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `user-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    ${message}
  `;

  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

document.querySelectorAll('.admin-confirm-modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal.id);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const ok = params.get('ok');

  if (ok === 'aprovada') {
    showUserNotification('Receita aprovada com sucesso!', 'success');
  } else if (ok === 'rejeitada') {
    showUserNotification('Receita rejeitada com sucesso!', 'success');
  } else if (ok === 'editada') {
    showUserNotification('Receita atualizada com sucesso!', 'success');
  }

  if (ok) {
    const url = new URL(window.location.href);
    url.searchParams.delete('ok');
    window.history.replaceState({}, '', url);
  }

  const searchForm = document.getElementById('pendentesSearchForm');
  const searchInput = document.getElementById('pendentesSearch');
  const searchWrapper = document.querySelector('.admin-search-box');

  if (!searchForm || !searchInput || !searchWrapper) return;

  let searchTimeout = null;
  let loader = document.getElementById('searchLoader');

  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'searchLoader';
    loader.style.cssText = `
      display: none;
      text-align: center;
      padding: 5px 10px;
      color: #d4af37;
      font-size: 0.85rem;
      background: white;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      position: absolute;
      right: 0;
      top: calc(100% + 5px);
      min-width: 150px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      z-index: 10;
    `;
    loader.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-top: -6px;"></i> Buscando...';
    searchWrapper.style.position = 'relative';
    searchWrapper.appendChild(loader);
  }

  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);

    if (searchInput.value.trim().length > 0) {
      loader.style.display = 'flex';
    } else {
      loader.style.display = 'none';
    }

    searchTimeout = setTimeout(() => {
      searchForm.submit();
    }, 500);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(searchTimeout);
      loader.style.display = 'flex';
      searchForm.submit();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal('approveModal');
      closeModal('rejectModal');
    }
  });
});