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
        
        // Resetar estilos do modal
        const modalContent = modal.querySelector('.modal-content-user');
        if (modalContent) {
            modalContent.style.overflowY = '';
            modalContent.style.maxHeight = '';
        }
        modal.style.overflowY = '';
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
  function initializeCarousel() {
    const carousel = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    console.log('Itens do carrossel encontrados:', items.length);
    
    if (items.length === 0) {
      console.log('Nenhum item encontrado no carrossel');
      return;
    }
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    function updateCarousel() {
      if (carousel) {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
      
      // Atualizar classe active nos itens
      items.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
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
    
    // Configurar botões
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Configurar indicadores
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });
    
    // Iniciar auto-play
    let carouselInterval = setInterval(nextSlide, 5000);
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
      carouselContainer.addEventListener('mouseleave', () => carouselInterval = setInterval(nextSlide, 5000));
    }
    
    // Inicializar
    updateCarousel();
    console.log(`Carrossel inicializado com ${totalItems} itens`);
  }

  // Inicializar o carrossel quando a página carregar
  initializeCarousel();

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
        setTimeout(typeTitle, 150);
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

// Responsividade para Jornal de Receitas
function applyResponsiveStyles() {
    // Verifica se já existe o estilo de responsividade
    if (document.getElementById('responsive-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-styles';
    style.innerHTML = `
        /* RESPONSIVIDADE PARA TODOS OS DISPOSITIVOS */
        
        /* Dispositivos muito pequenos (celulares, até 480px) */
        @media (max-width: 480px) {
            :root {
                --header-padding: 10px;
                --font-scale: 0.8;
            }
            
            .header-container {
                padding: 10px 15px;
            }
            
            .newspaper-title {
                font-size: 2.5rem !important;
                padding: 0 10px;
                letter-spacing: 1px;
            }
            
            .newspaper-title::before,
            .newspaper-title::after {
                display: none;
            }
            
            .newspaper-subtitle {
                font-size: 1rem;
            }
            
            .newspaper-price,
            .newspaper-volume {
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                margin: 10px auto;
                width: fit-content;
            }
            
            .menu-icon,
            .user-icon {
                font-size: 1.2rem;
                height: 30px;
                width: 30px;
            }
            
            .nav-links {
                flex-direction: column;
                gap: 10px;
                margin: 20px 0;
            }
            
            .nav-links a {
                padding: 12px 15px;
                font-size: 0.9rem;
                justify-content: center;
            }
            
            .carousel-container {
                height: 250px;
                margin: 20px 0;
            }
            
            .carousel-caption h3 {
                font-size: 1.5rem;
            }
            
            .carousel-caption p {
                font-size: 0.9rem;
                padding: 0 10px;
            }
            
            .carousel-control {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
            
            .news-highlights {
                grid-template-columns: 1fr;
                gap: 15px;
                margin: 30px 0;
            }
            
            .news-item {
                padding: 20px;
                min-height: 200px;
            }
            
            .news-icon {
                width: 50px;
                height: 50px;
                font-size: 1.4rem;
                margin-right: 12px;
            }
            
            .recipe-filters {
                padding: 15px;
            }
            
            #filterForm {
                grid-template-columns: 1fr;
            }
            
            .receitas {
                grid-template-columns: 1fr !important;
                gap: 20px;
                margin: 30px 0;
            }
            
            .card {
                margin-bottom: 15px;
            }
            
            .card-image {
                height: 180px;
            }
            
            .card-content {
                padding: 15px;
            }
            
            .card h2 {
                font-size: 1.4rem;
            }
            
            .card-actions {
                flex-direction: row;
                gap: 10px;
            }
            
            .card-link,
            .card-favorite {
                justify-content: center;
            }
            
            .section-title h2 {
                font-size: 1.6rem;
            }
            
            .classifieds {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .advertisement {
                padding: 25px 15px;
            }
            
            .advertisement h2 {
                font-size: 1.6rem;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                gap: 25px;
                text-align: center;
            }
            
            .footer-column ul li {
                justify-content: center;
            }
            
            .modal-content-user,
            .modal-content-login,
            .modal-content-logout,
            .modal-content-delete {
                width: 95% !important;
                max-width: 95% !important;
                margin: 10% auto;
            }
            
            .user-info-grid {
                grid-template-columns: 1fr;
                gap: 0;
            }
            
            .form-input {
                font-size: 0.9rem;
                padding: 10px;
            }

            .modal-content-user {
        width: 95% !important;
        max-width: 95% !important;
        margin: 10px auto !important;
        border-radius: 10px !important;
    }
    
    .modal-content-user .modal-body {
        padding: 15px !important;
        max-height: calc(90vh - 120px) !important;
    }
    
    .modal-content-user .form-input {
        font-size: 16px !important; /* Prevenir zoom no iOS */
    }


        }
        
        /* Dispositivos pequenos (celulares, 481px a 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
            .header-container {
                padding: 15px 20px;
            }
            
            .newspaper-title {
                font-size: 3rem;
                margin-top: 11%;
            }

            .newspaper-title::before, .newspaper-title::after{
                display: none;

            }
            
            .newspaper-subtitle {
                font-size: 1.1rem;
            }
            
            .nav-links {
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .nav-links a {
                padding: 12px 20px;
                font-size: 1rem;
            }
            
            .carousel-container {
                height: 350px;
            }
            
            .carousel-caption h3 {
                font-size: 1.8rem;
            }
            
            .news-highlights {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
            
            .receitas {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 25px;
            }
            
            .recipe-filters {
                padding: 20px;
            }
            
            #filterForm {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .classifieds {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .footer-content {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .modal-content-user,
            .modal-content-login,
            .modal-content-logout,
            .modal-content-delete {
                width: 90% !important;
                max-width: 500px !important;
            }
        }
        
        /* Dispositivos médios (tablets, 769px a 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
            .newspaper-title {
                font-size: 3.5rem;
                margin-top: 9%;
            }

            .newspaper-title::before, .newspaper-title::after{
              display: none;
            }
            
            .news-highlights {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .receitas {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .carousel-container {
                height: 400px;
            }
            
            .classifieds {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .footer-content {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .modal-content-user {
                max-width: 70% !important;
            }
        }
        
        /* Dispositivos grandes (desktops pequenos, 1025px a 1200px) */
        @media (min-width: 1025px) and (max-width: 1200px) {
            .newspaper-title {
                font-size: 4rem;
                margin-top: 5%;
            }
            
            .receitas {
                grid-template-columns: repeat(3, 1fr) !important;
            }
            
            .classifieds {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        
        /* Ajustes gerais para todos os dispositivos móveis */
        @media (max-width: 768px) {
            .tab-buttons {
                flex-direction: column;
                align-items: stretch;
            }
            
            .tab-button {
                text-align: center;
                padding: 12px;
                font-size: 1rem;
            }
            
            .modal-actions,
            .modal-actions-delete {
                flex-direction: column;
            }
            
            .modal-actions button,
            .modal-actions-delete button {
                width: 100%;
                margin-bottom: 10px;
            }
            
            .card-meta {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .carousel-controls {
                padding: 0 5px;
            }
            
            .carousel-control {
                width: 45px;
                height: 45px;
                font-size: 1.5rem;
            }
            
            .carousel-indicators {
                bottom: 10px;
            }
            
            .carousel-indicator {
                width: 10px;
                height: 10px;
            }
            
            .social-links {
                flex-wrap: wrap;
                justify-content: center;
            }

              .modal-content-user {
        max-height: 80vh !important;
        overflow-y: auto !important;
        margin: 5% auto !important;
    }
    
    .modal-content-user .modal-body {
        max-height: calc(80vh - 100px) !important;
        overflow-y: auto !important;
    }
    
    .modal-content-user .user-info-grid {
        display: flex !important;
        flex-direction: column !important;
        gap: 15px !important;
    }
    
    /* Garantir que o modal seja rolável em dispositivos móveis */
    .modal {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    .modal-content-user {
        position: relative !important;
        transform: none !important;
        top: 45px !important;

    }
        }
        
        /* Ajustes para orientação paisagem em dispositivos móveis */
        @media (max-width: 768px) and (orientation: landscape) {
            .carousel-container {
                height: 300px;
            }
            
            .nav-links {
                flex-direction: row;
                flex-wrap: wrap;
            }
            
            .newspaper-title {
                font-size: 2.2rem;
            }
        }
        
        /* Ajustes para telas muito grandes */
        @media (min-width: 1400px) {
            body {
                max-width: 1400px;
                margin: 0 auto;
            }
        }
        
        /* Ajustes para impressão */
        @media print {
            .header-full-width,
            .nav-links,
            .carousel-container,
            .advertisement,
            .modal,
            .sidebar,
            .menu-icon,
            .user-icon,
            .card-favorite,
            .card-delete,
            .carousel-controls,
            .social-links,
            .footer-bottom {
                display: none !important;
            }
            
            body {
                background: white;
                color: black;
            }
            
            .card,
            .news-item,
            .classified-item {
                break-inside: avoid;
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Função para ajustar dinamicamente elementos específicos
function adjustLayoutForScreenSize() {
    const width = window.innerWidth;
    
    // Ajustar grid de receitas baseado na largura da tela
    const receitasContainer = document.getElementById('all-recipes');
    if (receitasContainer) {
        if (width <= 480) {
            receitasContainer.style.gridTemplateColumns = '1fr';
        } else if (width <= 768) {
            receitasContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (width <= 1024) {
            receitasContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            receitasContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
        }
    }
    
    // Ajustar altura do carrossel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        if (width <= 480) {
            carouselContainer.style.height = '250px';
        } else if (width <= 768) {
            carouselContainer.style.height = '350px';
        } else if (width <= 1024) {
            carouselContainer.style.height = '400px';
        } else {
            carouselContainer.style.height = '500px';
        }
    }
    
    // Ajustar tamanho da fonte do título
    const title = document.querySelector('.newspaper-title');
    if (title) {
        if (width <= 480) {
            title.style.fontSize = '2.5rem';
        } else if (width <= 768) {
            title.style.fontSize = '3rem';
        } else if (width <= 1024) {
            title.style.fontSize = '3.5rem';
        } else if (width <= 1200) {
            title.style.fontSize = '4rem';
        } else {
            title.style.fontSize = '4.5rem';
        }
    }
}

// Inicializar a responsividade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveStyles();
    adjustLayoutForScreenSize();
    
    // Reajustar quando a janela for redimensionada
    window.addEventListener('resize', adjustLayoutForScreenSize);
    
    // Reaplicar estilos se necessário
    window.addEventListener('load', applyResponsiveStyles);
});

// Adicione esta função ao seu código
function setupMobileModalScroll() {
    const userModal = document.getElementById('userModal');
    
    if (userModal) {
        // Prevenir que o modal feche ao rolar
        userModal.addEventListener('touchmove', function(e) {
            const modalContent = this.querySelector('.modal-content-user');
            if (modalContent) {
                const isScrollable = modalContent.scrollHeight > modalContent.clientHeight;
                const isAtTop = modalContent.scrollTop === 0;
                const isAtBottom = modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight;
                
                // Se o conteúdo do modal não for rolável ou estiver nos limites
                if (!isScrollable || (e.target === modalContent && ((isAtTop && e.touches[0].clientY > e.touches[0].clientY) || 
                    (isAtBottom && e.touches[0].clientY < e.touches[0].clientY)))) {
                    e.stopPropagation();
                }
            }
        }, { passive: false });
        
        // Ajustar altura do modal quando aberto em mobile
        if (window.innerWidth <= 768) {
            userModal.addEventListener('shown', function() {
                const modalContent = this.querySelector('.modal-content-user');
                if (modalContent) {
                    const viewportHeight = window.innerHeight;
                    modalContent.style.maxHeight = `${viewportHeight * 0.8}px`;
                }
            });
        }
    }
}

// Chame esta função no DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupMobileModalScroll();
    
    // Ajustar modal quando a tela for redimensionada
    window.addEventListener('resize', function() {
        const userModal = document.getElementById('userModal');
        if (userModal && userModal.style.display === 'block') {
            const modalContent = userModal.querySelector('.modal-content-user');
            if (modalContent && window.innerWidth <= 768) {
                const viewportHeight = window.innerHeight;
                modalContent.style.maxHeight = `${viewportHeight * 0.8}px`;
            }
        }
    });
});

// Adicionar classe de mobile ao body para CSS específico
function detectMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.add('desktop-device');
    }
}

// Executar detecção de dispositivo
detectMobile();

// ===================== SPINNER DE CARREGAMENTO =====================
function showPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.remove('hidden');
        // Garantir que o loader esteja visível
        loader.style.display = 'flex';
    }
}

function hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        // Adicionar transição suave
        loader.classList.add('hidden');
        // Remover completamente após a transição
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Tempo deve coincidir com a transição CSS
    }
}

// Mostrar spinner imediatamente
document.addEventListener('DOMContentLoaded', function() {
    showPageLoader();
    
    // Esconder spinner quando tudo estiver carregado
    window.addEventListener('load', function() {
        setTimeout(hidePageLoader, 600);
    });
    
    setTimeout(hidePageLoader, 3000);
});

// Para navegação SPA (se aplicável)
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.includes('#') && 
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute('target')) {
        showPageLoader();
    }
});
