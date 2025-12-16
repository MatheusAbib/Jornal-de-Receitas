     // Toggle de senha aprimorado
    function togglePassword(inputId) {
      const input = document.getElementById(inputId);
      const icon = input.nextElementSibling.querySelector('i');
      
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

    // Máscaras
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function() {
      let v = this.value.replace(/\D/g, '');
      if(v.length > 3) v = v.slice(0,3) + '.' + v.slice(3);
      if(v.length > 7) v = v.slice(0,7) + '.' + v.slice(7);
      if(v.length > 11) v = v.slice(0,11) + '-' + v.slice(11,13);
      this.value = v;
    });

    const telInput = document.getElementById('telefone');
    telInput.addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'');
      if(v.length > 0) v = '(' + v;
      if(v.length > 3) v = v.slice(0,3) + ') ' + v.slice(3);
      if(v.length > 9) v = v.slice(0,9) + '-' + v.slice(9,14);
      this.value = v;
    });

    // Validação em tempo real
    function showError(fieldId, message) {
      const errorDiv = document.getElementById(fieldId + 'Error');
      errorDiv.querySelector('span').textContent = message;
      errorDiv.style.display = 'flex';
      document.getElementById(fieldId).parentElement.parentElement.classList.add('error');
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('success');
    }

    function showSuccess(fieldId) {
      const errorDiv = document.getElementById(fieldId + 'Error');
      errorDiv.style.display = 'none';
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('error');
      document.getElementById(fieldId).parentElement.parentElement.classList.add('success');
    }

    function clearValidation(fieldId) {
      const errorDiv = document.getElementById(fieldId + 'Error');
      errorDiv.style.display = 'none';
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('error');
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('success');
    }

    // Validações específicas
    document.getElementById('nome').addEventListener('blur', function() {
      if(this.value.length < 3) {
        showError('nome', 'Nome deve ter pelo menos 3 caracteres');
      } else if(this.value.length > 100) {
        showError('nome', 'Nome muito longo (máx. 100 caracteres)');
      } else {
        showSuccess('nome');
      }
    });

    document.getElementById('email').addEventListener('blur', function() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(this.value)) {
        showError('email', 'Email inválido');
      } else {
        showSuccess('email');
      }
    });

    document.getElementById('cpf').addEventListener('blur', function() {
      const cpf = this.value.replace(/\D/g, '');
      if(cpf.length !== 11) {
        showError('cpf', 'CPF deve ter 11 dígitos');
      } else {
        showSuccess('cpf');
      }
    });

    document.getElementById('senha').addEventListener('input', function() {
      if(this.value.length < 6) {
        showError('senha', 'Senha deve ter pelo menos 6 caracteres');
      } else {
        showSuccess('senha');
      }
      
      // Atualiza validação da confirmação
      const confirmarSenha = document.getElementById('confirmarSenha').value;
      if(confirmarSenha) {
        validatePasswordMatch();
      }
    });

    document.getElementById('confirmarSenha').addEventListener('input', validatePasswordMatch);

    function validatePasswordMatch() {
      const senha = document.getElementById('senha').value;
      const confirmarSenha = document.getElementById('confirmarSenha').value;
      
      if(confirmarSenha && senha !== confirmarSenha) {
        showError('confirmarSenha', 'As senhas não coincidem');
      } else if(confirmarSenha) {
        showSuccess('confirmarSenha');
      }
    }

    // Validação do formulário
    document.getElementById('cadastroForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Limpa validações anteriores
      ['nome', 'email', 'cpf', 'telefone', 'genero', 'senha', 'confirmarSenha'].forEach(clearValidation);
      
      let isValid = true;
      const alertBox = document.getElementById('alertBox');
      alertBox.style.display = 'none';
      
      // Validações básicas
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
      const senha = document.getElementById('senha').value;
      const confirmarSenha = document.getElementById('confirmarSenha').value;
      const genero = document.getElementById('genero').value;
      
      if(nome.length < 3) {
        showError('nome', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)) {
        showError('email', 'Email inválido');
        isValid = false;
      }
      
      if(cpf.length !== 11) {
        showError('cpf', 'CPF deve ter 11 dígitos');
        isValid = false;
      }
      
      if(!genero) {
        showError('genero', 'Selecione um gênero');
        isValid = false;
      }
      
      if(senha.length < 6) {
        showError('senha', 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
      }
      
      if(senha !== confirmarSenha) {
        showError('confirmarSenha', 'As senhas não coincidem');
        isValid = false;
      }
      
      if(!isValid) {
        alertBox.querySelector('#alertMessage').textContent = 'Por favor, corrija os erros no formulário.';
        alertBox.className = 'alert alert-error';
        alertBox.style.display = 'flex';
        alertBox.classList.add('shake');
        setTimeout(() => alertBox.classList.remove('shake'), 500);
        return;
      }
      
      // Se tudo estiver válido, envia o formulário
      this.submit();
    });

    // Mensagem do servidor
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const alertBox = document.getElementById('alertBox');

    if(success) {
      alertBox.querySelector('#alertMessage').textContent = decodeURIComponent(success);
      alertBox.className = 'alert alert-success';
      alertBox.style.display = 'flex';
      
      // Redireciona após 3 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }

    if(error) {
      alertBox.querySelector('#alertMessage').textContent = decodeURIComponent(error);
      alertBox.className = 'alert alert-error';
      alertBox.style.display = 'flex';
    }

    
    // Responsividade para página de Cadastro
function applyResponsiveStylesCadastro() {
    // Verifica se já existe o estilo de responsividade
    if (document.getElementById('responsive-styles-cadastro')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-styles-cadastro';
    style.innerHTML = `
        /* RESPONSIVIDADE PARA PÁGINA DE CADASTRO */
        
        /* Dispositivos muito pequenos (celulares, até 480px) */
        @media (max-width: 480px) {

            
            .header-full-width {
                margin-bottom: 20px !important;
            }
            
            .header-container {
                padding: 15px 10px !important;
            }
            
            .newspaper-title {
                font-size: 1.8rem !important;
                padding: 0 10px !important;
                letter-spacing: 1px !important;
            }
            
            .newspaper-title::before,
            .newspaper-title::after {
                font-size: 1.2rem !important;
                display: none !important;
            }
            
            .newspaper-subtitle {
                font-size: 0.9rem !important;
                padding: 0 10px !important;
                line-height: 1.4 !important;
            }
            
            .back-link-container {
                padding: 0 15px 15px 15px !important;
                max-width: 100% !important;
              }
              
              .back-link {
                font-size: 0.9rem !important;
                padding: 8px 12px !important;
              }
            
            .container {
                padding: 20px 15px !important;
                margin: 0 10px 20px !important;
                border-radius: 12px !important;
                max-width: 100% !important;
                width: calc(100% - 20px) !important;
            }
            
            .form-header h1 {
                font-size: 1.6rem !important;
            }
            
            .form-header::after {
                width: 60px !important;
            }
            
            .form-row {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
                margin-bottom: 10px !important;
            }
            
            .form-group {
                margin-bottom: 15px !important;
            }
            
            .form-group label {
                font-size: 0.9rem !important;
                margin-bottom: 8px !important;
            }
            
            .form-control {
                padding: 12px 15px 12px 20px !important;
                font-size: 0.95rem !important;
                border-radius: 8px !important;
            }
            
            .input-icon i {
                left: 12px !important;
                font-size: 1rem !important;
            }
            
            select.form-control {
                padding-right: 35px !important;
                background-position: right 12px center !important;
            }
            
            .password-toggle {
                right: 12px !important;
                font-size: 1rem !important;
            }
            
            .btn {
                padding: 14px !important;
                font-size: 1rem !important;
                margin-top: 15px !important;
                border-radius: 8px !important;
            }
            
            .alert {
                padding: 15px !important;
                margin-bottom: 20px !important;
                font-size: 0.9rem !important;
            }
            
            .login-link {
                margin-top: 20px !important;
                padding-top: 15px !important;
                font-size: 0.9rem !important;
            }
            
            .form-error {
                font-size: 0.8rem !important;
                margin-top: 5px !important;
            }
            
            /* Ajuste para iOS para evitar zoom automático */
            @supports (-webkit-touch-callout: none) {
                .form-control {
                    font-size: 16px !important;
                }
            }
        }
        
        /* Dispositivos pequenos (celulares, 481px a 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
            body {
                padding: 20px 15px !important;
            }
            
            .newspaper-title {
                font-size: 2.2rem !important;
            }
            
            .newspaper-subtitle {
                font-size: 1rem !important;
            }
            
            .back-link-container {
                padding: 0 20px 15px 20px !important;
                max-width: calc(100% - 30px) !important;
              }
            
            .container {
                padding: 25px 20px !important;
                margin: 0 15px !important;
                max-width: calc(100% - 30px) !important;
            }
            
            .form-header h1 {
                font-size: 1.8rem !important;
            }
            
            .form-row {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
            }
            
            .form-control {
                padding: 13px 15px 13px 45px !important;
            }
            
            .btn {
                padding: 15px !important;
            }
        }
        
        /* Dispositivos médios (tablets, 769px a 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
            body {
                padding: 30px 20px !important;
            }
            
            .container {
                max-width: 700px !important;
            }
            
            .form-row {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            /* Última linha com 1 coluna (senhas) */
            .form-row:last-of-type {
                grid-template-columns: repeat(2, 1fr) !important;
            }

              .back-link-container {
              max-width: 700px !important;
            }
        }
        
        /* Dispositivos grandes (desktops pequenos, 1025px a 1200px) */
        @media (min-width: 1025px) and (max-width: 1200px) {
            .container {
                max-width: 800px !important;
            }

            .back-link-container {
              max-width: 800px !important;
            }
        }
        
        /* Ajustes gerais para todos os dispositivos móveis */
        @media (max-width: 768px) {
            body::before {
                background-size: 15px 15px !important;
            }
            
            .container::before {
                height: 3px !important;
            }
            
            /* Melhorias para formulários em mobile */
            input[type="text"],
            input[type="email"],
            input[type="password"],
            select {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                border-radius: 8px !important;
            }
            
            /* Evitar zoom em inputs no iOS */
            @media (max-width: 767px) {
                input[type="text"],
                input[type="email"],
                input[type="password"],
                select {
                    font-size: 16px !important;
                }
            }
            
            /* Remover animações complexas em mobile para melhor performance */
            .btn:hover {
                transform: none !important;
            }
            
            .form-control:focus::before {
                display: none !important;
            }
        }
        
        /* Ajustes para orientação paisagem em dispositivos móveis */
        @media (max-width: 768px) and (orientation: landscape) {
            body {
                padding: 15px !important;
                min-height: auto !important;
            }
            
            .container {
                max-height: 90vh !important;
                overflow-y: auto !important;
                margin: 10px auto !important;
            }
            
            .form-row {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 15px !important;
            }
            
            .form-row:last-of-type {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .newspaper-title {
                font-size: 1.6rem !important;
            }
            
            .back-link {
                margin: 10px 0 !important;
            }
        }
        
        /* Otimização para tablets em modo retrato */
        @media (min-width: 600px) and (max-width: 900px) and (orientation: portrait) {
            .container {
                max-width: 550px !important;
            }
            
            .form-row {
                grid-template-columns: 1fr !important;
            }
            
            .form-control {
                padding: 15px 15px 15px 45px !important;
            }
        }
        
        /* Ajustes para impressão */
        @media print {
            body {
                background: white !important;
                color: black !important;
                padding: 20px !important;
            }
            
            .header-full-width,
            .back-link,
            .btn,
            .login-link,
            .password-toggle,
            .form-error,
            .alert {
                display: none !important;
            }
            
            .container {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                padding: 20px !important;
                margin: 0 !important;
                max-width: 100% !important;
            }
            
            .container::before {
                display: none !important;
            }
            
            .form-control {
                border: 1px solid #999 !important;
                background: transparent !important;
                color: black !important;
            }
            
            .form-control:focus {
                box-shadow: none !important;
            }
            
            select.form-control {
                background-image: none !important;
            }
            
            .newspaper-title {
                color: black !important;
                text-shadow: none !important;
                font-size: 2rem !important;
            }
            
            .newspaper-subtitle {
                color: #666 !important;
            }
            
            .form-header h1 {
                color: black !important;
            }
        }
        
        /* Melhorias de acessibilidade para toque */
        @media (hover: none) and (pointer: coarse) {
            .form-control,
            .btn,
            .back-link,
            .password-toggle,
            select.form-control {
                min-height: 44px !important;
            }
            
            .form-group label {
                padding: 5px 0 !important;
            }
            
            .btn {
                padding: 15px 20px !important;
            }
            
            .form-control {
                padding: 14px 15px 14px 20px !important;
                line-height: 1.4 !important;
            }
            
            select.form-control {
                line-height: normal !important;
            }
            
            /* Aumentar área de toque para checkboxes (se houver) */
            input[type="checkbox"],
            input[type="radio"] {
                min-width: 20px !important;
                min-height: 20px !important;
            }
        }
        
        /* Suporte para modo escuro */
        @media (prefers-color-scheme: dark) {
            @media (max-width: 768px) {
                body {
                    background: #1a1a1a !important;
                    color: #f0f0f0 !important;
                }
                
                .container {
                    background: #2a2a2a !important;
                    border-color: #444 !important;
                }
                
                .newspaper-title {
                    color: #f0f0f0 !important;
                }
                
                .newspaper-subtitle {
                    color: #b0b0b0 !important;
                }
                
                .form-header h1 {
                    color: #e67e22 !important;
                }
                
                .form-group label {
                    color: #e67e22 !important;
                }
                
                .form-control {
                    background: #333 !important;
                    color: #f0f0f0 !important;
                    border-color: #555 !important;
                }
                
                .form-control::placeholder {
                    color: #999 !important;
                }
                
                .btn {
                    background: linear-gradient(135deg, #e67e22, #d35400) !important;
                }
                
                .back-link {
                    color: #e67e22 !important;
                }
                
                .login-link {
                    color: #b0b0b0 !important;
                }
                
                .login-link a {
                    color: #e67e22 !important;
                }
                
                .alert {
                    background: rgba(46, 204, 113, 0.2) !important;
                    color: #2ecc71 !important;
                }
                
                .alert-error {
                    background: rgba(231, 76, 60, 0.2) !important;
                    color: #e74c3c !important;
                }
                
                .form-error {
                    color: #e74c3c !important;
                }
            }
        }
        
        /* Ajustes para navegadores específicos */
        @supports (-webkit-overflow-scrolling: touch) {
            /* Safari iOS */
            .container {
                -webkit-overflow-scrolling: touch !important;
            }
        }
        
        /* Corrigir altura segura para dispositivos com notch */
        @supports (padding: max(0px)) {
            body {
                padding-left: max(10px, env(safe-area-inset-left)) !important;
                padding-right: max(10px, env(safe-area-inset-right)) !important;
                padding-top: max(0px, env(safe-area-inset-top)) !important;
                padding-bottom: max(60px, env(safe-area-inset-bottom)) !important;
            }
            
            .header-full-width {
                padding-top: max(0px, env(safe-area-inset-top)) !important;
            }
        }
        
        
        /* Ajustes para animações reduzidas */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .btn:hover,
            .back-link:hover,
            .login-link a:hover {
                transform: none !important;
            }
        }
        
        /* Layout específico para telas muito estreitas */
        @media (max-width: 360px) {
            .newspaper-title {
                font-size: 1.6rem !important;
            }
            
            .newspaper-subtitle {
                font-size: 0.85rem !important;
            }
            
            .form-control {
                padding: 10px 12px 10px 35px !important;
                font-size: 0.9rem !important;
            }
            
            .input-icon i {
                left: 10px !important;
                font-size: 0.9rem !important;
            }
            
            .password-toggle {
                right: 10px !important;
                font-size: 0.9rem !important;
            }
            
            .btn {
                padding: 12px !important;
                font-size: 0.95rem !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Função para ajustar dinamicamente o layout do cadastro
function adjustCadastroLayoutForScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    // Ajustar container principal
    const container = document.querySelector('.container');
    if (container) {
        if (width <= 480) {
            container.style.padding = '20px 15px';
            container.style.margin = '0 10px 20px';
            container.style.maxWidth = '100%';
            container.style.width = 'calc(100% - 20px)';
        } else if (width <= 768) {
            container.style.padding = '25px 20px';
            container.style.margin = '0 15px';
            container.style.maxWidth = 'calc(100% - 30px)';
        } else if (width <= 1024) {
            container.style.maxWidth = '700px';
        } else if (width <= 1200) {
            container.style.maxWidth = '800px';
        } else {
            container.style.maxWidth = '900px';
        }
        
        // Ajuste para paisagem em mobile
        if (width <= 768 && isLandscape) {
            container.style.maxHeight = '90vh';
            container.style.overflowY = 'auto';
        }
    }
    
    // Ajustar grid dos formulários
    const formRows = document.querySelectorAll('.form-row');
    formRows.forEach((row, index) => {
        if (width <= 480) {
            row.style.gridTemplateColumns = '1fr';
        } else if (width <= 768) {
            row.style.gridTemplateColumns = '1fr';
        } else if (width <= 1024) {
            // Em tablets, manter 2 colunas exceto para senhas
            if (index === formRows.length - 1) {
                row.style.gridTemplateColumns = '1fr';
            } else {
                row.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }
        } else {
            row.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        }
        
        // Paisagem em mobile
        if (width <= 768 && isLandscape) {
            row.style.gridTemplateColumns = 'repeat(2, 1fr)';
        }
    });
    
    // Ajustar link de voltar
    const backLink = document.querySelector('.back-link');
    if (backLink) {
    }
    

    // Otimizar para touch
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        const touchElements = document.querySelectorAll('.form-control, .btn, .back-link, select.form-control');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
        });
        
        // Ajustar inputs para evitar zoom no iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && width <= 768) {
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
            inputs.forEach(input => {
                input.style.fontSize = '16px';
            });
        }
    }
    
    // Reduzir animações se preferido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

// Inicializar a responsividade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveStylesCadastro();
    adjustCadastroLayoutForScreenSize();
    
    // Reajustar quando a janela for redimensionada
    window.addEventListener('resize', adjustCadastroLayoutForScreenSize);
    
    // Reaplicar estilos se necessário
    window.addEventListener('load', applyResponsiveStylesCadastro);
    
    // Configurar formulário para mobile
    setupMobileForm();
});

// Detectar dispositivo e otimizar
function optimizeCadastroForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-cadastro-view');
        
        // Simplificar animações para melhor performance
        const animatedElements = document.querySelectorAll('.btn, .form-control');
        animatedElements.forEach(el => {
            el.style.transition = 'all 0.2s ease';
        });
        
        // Focar no primeiro campo automaticamente (com cuidado)
        setTimeout(() => {
            const firstInput = document.querySelector('#nome');
            if (firstInput && !document.querySelector('#alertBox.success')) {
                firstInput.focus();
            }
        }, 500);
    } else {
        document.body.classList.add('desktop-cadastro-view');
    }
}

// Executar otimizações
optimizeCadastroForMobile();

// Adicionar listener para mudanças de orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        adjustCadastroLayoutForScreenSize();
        optimizeCadastroForMobile();
        setupMobileForm();
    }, 100);
});

// Configurar formulário para melhor experiência mobile
function setupMobileForm() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Adicionar suporte a rolagem suave para campos
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
        
        // Melhorar validação visual para mobile
        const form = document.getElementById('cadastroForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                // Adicionar feedback tátil
                const submitBtn = this.querySelector('.btn');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                }
            });
        }
    }
}

// Função para melhorar a experiência dos inputs em mobile
function enhanceMobileInputExperience() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Adicionar máscara de CPF com melhor suporte mobile
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    this.value = value;
                }
            });
        }
        
        // Adicionar máscara de telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                
                if (value.length <= 11) {
                    if (value.length > 2) {
                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                    }
                    if (value.length > 10) {
                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    } else if (value.length > 6) {
                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    }
                    this.value = value;
                }
            });
        }
        
        // Prevenir envio do formulário em orientação paisagem (opcional)
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width <= 768 && width > height) {
            const submitBtn = document.querySelector('.btn[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                
                submitBtn.addEventListener('click', function(e) {
                    if (width > height) {
                        if (confirm('Para melhor experiência, recomendamos preencher o formulário em orientação retrato. Deseja continuar mesmo assim?')) {
                            return true;
                        }
                        e.preventDefault();
                        return false;
                    }
                });
            }
        }
    }
}

// Executar melhorias de inputs
enhanceMobileInputExperience();

// Função para criar notificação mobile-friendly
function createMobileNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.parentNode.insertBefore(notification, alertBox.nextSibling);
        
        // Ajustar estilo para mobile
        const width = window.innerWidth;
        if (width <= 480) {
            notification.style.margin = '15px 0';
            notification.style.fontSize = '0.9rem';
        }
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remover após alguns segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

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
      
      setTimeout(typeTitle, 10);
    }