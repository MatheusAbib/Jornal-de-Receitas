// ===================== FUNÇÕES GLOBAIS =====================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('show');
    
    // Prevenir rolagem do body quando sidebar está aberta
    if (sidebar.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
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

function configurarIconeUsuario() {
  const userIcon = document.getElementById('userIcon');
  const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
  const estaLogado = nomeUsuarioElement && nomeUsuarioElement.textContent.trim();
  
  if (userIcon && estaLogado) {
    userIcon.style.display = 'inline-flex';
    userIcon.style.cursor = 'pointer';
    userIcon.title = 'Ver meu perfil';
    userIcon.onclick = function() {
      console.log('Ícone do usuário clicado');
      abrirModalUsuarioSimples(); // Chamar a nova função
    };
  } else if (userIcon) {
    // Se não estiver logado, esconder o ícone
    userIcon.style.display = 'none';
  }
}

async function abrirModalUsuarioSimples() {
  const modal = document.getElementById('userModal');
  
  if (!modal) {
    console.error('Modal do usuário não encontrado');
    return;
  }
  
  console.log('Abrindo modal do usuário...');
  
  // Mostrar loading
  const messageEl = document.getElementById('userEditMessage');
  if (messageEl) {
    messageEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando dados do usuário...';
    messageEl.className = 'message info';
  }
  
  try {
    // Buscar dados do usuário logado via API
    const response = await fetch('/perfil/usuario-logado', {
      credentials: 'include' 
    });    
    if (response.ok) {
      const data = await response.json();
      const usuario = data.usuario;
      
      console.log('Dados do usuário recebidos:', usuario);
      
      // Preencher os campos do formulário
      if (document.getElementById('editNome')) {
        document.getElementById('editNome').value = usuario.nome || '';
      }
      if (document.getElementById('editEmail')) {
        document.getElementById('editEmail').value = usuario.email || '';
      }
      if (document.getElementById('editCpf')) {
        document.getElementById('editCpf').value = usuario.cpf || '';
      }
      
      // TELEFONE: formatar automaticamente
      if (document.getElementById('editTelefone')) {
        let telefoneValue = usuario.telefone || '';
        if (telefoneValue) {
          telefoneValue = formatarTelefone(telefoneValue);
        }
        document.getElementById('editTelefone').value = telefoneValue;
      }
      
      if (document.getElementById('editGenero')) {
        // Configurar o valor do select
        const generoSelect = document.getElementById('editGenero');
        const generoValue = (usuario.genero || '').toUpperCase();
        generoSelect.value = generoValue;
      }
      if (document.getElementById('editDataCadastro')) {
        // Formatar a data
        let dataCadastro = usuario.dataCadastro || '';
        if (dataCadastro) {
          try {
            // Remover timezone se existir
            const dataString = dataCadastro.split('T')[0];
            const [ano, mes, dia] = dataString.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;
            document.getElementById('editDataCadastro').value = dataFormatada;
          } catch (e) {
            document.getElementById('editDataCadastro').value = dataCadastro;
          }
        }
      }
      
      // Limpar campos de senha
      if (document.getElementById('editSenha')) {
        document.getElementById('editSenha').value = '';
      }
      if (document.getElementById('confirmarSenha')) {
        document.getElementById('confirmarSenha').value = '';
      }
      
      // Atualizar mensagem
      if (messageEl) {
        messageEl.innerHTML = '<i class="fas fa-info-circle"></i> Edite suas informações acima. Deixe a senha em branco para mantê-la inalterada.';
        messageEl.className = 'message info';
      }
      
    } else if (response.status === 401) {
      // Usuário não autenticado
      console.log('Usuário não autenticado');
      
      // Preencher apenas com o nome que aparece no header
      const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
      const nomeUsuario = nomeUsuarioElement ? nomeUsuarioElement.textContent.trim() : '';
      
      if (document.getElementById('editNome')) {
        document.getElementById('editNome').value = nomeUsuario || '';
      }
      
      if (messageEl) {
        messageEl.innerHTML = '<i class="fas fa-info-circle"></i> Faça login para acessar todas as funcionalidades.';
        messageEl.className = 'message info';
      }
    } else {
      // Outro erro
      console.error('Erro na resposta:', response.status);
      if (messageEl) {
        messageEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao carregar dados do usuário.';
        messageEl.className = 'message error';
      }
    }
    
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    
    // Fallback em caso de erro
    const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
    const nomeUsuario = nomeUsuarioElement ? nomeUsuarioElement.textContent.trim() : '';
    
    if (document.getElementById('editNome')) {
      document.getElementById('editNome').value = nomeUsuario || '';
    }
    
    if (messageEl) {
      messageEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro de conexão ao carregar dados.';
      messageEl.className = 'message error';
    }
  }
  
  // Mostrar o modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Focar no primeiro campo
  setTimeout(() => {
    const nomeField = document.getElementById('editNome');
    if (nomeField) {
      nomeField.focus();
    }
  }, 300);
}

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
  const modal = document.getElementById('userModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function openLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Limpar mensagens de erro anteriores
    hideLoginError();
    
    // Focar no primeiro campo
    setTimeout(() => {
      const usernameField = document.getElementById('username');
      if (usernameField) {
        usernameField.focus();
      }
    }, 300);
  }
}

function closeLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Limpar formulário
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.reset();
    }
    hideLoginError();
  }
}

function showLoginError(message) {
  const errorDiv = document.getElementById('loginError');
  const errorMessage = document.getElementById('errorMessage');
  
  if (errorDiv && errorMessage) {
    errorMessage.textContent = message;
    errorDiv.style.display = 'flex';
    
    // Adicionar efeito shake no formulário
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.classList.add('shake');
      setTimeout(() => loginForm.classList.remove('shake'), 500);
    }
  }
}

function hideLoginError() {
  const errorDiv = document.getElementById('loginError');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

function showLoginSuccess() {
  const errorDiv = document.getElementById('loginError');
  const submitBtn = document.querySelector('.login-button');
  
  if (errorDiv && submitBtn) {
    // Mudar aparência do botão
    submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #219653)';
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Login realizado!';
    
    // Mostrar mensagem de sucesso
    errorDiv.innerHTML = '<i class="fas fa-check-circle"></i> Redirecionando...';
    errorDiv.style.display = 'flex';
    errorDiv.style.background = 'rgba(46, 204, 113, 0.1)';
    errorDiv.style.borderColor = 'rgba(46, 204, 113, 0.3)';
    errorDiv.style.color = '#27ae60';
  }
}

function showMessage(message, type) {
  const messageEl = document.getElementById('userEditMessage');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    
    if (type === 'success') {
      messageEl.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else {
      messageEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }
  }
}

// ===================== CÓDIGO PRINCIPAL =====================
document.addEventListener('DOMContentLoaded', function() {
  // ===================== SIDEBAR =====================
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }
  
  
  // Fechar sidebar ao clicar fora (quando aberta)
  document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (sidebar && sidebar.classList.contains('show') && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target)) {
      toggleSidebar();
    }
  });
  
  // Fechar sidebar com tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('show')) {
        toggleSidebar();
      }
    }
  });

   const telefoneInput = document.getElementById('editTelefone');
  
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
      aplicarMascaraTelefoneInput(e.target);
    });
    
    // Também para quando o campo perde o foco (caso o usuário cole algo)
    telefoneInput.addEventListener('blur', function(e) {
      aplicarMascaraTelefoneInput(e.target);
    });
  }

  // ===================== CARROSSEL =====================
  const carousel = document.querySelector('.carousel-inner');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  let currentIndex = 0;
  const totalItems = items.length;
  
  function updateCarousel() {
    if (carousel) {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }

  // ===================== MODAL DE EXCLUSÃO =====================
  let currentRecipeToDelete = null;
  let currentDeleteButton = null;

  function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.card-delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const recipeId = this.getAttribute('data-recipe-id');
        const recipeTitle = this.getAttribute('data-recipe-title');
        
        // Armazenar informações para usar no modal
        currentRecipeToDelete = recipeId;
        currentDeleteButton = this;
        
        // Abrir modal de confirmação
        openDeleteModal(recipeTitle);
      });
    });
  }

  function openDeleteModal(recipeTitle) {
    const modal = document.getElementById('deleteModal');
    const recipeNameElement = document.getElementById('recipeNameToDelete');
    
    if (modal && recipeNameElement) {
      // Definir o nome da receita no modal
      recipeNameElement.textContent = `"${recipeTitle}"`;
      
      // Mostrar modal
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Limpar variáveis
      currentRecipeToDelete = null;
      currentDeleteButton = null;
    }
  }

  function setupDeleteModal() {
    const modal = document.getElementById('deleteModal');
    const closeBtn = document.querySelector('.close-delete-modal');
    const cancelBtn = document.querySelector('.delete-modal .cancel');
    const confirmBtn = document.querySelector('.delete-modal .confirm');
    
    // Fechar modal ao clicar no X
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDeleteModal);
    }
    
    // Fechar modal ao clicar no botão Cancelar
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeDeleteModal);
    }
    
    // Confirmar exclusão
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async function() {
        if (currentRecipeToDelete && currentDeleteButton) {
          // Desabilitar botão durante a exclusão
          this.disabled = true;
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';
          
          await deleteRecipe(currentRecipeToDelete, currentDeleteButton);
          closeDeleteModal();
          
          // Reativar botão
          this.disabled = false;
          this.innerHTML = '<i class="fas fa-trash"></i> Excluir';
        }
      });
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeDeleteModal();
        }
      });
    }
  }

  async function deleteRecipe(recipeId, buttonElement) {
    try {
      console.log('Tentando excluir receita ID:', recipeId);
      
      const response = await fetch(`/rejeitar/${recipeId}`, {
        method: 'POST'
      });
      
      console.log('Resposta do servidor:', response.status, response.statusText);
      
      if (response.ok) {
        // Animação de exclusão
        const card = buttonElement.closest('.card');
        if (card) {
          card.style.animation = 'fadeOut 0.3s ease forwards';
          
          setTimeout(() => {
            card.remove();
            showDeleteNotification('Receita excluída com sucesso!', true);
            
            // Atualizar contagem se necessário
            updateCardCount();
          }, 300);
        }
        
        // Remover dos favoritos
        const favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        const updatedFavorites = favorites.filter(id => id !== recipeId);
        localStorage.setItem('recipeFavorites', JSON.stringify(updatedFavorites));
        updateFavoriteCount();
        
        // Recarregar favoritos se a aba estiver aberta
        const favTab = document.getElementById('favoritas');
        if (favTab && favTab.classList.contains('active')) {
          loadFavoriteRecipes();
        }
        
        console.log('Receita excluída com sucesso!');
      } else {
        console.error('Erro ao excluir receita:', response.status);
        showDeleteNotification('Erro ao excluir receita', false);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      showDeleteNotification('Erro de conexão', false);
    }
  }

  function updateCardCount() {
    const cards = document.querySelectorAll('#all-recipes .card');
    console.log(`Restam ${cards.length} receitas`);
  }

  function showDeleteNotification(message, isSuccess) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: ${isSuccess ? '#27ae60' : '#e74c3c'};
      color: white; padding: 12px 20px; border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000; display: flex; align-items: center; gap: 10px;
      opacity: 0; transform: translateY(20px); transition: all 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas ${isSuccess ? 'fa-check' : 'fa-exclamation'}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateY(0)'; }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Adicionar animação CSS para exclusão
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  // Inicializar botões de excluir
  initializeDeleteButtons();
  setupDeleteModal();
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  }
  
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });
  
  let carouselInterval = setInterval(nextSlide, 5000);
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    carouselContainer.addEventListener('mouseleave', () => carouselInterval = setInterval(nextSlide, 5000));
  }

  // ===================== ABAS =====================
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      tabContents.forEach(content => content.classList.remove('active'));
      const targetTab = document.getElementById(tabId);
      if (targetTab) {
        targetTab.classList.add('active');
      }
      if (tabId === 'favoritas') loadFavoriteRecipes();
    });
  });

  // ===================== FAVORITOS =====================
  let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];

  function updateFavoriteCount() {
    const favoriteCount = document.getElementById('favorite-count');
    if (favoriteCount) {
      favoriteCount.textContent = favorites.length;
    }
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
        if (icon) {
          icon.classList.remove('far');
          icon.classList.add('fas');
        }
      }
      button.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
          favorites = favorites.filter(id => id !== recipeId);
          this.classList.remove('active');
          if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
          }
        } else {
          favorites.push(recipeId);
          this.classList.add('active');
          if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
          }
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
    
    if (!favoriteContainer || !emptyState) return;
    
    favoriteContainer.innerHTML = '';
    if (favorites.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';
    const allRecipeCards = document.querySelectorAll('#all-recipes .card');
    allRecipeCards.forEach(card => {
      const favoriteButton = card.querySelector('.card-favorite');
      if (favoriteButton) {
        const recipeId = favoriteButton.getAttribute('data-recipe-id');
        if (favorites.includes(recipeId)) {
          const clonedCard = card.cloneNode(true);
          const favButton = clonedCard.querySelector('.card-favorite');
          if (favButton) {
            favButton.classList.add('active');
            const icon = favButton.querySelector('i');
            if (icon) {
              icon.classList.remove('far');
              icon.classList.add('fas');
            }
            favButton.addEventListener('click', function() {
              favorites = favorites.filter(id => id !== recipeId);
              localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
              updateFavoriteCount();
              this.closest('.card').remove();
              if (favorites.length === 0) emptyState.style.display = 'block';
              const mainButton = document.querySelector(`#all-recipes .card-favorite[data-recipe-id="${recipeId}"]`);
              if (mainButton) {
                mainButton.classList.remove('active');
                const mainIcon = mainButton.querySelector('i');
                if (mainIcon) {
                  mainIcon.classList.remove('fas');
                  mainIcon.classList.add('far');
                }
              }
              showFavoriteNotification(false);
            });
          }
          favoriteContainer.appendChild(clonedCard);
        }
      }
    });
  }

  initializeFavoriteButtons();
  updateFavoriteCount();

  // ===================== EFEITO DE DIGITAÇÃO =====================
  const titleElement = document.querySelector('.newspaper-title');
  if (titleElement) {
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
  }

  // ===================== MODAL DE LOGIN =====================
  function setupLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-login-modal');
    
    // Fechar modal
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLoginModal);
    }
    
    // Fechar ao clicar fora
    if (loginModal) {
      loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
          closeLoginModal();
        }
      });
    }
    
    // Configurar link de login no sidebar
    const sidebarLoginLink = document.querySelector('a[onclick*="openLoginModal"]');
    if (sidebarLoginLink) {
      sidebarLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
      });
    }
  }

  // Configurar evento de envio do formulário de login
// ===================== MODAL DE LOGIN =====================
// Configurar evento de envio do formulário de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    const submitBtn = this.querySelector('.login-button');
    const buttonText = submitBtn.querySelector('.button-text');
    const originalText = buttonText.textContent;
    
    // Limpar erros anteriores
    hideLoginError();
    
    // Mostrar estado de carregamento
    submitBtn.disabled = true;
    buttonText.textContent = 'Entrando...';
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      if (remember) {
        formData.append('remember-me', 'on');
      }
      
      console.log('Enviando login...');
      
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest' // Indica que é AJAX
        },
        body: formData
      });
      
      console.log('Status da resposta:', response.status);
      console.log('Content-Type:', response.headers.get('content-type'));
      
      // Verificar se é JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (isJson) {
        const result = await response.json();
        console.log('Resposta JSON:', result);
        
        if (result.success) {
          // Login bem-sucedido via AJAX
          showLoginSuccess();
          
          setTimeout(() => {
            window.location.href = result.redirectUrl || '/';
          }, 1500);
          
        } else {
          // Erro do servidor
          showLoginError(result.message || 'Email ou senha incorretos');
          document.getElementById('password').value = '';
          document.getElementById('password').focus();
        }
      } else {
        // Não é JSON - pode ser redirecionamento HTML normal
        console.log('Resposta não é JSON, tratando como redirecionamento...');
        
        if (response.ok || response.status === 302) {
          // Login bem-sucedido (redirecionamento normal)
          showLoginSuccess();
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (response.status === 401 || response.status === 403) {
          // Credenciais inválidas
          showLoginError('Email ou senha incorretos');
          document.getElementById('password').value = '';
          document.getElementById('password').focus();
        } else {
          // Outro erro
          showLoginError('Erro ao fazer login. Tente novamente.');
        }
      }
      
    } catch (error) {
      console.error('Erro na requisição:', error);
      showLoginError('Erro de conexão. Verifique sua internet.');
    } finally {
      // Restaurar botão
      submitBtn.disabled = false;
      buttonText.textContent = originalText;
    }
  });
}

  // Configurar modal de login
  setupLoginModal();

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
  if (dateElement) {
    const today = new Date();
    const meses = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    const dia = today.getDate();
    const mes = meses[today.getMonth()];
    const ano = today.getFullYear();
    dateElement.textContent = `${dia} de ${mes} de ${ano}`;
  }

  // ===================== FILTROS DE RECEITAS =====================
  function filtrarReceitas() {
    const nomeFiltro = document.getElementById('nome')?.value.toLowerCase() || '';
    const tempoFiltro = parseInt(document.getElementById('tempo')?.value);
    const porcoesFiltro = parseInt(document.getElementById('porcoes')?.value);

    const cards = document.querySelectorAll('#all-recipes .card');

    cards.forEach(card => {
      const titulo = card.querySelector('h2')?.innerText.toLowerCase() || '';
      const tempoElement = card.querySelector('.card-meta span:first-child span');
      const porcoesElement = card.querySelector('.card-meta span:last-child span');
      
      const tempo = tempoElement ? parseInt(tempoElement.innerText) : 0;
      const porcoes = porcoesElement ? parseInt(porcoesElement.innerText) : 0;

      let mostrar = true;

      if (nomeFiltro && !titulo.includes(nomeFiltro)) mostrar = false;
      if (!isNaN(tempoFiltro) && tempo > tempoFiltro) mostrar = false;
      if (!isNaN(porcoesFiltro) && porcoes != porcoesFiltro) mostrar = false;

      card.style.display = mostrar ? 'block' : 'none';
    });
  }

  const filterForm = document.getElementById('filterForm');
  if (filterForm) {
    filterForm.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        filtrarReceitas();
      }
    });
  }

  const aplicarFiltros = document.getElementById('aplicarFiltros');
  if (aplicarFiltros) {
    aplicarFiltros.addEventListener('click', filtrarReceitas);
  }

  const limparFiltros = document.getElementById('limparFiltros');
  if (limparFiltros) {
    limparFiltros.addEventListener('click', () => {
      if (filterForm) filterForm.reset();
      const cards = document.querySelectorAll('#all-recipes .card');
      cards.forEach(card => card.style.display = 'block');
    });
  }

  // ===================== FECHAR MODAIS COM ESC =====================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Fechar todos os modais abertos
      closeLoginModal();
      closeDeleteModal();
      closeLogoutModal();
      fecharModalUsuario();
      
      // Fechar sidebar
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('show')) {
        toggleSidebar();
      }
    }
  });

// ===================== FORMULÁRIO DE EDIÇÃO DO USUÁRIO =====================
  const userEditForm = document.getElementById('userEditForm');
  if (userEditForm) {
    userEditForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(this);
      
      // Remover máscara do telefone antes de enviar
      const telefoneInput = document.getElementById('editTelefone');
      if (telefoneInput && telefoneInput.value) {
        const telefoneSemMascara = telefoneInput.value.replace(/\D/g, '');
        formData.set('telefone', telefoneSemMascara);
      }
      
      const dadosAtualizados = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        genero: formData.get('genero'),
        senha: formData.get('senha'),
        confirmarSenha: formData.get('confirmarSenha')
      };
      
      // Validação de senha
      if (dadosAtualizados.senha && dadosAtualizados.senha !== dadosAtualizados.confirmarSenha) {
        showMessage('As senhas não coincidem', 'error');
        return;
      }
      
      // Se a senha estiver vazia, remover do objeto
      if (!dadosAtualizados.senha || dadosAtualizados.senha.trim() === '') {
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
          headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include',
          body: JSON.stringify(dadosAtualizados)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          showMessage(result.message || 'Perfil atualizado com sucesso!', 'success');
          
          // Atualizar o nome no header se foi alterado
          if (dadosAtualizados.nome) {
            const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
            if (nomeUsuarioElement) {
              nomeUsuarioElement.textContent = dadosAtualizados.nome;
            }
          }
          
          // Fechar o modal após 1.5 segundos
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
  }

  // ===================== EVENT LISTENERS PARA FECHAR MODAIS =====================
  const closeUserModalBtn = document.querySelector('.close-user-modal');
  if (closeUserModalBtn) {
    closeUserModalBtn.addEventListener('click', fecharModalUsuario);
  }

  const userModal = document.getElementById('userModal');
  if (userModal) {
    userModal.addEventListener('click', function(event) {
      if (event.target === this) {
        fecharModalUsuario();
      }
    });
  }
});

// ===================== FUNÇÕES DE FORMATAÇÃO =====================
function formatarTelefone(telefone) {
  if (!telefone) return '';
  
  // Remove tudo que não é dígito
  const digits = telefone.replace(/\D/g, '');
  
  // Aplica máscara baseada no tamanho
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (digits.length === 9) {
    return digits.replace(/(\d{5})(\d{4})/, '$1-$2');
  } else if (digits.length === 8) {
    return digits.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  
  return digits; // Retorna sem formatação se não for tamanho conhecido
}

function aplicarMascaraTelefoneInput(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  
  if (value.length === 11) {
    // Formato: (99) 99999-9999
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length === 10) {
    // Formato: (99) 9999-9999
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  } else if (value.length > 0) {
    value = value.replace(/(\d{0,2})/, '($1');
  }
  
  input.value = value;
}



