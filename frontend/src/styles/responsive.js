export function applyResponsiveStyles() {
  const anterior = document.getElementById('responsive-styles');
  if (anterior) anterior.remove();

  const style = document.createElement('style');
  style.id = 'responsive-styles';
  style.innerHTML = `
@media (max-width: 1400px) {
  body { max-width: 1400px !important; margin: 0 auto !important; }
}

@media (max-width: 1200px) {
.minhas-stats { grid-template-columns: repeat(3, 1fr) !important; }
}

@media (max-width: 1200px) {
  .receitas-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 20px !important; }
  .nova-info-card { position: static !important; }
  .newspaper-title::before, .newspaper-title::after { display: none !important; }
  .nova-main-layout { grid-template-columns: 1fr 740px !important;  gap: 15px !important;}
  .nova-tempo-label-row{
flex-direction: column;
justify-content: normal !important;
    align-items: normal !important;
    gap: 0 !important;
}
}

@media (max-width: 1024px) {
  .newspaper-title { font-size: 2rem !important; }
  .newspaper-date, .newspaper-price { display: none !important; }
  .header-user-profile, .header-logout-btn { padding: 4px 14px !important; }
  .carousel-container { height: 400px !important; min-height: 400px !important; }
  .receitas-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 26px !important; }
  .footer-content { grid-template-columns: repeat(3, 1fr) !important; }
  .minhas-wrapper { max-width: 100% !important; width: 100% !important; padding: 80px 20px 50px !important; }
  .minhas-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 18px !important; }
  .detalhe-hero { grid-template-columns: 1fr !important; min-height: auto !important; }
  .detalhe-image { min-height: 320px !important; height: 320px !important; border-right: none !important; border-bottom: 2px solid var(--header-color) !important; }
  .detalhe-info { padding: 30px !important; }
  .detalhe-titulo { font-size: 2rem !important; }
  .detalhe-body { grid-template-columns: 1fr !important; padding: 30px !important; gap: 40px !important; }
  .detalhe-section:first-child { border-right: none !important; border-bottom: 1px dashed rgba(139, 0, 0, 0.2) !important; padding-bottom: 30px !important; }
  .nova-main-layout { grid-template-columns: 1fr !important;}
  .nova-info-card { position: static !important; max-width: 100% !important; width: 100% !important; }
  .dashboard-cards { grid-template-columns: repeat(2, 1fr) !important; padding: 20px 25px !important; }
  .classifieds { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
  .dashboard-grid { padding: 0 25px 25px !important; }
  .admin-table-container { margin: 5px !important; }
  .carrossel-grid {padding: 5px !important;}
  
}

@media (max-width: 996px) {
  .newspaper-header { padding: 20px !important; }
  .header-nav { margin-top: 10px !important; }
  .newspaper-subtitle { font-size: 0.85rem !important; }
  .header-nav a { padding: 10px 14px !important; font-size: 0.75rem !important; }
  .newspaper-title { font-size: 2.8rem !important; }
  .newspaper-title::before, .newspaper-title::after { font-size: 2rem !important; }
  .newspaper-title::before { left: -25px !important; }
  .newspaper-title::after { right: -25px !important; }
  .header-full-width.scrolled .newspaper-title { padding: 0 !important; font-size: 1.3rem !important; }

}

@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
  .panel-body-chart { height: 320px !important; }
  .carousel-container { min-height: 380px !important; }
  .carousel-caption h3 { font-size: 2rem !important; }
  .carousel-caption p { font-size: 1rem !important; }
  .ver-receita-grid { grid-template-columns: 1fr 1fr !important; }
  .ver-receita-col-imagem { grid-column: 1 / -1 !important; }
  .ver-receita-imagem { height: 240px !important; }
  
}

@media (max-width: 768px) {

  body { max-width: 100% !important; overflow-x: hidden !important; padding: 0 !important; }
  .home-wrapper { margin: 0 !important; padding: 35px 5px 5px !important; }
  .user-view-info { gap: 8px !important; }

  .header-container, .header-full-width.scrolled .header-container { padding: 12px 15px !important; }
  .newspaper-header { padding: 0 !important; }
  .header-right, .newspaper-price, .newspaper-date, .header-logout-btn, .header-notification-btn, .header-user-desktop { display: none !important; }
  .newspaper-subtitle { display: none !important; }
  .header-center { justify-content: flex-end !important; gap: 0 !important; }
  .header-greeting { text-align: center !important; }
  .newspaper-title { padding: 0 !important; font-size: 1.15rem !important; letter-spacing: 1px !important; text-shadow: none !important; }
  .newspaper-title::before, .newspaper-title::after { display: none !important; }
  .header-full-width.scrolled .newspaper-title { font-size: 1.15rem !important; }

  .header-notification-desktop, .header-notification-nav, .header-notification-btn { display: none !important; }
  .header-nav.open .header-notification-sidebar { display: inline-flex !important; }
  .header-nav.open .header-notification-nav, .header-nav.open .header-notification-desktop { display: none !important; }

  .menu-icon { display: flex !important; align-items: center !important; justify-content: center !important; width: 38px !important; height: 38px !important; padding: 0 !important; flex-shrink: 0 !important; color: white !important; font-size: 1.3rem !important; cursor: pointer !important; background: rgba(255, 255, 255, 0.06) !important; border: 2px solid rgba(255, 255, 255, 0.3) !important; transition: all 0.25s ease !important; }

  .header-nav { position: fixed !important; top: 0 !important; left: -5px !important; z-index: 2000 !important; display: flex !important; flex-direction: column !important; align-items: stretch !important; justify-content: flex-start !important; gap: 8px !important; width: 280px !important; max-width: 85% !important; height: 100vh !important; margin: 0 !important; padding: 18px !important; overflow-y: auto !important; flex-wrap: nowrap !important; background: #fff !important; border: none !important; border-right: 2px solid var(--header-color) !important; box-shadow: 4px 0 0 rgba(139, 0, 0, 0.15) !important; transform: translateX(-100%) !important; transition: transform 0.3s ease !important; }
  .header-nav.open { transform: translateX(0) !important; }
  .header-nav a { justify-content: flex-start !important; padding: 14px 18px !important; color: var(--header-color) !important; font-size: 0.85rem !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; background: transparent !important; border: 2px solid var(--header-color) !important; transform: none !important; }
  .header-nav a i { color: var(--header-color) !important; opacity: 1 !important; }
  .header-nav a.active { color: var(--header-color) !important; background: var(--accent-color) !important; border-color: var(--accent-color) !important; }
  .header-nav.open .header-nav-top { display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 12px !important; padding-bottom: 14px !important; margin-bottom: 12px !important; border-bottom: 2px solid var(--header-color) !important; }
  .header-nav.open .header-nav-title { display: block !important; margin: 0 !important; color: var(--header-color) !important; font-family: 'DM Serif Display', serif !important; font-size: 1.2rem !important; font-weight: 800 !important; line-height: 1.1 !important; text-transform: uppercase !important; letter-spacing: 2px !important; }
  .header-nav.open .header-nav-close { display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important; color: var(--header-color) !important; font-size: 1.8rem !important; line-height: 1 !important; cursor: pointer !important; background: none !important; border: none !important; opacity: 0.7 !important; transition: all 0.3s ease !important; }
  .header-nav .header-user-profile, .header-nav .header-user-mobile, .header-nav .header-notification-sidebar, .header-nav .header-logout-sidebar { display: inline-flex !important; width: 100% !important; min-height: 46px !important; height: auto !important; padding: 14px 18px !important; box-sizing: border-box !important; justify-content: flex-start !important; color: var(--header-color) !important; font-weight: 700 !important; font-size: 0.85rem !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; background: transparent !important; border: 2px solid var(--header-color) !important; transform: none !important; }
  .header-nav .header-user-profile i, .header-nav .header-user-profile span, .header-nav .header-user-mobile i, .header-nav .header-notification-sidebar i, .header-nav .header-logout-sidebar i { color: var(--header-color) !important; }
  .header-nav .header-notification-sidebar .notification-sidebar-badge { display: inline-flex !important; }
  .header-full-width.scrolled .header-nav { max-height: none !important; padding: 18px !important; overflow-y: auto !important; opacity: 1 !important; background: #fff !important; border: none !important; border-right: 2px solid var(--header-color) !important; }
  .header-full-width.scrolled .header-nav:not(.open) { transform: translateX(-100%) !important; }
  .header-full-width.scrolled .header-nav.open { transform: translateX(0) !important; padding: 15px !important; }
  .header-full-width.scrolled .header-nav.open .header-user-mobile, .header-full-width.scrolled .header-nav.open .header-notification-sidebar, .header-full-width.scrolled .header-nav.open .header-logout-sidebar { display: inline-flex !important; }
  .header-full-width.scrolled .header-nav.open .header-user-profile { display: inline-flex !important; font-size: 0.85rem !important; font-weight: 700 !important; }

  .carousel-container { display: none !important; }

  .tab-buttons { display: flex !important; align-items: stretch !important; flex-direction: row !important; flex-wrap: nowrap !important; margin: 38px auto 0 auto !important; }
  .tab-button { text-align: center !important; font-size: 0.7rem !important; gap: 3px !important; }
  .tab-button .badge { padding: 2px 6px !important; font-size: 0.6rem !important; }
  .recipe-count { display: none !important; }

  .recipe-filters { padding: 12px !important; margin: 20px 0 0 0 !important; }
  .filtros-grid { grid-template-columns: 1fr !important; }
  .filter-buttons { flex-direction: column !important; margin-top: 0 !important; gap: 8px !important; }
  .filter-buttons button { width: 100% !important; justify-content: center !important; }

  .receitas-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
  .card { box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15) !important; }
  .card-image { height: 120px !important; }
  .card-content { padding: 12px 12px 14px !important; }
  .card-titulo { font-size: 0.95rem !important; margin-bottom: 8px !important; }
  .card-meta { gap: 6px !important; padding-bottom: 6px !important; }
  .card-meta-row { gap: 12px !important; }
  .card-meta-item { font-size: 0.72rem !important; gap: 4px !important; }
  .card-meta-item i { font-size: 0.7rem !important; }
  .card-link { font-size: 0.68rem !important; padding: 8px 10px !important; }
  .card-favorite-btn { width: 32px !important; height: 32px !important; font-size: 0.85rem !important; }
  .card-badge-categoria { font-size: 0.6rem !important; padding: 4px 10px !important; letter-spacing: 1px !important; }
  .category-title { font-size: 1.1rem !important; gap: 8px !important; }

  .classifieds-section .section-title { margin-bottom: 20px !important; padding-bottom: 12px !important; }
  .classifieds-section .section-title h2 { font-size: 1.4rem !important; letter-spacing: 0.5px !important; }
  .classifieds-section .section-title p { font-size: 0.82rem !important; }
  .classifieds { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
  .card-receita-rapida .card-image { height: 130px !important; }
  .card-receita-rapida .card-content { padding: 12px !important; gap: 8px !important; }
  .card-receita-rapida .card-image-titulo { bottom: 8px !important; left: 10px !important; right: 10px !important; }
  .card-receita-rapida .card-image-titulo h3 { font-size: 0.95rem !important; letter-spacing: 0 !important; }
  .card-descricao-rapida { font-size: 0.75rem !important; line-height: 1.4 !important; }

  .detalhe-container { padding: 70px 5px 0 !important; gap: 20px !important; margin: 0 !important; }
  .detalhe-card { box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15) !important; border: 1px solid var(--header-color) !important; }
  .detalhe-badge-categoria { display: none !important; }
  .detalhe-image { min-height: 260px !important; height: 260px !important; }
  .detalhe-info { padding: 22px 20px !important; }
  .detalhe-info-header { flex-direction: column !important; align-items: stretch !important; gap: 14px !important; }
  .detalhe-info-actions { position: static !important; width: 100% !important; }
  .detalhe-favorite-btn, .detalhe-print-btn { flex: 1 !important; min-width: 0 !important; padding: 10px 12px !important; font-size: 0.72rem !important; }
  .detalhe-titulo { font-size: 1.7rem !important; margin-bottom: 15px !important; }
  .detalhe-meta { gap: 6px !important; }
  .detalhe-meta-item { font-size: 0.75rem !important; padding: 4px 11px !important; }
  .detalhe-body { padding: 25px 20px !important; gap: 30px !important; }
  .detalhe-section:first-child { padding-bottom: 25px !important; }
  .detalhe-section-header { gap: 10px !important; margin-bottom: 18px !important; padding-bottom: 12px !important; }
  .detalhe-section-header i { font-size: 1rem !important; }
  .detalhe-section-header h2 { font-size: 0.95rem !important; }
  .detalhe-section-count { font-size: 0.65rem !important; padding: 3px 10px !important; }
  .detalhe-ingrediente-item { padding: 10px 14px !important; gap: 12px !important; }
  .detalhe-ingrediente-text { font-size: 0.88rem !important; }
  .detalhe-preparo-item { padding: 13px 15px !important; gap: 13px !important; }
  .detalhe-preparo-number { min-width: 28px !important; height: 28px !important; font-size: 0.78rem !important; }
  .detalhe-preparo-text { font-size: 0.88rem !important; }

  .minhas-wrapper { padding: 80px 5px 40px !important; margin: 0 !important; width: 100% !important; margin: 0 !important; }
  .minhas-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; margin-bottom: 20px !important; }
  .stat-card { padding: 12px !important; gap: 10px !important; }
  .stat-icon { width: 36px !important; height: 36px !important; font-size: 0.95rem !important; }
  .stat-value { font-size: 1.2rem !important; }
  .stat-label { font-size: 0.6rem !important; }
  .minhas-tabs { margin: 20px 0 !important; overflow-x: auto !important; overflow-y: hidden !important; scrollbar-width: none !important; -webkit-overflow-scrolling: touch !important; }
  .minhas-tabs::-webkit-scrollbar { display: none !important; }
  .minhas-tab { padding: 10px 14px !important; font-size: 0.7rem !important; flex: 1 !important; justify-content: center !important; }
  .minhas-grid { grid-template-columns: 1fr 1fr !important; gap: 5px !important; }
  .minha-card { box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15) !important; }
  .minha-imagem { height: 130px !important; }
  .status-badge { top: 8px !important; font-size: 0.6rem !important; padding: 4px 8px !important; gap: 4px !important; }
  .minha-info { padding: 10px !important; }
  .minha-info h3 { font-size: 0.9rem !important; margin-bottom: 8px !important; }
  .minha-meta { font-size: 0.7rem !important; gap: 6px !important; margin-bottom: 12px !important; padding-bottom: 10px !important; }
  .minha-actions { gap: 6px !important; }
  .minha-actions button { min-width: 100% !important; padding: 8px 10px !important; font-size: 0.65rem !important; }

  .nova-main-layout { padding: 70px 5px 40px !important; gap: 20px !important; }
  .nova-recipe-form { padding: 20px !important; }
  .nova-form-row { grid-template-columns: 1fr !important; gap: 12px !important; }
  .nova-titulo-width, .nova-tempo-width, .nova-porcoes-width { grid-column: span 1 !important; }
  .nova-ingrediente-row { grid-template-columns: 1fr 1fr !important; gap: 8px !important; padding: 12px !important; background: rgba(212, 175, 55, 0.04) !important; border-radius: 4px !important; border: 1px solid rgba(139, 0, 0, 0.1) !important; }
  .nova-ingrediente-nome-wrapper { grid-column: 1 / -1 !important; }
  .nova-info-body { padding: 16px !important; }
  .nova-info-section { padding-bottom: 12px !important; margin-bottom: 18px !important; }
  .nova-info-section h4 { font-size: 0.78rem !important; }
  .nova-info-section p, .nova-info-section li { font-size: 0.85rem !important; }
  .nova-submit-button { padding: 14px !important; font-size: 0.9rem !important; }

  .sobre-container { padding: 80px 5px 40px !important; margin: 0 !important; }
  .sobre-header h1 { font-size: 1.8rem !important; }
  .sobre-content { gap: 15px !important; }
  .timeline-item { flex-direction: column !important; gap: 8px !important; padding-bottom: 18px !important; }
  .timeline-item::before { display: none !important; }
  .timeline-year { width: 90px !important; height: 36px !important; font-size: 0.9rem !important; }

  .modal-overlay { overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; padding: 3px !important; }
  .modal-content { max-height: 80vh !important; overflow-y: auto !important; margin: 5% auto !important; }
  .modal-body { max-height: calc(80vh - 100px) !important; overflow-y: auto !important; }
  .modal-actions { flex-direction: column !important; gap: 8px !important; }
  .modal-actions button { width: 100% !important; }

  .admin-content-wrapper { margin-left: 0 !important; width: 100% !important; max-width: none !important; }
  .admin-search-box { width: 100% !important; }
  .admin-search-box input { width: 100% !important; font-size: 0.88rem !important; padding: 11px 14px 11px 40px !important; }
  .admin-table thead { display: none !important; }
  .admin-table tr { display: block !important; margin-bottom: 15px !important; border: 2px solid var(--header-color) !important; padding: 8px !important; }
  .admin-table td { display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 8px 12px !important; border-bottom: 1px dashed rgba(139, 0, 0, 0.15) !important; }
  .admin-table td::before { content: attr(data-label) !important; font-weight: 700 !important; color: var(--header-color) !important; font-size: 0.75rem !important; text-transform: uppercase !important; }
  .admin-topbar { flex-direction: column !important; align-items: stretch !important; padding: 15px !important; padding-left: 70px !important; gap: 12px !important; }
  .admin-topbar h1 { font-size: 1.15rem !important; }
  .admin-topbar-actions { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; width: 100% !important; }
  .admin-topbar-actions > span { font-size: 0.8rem !important; justify-content: center !important; padding: 6px 10px !important; background: rgba(139, 0, 0, 0.04) !important; border-left: 3px solid var(--accent-color) !important; }
  .admin-table-header .count { font-size: 0.9rem !important; }
  .admin-recipe-tabs { flex-direction: column !important; align-items: stretch !important; gap: 6px !important; margin-bottom: 15px !important; }
  .admin-recipe-tab { justify-content: space-between !important; padding: 8px 10px !important; font-size: 0.65rem !important; }
  .admin-cards-grid { grid-template-columns: 1fr !important; padding: 15px !important; gap: 20px !important; }
  .admin-recipe-image { height: 180px !important; }
  .admin-recipe-content { padding: 18px !important; }
  .admin-recipe-content h2 { font-size: 1.2rem !important; }
  .admin-sidebar-toggle { display: inline-flex !important; }
  .admin-sidebar { transform: translateX(-100%) !important; transition: transform 0.3s ease !important; z-index: 2000 !important; }
  .admin-sidebar.open { transform: translateX(0) !important; }
  .admin-sidebar-close { display: block !important; }

  .dashboard-cards { padding: 15px 5px !important; gap: 12px !important; }
  .dashboard-grid { padding: 0 5px 20px !important; }
  .dashboard-card { padding: 16px !important; gap: 12px !important; }
  .card-icon { width: 42px !important; height: 42px !important; font-size: 1.15rem !important; }
  .card-value { font-size: 1.5rem !important; }
  .panel-header { padding: 14px 18px !important; }
  .panel-header h2 { font-size: 0.95rem !important; }
  .panel-body-chart { padding: 15px !important; height: 280px !important; }
  .top-item { grid-template-columns: 34px 1fr auto !important; gap: 12px !important; }
  .top-rank { width: 34px !important; height: 34px !important; font-size: 1rem !important; }
  .top-titulo { font-size: 0.82rem !important; }
  .top-count { font-size: 1rem !important; min-width: 46px !important; }

  .footer-content { grid-template-columns: 1fr !important; gap: 30px !important; padding: 30px 8px 20px !important; width: auto !important; }
  .footer-title { font-size: 1rem !important; }
  .footer-description { font-size: 0.85rem !important; }
  .footer-bottom { padding: 16px 20px !important; }
  .footer-bottom p { font-size: 0.7rem !important; }
  .social-links { flex-wrap: wrap !important; justify-content: left !important; }

  .p-toast { width: 100% !important; left: 0 !important; right: 0 !important; padding: 0 12px !important; }
  .p-toast-top-right, .p-toast-top-left, .p-toast-bottom-right, .p-toast-bottom-left { width: 100% !important; max-width: 100% !important; left: 0 !important; right: 0 !important; padding: 12px !important; }
  .p-toast .p-toast-message { margin: 0 0 10px 0 !important; width: 100% !important; }
  .p-toast .p-toast-message-content { padding: 12px 14px !important; gap: 10px !important; }
  .p-toast .p-toast-summary { font-size: 0.9rem !important; }
  .p-toast .p-toast-detail { font-size: 0.8rem !important; }

  .minhas-tab:hover { color: var(--light-text) !important; background: transparent !important; }
  .minha-card:hover { box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15) !important; }
  .btn-ver:hover, .btn-motivo:hover, .btn-excluir:hover { transform: none !important; }
  .nova-tempo-toggle:hover { background: #fff !important; color: var(--header-color) !important; }
  .nova-file-label:hover { border-color: rgba(139, 0, 0, 0.3) !important; background: #faf8f5 !important; }
  .nova-submit-button:hover { background: var(--header-color) !important; color: #fff !important; border: 2px solid var(--header-color) !important; }
  .nova-add-btn:hover { color: var(--accent-color) !important; background-color: white !important; border: 2px solid var(--accent-color) !important; }
  .tab-button:hover { color: var(--light-text) !important; background: transparent !important; }
  .card:hover { transform: none !important; box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15) !important; }
  .card-favorite-btn:hover { background: #fff !important; color: var(--header-color) !important; }
  .card-link:hover { background: var(--header-color) !important; color: #fff !important; }
  .detalhe-favorite-btn:hover, .detalhe-print-btn:hover { transform: none !important; box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15) !important; }
  .detalhe-ingrediente-item:hover { border-color: rgba(139, 0, 0, 0.15) !important; transform: none !important; }
  .detalhe-preparo-item:hover { border-color: rgba(139, 0, 0, 0.15) !important; transform: none !important; }
  .carousel-control:hover { background: #fff !important; color: var(--header-color) !important; transform: none !important; box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.25) !important; }
  .admin-recipe-card:hover { box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15) !important; }
  .admin-btn-view:hover, .admin-btn-approve:hover, .admin-btn-reject:hover { transform: none !important; box-shadow: 2px 2px 0 rgba(139, 0, 0, 0.15) !important; }
  .admin-recipe-tab:hover { color: var(--light-text) !important; background: transparent !important; }
  .action-btn.btn-view:hover { transform: none !important; }
  .header-nav a:hover { border-color: var(--header-color) !important; transform: none !important; box-shadow: none !important; }
  .header-nav a:hover i { color: var(--header-color) !important; opacity: 0.9 !important; }
  .header-nav a.active:hover { color: var(--header-color) !important; background: var(--accent-color) !important; border-color: var(--accent-color) !important; transform: none !important; box-shadow: none !important; }
  .header-user-profile:hover, .header-logout-btn:hover, .header-notification-btn:hover { color: white !important; background: rgba(255, 255, 255, 0.06) !important; border-color: rgba(255, 255, 255, 0.25) !important; transform: none !important; box-shadow: none !important; }
  .header-full-width.scrolled .menu-icon:hover { color: white !important; background: rgba(255, 255, 255, 0.06) !important; border-color: rgba(255, 255, 255, 0.3) !important; }
  .header-nav.open .header-nav-close:hover { opacity: 0.7 !important; transform: none !important; }
  .header-full-width.scrolled .header-nav.open > a:hover { color: var(--header-color) !important; background: transparent !important; border-color: var(--header-color) !important; }
  .header-full-width.scrolled .header-nav.open > a:hover i { color: var(--header-color) !important; }
  .header-full-width.scrolled .header-nav.open .header-user-profile:hover { color: var(--header-color) !important; background: transparent !important; border-color: var(--header-color) !important; transform: none !important; box-shadow: none !important; }
  .header-full-width.scrolled .header-nav.open .header-user-profile:hover i, .header-full-width.scrolled .header-nav.open .header-user-profile:hover span { color: var(--header-color) !important; }
  .header-nav .header-user-profile:hover, .header-nav .header-user-mobile:hover, .header-nav .header-notification-sidebar:hover, .header-nav .header-logout-sidebar:hover { color: var(--header-color) !important; background: transparent !important; border-color: var(--header-color) !important; }
  .header-nav .header-user-profile:hover i, .header-nav .header-user-profile:hover span, .header-nav .header-user-mobile:hover i, .header-nav .header-notification-sidebar:hover i, .header-nav .header-logout-sidebar:hover i { color: var(--header-color) !important; }
  .menu-icon:hover { color: white !important; background: rgba(255, 255, 255, 0.06) !important; border-color: rgba(255, 255, 255, 0.3) !important; }
  .admin-sidebar-btn:hover { color: var(--header-color) !important; background: transparent !important; border-color: var(--header-color) !important; }
  .admin-sidebar-btn:hover i { color: var(--header-color) !important; }
  .admin-sidebar-btn-sair:hover, .admin-sidebar-btn-sair:hover i { color: var(--header-color) !important; background: transparent !important; border-color: var(--header-color) !important; }
  .admin-sidebar-toggle:hover { color: white !important; background: none !important; border-color: white !important; }
}

@media (max-width: 768px) and (orientation: landscape) {
  .carousel-container { height: 300px !important; }
  .newspaper-title { font-size: 2.2rem !important; }
}

@media (max-width: 600px) {
  .modal-content { max-width: 100% !important; max-height: 95vh !important; }
  .modal-header { padding: 16px 20px !important; }
  .modal-header h2 { font-size: 1rem !important; }
  .modal-body { padding: 20px !important; }
  .modal-footer { flex-direction: column-reverse !important; padding: 14px 20px !important; }
  .modal-actions { flex-direction: column-reverse !important; }
  .modal-btn { width: 100% !important; }
  .modal-body .form-grid { grid-template-columns: 1fr !important; }
  .notificacoes-footer { flex-direction: column !important; }
  .notificacao-item { padding: 12px !important; gap: 10px !important; }
  .notificacao-icon { width: 34px !important; height: 34px !important; font-size: 1rem !important; }
  .user-form-row { grid-template-columns: 1fr !important; gap: 14px !important; }
  .cadastro-form-row { grid-template-columns: 1fr !important; }
  .resumo-card-value { font-size: 1.5rem !important; }
  .resumo-card-icon { width: 42px !important; height: 42px !important; font-size: 1.2rem !important; }
  .resumo-ingrediente-header { flex-direction: column !important; align-items: flex-start !important; }
  .ver-receita-grid { grid-template-columns: 1fr !important; }
  .top-item { grid-template-columns: 34px 1fr auto !important; gap: 12px !important; }
  .top-rank { width: 34px !important; height: 34px !important; font-size: 1rem !important; }
  .top-titulo { font-size: 0.82rem !important; }
  .top-count { font-size: 1rem !important; min-width: 46px !important; }
}

@media (max-width: 480px) {
  .header-container { padding: 10px 12px !important; }
  .header-full-width.scrolled .newspaper-title { font-size: 1.1rem !important; }
  .menu-icon { width: 38px !important; height: 38px !important; font-size: 1.5rem !important; }
  .header-nav a { padding: 12px 16px !important; }

  .tab-buttons { justify-content: space-between !important; }
  .recipe-filters { padding: 15px !important; margin: 20px 0 0 0 !important; }
  .recipe-filters h3 { font-size: 1.3rem !important; }
  .filter-group input { padding: 10px 10px 10px 40px !important; }
  .filter-buttons { margin-top: 0 !important; gap: 8px !important; }

  .receitas-grid { grid-template-columns: 1fr 1fr !important; gap: 5px !important; }
  .card { margin-bottom: 15px !important; }
  .card-image { height: 110px !important; min-height: 100px !important; }
  .card-content { padding: 10px !important; gap: 6px !important; }
  .card-titulo { font-size: 0.75rem !important; margin-bottom: 0px !important; }
  .card-meta-row { display: flex !important; justify-content: flex-start !important; align-items: normal !important; }
  .card-meta-chefe { display: none !important; }
  .card-meta-item { font-size: 0.7rem !important; }
  .card-link { font-size: 0.62rem !important; padding: 7px 8px !important; justify-content: center !important; }
  .card-favorite-btn { width: 28px !important; height: 28px !important; font-size: 0.8rem !important; }
  .card-badge-categoria { display: none !important; }
  .category-title { font-size: 1.6rem !important; }

  .classifieds-section .section-title h2 { font-size: 1.2rem !important; }
  .classifieds-section .section-title p { font-size: 0.75rem !important; }
  .classifieds { gap: 5px !important; }
  .card-receita-rapida .card-image { height: 110px !important; }
  .card-receita-rapida .card-content { padding: 10px !important; }
  .card-receita-rapida .card-image-titulo { bottom: 6px !important; left: 8px !important; right: 8px !important; }
  .card-receita-rapida .card-image-titulo h3 { font-size: 0.82rem !important; }
  .card-descricao-rapida { display: none; }
  .card-receita-rapida .card-meta-item { font-size: 0.65rem !important; }

  .detalhe-container { padding: 70px 5px 0 !important; }
  .detalhe-image { min-height: 220px !important; height: 220px !important; }
  .detalhe-info { padding: 20px 16px !important; }
  .detalhe-titulo { font-size: 1.4rem !important; }
  .detalhe-meta-item { font-size: 0.7rem !important; padding: 4px 10px !important; }
  .detalhe-meta-item i { font-size: 0.8rem !important; }
  .detalhe-body { padding: 20px 16px !important; gap: 25px !important; }
  .detalhe-section-header h2 { font-size: 0.9rem !important; }
  .detalhe-section-header i { font-size: 0.9rem !important; }
  .detalhe-section-count { font-size: 0.6rem !important; padding: 3px 8px !important; }
  .detalhe-ingrediente-item { padding: 9px 12px !important; gap: 10px !important; }
  .detalhe-ingrediente-text { font-size: 0.85rem !important; }
  .detalhe-preparo-item { padding: 11px 12px !important; gap: 11px !important; }
  .detalhe-preparo-number { min-width: 24px !important; height: 24px !important; font-size: 0.72rem !important; }
  .detalhe-preparo-text { font-size: 0.85rem !important; line-height: 1.5 !important; }
  .detalhe-favorite-btn, .detalhe-print-btn { padding: 9px 10px !important; font-size: 0.68rem !important; gap: 5px !important; }

  .minhas-tab { padding: 8px 10px !important; font-size: 0.65rem !important; }
  .tab-count { display: none !important; }
  .minhas-tab i { font-size: 0.8rem !important; }
  .minha-imagem { height: 110px !important; }
  .minha-info h3 { font-size: 0.85rem !important; }
  .minha-meta { font-size: 0.65rem !important; }

  .nova-main-layout { padding: 70px 5px 0 !important; }
  .nova-recipe-form { padding: 15px !important; }
  .nova-form-group label { font-size: 0.75rem !important; gap: 4px !important; }
  .nova-form-group label i { font-size: 0.8rem !important; width: 14px !important; }
  .nova-form-group input, .nova-form-group select { padding: 10px 12px !important; font-size: 0.88rem !important; }
  .nova-ingrediente-row { grid-template-columns: 1fr !important; gap: 8px !important; padding: 10px !important; }
  .nova-quantidade, .nova-unidade { grid-column: span 1 !important; }
  .nova-file-label { align-items: stretch !important; gap: 10px !important; padding: 12px !important; }
  .nova-file-text { font-size: 0.65rem !important; white-space: normal !important; }
  .nova-file-button { font-size: 0.8rem !important; width: 38px !important; height: 38px !important; }
  .nova-add-btn { width: 100% !important; justify-content: center !important; padding: 10px !important; font-size: 0.75rem !important; }
  .nova-passo-input { padding: 10px 42px 10px 12px !important; font-size: 0.85rem !important; }
  .nova-remove-btn { width: 26px !important; height: 26px !important; font-size: 14px !important; }
  .nova-submit-button { padding: 13px !important; font-size: 0.85rem !important; }
  .nova-info-header h3 { font-size: 0.9rem !important; gap: 8px !important; }
  .nova-info-body { padding: 14px !important; }
  .nova-info-section h4 { font-size: 0.72rem !important; }

  .sobre-header h1 { font-size: 1.5rem !important; }
  .sobre-section { padding: 20px 18px !important; }
  .sobre-section h2 { font-size: 1.1rem !important; }

  .modal-content { width: 100% !important; max-width: 100% !important; margin: 10px auto !important; border-radius: 4px !important; }
  .modal-body { padding: 15px !important; max-height: calc(90vh - 120px) !important; }
  .modal-body .form-group input, .modal-body .form-group select, .modal-body .form-group textarea { font-size: 16px !important; }
  .logout-modal-content { padding: 28px 20px 22px !important; }
  .logout-modal-icon { width: 60px !important; height: 60px !important; }
  .logout-modal-title { font-size: 1.1rem !important; }
  .logout-modal-message { font-size: 0.88rem !important; }
  .logout-modal-actions { flex-direction: column !important; gap: 10px !important; }
  .logout-btn-cancel, .logout-btn-confirm { flex: none !important; width: 100% !important; font-size: 0.75rem !important; padding: 10px 18px !important; }

  .admin-topbar { padding: 12px !important; padding-left: 65px !important; }
  .admin-topbar h1 { font-size: 1rem !important; }
  .admin-topbar-actions > span { font-size: 0.72rem !important; }
  .admin-search-box input { font-size: 0.82rem !important; padding: 10px 12px 10px 38px !important; }
  .admin-cards-grid { gap: 16px !important; }
  .admin-recipe-image { height: 160px !important; }
  .admin-recipe-content { padding: 15px !important; }
  .admin-recipe-content h2 { font-size: 1.1rem !important; }
  .admin-btn { padding: 9px 12px !important; font-size: 0.78rem !important; }

  .dashboard-cards { grid-template-columns: 1fr !important; }
  .panel-body-chart { height: 240px !important; }

  .footer-content { grid-template-columns: 1fr !important; gap: 25px !important; text-align: left !important; }
  .social-links a { width: 38px !important; height: 38px !important; font-size: 1rem !important; }

  .carousel-caption h3 { font-size: 1.15rem !important; }
  .carousel-caption p { font-size: 0.82rem !important; }
  .carousel-control { width: 36px !important; height: 36px !important; font-size: 0.85rem !important; }
  .carousel-controls { padding: 0 8px !important; }

  .p-toast .p-toast-message-content { padding: 10px 12px !important; }
  .p-toast .p-toast-summary { font-size: 0.85rem !important; }
  .p-toast .p-toast-detail { font-size: 0.75rem !important; }
}

@media (max-width: 378px) {
  .minhas-tabs { flex-direction: column !important; }
  .admin-recipe-tab span { display: none !important; }
  .admin-table-header .count { font-size: 0.7rem !important; }
  .card-meta-row{flex-direction: column; gap: 2px!important}
}

@media (min-width: 769px) {
  .header-full-width.scrolled .header-nav.open .header-user-mobile,
  .header-full-width.scrolled .header-nav.open .header-notification-sidebar,
  .header-full-width.scrolled .header-nav.open .header-logout-sidebar,
  .header-full-width.scrolled .header-nav.open .header-notification-nav {
    display: none !important;
  }
}

@media print {
  .header-full-width, .carousel-container, .modal-overlay, .modal-content,
  .admin-sidebar, .menu-icon, .card-favorite-btn, .carousel-controls,
  .social-links, .footer-bottom, .detalhe-topbar, .detalhe-badge-categoria,
  .newspaper-footer { display: none !important; }
  body { background: white !important; color: black !important; }
  .card, .minha-card, .admin-recipe-card { break-inside: avoid !important; box-shadow: none !important; border: 1px solid #ddd !important; }
  .detalhe-container { padding: 0 !important; }
  .detalhe-card { box-shadow: none !important; border: none !important; }
  .detalhe-hero { background: white !important; }
  .detalhe-image { min-height: 200px !important; }
}

.menu-icon i,
.header-nav-close i {
  pointer-events: none !important;
}
`;

  document.head.appendChild(style);
}
