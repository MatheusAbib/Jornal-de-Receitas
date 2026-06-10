      
let filterTimeout = null;
let lastFilterValues = {};

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('show');
    
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
      abrirModalUsuarioSimples(); 
    };
  } else if (userIcon) {
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
  
  const messageEl = document.getElementById('userEditMessage');
  if (messageEl) {
    messageEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando dados do usuário...';
    messageEl.className = 'message info';
  }
  
  try {
    const response = await fetch('/perfil/usuario-logado', {
      credentials: 'include' 
    });    
    if (response.ok) {
      const data = await response.json();
      const usuario = data.usuario;
      
      console.log('Dados do usuário recebidos:', usuario);
      
      if (document.getElementById('editNome')) {
        document.getElementById('editNome').value = usuario.nome || '';
      }
      if (document.getElementById('editEmail')) {
        document.getElementById('editEmail').value = usuario.email || '';
      }
      if (document.getElementById('editCpf')) {
        document.getElementById('editCpf').value = usuario.cpf || '';
      }
      
      if (document.getElementById('editTelefone')) {
        let telefoneValue = usuario.telefone || '';
        if (telefoneValue) {
          telefoneValue = formatarTelefone(telefoneValue);
        }
        document.getElementById('editTelefone').value = telefoneValue;
      }
      
      if (document.getElementById('editGenero')) {
        const generoSelect = document.getElementById('editGenero');
        const generoValue = (usuario.genero || '').toUpperCase();
        generoSelect.value = generoValue;
      }
      if (document.getElementById('editDataCadastro')) {
        let dataCadastro = usuario.dataCadastro || '';
        if (dataCadastro) {
          try {
            const dataString = dataCadastro.split('T')[0];
            const [ano, mes, dia] = dataString.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;
            document.getElementById('editDataCadastro').value = dataFormatada;
          } catch (e) {
            document.getElementById('editDataCadastro').value = dataCadastro;
          }
        }
      }
      
      if (document.getElementById('editSenha')) {
        document.getElementById('editSenha').value = '';
      }
      if (document.getElementById('confirmarSenha')) {
        document.getElementById('confirmarSenha').value = '';
      }
      
      if (messageEl) {
        messageEl.innerHTML = '<i class="fas fa-info-circle"></i> Edite suas informações acima. Deixe a senha em branco para mantê-la inalterada.';
        messageEl.className = 'message info';
      }
      
    } else if (response.status === 401) {
      console.log('Usuário não autenticado');
      
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
      console.error('Erro na resposta:', response.status);
      if (messageEl) {
        messageEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao carregar dados do usuário.';
        messageEl.className = 'message error';
      }
    }
    
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    
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
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
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
    
    hideLoginError();
    
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
    submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #219653)';
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Login realizado!';
    
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

function openCadastroModal() {
  const modal = document.getElementById('cadastroModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    hideCadastroAlert();
    setTimeout(() => {
      const nomeField = document.getElementById('cadastroNome');
      if (nomeField) nomeField.focus();
    }, 300);
  }
}

function closeCadastroModal() {
  const modal = document.getElementById('cadastroModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    const form = document.getElementById('cadastroFormModal');
    if (form) form.reset();
    clearCadastroValidation();
    hideCadastroAlert();
  }
}

function hideCadastroAlert() {
  const alert = document.getElementById('cadastroAlert');
  if (alert) alert.style.display = 'none';
}

function showCadastroAlert(message, isError = false) {
  const alert = document.getElementById('cadastroAlert');
  const messageSpan = document.getElementById('cadastroAlertMessage');
  if (alert && messageSpan) {
    messageSpan.textContent = message;
    alert.className = isError ? 'cadastro-alert error' : 'cadastro-alert';
    alert.style.display = 'flex';
    setTimeout(() => {
      if (alert.style.display === 'flex') {
        alert.style.opacity = '0';
        setTimeout(() => {
          alert.style.display = 'none';
          alert.style.opacity = '1';
        }, 3000);
      }
    }, 5000);
  }
}

function showCadastroError(fieldId, message) {
  const errorDiv = document.getElementById(`cadastro${fieldId}Error`);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    const input = document.getElementById(`cadastro${fieldId}`);
    if (input) input.style.borderColor = '#e74c3c';
  }
}

function clearCadastroError(fieldId) {
  const errorDiv = document.getElementById(`cadastro${fieldId}Error`);
  if (errorDiv) {
    errorDiv.style.display = 'none';
    const input = document.getElementById(`cadastro${fieldId}`);
    if (input) input.style.borderColor = '';
  }
}

function clearCadastroValidation() {
  const fields = ['Nome', 'Email', 'Cpf', 'Telefone', 'Genero', 'Senha', 'ConfirmarSenha'];
  fields.forEach(field => clearCadastroError(field));
}

function toggleCadastroPassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentElement.querySelector('.password-toggle-cadastro i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

function validateCadastroForm() {
  let isValid = true;
  clearCadastroValidation();
  
  const nome = document.getElementById('cadastroNome').value.trim();
  if (nome.length < 3) {
    showCadastroError('Nome', 'Nome deve ter pelo menos 3 caracteres');
    isValid = false;
  }
  
  const email = document.getElementById('cadastroEmail').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showCadastroError('Email', 'Email inválido');
    isValid = false;
  }
  
  const cpf = document.getElementById('cadastroCpf').value.replace(/\D/g, '');
  if (cpf.length !== 11) {
    showCadastroError('Cpf', 'CPF deve ter 11 dígitos');
    isValid = false;
  }
  
  const telefone = document.getElementById('cadastroTelefone').value.replace(/\D/g, '');
  if (telefone.length < 10) {
    showCadastroError('Telefone', 'Telefone inválido');
    isValid = false;
  }
  
  const genero = document.getElementById('cadastroGenero').value;
  if (!genero) {
    showCadastroError('Genero', 'Selecione um gênero');
    isValid = false;
  }
  
  const senha = document.getElementById('cadastroSenha').value;
  if (senha.length < 6) {
    showCadastroError('Senha', 'Senha deve ter pelo menos 6 caracteres');
    isValid = false;
  }
  
  const confirmarSenha = document.getElementById('cadastroConfirmarSenha').value;
  if (senha !== confirmarSenha) {
    showCadastroError('ConfirmarSenha', 'As senhas não coincidem');
    isValid = false;
  }
  
  return isValid;
}

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }
  
    document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (sidebar && sidebar.classList.contains('show') && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target)) {
      toggleSidebar();
    }
  });
  
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
    
    telefoneInput.addEventListener('blur', function(e) {
      aplicarMascaraTelefoneInput(e.target);
    });
  }

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
    
    updateCarousel();
    console.log(`Carrossel inicializado com ${totalItems} itens`);
  }

  initializeCarousel();

  let currentRecipeToDelete = null;
  let currentDeleteButton = null;

function initializeDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.card-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      const recipeId = this.getAttribute('data-recipe-id');
      const recipeTitle = this.getAttribute('data-recipe-title');
      const recipeChefe = this.getAttribute('data-recipe-chefe');
      
      console.log('Recipe ID:', recipeId);
      console.log('Recipe Title:', recipeTitle);
      console.log('Recipe Chefe:', recipeChefe);
      
      currentRecipeToDelete = recipeId;
      currentDeleteButton = this;
      
      openDeleteModal(recipeTitle, recipeChefe);
    });
  });
}

function openDeleteModal(recipeTitle, recipeChefe) {
  const modal = document.getElementById('deleteModal');
  const recipeNameElement = document.getElementById('recipeNameToDelete');
  const chefeInfoContainer = document.getElementById('chefeInfoContainer');
  const chefeNameElement = document.getElementById('chefeNameToDelete');
  
  if (modal && recipeNameElement) {
    recipeNameElement.textContent = `"${recipeTitle}"`;
    
    if (recipeChefe && recipeChefe.trim()) {
      chefeNameElement.textContent = recipeChefe;
      chefeInfoContainer.style.display = 'block';
    } else {
      chefeInfoContainer.style.display = 'none';
    }
    
    modal.style.zIndex = '2000';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

  function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      currentRecipeToDelete = null;
      currentDeleteButton = null;
    }
  }

  function setupDeleteModal() {
  const modal = document.getElementById('deleteModal');
  const closeBtn = document.querySelector('.close-delete-modal');
  const cancelBtn = document.querySelector('.delete-modal .cancel');
  const confirmBtn = document.querySelector('.delete-modal .confirm');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function(event) {
      event.stopPropagation();
      closeDeleteModal();
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function(event) {
      event.stopPropagation();
      closeDeleteModal();
    });
  }
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async function() {
        if (currentRecipeToDelete && currentDeleteButton) {
          this.disabled = true;
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';
          
          await deleteRecipe(currentRecipeToDelete, currentDeleteButton);
          closeDeleteModal();
          
          this.disabled = false;
          this.innerHTML = '<i class="fas fa-trash"></i> Excluir';
        }
      });
    }
    
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
        const card = buttonElement.closest('.card');
        if (card) {
          card.style.animation = 'fadeOut 0.3s ease forwards';
          
          setTimeout(() => {
            card.remove();
            showDeleteNotification('Receita excluída com sucesso!', true);
            
            updateCardCount();
          }, 300);
        }
        
        const favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        const updatedFavorites = favorites.filter(id => id !== recipeId);
        localStorage.setItem('recipeFavorites', JSON.stringify(updatedFavorites));
        updateFavoriteCount();
        
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
    background: ${isSuccess ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : '#e74c3c'};
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

  initializeDeleteButtons();
  setupDeleteModal();

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
    console.log(`Inicializando ${favoriteButtons.length} botões de favorito`);
    
    favoriteButtons.forEach(button => {
        const recipeId = button.getAttribute('data-recipe-id');
        const recipeTitle = button.closest('.card').querySelector('h2').textContent;
        
        console.log(`Receita ${recipeId}: ${recipeTitle} - Favorita: ${favorites.includes(recipeId)}`);
        
        if (favorites.includes(recipeId)) {
            button.classList.add('active');
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        } else {
            button.classList.remove('active');
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
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
                console.log(`Removido dos favoritos: ${recipeId}`);
            } else {
                if (!favorites.includes(recipeId)) {
                    favorites.push(recipeId);
                }
                this.classList.add('active');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
                console.log(`Adicionado aos favoritos: ${recipeId}`);
            }
            
            localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
            
            updateFavoriteCount();
            
            showFavoriteNotification(this.classList.contains('active'));
            
            const favTab = document.getElementById('favoritas');
            if (favTab && favTab.classList.contains('active')) {
                loadFavoriteRecipes();
            }
        });
    });
    
    console.log('Favoritos no localStorage:', JSON.parse(localStorage.getItem('recipeFavorites')) || []);
}

  function loadFavoriteRecipes() {
    const favoriteContainer = document.getElementById('favorite-recipes');
    const emptyState = document.getElementById('empty-favorites');
    
    if (!favoriteContainer || !emptyState) return;
    
    favoriteContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        emptyState.style.display = 'block';
        favoriteContainer.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    favoriteContainer.style.display = 'grid';
    
    const allRecipeCards = document.querySelectorAll('#salgados-recipes .card, #doces-recipes .card');
    
    console.log(`Total de cards encontrados: ${allRecipeCards.length}`);
    console.log(`Favoritos no localStorage: ${favorites.join(', ')}`);
    
    let favoriteCardsFound = 0;
    
    allRecipeCards.forEach(card => {
        const favoriteButton = card.querySelector('.card-favorite');
        if (favoriteButton) {
            const recipeId = favoriteButton.getAttribute('data-recipe-id');
            
            if (favorites.includes(recipeId)) {
                favoriteCardsFound++;
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
                        
                        const mainButton = document.querySelector(`.card-favorite[data-recipe-id="${recipeId}"]:not(#favorite-recipes .card-favorite)`);
                        if (mainButton) {
                            mainButton.classList.remove('active');
                            const mainIcon = mainButton.querySelector('i');
                            if (mainIcon) {
                                mainIcon.classList.remove('fas');
                                mainIcon.classList.add('far');
                            }
                        }
                        
                        showFavoriteNotification(false);
                        
                        if (favorites.length === 0) {
                            emptyState.style.display = 'block';
                            favoriteContainer.style.display = 'none';
                        }
                    });
                }
                
                favoriteContainer.appendChild(clonedCard);
            }
        }
    });
    
    console.log(`Cards favoritos encontrados: ${favoriteCardsFound}`);
    
    if (favoriteCardsFound === 0 && favorites.length > 0) {
        console.warn('Favoritos no localStorage mas não encontrados no DOM');
        emptyState.style.display = 'block';
        favoriteContainer.style.display = 'none';
        favorites = [];
        localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
        updateFavoriteCount();
    }
}

  initializeFavoriteButtons();
  updateFavoriteCount();

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

  function setupLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-login-modal');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLoginModal);
    }
    
    if (loginModal) {
      loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
          closeLoginModal();
        }
      });
    }
    
    const sidebarLoginLink = document.querySelector('a[onclick*="openLoginModal"]');
    if (sidebarLoginLink) {
      sidebarLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
      });
    }
  }

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
    
    hideLoginError();
    
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
          'X-Requested-With': 'XMLHttpRequest' 
        },
        body: formData
      });
      
      console.log('Status da resposta:', response.status);
      console.log('Content-Type:', response.headers.get('content-type'));
      
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (isJson) {
        const result = await response.json();
        console.log('Resposta JSON:', result);
        
        if (result.success) {
          showLoginSuccess();
          
          setTimeout(() => {
            window.location.href = result.redirectUrl || '/';
          }, 1500);
          
        } else {
          showLoginError(result.message || 'Email ou senha incorretos');
          document.getElementById('password').value = '';
          document.getElementById('password').focus();
        }
      } else {
        console.log('Resposta não é JSON, tratando como redirecionamento...');
        
        if (response.ok || response.status === 302) {
          showLoginSuccess();
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (response.status === 401 || response.status === 403) {
          showLoginError('Email ou senha incorretos');
          document.getElementById('password').value = '';
          document.getElementById('password').focus();
        } else {
          showLoginError('Erro ao fazer login. Tente novamente.');
        }
      }
      
    } catch (error) {
      console.error('Erro na requisição:', error);
      showLoginError('Erro de conexão. Verifique sua internet.');
    } finally {
      submitBtn.disabled = false;
      buttonText.textContent = originalText;
    }
  });
}

const cadastroForm = document.getElementById('cadastroFormModal');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateCadastroForm()) {
      return;
    }
    
    const submitBtn = this.querySelector('.btn-cadastro');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
    submitBtn.disabled = true;
    
    const formData = new FormData(this);
    const dados = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      cpf: formData.get('cpf').replace(/\D/g, ''),
      telefone: formData.get('telefone').replace(/\D/g, ''),
      genero: formData.get('genero'),
      senha: formData.get('senha')
    };
    
    try {
      const response = await fetch('/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        showCadastroAlert(result.message || 'Cadastro realizado com sucesso! Faça login.');
        setTimeout(() => {
          closeCadastroModal();
          openLoginModal();
        }, 2000);
      } else {
        showCadastroAlert(result.message || 'Erro ao cadastrar', true);
      }
    } catch (error) {
      console.error('Erro:', error);
      showCadastroAlert('Erro de conexão. Tente novamente.', true);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

const cadastroCpf = document.getElementById('cadastroCpf');
if (cadastroCpf) {
  cadastroCpf.addEventListener('input', function() {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 3) v = v.slice(0,3) + '.' + v.slice(3);
    if (v.length > 7) v = v.slice(0,7) + '.' + v.slice(7);
    if (v.length > 11) v = v.slice(0,11) + '-' + v.slice(11,13);
    this.value = v;
  });
}

const cadastroTelefone = document.getElementById('cadastroTelefone');
if (cadastroTelefone) {
  cadastroTelefone.addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'');
    if (v.length > 0) v = '(' + v;
    if (v.length > 3) v = v.slice(0,3) + ') ' + v.slice(3);
    if (v.length > 9) v = v.slice(0,9) + '-' + v.slice(9,14);
    this.value = v;
  });
}

const closeCadastroBtn = document.querySelector('.close-cadastro-modal');
if (closeCadastroBtn) {
  closeCadastroBtn.addEventListener('click', closeCadastroModal);
}

const cadastroModal = document.getElementById('cadastroModal');
if (cadastroModal) {
  cadastroModal.addEventListener('click', function(e) {
    if (e.target === this) closeCadastroModal();
  });
}

  setupLoginModal();

  verificarUsuarioAutenticado();

  configurarIconeUsuario();

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

  function setupFilterWithDelay() {
    const nomeInput = document.getElementById('nome');
    const categoriaSelect = document.getElementById('categoria');
    const porcoesInput = document.getElementById('porcoes');
    
    const searchStatus = document.createElement('div');
    searchStatus.id = 'searchStatus';
    searchStatus.style.cssText = `
        text-align: center;
        padding: 10px;
        color: var(--light-text);
        font-style: italic;
        display: none;
    `;
    
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.parentNode.insertBefore(searchStatus, filterForm.nextSibling);
    }
    
    function showSearchStatus(message) {
        searchStatus.textContent = message;
        searchStatus.style.display = 'block';
    }
    
    function hideSearchStatus() {
        searchStatus.style.display = 'none';
    }
    
    function applyFilterWithDelay() {
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }
        
        const currentValues = {
            nome: nomeInput ? nomeInput.value.toLowerCase().trim() : '',
            categoria: categoriaSelect ? categoriaSelect.value : '',
            porcoes: porcoesInput ? porcoesInput.value : ''
        };
        
        const hasChanged = JSON.stringify(currentValues) !== JSON.stringify(lastFilterValues);
        
        if (!hasChanged) return;
        
        lastFilterValues = { ...currentValues };
        
        showSearchStatus('Procurando receita...');
        
        filterTimeout = setTimeout(() => {
            filtrarReceitasComCategoria(currentValues);
            hideSearchStatus();
        }, 1000);
    }
    
function filtrarReceitasComCategoria(filtros = {}) {
    const { nome = '', categoria = '', porcoes = '' } = filtros;
    
    const salgadosCards = document.querySelectorAll('#salgados-recipes .card');
    const docesCards = document.querySelectorAll('#doces-recipes .card');
    
    let salgadosVisiveis = 0;
    let docesVisiveis = 0;
    let totalVisiveis = 0;

    const salgadosSection = document.getElementById('salgados-section');
    const docesSection = document.getElementById('doces-section');
    const salgadosEmpty = document.getElementById('salgados-empty');
    const docesEmpty = document.getElementById('doces-empty');
    
    const filtroCategoriaAtivo = categoria !== '';
    
    if (!filtroCategoriaAtivo) {
        if (salgadosSection) salgadosSection.style.display = 'block';
        if (docesSection) docesSection.style.display = 'block';
    } else {
        if (categoria === 'SALGADO') {
            if (salgadosSection) salgadosSection.style.display = 'block';
            if (docesSection) docesSection.style.display = 'none'; 
        } else if (categoria === 'DOCE') {
            if (salgadosSection) salgadosSection.style.display = 'none'; 
            if (docesSection) docesSection.style.display = 'block';
        }
    }

    salgadosCards.forEach(card => {
        const titulo = card.querySelector('h2')?.innerText.toLowerCase() || '';
        const porcoesElement = card.querySelector('.card-meta span:nth-child(2) span');
        const porcoesReceita = porcoesElement ? parseInt(porcoesElement.innerText) : 0;

        let mostrar = true;

        if (nome && !titulo.includes(nome.toLowerCase())) {
            mostrar = false;
        }

        if (categoria && categoria !== 'SALGADO') {
            mostrar = false;
        }

        if (porcoes && porcoesReceita !== parseInt(porcoes)) {
            mostrar = false;
        }

        if (mostrar) {
            card.style.display = 'flex';
            salgadosVisiveis++;
            totalVisiveis++;
        } else {
            card.style.display = 'none';
        }
    });

    docesCards.forEach(card => {
        const titulo = card.querySelector('h2')?.innerText.toLowerCase() || '';
        const porcoesElement = card.querySelector('.card-meta span:nth-child(2) span');
        const porcoesReceita = porcoesElement ? parseInt(porcoesElement.innerText) : 0;

        let mostrar = true;

        if (nome && !titulo.includes(nome.toLowerCase())) {
            mostrar = false;
        }

        if (categoria && categoria !== 'DOCE') {
            mostrar = false;
        }

        if (porcoes && porcoesReceita !== parseInt(porcoes)) {
            mostrar = false;
        }

        if (mostrar) {
            card.style.display = 'flex';
            docesVisiveis++;
            totalVisiveis++;
        } else {
            card.style.display = 'none';
        }
    });

    const salgadosCount = document.getElementById('salgados-count');
    const docesCount = document.getElementById('doces-count');
    const salgadosEmptyText = document.getElementById('salgados-empty-text');
    const docesEmptyText = document.getElementById('doces-empty-text');

    if (salgadosCount) {
        salgadosCount.textContent = `${salgadosVisiveis} receita${salgadosVisiveis !== 1 ? 's' : ''}`;
    }

    if (docesCount) {
        docesCount.textContent = `${docesVisiveis} receita${docesVisiveis !== 1 ? 's' : ''}`;
    }

    if (salgadosEmpty && salgadosSection && salgadosSection.style.display !== 'none') {
        if (salgadosVisiveis === 0) {
            salgadosEmpty.style.display = 'block';
            if (salgadosEmptyText) {
                salgadosEmptyText.textContent = categoria === 'SALGADO' 
                    ? 'Não há receitas salgadas com os filtros aplicados.' 
                    : 'Não há receitas salgadas disponíveis.';
            }
        } else {
            salgadosEmpty.style.display = 'none';
        }
    }

    if (docesEmpty && docesSection && docesSection.style.display !== 'none') {
        if (docesVisiveis === 0) {
            docesEmpty.style.display = 'block';
            if (docesEmptyText) {
                docesEmptyText.textContent = categoria === 'DOCE' 
                    ? 'Não há receitas doces com os filtros aplicados.' 
                    : 'Não há receitas doces disponíveis.';
            }
        } else {
            docesEmpty.style.display = 'none';
        }
    }

    if (searchStatus && totalVisiveis === 0) {
        const hasFilters = nome || categoria || porcoes;
        if (hasFilters) {
            showSearchStatus('Nenhuma receita encontrada com esses filtros.');
            setTimeout(() => {
                if (searchStatus.textContent.includes('Nenhuma receita')) {
                    hideSearchStatus();
                }
            }, 2000);
        }
    } else if (searchStatus) {
        hideSearchStatus();
    }
}
    
    if (nomeInput) {
        nomeInput.addEventListener('input', applyFilterWithDelay);
    }
    
    if (categoriaSelect) {
        categoriaSelect.addEventListener('change', applyFilterWithDelay);
    }
    
    if (porcoesInput) {
        porcoesInput.addEventListener('input', applyFilterWithDelay);
    }
    
    const aplicarFiltros = document.getElementById('aplicarFiltros');
    if (aplicarFiltros) {
        aplicarFiltros.addEventListener('click', function() {
            if (filterTimeout) {
                clearTimeout(filterTimeout);
            }
            
            showSearchStatus('Aplicando filtros...');
            
            const currentValues = {
                nome: nomeInput ? nomeInput.value.toLowerCase().trim() : '',
                categoria: categoriaSelect ? categoriaSelect.value : '',
                porcoes: porcoesInput ? porcoesInput.value : ''
            };
            
            filtrarReceitasComCategoria(currentValues);
            setTimeout(hideSearchStatus, 500);
        });
    }
    
const limparFiltros = document.getElementById('limparFiltros');
if (limparFiltros) {
    limparFiltros.addEventListener('click', function() {
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }
        
        if (nomeInput) nomeInput.value = '';
        if (categoriaSelect) categoriaSelect.value = '';
        if (porcoesInput) porcoesInput.value = '';
        
        lastFilterValues = {};
        
        const salgadosCards = document.querySelectorAll('#salgados-recipes .card');
        const docesCards = document.querySelectorAll('#doces-recipes .card');
        
        salgadosCards.forEach(card => card.style.display = 'flex');
        docesCards.forEach(card => card.style.display = 'flex');
        
        const salgadosSection = document.getElementById('salgados-section');
        const docesSection = document.getElementById('doces-section');
        
        if (salgadosSection) salgadosSection.style.display = 'block';
        if (docesSection) docesSection.style.display = 'block';

        const salgadosEmpty = document.getElementById('salgados-empty');
        const docesEmpty = document.getElementById('doces-empty');
        
        if (salgadosEmpty) salgadosEmpty.style.display = 'none';
        if (docesEmpty) docesEmpty.style.display = 'none';
                
        const salgadosCount = document.getElementById('salgados-count');
        const docesCount = document.getElementById('doces-count');
        
        if (salgadosCount) {
            salgadosCount.textContent = `${salgadosCards.length} receita${salgadosCards.length !== 1 ? 's' : ''}`;
        }
        
        if (docesCount) {
            docesCount.textContent = `${docesCards.length} receita${docesCards.length !== 1 ? 's' : ''}`;
        }
        
        showSearchStatus('Filtros limpos! Mostrando todas as receitas.');
        setTimeout(hideSearchStatus, 1000);
    });
}
    
    const filterFormElement = document.getElementById('filterForm');
    if (filterFormElement) {
        filterFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
  }
  
  setupFilterWithDelay();

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLoginModal();
      closeDeleteModal();
      closeLogoutModal();
      fecharModalUsuario();
      
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('show')) {
        toggleSidebar();
      }
    }
  });

  const userEditForm = document.getElementById('userEditForm');
  if (userEditForm) {
    userEditForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(this);
      
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
      
      if (dadosAtualizados.senha && dadosAtualizados.senha !== dadosAtualizados.confirmarSenha) {
        showMessage('As senhas não coincidem', 'error');
        return;
      }
      
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
          
          if (dadosAtualizados.nome) {
            const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
            if (nomeUsuarioElement) {
              nomeUsuarioElement.textContent = dadosAtualizados.nome;
            }
          }
          
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

function formatarTelefone(telefone) {
  if (!telefone) return '';
  
  const digits = telefone.replace(/\D/g, '');
  
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (digits.length === 9) {
    return digits.replace(/(\d{5})(\d{4})/, '$1-$2');
  } else if (digits.length === 8) {
    return digits.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  
  return digits; 
}

function aplicarMascaraTelefoneInput(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  
  if (value.length === 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length === 10) {
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

function applyResponsiveStyles() {
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

            body{
              padding: 0 15px;
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
                padding: 18px;
                min-height: 180px;
            }

            .news-description{
              font-size: 0.9rem;
            }

            .news-title{
            font-size: 1.1rem;
            }

            .filter-group input {
              padding: 10px 10px 10px 40px
            }

            .filter-buttons{
              margin-top: 0;
              gap: 0;
            }
            
            .news-icon {
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
                margin-right: 12px;
            }
            
            .recipe-filters {
                padding: 15px;
            }

            .recipe-filters h3{
            font-size: 1.3rem;
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

            .header-top{
              flex-direction: row-reverse;
            }

            .recipe-count{
            display: none;
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
    
    .modal {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    .modal-content-user {
        position: relative !important;
        transform: none !important;
        top: 45px !important;

    }

     .content-wrapper {
        padding: 0 15px !important;
        max-width: 100% !important;
    }
    
    body {
        max-width: 100% !important;
        overflow-x: hidden !important;
        padding: 0 !important;
    }


     .header-full-width {
        width: 100% !important;
        left: 0 !important;
        right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    
    .header-container {
        padding: 10px 15px !important;
        max-width: 100% !important;
    }
        }
        
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
        
        @media (min-width: 1400px) {
            body {
                max-width: 1400px;
                margin: 0 auto;
            }
        }
        
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

function adjustLayoutForScreenSize() {
    const width = window.innerWidth;
    
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

document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveStyles();
    adjustLayoutForScreenSize();
    
    window.addEventListener('resize', adjustLayoutForScreenSize);
    
    window.addEventListener('load', applyResponsiveStyles);
});

function setupMobileModalScroll() {
    const userModal = document.getElementById('userModal');
    
    if (userModal) {
        userModal.addEventListener('touchmove', function(e) {
            const modalContent = this.querySelector('.modal-content-user');
            if (modalContent) {
                const isScrollable = modalContent.scrollHeight > modalContent.clientHeight;
                const isAtTop = modalContent.scrollTop === 0;
                const isAtBottom = modalContent.scrollTop + modalContent.clientHeight >= modalContent.scrollHeight;
                
                if (!isScrollable || (e.target === modalContent && ((isAtTop && e.touches[0].clientY > e.touches[0].clientY) || 
                    (isAtBottom && e.touches[0].clientY < e.touches[0].clientY)))) {
                    e.stopPropagation();
                }
            }
        }, { passive: false });
        
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

document.addEventListener('DOMContentLoaded', function() {
    setupMobileModalScroll();
    
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

function detectMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.add('desktop-device');
    }
}

detectMobile();

function showPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.remove('hidden');
        loader.style.display = 'flex';
    }
}

function hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showPageLoader();
    
    window.addEventListener('load', function() {
        setTimeout(hidePageLoader, 600);
    });
    
    setTimeout(hidePageLoader, 3000);
});

document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.includes('#') && 
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute('target')) {
        showPageLoader();
    }
});

function updateCategoryCounts() {
    const salgadosCards = document.querySelectorAll('#salgados-recipes .card');
    const docesCards = document.querySelectorAll('#doces-recipes .card');
    
    const salgadosCount = document.getElementById('salgados-count');
    const docesCount = document.getElementById('doces-count');
    const noRecipesMessage = document.getElementById('no-recipes-message');
    
    if (salgadosCount) {
        salgadosCount.textContent = `${salgadosCards.length} receita${salgadosCards.length !== 1 ? 's' : ''}`;
    }
    
    if (docesCount) {
        docesCount.textContent = `${docesCards.length} receita${docesCards.length !== 1 ? 's' : ''}`;
    }
    
    if (noRecipesMessage) {
        const totalReceitas = salgadosCards.length + docesCards.length;
        noRecipesMessage.style.display = totalReceitas === 0 ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateCategoryCounts, 500); 
        setupStickyHeader();

});

function setupStickyHeader() {
    const header = document.querySelector('.header-full-width');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    if (!header) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader(scrollTop) {
        if (scrollTop > 150) { 
            if (!header.classList.contains('scrolled')) {
                header.classList.add('scrolled');
                
                if (contentWrapper) {
                    const headerHeight = header.offsetHeight;
                    contentWrapper.style.marginTop = `${headerHeight}px`;
                }
            }
        } else {
            if (header.classList.contains('scrolled')) {
                header.classList.remove('scrolled');
                
                if (contentWrapper) {
                    contentWrapper.style.marginTop = '0';
                }
            }
        }
    }
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeader(scrollTop);
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    updateHeader(window.pageYOffset || document.documentElement.scrollTop);
    
    window.addEventListener('resize', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        updateHeader(scrollTop);
    });
}