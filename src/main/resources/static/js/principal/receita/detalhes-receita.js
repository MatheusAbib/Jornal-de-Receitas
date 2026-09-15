document.addEventListener('DOMContentLoaded', function() {

  async function checkFavoriteStatus() {
    const favoriteBtn = document.querySelector('.detalhe-favorite-btn');
    if (!favoriteBtn) return;

    const recipeId = favoriteBtn.dataset.recipeId;
    if (!recipeId) return;

    try {
      const response = await fetch('/api/favoritos');
      if (response.ok) {
        const data = await response.json();
        const favorites = data.favoritos || [];
        const isFav = favorites.includes(parseInt(recipeId));
        
        const icon = favoriteBtn.querySelector('i');
        if (isFav) {
          favoriteBtn.classList.add('active');
          if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
          }
        } else {
          favoriteBtn.classList.remove('active');
          if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  }

  checkFavoriteStatus();

  document.addEventListener('pollingUpdated', checkFavoriteStatus);



  document.addEventListener('click', async function(e) {

    const favoriteBtn = e.target.closest('.detalhe-favorite-btn');
    if (favoriteBtn) {
      e.preventDefault();
      e.stopPropagation();

      const recipeId = favoriteBtn.dataset.recipeId;
      const icon = favoriteBtn.querySelector('i');
      const isActive = favoriteBtn.classList.contains('active');

      try {
        const response = await fetch(`/api/favoritos/${recipeId}`, {
          method: isActive ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
          showNotification('Faça login para favoritar receitas!', false);
          return;
        }

        if (response.ok) {
          favoriteBtn.classList.toggle('active');
          if (icon) {
            if (favoriteBtn.classList.contains('active')) {
              icon.classList.remove('far');
              icon.classList.add('fas');
              showNotification('Receita adicionada aos favoritos!', true);
            } else {
              icon.classList.remove('fas');
              icon.classList.add('far');
              showNotification('Receita removida dos favoritos!', true);
            }
          }

          if (typeof updateFavoriteCount === 'function') {
            updateFavoriteCount();
          }
        }
      } catch (error) {
        console.error('Erro ao favoritar:', error);
      }
      return;
    }

    const sectionHeader = e.target.closest('.detalhe-section.ingredientes .detalhe-section-header');
    if (sectionHeader) {
      const checkboxes = document.querySelectorAll('.detalhe-ingrediente-checkbox');
      if (checkboxes.length === 0) return;

      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      checkboxes.forEach(cb => {
        cb.checked = !allChecked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      });
      return;
    }
  });



  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('detalhe-ingrediente-checkbox')) {
      const label = e.target.nextElementSibling;
      if (label) {
        if (e.target.checked) {
          label.style.color = 'var(--light-text)';
          label.style.textDecoration = 'line-through';
        } else {
          label.style.color = '';
          label.style.textDecoration = '';
        }
      }
    }
  });

});


function showNotification(message, isSuccess = false) {
  const notification = document.createElement('div');
  notification.className = `user-notification ${isSuccess ? 'success' : 'error'}`;
  notification.innerHTML = `
    <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    ${message}
  `;

  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}