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
  verificarUsuarioAutenticado();

  // ===================== CONFIGURAR ÍCONE DO USUÁRIO =====================
  configurarIconeUsuario();

  // ===================== CONFIGURAR MODAL DE LOGOUT =====================
  const closeLogoutBtn = document.querySelector('.close-logout-modal');
  if (closeLogoutBtn) {
    closeLogoutBtn.addEventListener('click', closeLogoutModal);
  }
  
  const cancelLogoutBtn = document.querySelector('.logout-modal .cancel');
  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', closeLogoutModal);
  }
  
  const logoutBtn = document.querySelector('.logout-modal .logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/logout';
      document.body.appendChild(form);
      form.submit();
    });
  }
  
  const logoutModal = document.getElementById('logoutModal');
  if (logoutModal) {
    logoutModal.addEventListener('click', function(e) {
      if (e.target === logoutModal) {
        closeLogoutModal();
      }
    });
  }

  // ===================== DATA ATUAL =====================
  const dateElement = document.getElementById('newspaperDate');
  const today = new Date();
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const dia = today.getDate();
  const mes = meses[today.getMonth()];
  const ano = today.getFullYear();
  dateElement.textContent = `${dia} de ${mes} de ${ano}`;

  // ===================== FILTROS DE RECEITAS =====================
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

  document.getElementById('filterForm').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      filtrarReceitas();
    }
  });

  document.getElementById('aplicarFiltros').addEventListener('click', filtrarReceitas);

  document.getElementById('limparFiltros').addEventListener('click', () => {
    document.getElementById('filterForm').reset();
    const cards = document.querySelectorAll('#all-recipes .card');
    cards.forEach(card => card.style.display = 'block');
  });
});

// ===================== FUNÇÕES GLOBAIS =====================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
}

function verificarUsuarioAutenticado() {
  const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
  const estaLogado = nomeUsuarioElement && nomeUsuarioElement.textContent.trim();
  
  if (estaLogado) {
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
      userIcon.style.cursor = 'pointer';
      userIcon.title = 'Ver meu perfil';
    }
  }
}

// ===================== CONFIGURAR ÍCONE DO USUÁRIO =====================
// ===================== CONFIGURAR ÍCONE DO USUÁRIO =====================
function configurarIconeUsuario() {
    console.log('=== INICIANDO CONFIGURAÇÃO DO ÍCONE ===');
    
    const userIcon = document.getElementById('userIcon');
    console.log('Elemento userIcon encontrado:', userIcon);
    
    if (userIcon) {
        console.log('Ícone existe no DOM');
        userIcon.style.display = 'inline-block';
        userIcon.style.cursor = 'pointer';
        userIcon.style.border = '2px solid red'; // Para visualizar
        
        // Adicionar evento de clique DIRETAMENTE
        userIcon.addEventListener('click', function(e) {
            console.log('=== CLIQUE DETECTADO ===');
            console.log('Elemento clicado:', e.target);
            console.log('Evento funcionou!');
            
            // Teste simples - mostrar alerta
            alert('Ícone clicado! Funciona!');
            
            // Tentar abrir modal
            abrirModalUsuarioComDadosReais();
        });
        
        console.log('Evento de clique adicionado ao ícone');
    } else {
        console.log('=== ERRO: Ícone do usuário NÃO encontrado ===');
        console.log('Procurando por qualquer elemento com classe user-icon:');
        const userIcons = document.querySelectorAll('.user-icon');
        console.log('Elementos com classe user-icon:', userIcons);
    }
}

// ===================== MODAL DO USUÁRIO COM DADOS REAIS =====================
async function abrirModalUsuarioComDadosReais() {
  try {
    console.log('Buscando dados do usuário...');
    const response = await fetch('/perfil/usuario-logado');
    const result = await response.json();
    
    if (response.ok && result.usuario) {
      console.log('Dados do usuário encontrados:', result.usuario);
      abrirModalUsuario(result.usuario);
    } else {
      console.log('Usuário não logado ou erro:', result.message);
      // Se não estiver logado, abre modal básico
      abrirModalUsuarioSimples();
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    abrirModalUsuarioSimples();
  }
}

// ===================== MODAL DO USUÁRIO SIMPLIFICADO =====================
function abrirModalUsuarioSimples() {
  const modal = document.getElementById('userModal');
  
  const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
  const nomeUsuario = nomeUsuarioElement ? nomeUsuarioElement.textContent.trim() : '';
  
  document.getElementById('editNome').value = nomeUsuario || '';
  document.getElementById('editEmail').value = '';
  document.getElementById('editCpf').value = '';
  document.getElementById('editTelefone').value = '';
  document.getElementById('editGenero').value = '';
  document.getElementById('editDataCadastro').value = '';
  document.getElementById('editSenha').value = '';
  document.getElementById('confirmarSenha').value = '';
  
  const messageEl = document.getElementById('userEditMessage');
  if (nomeUsuario) {
    messageEl.innerHTML = '<i class="fas fa-info-circle"></i> Faça login para editar seu perfil completo.';
    messageEl.className = 'message info';
  } else {
    messageEl.innerHTML = '<i class="fas fa-info-circle"></i> Faça login para acessar todas as funcionalidades.';
    messageEl.className = 'message info';
  }
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// ===================== MODAL DE LOGOUT =====================
function openLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ===================== MODAL DO USUÁRIO =====================
function abrirModalUsuario(usuario) {
  const modal = document.getElementById('userModal');
  
  document.getElementById('editNome').value = usuario.nome || '';
  document.getElementById('editEmail').value = usuario.email || '';
  document.getElementById('editCpf').value = usuario.cpf || '';
  document.getElementById('editTelefone').value = usuario.telefone || '';
  document.getElementById('editGenero').value = (usuario.genero || '').toUpperCase().trim();
  document.getElementById('editDataCadastro').value = usuario.dataCadastro || '';
  document.getElementById('editSenha').value = '';
  document.getElementById('confirmarSenha').value = '';
  
  const messageEl = document.getElementById('userEditMessage');
  if (!usuario.email) {
    messageEl.innerHTML = '<i class="fas fa-info-circle"></i> Para editar seu perfil completo, faça login primeiro.';
    messageEl.className = 'message info';
  } else {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function fecharModalUsuario() {
  document.getElementById('userModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ===================== MODAL DE LOGIN =====================
function openLoginModal() {
  const loginModal = document.getElementById('loginModal');
  loginModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// ===================== FORMULÁRIO DE EDIÇÃO DO USUÁRIO =====================
document.getElementById('userEditForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const formData = new FormData(this);
  const dadosAtualizados = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    telefone: formData.get('telefone'),
    genero: formData.get('genero'),
    senha: formData.get('senha'),
    confirmarSenha: formData.get('confirmarSenha')
  };
  
  if (dadosAtualizados.senha && dadosAtualizados.senha !== dadosAtualizados.confirmarSenha) {
    showMessage('As senhas não coincidem', 'error');
    return;
  }
  
  if (!dadosAtualizados.senha) {
    delete dadosAtualizados.senha;
    delete dadosAtualizados.confirmarSenha;
  }
  
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch('/perfil/editar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showMessage(result.message || 'Perfil atualizado com sucesso!', 'success');
      setTimeout(fecharModalUsuario, 1500);
    } else {
      showMessage(result.message || 'Erro ao atualizar perfil', 'error');
    }
  } catch (error) {
    console.error('Erro:', error);
    showMessage('Erro de conexão ao atualizar perfil', 'error');
  } finally {
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
});

function showMessage(message, type) {
  const messageEl = document.getElementById('userEditMessage');
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  
  if (type === 'success') {
    messageEl.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  } else {
    messageEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  }
}

// ===================== EVENT LISTENERS PARA FECHAR MODAIS =====================
document.querySelector('.close-user-modal').addEventListener('click', fecharModalUsuario);
document.getElementById('userModal').addEventListener('click', function(event) {
  if (event.target === this) {
    fecharModalUsuario();
  }
});