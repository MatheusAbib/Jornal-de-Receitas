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
                width: 95% !important;
                max-width: 95% !important;
                margin: 10px !important;
                padding: 0 !important;
            }
            
            .modal-header h3 {
                font-size: 1.3rem !important;
            }
            
            .modal-message {
                font-size: 0.95rem !important;
                margin-bottom: 20px !important;
            }
            
            .modal-actions {
                flex-direction: column !important;
                gap: 10px !important;
            }
            
            .modal-button {
                width: 100% !important;
                padding: 10px 15px !important;
                min-width: auto !important;
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
                width: 90% !important;
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
            
            .modal-header h3 {
                font-size: 1.5rem !important;
            }
            
            .modal-body {
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
