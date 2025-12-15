    // Script para compartilhar receita
    function shareRecipe() {
      if (navigator.share) {
        navigator.share({
          title: document.querySelector('.recipe-title').textContent,
          text: 'Confira esta receita incrível!',
          url: window.location.href
        });
      } else {
        // Fallback para copiar link
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    }

    // Marcar todos os ingredientes quando clicar no título
    document.querySelector('.section-title').addEventListener('click', function() {
      const checkboxes = document.querySelectorAll('.ingredient-checkbox');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      
      checkboxes.forEach(cb => {
        cb.checked = !allChecked;
      });
    });

    // Efeito de fade in para elementos
    document.addEventListener('DOMContentLoaded', function() {
      const elements = document.querySelectorAll('.slide-up');
      elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
      });
    });

    // Responsividade para página de Detalhes da Receita
function applyResponsiveStylesDetalhe() {
    // Verifica se já existe o estilo de responsividade
    if (document.getElementById('responsive-styles-detalhe')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-styles-detalhe';
    style.innerHTML = `
        
        /* Dispositivos muito pequenos (celulares, até 480px) */
        @media (max-width: 480px) {
            body {
                padding: 15px 10px !important;
            }
            
            .main-container {
                padding: 0 5px !important;
            }
            
            .recipe-title {
                font-size: 2rem !important;
                line-height: 1.2 !important;
                margin-bottom: 10px !important;
                text-align: center !important;
            }
            
            .recipe-title::after {
                left: 20% !important;
                width: 60% !important;
                bottom: -5px !important;
                height: 3px !important;
            }
            
            .recipe-subtitle {
                font-size: 0.9rem !important;
                margin-top: 15px !important;
                padding: 12px 15px !important;
                line-height: 1.5 !important;
            }
            
            .recipe-header {
                margin-bottom: 30px !important;
                padding-top: 10px !important;
            }
            
            .hero-section {
                grid-template-columns: 1fr !important;
                gap: 25px !important;
                margin-bottom: 40px !important;
            }
            
            .recipe-image-wrapper {
                height: 250px !important;
                border-radius: 12px !important;
            }
            
            .image-overlay {
                padding: 15px !important;
                flex-direction: column !important;
                gap: 10px !important;
                align-items: flex-start !important;
            }
            
            .recipe-status {
                font-size: 0.8rem !important;
                padding: 6px 12px !important;
            }
            
            .image-credit {
                font-size: 0.75rem !important;
            }
            
            .info-card {
                padding: 20px !important;
                border-radius: 12px !important;
            }
            
            .info-card-header {
                margin-bottom: 20px !important;
            }
            
            .info-card-header h2 {
                font-size: 1.2rem !important;
            }
            
            .info-grid {
                gap: 12px !important;
            }
            
            .info-item {
                grid-template-columns: 40px 1fr !important;
                gap: 12px !important;
                padding: 15px !important;
            }
            
            .info-icon {
                width: 40px !important;
                height: 40px !important;
                font-size: 1rem !important;
                border-radius: 8px !important;
            }
            
            .info-value {
                font-size: 1rem !important;
            }
            
            .content-section {
                padding: 20px !important;
                margin-bottom: 25px !important;
                border-radius: 12px !important;
            }
            
            .section-header {
                margin-bottom: 20px !important;
                gap: 10px !important;
            }
            
            .section-icon {
                width: 40px !important;
                height: 40px !important;
                font-size: 1.1rem !important;
                border-radius: 8px !important;
            }
            
            .section-title {
                font-size: 1.3rem !important;
            }
            
            .section-count {
                font-size: 0.8rem !important;
                padding: 4px 8px !important;
            }
            
            .ingredients-grid {
                grid-template-columns: 1fr !important;
                gap: 10px !important;
            }
            
            .ingredient-item {
                padding: 15px !important;
                gap: 12px !important;
            }
            
            .ingredient-text {
                font-size: 1rem !important;
            }
            
            .step-item {
                padding: 25px 25px 25px 75px !important;
                margin-bottom: 15px !important;
            }
            
            .step-number {
                width: 45px !important;
                height: 45px !important;
                font-size: 1.1rem !important;
                left: 15px !important;
            }
            
            .step-content {
                font-size: 1rem !important;
                line-height: 1.6 !important;
            }
            
            .action-buttons {
                flex-direction: column !important;
                gap: 12px !important;
                margin-top: 40px !important;
            }
            
            .btn {
                width: 100% !important;
                padding: 12px 20px !important;
                font-size: 1rem !important;
                justify-content: center !important;
            }
            
            .decoration-leaf {
                font-size: 2.5rem !important;
                display: none !important;
            }
        }
        
        /* Dispositivos pequenos (celulares, 481px a 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
            body {
                padding: 20px 15px !important;
            }
            
            .recipe-title {
                font-size: 2.5rem !important;
            }
            
            .recipe-subtitle {
                font-size: 1rem !important;
            }
            
            .hero-section {
                grid-template-columns: 1fr !important;
                gap: 30px !important;
            }
            
            .recipe-image-wrapper {
                height: 300px !important;
            }
            
            .info-card {
                padding: 25px !important;
            }
            
            .content-section {
                padding: 25px !important;
            }
            
            .ingredients-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .step-item {
                padding: 25px 25px 25px 85px !important;
            }
            
            .step-number {
                width: 50px !important;
                height: 50px !important;
                font-size: 1.2rem !important;
            }
            
            .action-buttons {
                flex-wrap: wrap !important;
                gap: 15px !important;
            }
            
            .btn {
                flex: 1 !important;
                min-width: 200px !important;
            }
        }
        
        /* Dispositivos médios (tablets, 769px a 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
            .recipe-title {
                font-size: 3rem !important;
            }
            
            .hero-section {
                grid-template-columns: 1fr 350px !important;
                gap: 30px !important;
            }
            
            .recipe-image-wrapper {
                height: 400px !important;
            }
            
            .ingredients-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }
        
        /* Dispositivos grandes (desktops pequenos, 1025px a 1200px) */
        @media (min-width: 1025px) and (max-width: 1200px) {
            .hero-section {
                grid-template-columns: 1fr 380px !important;
            }
            
            .recipe-image-wrapper {
                height: 430px !important;
            }
        }
        
        /* Ajustes gerais para todos os dispositivos móveis */
        @media (max-width: 768px) {
            .recipe-image-wrapper:hover {
                transform: none !important;
            }
            
            .info-item:hover {
                transform: none !important;
            }
            
            .ingredient-item:hover {
                transform: none !important;
            }
            
            .step-item:hover {
                transform: none !important;
            }
            
            .btn:hover {
                transform: none !important;
            }
            
            /* Melhorias para impressão mobile */
            @media print {
                .action-buttons,
                .recipe-subtitle,
                .image-overlay,
                .decoration-leaf {
                    display: none !important;
                }
                
                body {
                    padding: 0 !important;
                }
                
                .content-section {
                    break-inside: avoid !important;
                }
            }
        }
        
        /* Ajustes para orientação paisagem em dispositivos móveis */
        @media (max-width: 768px) and (orientation: landscape) {
            .hero-section {
                grid-template-columns: 1fr 1fr !important;
            }
            
            .recipe-image-wrapper {
                height: 250px !important;
            }
            
            .recipe-title {
                font-size: 2rem !important;
            }
            
            .ingredients-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .action-buttons {
                flex-direction: row !important;
                flex-wrap: wrap !important;
            }
            
            .btn {
                flex: 1 !important;
                min-width: 150px !important;
            }
        }
        
        /* Otimização para tablets em modo retrato */
        @media (min-width: 600px) and (max-width: 900px) and (orientation: portrait) {
            .recipe-image-wrapper {
                height: 350px !important;
            }
            
            .info-card {
                padding: 25px !important;
            }
            
            .ingredients-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }
        
        /* Ajustes para impressão */
        @media print {
            body {
                background: white !important;
                color: black !important;
                padding: 20px !important;
                font-size: 12pt !important;
            }
            
            .decoration-leaf,
            .image-overlay,
            .action-buttons,
            .info-card::before,
            .recipe-status,
            .image-credit {
                display: none !important;
            }
            
            .main-container {
                max-width: 100% !important;
            }
            
            .recipe-title {
                color: black !important;
                font-size: 18pt !important;
                text-shadow: none !important;
            }
            
            .recipe-title::after {
                background: black !important;
            }
            
            .recipe-subtitle {
                background: white !important;
                border: 1px solid #ddd !important;
                color: #666 !important;
            }
            
            .recipe-image-wrapper {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                height: auto !important;
                max-height: 300px !important;
            }
            
            .recipe-image {
                height: auto !important;
                max-height: 300px !important;
            }
            
            .info-card,
            .content-section {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                background: white !important;
                page-break-inside: avoid !important;
            }
            
            .ingredient-checkbox {
                -webkit-appearance: none;
                appearance: none;
                border: 1px solid #999 !important;
                border-radius: 3px !important;
            }
            
            .ingredient-checkbox:checked::before {
                content: "✓" !important;
                color: black !important;
            }
            
            .step-item {
                box-shadow: none !important;
                border: 1px solid #eee !important;
                page-break-inside: avoid !important;
            }
            
            .step-number {
                background: #f0f0f0 !important;
                color: black !important;
                box-shadow: none !important;
                border: 1px solid #ddd !important;
            }
        }
        
        /* Melhorias de acessibilidade para toque */
        @media (hover: none) and (pointer: coarse) {
            .ingredient-checkbox {
                width: 28px !important;
                height: 28px !important;
            }
            
            .btn {
                min-height: 44px !important;
                padding: 12px 24px !important;
            }
            
       
            
            /* Aumentar área de toque para checkboxes */
            .ingredient-item {
                position: relative !important;
            }
            
            .ingredient-item::after {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
            }
        }
        
        /* Suporte para modo escuro */
        @media (prefers-color-scheme: dark) {
            @media (max-width: 768px) {
                body {
                    background: #1a1a1a !important;
                    color: #f0f0f0 !important;
                }
                
                .info-card,
                .content-section {
                    background: #2a2a2a !important;
                    border-color: #444 !important;
                }
                
                .recipe-title {
                    color: #e67e22 !important;
                }
                
                .recipe-subtitle {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: #b0b0b0 !important;
                }
                
                .info-item,
                .ingredient-item,
                .step-item {
                    background: #333 !important;
                    color: #f0f0f0 !important;
                }
                
                .info-value {
                    color: #e67e22 !important;
                }
                
                .ingredient-text {
                    color: #f0f0f0 !important;
                }
                
                .step-content {
                    color: #f0f0f0 !important;
                }
                
                .section-title {
                    color: #e67e22 !important;
                }
                
                .btn {
                    border-color: #e67e22 !important;
                    color: #e67e22 !important;
                }
                
                .btn:before {
                    background: #e67e22 !important;
                }
                
                .btn:hover {
                    color: #fff !important;
                }
                
                .recipe-status {
                    background: linear-gradient(135deg, #e67e22, #d35400) !important;
                }
            }
        }
        
        /* Ajustes para navegadores específicos */
        @supports (-webkit-overflow-scrolling: touch) {
            /* Safari iOS */
            body {
                -webkit-overflow-scrolling: touch !important;
            }
        }
        
        /* Corrigir altura segura para dispositivos com notch */
        @supports (padding: max(0px)) {
            body {
                padding-top: max(15px, env(safe-area-inset-top)) !important;
                padding-bottom: max(15px, env(safe-area-inset-bottom)) !important;
                padding-left: max(10px, env(safe-area-inset-left)) !important;
                padding-right: max(10px, env(safe-area-inset-right)) !important;
            }
        }
        
        /* Ajuste para telas muito grandes */
        @media (min-width: 1600px) {
            .main-container {
                max-width: 1400px !important;
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
            
            .recipe-image-wrapper:hover,
            .info-item:hover,
            .ingredient-item:hover,
            .step-item:hover,
            .btn:hover {
                transform: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Função para ajustar dinamicamente o layout da página de detalhes
function adjustDetalheLayoutForScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    // Ajustar grid do hero-section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        if (width <= 480) {
            heroSection.style.gridTemplateColumns = '1fr';
        } else if (width <= 768) {
            heroSection.style.gridTemplateColumns = '1fr';
        } else if (width <= 1024) {
            heroSection.style.gridTemplateColumns = '1fr 350px';
        } else if (width <= 1200) {
            heroSection.style.gridTemplateColumns = '1fr 380px';
        } else {
            heroSection.style.gridTemplateColumns = '1fr 400px';
        }
        
        // Ajustar para paisagem em mobile
        if (width <= 768 && isLandscape) {
            heroSection.style.gridTemplateColumns = '1fr 1fr';
        }
    }
    
    // Ajustar altura da imagem
    const imageWrapper = document.querySelector('.recipe-image-wrapper');
    if (imageWrapper) {
        if (width <= 480) {
            imageWrapper.style.height = '250px';
        } else if (width <= 768) {
            imageWrapper.style.height = '300px';
        } else if (width <= 1024) {
            imageWrapper.style.height = '400px';
        } else if (width <= 1200) {
            imageWrapper.style.height = '430px';
        } else {
            imageWrapper.style.height = '458px';
        }
    }
    
    // Ajustar grid de ingredientes
    const ingredientsGrid = document.querySelector('.ingredients-grid');
    if (ingredientsGrid) {
        if (width <= 480) {
            ingredientsGrid.style.gridTemplateColumns = '1fr';
        } else if (width <= 768) {
            ingredientsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            ingredientsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        }
        
        // Paisagem em mobile
        if (width <= 768 && isLandscape) {
            ingredientsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        }
    }
    
    // Ajustar título da receita
    const recipeTitle = document.querySelector('.recipe-title');
    if (recipeTitle) {
        if (width <= 480) {
            recipeTitle.style.fontSize = '2rem';
        } else if (width <= 768) {
            recipeTitle.style.fontSize = '2.5rem';
        } else if (width <= 1024) {
            recipeTitle.style.fontSize = '3rem';
        } else {
            recipeTitle.style.fontSize = '3.5rem';
        }
    }
    
    // Ajustar botões de ação
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        if (width <= 480) {
            actionButtons.style.flexDirection = 'column';
        } else if (width <= 768) {
            actionButtons.style.flexDirection = 'row';
            actionButtons.style.flexWrap = 'wrap';
        } else {
            actionButtons.style.flexDirection = 'row';
            actionButtons.style.flexWrap = 'nowrap';
        }
    }
    
    // Ajustar padding do body
    if (width <= 480) {
        document.body.style.padding = '15px 10px';
    } else if (width <= 768) {
        document.body.style.padding = '20px 15px';
    } else {
        document.body.style.padding = '30px 20px';
    }
    
    // Otimizar para touch
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        const touchElements = document.querySelectorAll('.btn, .ingredient-checkbox');
        touchElements.forEach(el => {
            if (el.classList.contains('btn')) {
                el.style.minHeight = '44px';
                el.style.padding = '12px 24px';
            }
            
            if (el.classList.contains('ingredient-checkbox')) {
                el.style.width = '28px';
                el.style.height = '28px';
            }
        });
    }
    
    // Reduzir animações se preferido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

// Inicializar a responsividade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveStylesDetalhe();
    adjustDetalheLayoutForScreenSize();
    
    // Reajustar quando a janela for redimensionada
    window.addEventListener('resize', adjustDetalheLayoutForScreenSize);
    
    // Reaplicar estilos se necessário
    window.addEventListener('load', applyResponsiveStylesDetalhe);
});

// Detectar dispositivo e otimizar
function optimizeDetalheForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-detalhe-view');
        
        // Remover decorações em mobile para performance
        const decorations = document.querySelectorAll('.decoration-leaf');
        decorations.forEach(decoration => {
            decoration.style.display = 'none';
        });
        
        // Ajustar transições para melhor performance
        const animatedElements = document.querySelectorAll('.recipe-image-wrapper, .info-item, .ingredient-item, .step-item, .btn');
        animatedElements.forEach(el => {
            el.style.transition = 'all 0.2s ease';
        });
    } else {
        document.body.classList.add('desktop-detalhe-view');
    }
}

// Executar otimizações
optimizeDetalheForMobile();

// Adicionar listener para mudanças de orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        adjustDetalheLayoutForScreenSize();
        optimizeDetalheForMobile();
    }, 100);
});

// Função para melhorar a experiência de impressão
function enhancePrintExperience() {
    const printButton = document.querySelector('[onclick="window.print()"]');
    if (printButton) {
        printButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Adicionar classe para impressão
            document.body.classList.add('printing');
            
            // Aguardar um momento e imprimir
            setTimeout(() => {
                window.print();
                
                // Remover classe após impressão
                setTimeout(() => {
                    document.body.classList.remove('printing');
                }, 100);
            }, 100);
        });
    }
}

// Executar melhorias de impressão
enhancePrintExperience();

// Função para melhorar a funcionalidade dos checkboxes
function enhanceIngredientCheckboxes() {
    const checkboxes = document.querySelectorAll('.ingredient-checkbox');
    
    checkboxes.forEach(checkbox => {
        // Tornar mais fácil de tocar em mobile
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.color = 'var(--text-light)';
                label.style.textDecoration = 'line-through';
            } else {
                label.style.color = '';
                label.style.textDecoration = '';
            }
        });
        
        // Adicionar área de toque maior em mobile
        if ('ontouchstart' in window) {
            const container = checkbox.closest('.ingredient-item');
            if (container) {
                container.style.cursor = 'pointer';
                container.addEventListener('click', function(e) {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            }
        }
    });
}

 const titleElement = document.querySelector('.recipe-title');
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

// Executar melhorias dos checkboxes
enhanceIngredientCheckboxes();

// Função para criar versão mobile-friendly do layout
function createMobileFriendlyLayout() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Reorganizar elementos para melhor visualização mobile
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Simplificar animações para melhor performance
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
        animatedElements.forEach(el => {
            el.style.animation = 'fadeIn 0.4s ease-out';
        });
    }
}

// Executar criação de layout mobile
createMobileFriendlyLayout();