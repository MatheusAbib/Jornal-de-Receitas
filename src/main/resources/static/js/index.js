   document.addEventListener('DOMContentLoaded', function() {
  // ===================== CARROSSEL =====================
  const carousel = document.querySelector('.carousel-inner');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  let currentIndex = 0;
  const totalItems = items.length;
  
  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  }
  
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });
  
  let carouselInterval = setInterval(nextSlide, 5000);
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  carouselContainer.addEventListener('mouseleave', () => carouselInterval = setInterval(nextSlide, 5000));

  // ===================== ABAS =====================
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      if (tabId === 'favoritas') loadFavoriteRecipes();
    });
  });

  // ===================== FAVORITOS =====================
  let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];

  function updateFavoriteCount() {
    document.getElementById('favorite-count').textContent = favorites.length;
  }

  function showFavoriteNotification(isFavorite) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: ${isFavorite ? 'var(--favorite-color)' : 'var(--header-color)'};
      color: white; padding: 12px 20px; border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000; display: flex; align-items: center; gap: 10px;
      opacity: 0; transform: translateY(20px); transition: all 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas ${isFavorite ? 'fa-heart' : 'fa-times'}"></i> ${isFavorite ? 'Receita adicionada aos favoritos!' : 'Receita removida dos favoritos!'}`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateY(0)'; }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  function initializeFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.card-favorite');
    favoriteButtons.forEach(button => {
      const recipeId = button.getAttribute('data-recipe-id');
      if (favorites.includes(recipeId)) {
        button.classList.add('active');
        const icon = button.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas');
      }
      button.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
          favorites = favorites.filter(id => id !== recipeId);
          this.classList.remove('active');
          icon.classList.remove('fas');
          icon.classList.add('far');
        } else {
          favorites.push(recipeId);
          this.classList.add('active');
          icon.classList.remove('far');
          icon.classList.add('fas');
        }
        localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
        updateFavoriteCount();
        showFavoriteNotification(this.classList.contains('active'));
      });
    });
  }

  function loadFavoriteRecipes() {
    const favoriteContainer = document.getElementById('favorite-recipes');
    const emptyState = document.getElementById('empty-favorites');
    favoriteContainer.innerHTML = '';
    if (favorites.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';
    const allRecipeCards = document.querySelectorAll('#all-recipes .card');
    allRecipeCards.forEach(card => {
      const recipeId = card.querySelector('.card-favorite').getAttribute('data-recipe-id');
      if (favorites.includes(recipeId)) {
        const clonedCard = card.cloneNode(true);
        const favoriteButton = clonedCard.querySelector('.card-favorite');
        favoriteButton.classList.add('active');
        const icon = favoriteButton.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas');
        favoriteButton.addEventListener('click', function() {
          favorites = favorites.filter(id => id !== recipeId);
          localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
          updateFavoriteCount();
          this.closest('.card').remove();
          if (favorites.length === 0) emptyState.style.display = 'block';
          const mainButton = document.querySelector(`#all-recipes .card-favorite[data-recipe-id="${recipeId}"]`);
          if (mainButton) {
            mainButton.classList.remove('active');
            const mainIcon = mainButton.querySelector('i');
            mainIcon.classList.remove('fas');
            mainIcon.classList.add('far');
          }
          showFavoriteNotification(false);
        });
        favoriteContainer.appendChild(clonedCard);
      }
    });
  }

  initializeFavoriteButtons();
  updateFavoriteCount();

  // ===================== EFEITO DE DIGITAÇÃO =====================
  const titleElement = document.querySelector('.newspaper-title');
  const originalTitle = titleElement.textContent;
  titleElement.textContent = '';
  let charIndex = 0;
  function typeTitle() {
    if (charIndex < originalTitle.length) {
      titleElement.textContent += originalTitle.charAt(charIndex);
      charIndex++;
      setTimeout(typeTitle, 100);
    }
  }
  typeTitle();

  // ===================== LOGIN =====================
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.querySelector('.close');
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  closeModal.addEventListener('click', closeLoginModal);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLoginModal(); });



  function closeLoginModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    loginMessage.textContent = '';
    loginMessage.className = 'message';
    loginForm.reset();
  }

  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const submitBtn = loginForm.querySelector('.login-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const result = await response.json();
      if (response.ok && result.usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(result.usuario));
        sessionStorage.setItem('usuarioLogado', JSON.stringify(result.usuario));
        loginMessage.innerHTML = '<i class="fas fa-check-circle"></i> Login realizado com sucesso! Redirecionando...';
        loginMessage.className = 'message success';
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        loginMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${result.message || 'Erro ao fazer login.'}`;
        loginMessage.className = 'message error';
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
      }
    } catch (error) {
      console.error(error);
      loginMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro de conexão. Tente novamente.';
      loginMessage.className = 'message error';
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  // ===================== VERIFICAR USUÁRIO LOGADO =====================
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado'));
  if (usuarioLogado) {
    atualizarInterfaceUsuarioLogado(usuarioLogado);
    adicionarIconeUsuario(usuarioLogado);
  }
});

// ===================== FUNÇÕES GLOBAIS =====================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
}

function atualizarInterfaceUsuarioLogado(usuario) {
  if (!usuario.nome) return;

  // Atualiza o texto de boas-vindas
  let userNameEl = document.querySelector('.user-name');
  if (!userNameEl) {
    userNameEl = document.createElement('p');
    userNameEl.classList.add('user-name');
    const title = document.querySelector('.newspaper-title');
    title.insertAdjacentElement('afterend', userNameEl);
  }
  userNameEl.innerHTML = `<i class="fas fa-user"></i> Olá, ${usuario.nome}`;

  // Atualiza link de login → logout no sidebar
  const sidebar = document.getElementById('sidebar');
  const loginLink = sidebar.querySelector('a[onclick*="openLoginModal"]');
  if (loginLink) {
    loginLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Fazer Logout';
    loginLink.onclick = function(e) {
      e.preventDefault();
      abrirModalLogout(); // Alterado para abrir o modal
    };
  }

  // Ativa o ícone já existente
  adicionarIconeUsuario(usuario);
}


// ===================== MODAL DE LOGOUT =====================
function abrirModalLogout() {
  document.getElementById('logoutModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function fecharModalLogout() {
  document.getElementById('logoutModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Event listeners para o modal de logout
document.querySelector('.close-logout-modal').addEventListener('click', fecharModalLogout);
document.querySelector('.logout-modal .modal-button.cancel').addEventListener('click', fecharModalLogout);
document.querySelector('.logout-modal .modal-button.logout').addEventListener('click', fazerLogout);

// Fechar modal ao clicar fora dele
document.getElementById('logoutModal').addEventListener('click', function(event) {
  if (event.target === this) {
    fecharModalLogout();
  }
});

// Modificar a função fazerLogout existente
function fazerLogout() {
  fecharModalLogout();
  fetch('/logout', { method: 'POST' })
    .finally(() => {
      localStorage.removeItem('usuarioLogado');
      sessionStorage.removeItem('usuarioLogado');
      window.location.reload();
    });
}

function adicionarIconeUsuario(usuario) {
  const userIcon = document.getElementById('userIcon');
  if (!userIcon) return;

  // Mostra o ícone (caso ele esteja oculto)
  userIcon.style.display = 'inline-block';

  // Adiciona evento para abrir o modal
  userIcon.onclick = () => {
    abrirModalUsuario(usuario);
    document.body.style.overflow = 'hidden'; // Bloqueia scroll ao abrir
  };
}



   function abrirModalUsuario(usuario) {
      const modal = document.getElementById('userModal');
      const userInfo = document.getElementById('user-info');
      
      userInfo.innerHTML = `
        <div class="user-info-grid">
          <div class="user-info-item">
            <strong>Nome</strong>
            <p>${usuario.nome}</p>
          </div>
          <div class="user-info-item">
            <strong>Email</strong>
            <p>${usuario.email}</p>
          </div>
          <div class="user-info-item">
            <strong>CPF</strong>
            <p>${usuario.cpf}</p>
          </div>
          <div class="user-info-item">
            <strong>Telefone</strong>
            <p>${usuario.telefone || '-'}</p>
          </div>
          <div class="user-info-item">
            <strong>Gênero</strong>
            <p>${usuario.genero || '-'}</p>
          </div>
          <div class="user-info-item">
            <strong>Data de Cadastro</strong>
            <p>${usuario.dataCadastro}</p>
          </div>
        </div>
     
      `;
      
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

document.querySelector('.close-user-modal').addEventListener('click', () => {
  document.getElementById('userModal').style.display = 'none';
});


function openLoginModal() {
  const loginModal = document.getElementById('loginModal');
  loginModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

    function fecharModalUsuario() {
      document.getElementById('userModal').style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    document.querySelector('.close-user-modal').addEventListener('click', fecharModalUsuario);


      const dateElement = document.getElementById('newspaperDate');
  const today = new Date();

  // Array com os meses em português
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  const dia = today.getDate();
  const mes = meses[today.getMonth()];
  const ano = today.getFullYear();

  dateElement.textContent = `${dia} de ${mes} de ${ano}`;

function filtrarReceitas() {
  const nomeFiltro = document.getElementById('nome').value.toLowerCase();
  const tempoFiltro = parseInt(document.getElementById('tempo').value);
  const porcoesFiltro = parseInt(document.getElementById('porcoes').value);

  const cards = document.querySelectorAll('#all-recipes .card');

  cards.forEach(card => {
    const titulo = card.querySelector('h2').innerText.toLowerCase();
    const tempo = parseInt(card.querySelector('.card-meta span:first-child span').innerText);
    const porcoes = parseInt(card.querySelector('.card-meta span:last-child span').innerText);

    let mostrar = true;

    if (nomeFiltro && !titulo.includes(nomeFiltro)) mostrar = false;
    if (!isNaN(tempoFiltro) && tempo > tempoFiltro) mostrar = false;
    if (!isNaN(porcoesFiltro) && porcoes != porcoesFiltro) mostrar = false;

    card.style.display = mostrar ? 'block' : 'none';
  });
}

// Evento Enter para filtrar
document.getElementById('filterForm').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    filtrarReceitas();
  }
});

// Botão aplicar filtros
document.getElementById('aplicarFiltros').addEventListener('click', filtrarReceitas);

// Botão limpar filtros
document.getElementById('limparFiltros').addEventListener('click', () => {
  document.getElementById('filterForm').reset(); // reseta campos
  const cards = document.querySelectorAll('#all-recipes .card');
  cards.forEach(card => card.style.display = 'block'); // mostra todos
});
