  function confirmAction(action, button) {
      event.preventDefault();
      const form = button.closest('form');
      const formAction = form.getAttribute('action');
      
      if (action === 'approve') {
        document.getElementById('approveForm').setAttribute('action', formAction);
        openModal('approveModal');
      } else if (action === 'reject') {
        document.getElementById('rejectForm').setAttribute('action', formAction);
        openModal('rejectModal');
      }
      
      return false;
    }
    
    // Abrir modal
    function openModal(modalId) {
      document.getElementById(modalId).classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Fechar modal
    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    
    // Fechar modal ao clicar fora dele
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });
    
    // Adicionar animações de entrada para os cards
    document.addEventListener('DOMContentLoaded', function() {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
      });
    });
    
    // Função para toggle da sidebar
    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('show');
    }
    
    // Fechar sidebar ao clicar fora dela
    document.addEventListener('click', function(event) {
      const sidebar = document.getElementById('sidebar');
      const menuIcon = document.querySelector('.menu-icon');
      
      if (!sidebar.contains(event.target) && !menuIcon.contains(event.target) && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }
    });

    // Responsividade para página de Receitas Pendentes
function applyResponsiveStylesPendentes() {
    // Verifica se já existe o estilo de responsividade
    if (document.getElementById('responsive-styles-pendentes')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-styles-pendentes';
    style.innerHTML = `
        /* RESPONSIVIDADE PARA PÁGINA DE RECEITAS PENDENTES */
        
        /* Dispositivos muito pequenos (celulares, até 480px) */
        @media (max-width: 480px) {
            .header-container {
                padding: 10px 15px !important;
            }
            
            .page-header h1 {
                font-size: 1.8rem !important;
                padding: 0 10px;
            }
            
            .page-header h1::before,
            .page-header h1::after {
                font-size: 1.2rem !important;
            }
            
            .page-header h1::before {
                left: -15px !important;
            }
            
            .page-header h1::after {
                right: -15px !important;
            }
            
            .page-subtitle {
                font-size: 0.9rem !important;
                padding: 0 15px;
            }
            
            .back-link {
                font-size: 0.9rem;
                padding: 8px 0;
                margin-bottom: 15px;
            }
            
            .receitas-container {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
                margin: 20px 0 !important;
            }
            
            .card {
                margin-bottom: 15px;
            }
            
            .card-image {
                height: 150px !important;
            }
            
            .card-content {
                padding: 15px !important;
            }
            
            .card h2 {
                font-size: 1.3rem !important;
                margin-bottom: 10px !important;
            }
            
            .card p {
                font-size: 0.9rem !important;
                margin-bottom: 15px !important;
            }
            
            .card-badge {
                font-size: 0.8rem !important;
                padding: 5px 10px !important;
                top: 10px !important;
                right: 10px !important;
            }
            
            .card-actions {
                gap: 8px !important;
            }
            
            .action-row {
                flex-direction: column !important;
                gap: 8px !important;
            }
            
            .card-link,
            .approve-button,
            .reject-button {
                padding: 10px 15px !important;
                font-size: 0.9rem !important;
                width: 100% !important;
                justify-content: center !important;
            }
            
            .empty-state {
                padding: 40px 15px !important;
            }
            
            .empty-state i {
                font-size: 3rem !important;
            }
            
            .empty-state h2 {
                font-size: 1.4rem !important;
            }
            
            .empty-state p {
                font-size: 0.9rem !important;
                margin-bottom: 20px !important;
            }
            
            .back-button {
                padding: 10px 20px !important;
                font-size: 0.9rem !important;
            }
            
            .modal-content {
                padding: 20px 15px !important;
                margin: 0 10px !important;
                max-width: 100% !important;
            }
            
            .modal h3 {
                font-size: 1.4rem !important;
            }
            
            .modal p {
                font-size: 0.9rem !important;
                margin-bottom: 20px !important;
            }
            
            .modal-actions {
                flex-direction: column !important;
                gap: 10px !important;
            }
            
            .modal-button {
                width: 100% !important;
                padding: 10px 15px !important;
            }
            
            .header-top {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .menu-icon {
                align-self: flex-start;
            }
        }
        
        /* Dispositivos pequenos (celulares, 481px a 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
            .page-header h1 {
                font-size: 2.2rem !important;
            }
            
            .page-subtitle {
                font-size: 1rem !important;
            }
            
            .receitas-container {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 20px !important;
            }
            
            .card-image {
                height: 180px !important;
            }
            
            .card-content {
                padding: 20px !important;
            }
            
            .card h2 {
                font-size: 1.4rem !important;
            }
            
            .card-actions {
                gap: 10px !important;
            }
            
            .action-row {
                flex-wrap: wrap;
            }
            
            .card-link {
                width: 100%;
            }
            
            .approve-button,
            .reject-button {
                flex: 1;
                min-width: 140px;
            }
            
            .modal-content {
                max-width: 450px !important;
            }
        }
        
        /* Dispositivos médios (tablets, 769px a 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
            .receitas-container {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 25px !important;
            }
            
            .card-image {
                height: 180px !important;
            }
            
            .card h2 {
                font-size: 1.5rem !important;
            }
            
            .action-row {
                gap: 10px;
            }
        }
        
        /* Dispositivos grandes (desktops pequenos, 1025px a 1200px) */
        @media (min-width: 1025px) and (max-width: 1200px) {
            .receitas-container {
                grid-template-columns: repeat(3, 1fr) !important;
            }
        }
        
        /* Ajustes gerais para todos os dispositivos móveis */
        @media (max-width: 768px) {
            .page-header {
                margin: 20px 0 30px !important;
            }
            
            .content-wrapper {
                padding: 0 15px !important;
            }
            
            .modal {
                padding: 15px !important;
            }
            
            .modal-content {
                max-width: 90% !important;
            }
            
            .close {
                top: 10px !important;
                right: 10px !important;
                font-size: 1.3rem !important;
            }
            
            .modal-icon {
                font-size: 2.5rem !important;
                margin-bottom: 15px !important;
            }
        }
        
        /* Ajustes para orientação paisagem em dispositivos móveis */
        @media (max-width: 768px) and (orientation: landscape) {
            .receitas-container {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .card-image {
                height: 160px !important;
            }
            
            .page-header h1 {
                font-size: 1.8rem !important;
            }
            
            .modal-content {
                max-width: 80% !important;
                padding: 20px !important;
            }
        }
        
        /* Otimização para tablets em modo retrato */
        @media (min-width: 600px) and (max-width: 900px) and (orientation: portrait) {
            .receitas-container {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .card-image {
                height: 200px !important;
            }
            
            .card-content {
                padding: 20px !important;
            }
        }
        
        /* Ajustes para telas muito grandes */
        @media (min-width: 1400px) {
            body {
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .header-full-width {
                width: 100vw;
            }
            
            .header-container {
                max-width: 1400px;
            }
        }
        
        /* Ajustes para impressão */
        @media print {
            .header-full-width,
            .back-link,
            .card-badge,
            .card-actions,
            .modal,
            .menu-icon,
            .back-button {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
            
            .card {
                break-inside: avoid !important;
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                border-top: 3px solid var(--pending-color) !important;
            }
            
            .card-image img {
                max-height: 150px !important;
            }
            
            .receitas-container {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 15px !important;
            }
        }
        
        /* Melhorias de acessibilidade para toque */
        @media (hover: none) and (pointer: coarse) {
            .card-link,
            .approve-button,
            .reject-button,
            .modal-button {
                padding: 12px 20px !important;
                min-height: 44px !important;
            }
            
            .back-link,
            .back-button {
                padding: 10px !important;
                min-height: 44px !important;
            }
            
            .close {
                min-width: 44px !important;
                min-height: 44px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
        }
        
        /* Suporte para modo escuro */
        @media (prefers-color-scheme: dark) {
            @media (max-width: 768px) {
                .card {
                    background: #2c2c2c !important;
                    color: #f0f0f0 !important;
                }
                
                .card h2 {
                    color: #e67e22 !important;
                }
                
                .card p {
                    color: #b0b0b0 !important;
                }
                
                .empty-state {
                    background: #2c2c2c !important;
                }
                
                .empty-state h2 {
                    color: #e67e22 !important;
                }
                
                .empty-state p {
                    color: #b0b0b0 !important;
                }
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Função para ajustar dinamicamente elementos específicos da página pendentes
function adjustLayoutForScreenSizePendentes() {
    const width = window.innerWidth;
    
    // Ajustar grid de receitas baseado na largura da tela
    const receitasContainer = document.querySelector('.receitas-container');
    if (receitasContainer) {
        if (width <= 480) {
            receitasContainer.style.gridTemplateColumns = '1fr';
            receitasContainer.style.gap = '20px';
        } else if (width <= 768) {
            receitasContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
            receitasContainer.style.gap = '20px';
        } else if (width <= 1024) {
            receitasContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
            receitasContainer.style.gap = '25px';
        } else if (width <= 1200) {
            receitasContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
            receitasContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
        }
    }
    
    // Ajustar altura das imagens
    const cardImages = document.querySelectorAll('.card-image');
    cardImages.forEach(img => {
        if (width <= 480) {
            img.style.height = '150px';
        } else if (width <= 768) {
            img.style.height = '180px';
        } else {
            img.style.height = '200px';
        }
    });
    
    // Ajustar tamanho da fonte do título da página
    const pageTitle = document.querySelector('.page-header h1');
    if (pageTitle) {
        if (width <= 480) {
            pageTitle.style.fontSize = '1.8rem';
        } else if (width <= 768) {
            pageTitle.style.fontSize = '2.2rem';
        } else if (width <= 1024) {
            pageTitle.style.fontSize = '2.5rem';
        } else {
            pageTitle.style.fontSize = '2.8rem';
        }
    }
    
    // Ajustar padding do conteúdo
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        if (width <= 480) {
            contentWrapper.style.padding = '0 15px';
        } else if (width <= 768) {
            contentWrapper.style.padding = '0 20px';
        } else {
            contentWrapper.style.padding = '0 20px';
        }
    }
    
    // Otimizar botões para touch
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        const touchElements = document.querySelectorAll('.card-link, .approve-button, .reject-button, .modal-button');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.padding = '12px 20px';
        });
    }
}

// Inicializar a responsividade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveStylesPendentes();
    adjustLayoutForScreenSizePendentes();
    
    // Reajustar quando a janela for redimensionada
    window.addEventListener('resize', adjustLayoutForScreenSizePendentes);
    
    // Reaplicar estilos se necessário
    window.addEventListener('load', applyResponsiveStylesPendentes);
});

// Detectar dispositivo e adicionar classe para CSS específico
function detectDevicePendentes() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-view');
        
        // Otimizar para touch
        const touchElements = document.querySelectorAll('button, a, input[type="submit"]');
        touchElements.forEach(el => {
            el.classList.add('touch-optimized');
        });
    } else {
        document.body.classList.add('desktop-view');
    }
}

// Executar detecção de dispositivo
detectDevicePendentes();

// Função para melhorar a experiência em dispositivos com tela pequena
function optimizeForSmallScreen() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Simplificar animações para melhor performance
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.transition = 'transform 0.2s ease';
        });
        
        // Otimizar modais
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            modal.style.borderRadius = '8px';
            modal.style.padding = '20px';
        });
    }
}

// Executar otimizações
optimizeForSmallScreen();

// Adicionar listener para mudanças de orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        adjustLayoutForScreenSizePendentes();
        optimizeForSmallScreen();
    }, 100);
});