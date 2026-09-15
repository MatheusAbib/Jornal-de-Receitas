let currentDeleteId = null;

function showNotification(message, type) {
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

function openDeleteModal(button) {
  currentDeleteId = button.getAttribute('data-id');
  document.getElementById('deleteReceitaTitulo').textContent = button.getAttribute('data-titulo');
  document.getElementById('deleteModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  currentDeleteId = null;
}

function confirmDelete() {
  if (!currentDeleteId) return;

  const form = document.createElement('form');
  form.method = 'post';
  form.action = `/receitas-aprovadas/excluir/${currentDeleteId}`;
  document.body.appendChild(form);
  form.submit();
}

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const ok = params.get('ok');

  if (ok === 'excluida') {
    showNotification('Receita excluída com sucesso!', 'success');
    const url = new URL(window.location.href);
    url.searchParams.delete('ok');
    window.history.replaceState({}, '', url);
  } else if (ok === 'editada') {
    showNotification('Receita atualizada com sucesso!', 'success');
    const url = new URL(window.location.href);
    url.searchParams.delete('ok');
    window.history.replaceState({}, '', url);
  }

  const searchForm = document.getElementById('aprovadasSearchForm');
  const searchInput = document.getElementById('aprovadasSearch');
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
      closeDeleteModal();
    }
  });
});