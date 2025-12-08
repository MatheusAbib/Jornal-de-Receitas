  document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('recipeForm');
  const imageInput = document.getElementById('imagemFile');
  const imagePreview = document.getElementById('imagePreview');
  const fileText = document.getElementById('fileText');
  const ingredientesContainer = document.getElementById('ingredientesContainer');
  const modoPreparoContainer = document.getElementById('modoPreparoContainer');

  // Verificar se há mensagem de sucesso da submissão anterior
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('sucesso')) {
    mostrarNotificacao(urlParams.get('sucesso'));
  }

  // Criar elemento de notificação
  function criarNotificacao() {
    const notificacao = document.createElement('div');
    notificacao.id = 'successNotification';
    notificacao.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      display: none;
      align-items: center;
      gap: 10px;
      font-family: inherit;
      font-size: 14px;
      max-width: 300px;
      animation: slideInRight 0.3s ease;
    `;
    notificacao.innerHTML = `
      <i class="fas fa-check-circle" style="font-size: 18px;"></i>
      <span id="notificationText"></span>
    `;
    document.body.appendChild(notificacao);
    return notificacao;
  }

  const notificacao = criarNotificacao();

  function mostrarNotificacao(mensagem) {
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = mensagem;
    notificacao.style.display = 'flex';
    
    setTimeout(() => {
      notificacao.style.display = 'none';
    }, 5000);
  }

  // Limpar formulário
  function limparFormulario() {
    form.reset();
    
    // Limpar preview da imagem
    imagePreview.classList.remove('active');
    fileText.textContent = 'Selecione uma imagem para sua receita';
    
    // Limpar ingredientes dinâmicos (manter apenas o primeiro)
    const ingredientes = ingredientesContainer.querySelectorAll('.ingrediente-item');
    ingredientes.forEach((item, index) => {
      if (index > 0) item.remove();
    });
    if (ingredientes[0]) {
      ingredientes[0].querySelector('input').value = '';
      ingredientes[0].querySelector('input').placeholder = 'Ingrediente 1';
    }
    
    // Limpar passos dinâmicos (manter apenas o primeiro)
    const passos = modoPreparoContainer.querySelectorAll('.passo-item');
    passos.forEach((item, index) => {
      if (index > 0) item.remove();
    });
    if (passos[0]) {
      passos[0].querySelector('input').value = '';
      passos[0].querySelector('input').placeholder = 'Passo 1';
    }
    
    // Resetar valores padrão
    document.getElementById('porcoes').value = '1';
  }

  // Preview de imagem
  imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        showError('imagemError', 'Formato de arquivo não suportado. Use JPG, PNG ou GIF.');
        this.value = '';
        return;
      }
      hideError('imagemError');
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.querySelector('img').src = e.target.result;
        imagePreview.classList.add('active');
        fileText.textContent = file.name;
      }
      reader.readAsDataURL(file);
    } else {
      imagePreview.classList.remove('active');
      fileText.textContent = 'Selecione uma imagem para sua receita';
    }
  });

  // Reindexar ingredientes
  function atualizarIngredientes() {
    const ingredientes = ingredientesContainer.querySelectorAll('.ingrediente-item input');
    ingredientes.forEach((input, i) => {
      input.placeholder = `Ingrediente ${i + 1}`;
      aplicarCapitalizacao(input);
    });
  }

  // Reindexar passos
  function atualizarPassos() {
    const passos = modoPreparoContainer.querySelectorAll('.passo-item input');
    passos.forEach((input, i) => {
      input.placeholder = `Passo ${i + 1}`;
      aplicarCapitalizacao(input);
    });
  }

  // Adicionar ingrediente
  document.getElementById('addIngrediente').addEventListener('click', function() {
    const div = document.createElement('div');
    div.classList.add('ingrediente-item');
    div.innerHTML = `
      <div class="input-wrapper">
        <input type="text" name="ingredientes[]" required>
        <button type="button" class="remove-btn">×</button>
      </div>
    `;
    ingredientesContainer.appendChild(div);
    div.querySelector('.remove-btn').addEventListener('click', function() {
      div.remove();
      atualizarIngredientes();
    });
    atualizarIngredientes();
  });

  // Adicionar passo
  document.getElementById('addPasso').addEventListener('click', function() {
    const div = document.createElement('div');
    div.classList.add('passo-item');
    div.innerHTML = `
      <div class="input-wrapper">
        <input type="text" name="modoPreparo[]" required>
        <button type="button" class="remove-btn">×</button>
      </div>
    `;
    modoPreparoContainer.appendChild(div);
    div.querySelector('.remove-btn').addEventListener('click', function() {
      div.remove();
      atualizarPassos();
    });
    atualizarPassos();
  });

  // Capitalização
  function capitalizeFirst(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function aplicarCapitalizacao(input) {
    input.addEventListener("blur", function () {
      let valor = input.value.trim();
      if (valor) {
        input.value = capitalizeFirst(valor);
      }
    });
  }

  // Título fixo
  const tituloInput = document.getElementById("titulo");
  aplicarCapitalizacao(tituloInput);

  // Aplica capitalização nos existentes
  ingredientesContainer.querySelectorAll("input").forEach(inp => aplicarCapitalizacao(inp));
  modoPreparoContainer.querySelectorAll("input").forEach(inp => aplicarCapitalizacao(inp));

  // Tempo de preparo
  const tempoPreparoInput = document.getElementById('tempoPreparo');
  tempoPreparoInput.addEventListener('blur', function() {
    let valor = tempoPreparoInput.value.trim();
    if (valor) {
      let numero = valor.match(/\d+/);
      if (numero) {
        tempoPreparoInput.value = numero[0] + " Minutos";
      }
    }
  });

  // Validação simples
  form.addEventListener('submit', function(e) {
    let isValid = true;
    if (!form.querySelector('#titulo').value.trim()) { showError('tituloError'); isValid = false; } else hideError('tituloError');
    if (!form.querySelector('#tempoPreparo').value.trim()) { showError('tempoError'); isValid = false; } else hideError('tempoError');
    if (ingredientesContainer.querySelectorAll('input').length === 0) { showError('ingredientesError'); isValid = false; } else hideError('ingredientesError');
    if (modoPreparoContainer.querySelectorAll('input').length === 0) { showError('modoPreparoError'); isValid = false; } else hideError('modoPreparoError');
    if (imageInput.files[0] && !imageInput.files[0].type.match('image.*')) { showError('imagemError'); isValid = false; }
    
    if (isValid) {
      // Se o formulário for válido, mostrar notificação após o envio
      setTimeout(() => {
        mostrarNotificacao('Receita enviada para aprovação!');
        limparFormulario();
      }, 100);
    } else {
      e.preventDefault();
    }
  });

  function showError(id, msg='Campo obrigatório') { const el = document.getElementById(id); el.textContent = msg; el.classList.add('show'); }
  function hideError(id) { const el = document.getElementById(id); el.classList.remove('show'); }

  // Adicionar animação CSS para a notificação
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
});

// Responsividade para página de Formulário de Receitas
function applyResponsiveStylesForm() {
    // Verifica se já existe o estilo de responsividade
    if (document.getElementById('responsive-styles-form')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-styles-form';
    style.innerHTML = `
        /* RESPONSIVIDADE PARA FORMULÁRIO DE RECEITAS */
        
        /* Dispositivos muito pequenos (celulares, até 480px) */
        @media (max-width: 480px) {
            .form-container {
                margin: 20px auto !important;
                padding: 0 0px !important;
                max-width: 100% !important;
            }
            
            .form-header {
                margin-bottom: 25px !important;
            }
            
            .form-header h1 {
                font-size: 1.8rem !important;
                padding: 0 15px !important;
            }
            
            .form-header h1::before,
            .form-header h1::after {
                font-size: 1.2rem !important;
            }
            
            .form-header h1::before {
                left: -10px !important;
            }
            
            .form-header h1::after {
                right: -10px !important;
            }
            
            .form-subtitle {
                font-size: 0.9rem !important;
                padding: 0 10px !important;
            }
            
            .back-link {
                font-size: 0.9rem !important;
                margin-bottom: 15px !important;
                padding: 8px 0 !important;
            }
            
            .recipe-form {
                padding: 20px 20px !important;
                border-radius: 10px !important;
            }
            
            .form-row {
                flex-direction: column !important;
                gap: 15px !important;
            }
            
            .titulo-width,
            .tempo-width,
            .porcoes-width {
                flex: 1 1 100% !important;
                width: 100% !important;
            }
            
            .form-group {
                margin-bottom: 20px !important;
            }
            
            .form-group label {
                font-size: 1rem !important;
                margin-bottom: 8px !important;
            }
            
            .form-group label i {
                font-size: 1rem !important;
                width: 20px !important;
            }
            
            .form-control {
                padding: 12px 15px !important;
                font-size: 0.95rem !important;
            }
            
            textarea.form-control {
                min-height: 100px !important;
            }
            
            .file-input-label {
                padding: 12px 15px !important;
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 10px !important;
            }
            
            .file-input-text {
                font-size: 0.9rem !important;
            }
            
            .file-input-button {
                padding: 6px 12px !important;
                font-size: 0.85rem !important;
                align-self: flex-start !important;
            }
            
            .image-preview img {
                max-height: 180px !important;
            }
            
            #addIngrediente,
            #addPasso {
                padding: 8px 15px !important;
                font-size: 0.9rem !important;
                width: 100% !important;
                margin-top: 15px !important;
                text-align: center !important;
            }
            
            .ingrediente-item input,
            .passo-item input {
                padding: 10px 35px 10px 12px !important;
                font-size: 0.95rem !important;
                margin-bottom: 8px !important;
            }
            
            .input-wrapper .remove-btn {
                right: 8px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                font-size: 16px !important;
                padding: 3px 6px !important;
                min-width: 26px !important;
                min-height: 26px !important;
            }
            
            .submit-button {
                padding: 15px !important;
                font-size: 1.1rem !important;
                margin-top: 15px !important;
            }
            
            .button-icon {
                margin-right: 8px !important;
            }
            
            .char-count {
                font-size: 0.8rem !important;
            }
            
            .error-message {
                font-size: 0.8rem !important;
            }
            
            /* Ajuste para iOS */
            @supports (-webkit-touch-callout: none) {
                .form-control {
                    font-size: 16px !important; /* Evita zoom automático no iOS */
                }
                
                input[type="text"],
                input[type="number"],
                textarea {
                    font-size: 16px !important;
                }
            }
        }
        
        /* Dispositivos pequenos (celulares, 481px a 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
            .form-container {
                margin: 30px auto !important;
                padding: 0 20px !important;
            }
            
            .form-header h1 {
                font-size: 2.2rem !important;
            }
            
            .form-subtitle {
                font-size: 1rem !important;
            }
            
            .recipe-form {
                padding: 30px 25px !important;
            }
            
            .form-row {
                flex-direction: column !important;
                gap: 20px !important;
            }
            
            .titulo-width,
            .tempo-width,
            .porcoes-width {
                flex: 1 1 100% !important;
            }
            
            .form-group label {
                font-size: 1.05rem !important;
            }
            
            .form-control {
                padding: 14px 18px !important;
            }
            
            .file-input-label {
                padding: 14px 18px !important;
            }
            
            #addIngrediente,
            #addPasso {
                padding: 10px 20px !important;
                font-size: 0.95rem !important;
            }
            
            .ingrediente-item input,
            .passo-item input {
                padding: 12px 40px 12px 15px !important;
            }
            
            .submit-button {
                padding: 16px !important;
            }
        }
        
        /* Dispositivos médios (tablets, 769px a 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
            .form-container {
                margin: 35px auto !important;
                padding: 0 25px !important;
                max-width: 700px !important;
            }
            
            .recipe-form {
                padding: 35px 30px !important;
            }
            
            .form-header h1 {
                font-size: 2.5rem !important;
            }
            
            .form-row {
                gap: 15px !important;
            }
            
            .form-control {
                padding: 14px 18px !important;
            }
        }
        
        /* Dispositivos grandes (desktops pequenos, 1025px a 1200px) */
        @media (min-width: 1025px) and (max-width: 1200px) {
            .form-container {
                max-width: 750px !important;
            }
        }
        
        /* Ajustes gerais para todos os dispositivos móveis */
        @media (max-width: 768px) {
            body {
                padding: 0 !important;
                min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
            }
            
            .form-container {
                width: 100% !important;
            }
            
            .recipe-form::before {
                height: 4px !important;
            }
            
            /* Melhorias para formulários em mobile */
            input[type="text"],
            input[type="number"],
            textarea,
            select {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                border-radius: 8px !important;
            }
            
            /* Evitar zoom em inputs no iOS */
            @media (max-width: 767px) {
                input[type="text"],
                input[type="number"],
                textarea,
                select {
                    font-size: 16px !important;
                }
            }
        }
        
        /* Ajustes para orientação paisagem em dispositivos móveis */
        @media (max-width: 768px) and (orientation: landscape) {
            .form-container {
                margin: 15px auto !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
            }
            
            .recipe-form {
                padding: 20px !important;
                max-height: calc(90vh - 100px) !important;
                overflow-y: auto !important;
            }
            
            .form-row {
                flex-direction: row !important;
                flex-wrap: wrap !important;
            }
            
            .titulo-width {
                flex: 1 1 100% !important;
            }
            
            .tempo-width,
            .porcoes-width {
                flex: 1 1 calc(50% - 10px) !important;
            }
            
            .image-preview img {
                max-height: 150px !important;
            }
        }
        
        /* Otimização para tablets em modo retrato */
        @media (min-width: 600px) and (max-width: 900px) and (orientation: portrait) {
            .form-container {
                max-width: 600px !important;
            }
            
            .form-row {
                flex-direction: column !important;
            }
            
            .form-control {
                padding: 15px 20px !important;
            }
        }
        
        /* Ajustes para telas muito grandes */
        @media (min-width: 1400px) {
            .form-container {
                max-width: 850px !important;
            }
        }
        
        /* Ajustes para impressão */
        @media print {
            .form-container {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
            }
            
            .back-link,
            .file-input-container,
            .image-preview,
            #addIngrediente,
            #addPasso,
            .submit-button,
            .remove-btn {
                display: none !important;
            }
            
            .recipe-form {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                padding: 20px !important;
            }
            
            .recipe-form::before {
                display: none !important;
            }
            
            .form-control {
                border: 1px solid #999 !important;
                background: transparent !important;
            }
            
            .form-control:focus {
                box-shadow: none !important;
            }
            
            .form-group {
                break-inside: avoid !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
        }
        
        /* Melhorias de acessibilidade para toque */
        @media (hover: none) and (pointer: coarse) {
            .form-control,
            #addIngrediente,
            #addPasso,
            .submit-button,
            .back-link,
            .file-input-label {
                min-height: 44px !important;
            }
            
            .ingrediente-item input,
            .passo-item input {
                min-height: 44px !important;
                line-height: 1.4 !important;
            }
            
            .input-wrapper .remove-btn {
                min-width: 44px !important;
                min-height: 44px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .file-input-label {
                padding: 15px 20px !important;
            }
            
            /* Aumentar área de toque para labels */
            .form-group label {
                padding: 5px 0 !important;
            }
        }
        
        /* Suporte para modo escuro */
        @media (prefers-color-scheme: dark) {
            @media (max-width: 768px) {
                .recipe-form {
                    background: #2c2c2c !important;
                    color: #f0f0f0 !important;
                }
                
                .form-control {
                    background: #3c3c3c !important;
                    color: #f0f0f0 !important;
                    border-color: #555 !important;
                }
                
                .form-group label {
                    color: #e67e22 !important;
                }
                
                .file-input-label {
                    background: #3c3c3c !important;
                    border-color: #555 !important;
                }
                
                .file-input-text {
                    color: #b0b0b0 !important;
                }
                
                .form-header h1 {
                    color: #e67e22 !important;
                }
                
                .form-subtitle {
                    color: #b0b0b0 !important;
                }
                
                .back-link {
                    color: #e67e22 !important;
                }
                
                .submit-button {
                    background: #e67e22 !important;
                }
                
                .submit-button:hover {
                    background: #d35400 !important;
                }
            }
        }
        
        /* Ajustes para navegadores específicos */
        @supports (-webkit-overflow-scrolling: touch) {
            /* Safari iOS */
            .form-container {
                -webkit-overflow-scrolling: touch !important;
            }
        }
        
        /* Corrigir altura segura para dispositivos com notch */
        @supports (padding: max(0px)) {
            body {
                padding-left: max(15px, env(safe-area-inset-left)) !important;
                padding-right: max(15px, env(safe-area-inset-right)) !important;
                padding-top: max(0px, env(safe-area-inset-top)) !important;
                padding-bottom: max(0px, env(safe-area-inset-bottom)) !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Função para ajustar dinamicamente o formulário
function adjustFormLayoutForScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    // Ajustar container principal
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        if (width <= 480) {
            formContainer.style.padding = '0 15px';
            formContainer.style.margin = '20px auto';
        } else if (width <= 768) {
            formContainer.style.padding = '0 20px';
            formContainer.style.margin = '30px auto';
        } else {
            formContainer.style.padding = '0';
            formContainer.style.margin = '40px auto';
        }
        
        // Ajustar para orientação paisagem em mobile
        if (width <= 768 && isLandscape) {
            formContainer.style.maxHeight = '90vh';
            formContainer.style.overflowY = 'auto';
        }
    }
    
    // Ajustar layout do form-row
    const formRow = document.querySelector('.form-row');
    if (formRow) {
        if (width <= 768) {
            formRow.style.flexDirection = 'column';
        } else {
            formRow.style.flexDirection = 'row';
        }
    }
    
    // Ajustar tamanho da fonte do título
    const formTitle = document.querySelector('.form-header h1');
    if (formTitle) {
        if (width <= 480) {
            formTitle.style.fontSize = '1.8rem';
        } else if (width <= 768) {
            formTitle.style.fontSize = '2.2rem';
        } else if (width <= 1024) {
            formTitle.style.fontSize = '2.5rem';
        } else {
            formTitle.style.fontSize = '2.8rem';
        }
    }
    
    // Otimizar para touch em dispositivos móveis
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        const touchElements = document.querySelectorAll('.form-control, #addIngrediente, #addPasso, .submit-button, .back-link');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
        });
        
        // Ajustar botões de remover
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(btn => {
            btn.style.minWidth = '44px';
            btn.style.minHeight = '44px';
        });
    }
    
    // Ajustar padding do formulário
    const recipeForm = document.querySelector('.recipe-form');
    if (recipeForm) {
        if (width <= 480) {
            recipeForm.style.padding = '20px 15px';
        } else if (width <= 768) {
            recipeForm.style.padding = '30px 25px';
        } else {
            recipeForm.style.padding = '40px';
        }
    }
}

// Inicializar a responsividade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveStylesForm();
    adjustFormLayoutForScreenSize();
    
    // Reajustar quando a janela for redimensionada
    window.addEventListener('resize', adjustFormLayoutForScreenSize);
    
    // Reaplicar estilos se necessário
    window.addEventListener('load', applyResponsiveStylesForm);
    
    // Otimizar para dispositivos móveis
    optimizeFormForMobile();
});

// Detectar dispositivo e otimizar formulário
function optimizeFormForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-form-view');
        
        // Adicionar classe para ajustes específicos
        const form = document.getElementById('recipeForm');
        if (form) {
            form.classList.add('mobile-optimized-form');
        }
        
        // Prevenir zoom em inputs no iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.style.fontSize = '16px';
                });
            });
        }
    } else {
        document.body.classList.add('desktop-form-view');
    }
}

// Adicionar listener para mudanças de orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        adjustFormLayoutForScreenSize();
        optimizeFormForMobile();
    }, 100);
});

// Função para melhorar a experiência de entrada em dispositivos móveis
function enhanceMobileInputExperience() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Focar no primeiro campo ao carregar
        const firstInput = document.querySelector('.form-control');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 300);
        }
        
        // Suavizar rolagem ao focar em campos
        const formControls = document.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }
}

// Executar otimizações
enhanceMobileInputExperience();

// Prevenir envio do formulário em orientação paisagem em mobile (opcional)
function preventSubmitInLandscape() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width <= 768 && width > height) {
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                if (confirm('Para melhor experiência, recomendamos enviar o formulário em orientação retrato. Deseja continuar mesmo assim?')) {
                    return true;
                }
                e.preventDefault();
                return false;
            });
        }
    }
}

// Executar prevenção se necessário
preventSubmitInLandscape();