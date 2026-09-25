export function applyResponsiveStyles() {
  if (document.getElementById('responsive-styles')) return;

  const style = document.createElement('style');
  style.id = 'responsive-styles';
  style.innerHTML = `
@media (max-width: 1400px) {
  body { max-width: 1400px; margin: 0 auto; }
}

@media (max-width: 1200px) {
  .receitas-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 20px; }
  .nova-info-card { max-width: 360px; }
    .newspaper-title::before, .newspaper-title::after { display: none; }

}

@media (max-width: 1024px) {
  .newspaper-title { font-size: 2rem; }
  .newspaper-date, .newspaper-price { display: none; }
  .header-user-profile, .header-logout-btn { padding: 4px 14px; }
  .carousel-container { height: 400px; min-height: 400px; }
  .receitas-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 26px; }
  .footer-content { grid-template-columns: repeat(3, 1fr); }
  .modal-content { max-width: 70% !important; }
  .minhas-wrapper { width: auto; padding: 80px 20px 50px; }
  .minhas-stats { grid-template-columns: repeat(3, 1fr); }
  .minhas-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .detalhe-hero { grid-template-columns: 1fr; min-height: auto; }
  .detalhe-image { min-height: 320px; height: 320px; border-right: none; border-bottom: 2px solid var(--header-color); }
  .detalhe-info { padding: 30px; }
  .detalhe-titulo { font-size: 2rem; }
  .detalhe-body { grid-template-columns: 1fr; padding: 30px; gap: 40px; }
  .detalhe-section:first-child { border-right: none; border-bottom: 1px dashed rgba(139, 0, 0, 0.2); padding-bottom: 30px; }
  .nova-main-layout { grid-template-columns: 1fr; }
  .nova-info-card { position: static; max-width: 100%; width: 100%; }
  .dashboard-cards { grid-template-columns: repeat(2, 1fr); padding: 20px 25px; }
  .dashboard-grid { padding: 0 25px 25px; }
}

@media (max-width: 996px) {
  .newspaper-header { padding: 20px; }
  .header-nav { margin-top: 10px; }
  .newspaper-subtitle { font-size: 0.85rem; }
  .header-nav a { padding: 10px 14px; font-size: 0.75rem; }
  .newspaper-title { font-size: 2.8rem; }
  .newspaper-title::before, .newspaper-title::after { font-size: 2rem; }
  .newspaper-title::before { left: -25px; }
  .newspaper-title::after { right: -25px; }
  .header-full-width.scrolled .newspaper-title { padding: 0; font-size: 1.3rem; }
}

@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; gap: 18px; }
  .panel-body-chart { height: 320px; }
  .carousel-container { min-height: 380px; }
  .carousel-caption h3 { font-size: 2rem; }
  .carousel-caption p { font-size: 1rem; }
  .ver-receita-grid { grid-template-columns: 1fr 1fr; }
  .ver-receita-col-imagem { grid-column: 1 / -1; }
  .ver-receita-imagem { height: 240px; }
}

@media (max-width: 768px) {
  body { max-width: 100% !important; overflow-x: hidden !important; padding: 0 !important; }
  .home-wrapper{margin: 0;}
  .user-view-info {
      gap: 8px;
  }
  .header-container, .header-full-width.scrolled .header-container { padding: 12px 15px; }
  .newspaper-header { padding: 0; }
  .header-right, .newspaper-price, .newspaper-date, .header-logout-btn, .header-notification-btn, .header-user-desktop { display: none; }
  .newspaper-subtitle { display: none; }
  .header-center { justify-content: flex-end; gap: 0; }
  .header-greeting { text-align: center; }
  .newspaper-title { padding: 0; font-size: 1.15rem; letter-spacing: 1px; text-shadow: none; }
  .newspaper-title::before, .newspaper-title::after { display: none; }
  .header-full-width.scrolled .newspaper-title { font-size: 1.15rem; }

  .header-notification-desktop, .header-notification-nav, .header-notification-btn { display: none !important; }
  .header-nav.open .header-notification-sidebar { display: inline-flex !important; }
  .header-nav.open .header-notification-nav, .header-nav.open .header-notification-desktop { display: none !important; }

  .menu-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; padding: 0; flex-shrink: 0; color: white; font-size: 1.3rem; cursor: pointer; background: rgba(255, 255, 255, 0.06); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 4px; transition: all 0.25s ease; }

  .header-nav { position: fixed; top: 0; left: -5px; z-index: 2000; display: flex; flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 8px; width: 280px; max-width: 85%; height: 100vh; margin: 0; padding: 18px; overflow-y: auto; flex-wrap: nowrap; background: #fff; border: none; border-right: 2px solid var(--header-color); box-shadow: 4px 0 0 rgba(139, 0, 0, 0.15); transform: translateX(-100%); transition: transform 0.3s ease; }
  .header-nav.open { transform: translateX(0) !important; }
  .header-nav a { justify-content: flex-start; padding: 14px 18px; color: var(--header-color); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: transparent; border: 2px solid var(--header-color); transform: none; }
  .header-nav a i { color: var(--header-color); opacity: 1; }
  .header-nav a.active { color: var(--header-color); background: var(--accent-color); border-color: var(--accent-color); }
  .header-nav.open .header-nav-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 14px; margin-bottom: 12px; border-bottom: 2px solid var(--header-color); }
  .header-nav.open .header-nav-title { display: block; margin: 0; color: var(--header-color); font-family: 'DM Serif Display', serif; font-size: 1.2rem; font-weight: 800; line-height: 1.1; text-transform: uppercase; letter-spacing: 2px; }
  .header-nav.open .header-nav-close { display: flex; align-items: center; justify-content: center; padding: 0; color: var(--header-color); font-size: 1.8rem; line-height: 1; cursor: pointer; background: none; border: none; opacity: 0.7; transition: all 0.3s ease; }
  .header-nav .header-user-profile, .header-nav .header-user-mobile, .header-nav .header-notification-sidebar, .header-nav .header-logout-sidebar { display: inline-flex !important; width: 100%; min-height: 46px; height: auto; padding: 14px 18px; box-sizing: border-box; justify-content: flex-start; color: var(--header-color); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; background: transparent; border: 2px solid var(--header-color); border-radius: 4px; transform: none; }
  .header-nav .header-user-profile i, .header-nav .header-user-profile span, .header-nav .header-user-mobile i, .header-nav .header-notification-sidebar i, .header-nav .header-logout-sidebar i { color: var(--header-color); }
  .header-nav .header-notification-sidebar .notification-sidebar-badge { display: inline-flex; }
  .header-full-width.scrolled .header-nav { max-height: none; padding: 18px; overflow-y: auto; opacity: 1; background: #fff; border: none; border-right: 2px solid var(--header-color); }
  .header-full-width.scrolled .header-nav:not(.open) { transform: translateX(-100%); }
  .header-full-width.scrolled .header-nav.open { transform: translateX(0) !important; padding: 15px; }
  .header-full-width.scrolled .header-nav.open .header-user-mobile, .header-full-width.scrolled .header-nav.open .header-notification-sidebar, .header-full-width.scrolled .header-nav.open .header-logout-sidebar { display: inline-flex !important; }
  .header-full-width.scrolled .header-nav.open .header-user-profile { display: inline-flex !important; font-size: 0.85rem; font-weight: 700; }

  .carousel-container { display: none; }

  .tab-buttons { display: flex; align-items: stretch; flex-direction: row; flex-wrap: nowrap; margin: 38px auto 0 auto; }
  .tab-button { text-align: center; font-size: 0.7rem; gap: 3px; }
  .tab-button .badge { padding: 2px 6px; font-size: 0.6rem; }
  .recipe-count { display: none; }

  .recipe-filters { padding: 12px; margin: 20px 0 0 0; }
  .filtros-grid { grid-template-columns: 1fr; }
  .filter-buttons { flex-direction: column; margin-top: 0; gap: 8px; }
  .filter-buttons button { width: 100%; justify-content: center; }

  .receitas-grid { grid-template-columns: 1fr 1fr !important; gap: 10px; margin: 24px 0; }
  .card { box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15); }
  .card-image { height: 120px; }
  .card-content { padding: 12px 12px 14px; }
  .card-titulo { font-size: 0.95rem; margin-bottom: 8px; }
  .card-meta { gap: 6px; padding-bottom: 6px; }
  .card-meta-row { gap: 8px; }
  .card-meta-item { font-size: 0.72rem; gap: 4px; }
  .card-meta-item i { font-size: 0.7rem; }
  .card-link { font-size: 0.68rem; padding: 8px 10px; }
  .card-favorite-btn { width: 32px; height: 32px; font-size: 0.85rem; }
  .card-badge-categoria { font-size: 0.6rem; padding: 4px 10px; letter-spacing: 1px; }
  .category-title { font-size: 1.1rem; gap: 8px; }

  .detalhe-container { padding: 70px 5px 0; gap: 20px; margin: 0; }
  .detalhe-card { box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15); border: 1px solid var(--header-color); }
  .detalhe-badge-categoria { display: none; }
  .detalhe-image { min-height: 260px; height: 260px; }
  .detalhe-info { padding: 22px 20px; }
  .detalhe-info-header { flex-direction: column; align-items: stretch; gap: 14px; }
  .detalhe-info-actions { position: static; width: 100%; }
  .detalhe-favorite-btn, .detalhe-print-btn { flex: 1; min-width: 0; padding: 10px 12px; font-size: 0.72rem; }
  .detalhe-titulo { font-size: 1.7rem; margin-bottom: 15px; }
  .detalhe-meta { gap: 6px; }
  .detalhe-meta-item { font-size: 0.75rem; padding: 4px 11px; }
  .detalhe-body { padding: 25px 20px; gap: 30px; }
  .detalhe-section:first-child { padding-bottom: 25px; }
  .detalhe-section-header { gap: 10px; margin-bottom: 18px; padding-bottom: 12px; }
  .detalhe-section-header i { font-size: 1rem; }
  .detalhe-section-header h2 { font-size: 0.95rem; }
  .detalhe-section-count { font-size: 0.65rem; padding: 3px 10px; }
  .detalhe-ingrediente-item { padding: 10px 14px; gap: 12px; }
  .detalhe-ingrediente-text { font-size: 0.88rem; }
  .detalhe-preparo-item { padding: 13px 15px; gap: 13px; }
  .detalhe-preparo-number { min-width: 28px; height: 28px; font-size: 0.78rem; }
  .detalhe-preparo-text { font-size: 0.88rem; }

  .minhas-wrapper { padding: 80px 5px 40px; margin: 0; width: auto; }
  .minhas-stats { grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 20px; }
  .stat-card { padding: 12px; gap: 10px; }
  .stat-icon { width: 36px; height: 36px; font-size: 0.95rem; }
  .stat-value { font-size: 1.2rem; }
  .stat-label { font-size: 0.6rem; }
  .minhas-tabs { margin: 20px 0; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .minhas-tabs::-webkit-scrollbar { display: none; }
  .minhas-tab { padding: 10px 14px; font-size: 0.7rem; flex: 1; justify-content: center; }
  .minhas-grid { grid-template-columns: 1fr 1fr !important; gap: 5px; }
  .minha-card { box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15); }
  .minha-imagem { height: 130px; }
  .status-badge { top: 8px; right: 8px; font-size: 0.6rem; padding: 4px 8px; gap: 4px; }
  .minha-info { padding: 10px; }
  .minha-info h3 { font-size: 0.9rem; margin-bottom: 8px; }
  .minha-meta { font-size: 0.7rem; gap: 6px; margin-bottom: 12px; padding-bottom: 10px; }
  .minha-actions { gap: 6px; }
  .minha-actions button { min-width: 100%; padding: 8px 10px; font-size: 0.65rem; }

  .nova-main-layout { padding: 80px 15px 40px; gap: 20px; }
  .nova-recipe-form { padding: 20px; }
  .nova-form-row { grid-template-columns: 1fr; gap: 12px; }
  .nova-titulo-width, .nova-tempo-width, .nova-porcoes-width { grid-column: span 1; }
  .nova-ingrediente-row { grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; background: rgba(212, 175, 55, 0.04); border-radius: 4px; border: 1px solid rgba(139, 0, 0, 0.1); }
  .nova-ingrediente-nome-wrapper { grid-column: 1 / -1; }
  .nova-info-body { padding: 16px; }
  .nova-info-section { padding-bottom: 12px; margin-bottom: 18px; }
  .nova-info-section h4 { font-size: 0.78rem; }
  .nova-info-section p, .nova-info-section li { font-size: 0.85rem; }
  .nova-submit-button { padding: 14px; font-size: 0.9rem; }

  .sobre-container { padding: 80px 5px 40px; margin: 0; }
  .sobre-header h1 { font-size: 1.8rem; }
  .sobre-content { gap: 15px; }
  .timeline-item { flex-direction: column; gap: 8px; padding-bottom: 18px; }
  .timeline-item::before { display: none; }
  .timeline-year { width: 90px; height: 36px; font-size: 0.9rem; }

  .modal-overlay { overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; padding: 3px; }
  .modal-content { max-height: 80vh !important; overflow-y: auto !important; margin: 5% auto !important; }
  .modal-body { max-height: calc(80vh - 100px) !important; overflow-y: auto !important; }
  .modal-actions { flex-direction: column; gap: 8px; }
  .modal-actions button { width: 100%; }

  .admin-content-wrapper { margin-left: 0 !important; width: 100% !important; max-width: none !important; }
  .admin-table-container { margin: 0; }
  .admin-search-box { width: 100%; }
  .admin-search-box input { width: 100% !important; font-size: 0.88rem; padding: 11px 14px 11px 40px; }
  .admin-table thead { display: none; }
  .admin-table tr { display: block; margin-bottom: 15px; border: 2px solid var(--header-color); padding: 8px; }
  .admin-table td { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px dashed rgba(139, 0, 0, 0.15); }
  .admin-table td::before { content: attr(data-label); font-weight: 700; color: var(--header-color); font-size: 0.75rem; text-transform: uppercase; }
  .admin-topbar { flex-direction: column; align-items: stretch; padding: 15px; padding-left: 70px; gap: 12px; }
  .admin-topbar h1 { font-size: 1.15rem; }
  .admin-topbar-actions { flex-direction: column; align-items: stretch; gap: 10px; width: 100%; }
  .admin-topbar-actions > span { font-size: 0.8rem; justify-content: center; padding: 6px 10px; background: rgba(139, 0, 0, 0.04); border-left: 3px solid var(--accent-color); }
  .admin-table-header .count { font-size: 0.9rem; }
  .admin-recipe-tabs { flex-direction: column; align-items: stretch; gap: 6px; margin-bottom: 15px; }
  .admin-recipe-tab { justify-content: space-between; padding: 8px 10px; font-size: 0.65rem; }
  .admin-cards-grid { grid-template-columns: 1fr; padding: 15px; gap: 20px; }
  .admin-recipe-image { height: 180px; }
  .admin-recipe-content { padding: 18px; }
  .admin-recipe-content h2 { font-size: 1.2rem; }
  .admin-sidebar-toggle { display: inline-flex; }
  .admin-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 2000; }
  .admin-sidebar.open { transform: translateX(0); }
  .admin-sidebar-close { display: block; }

  .dashboard-cards { padding: 15px 5px; gap: 12px; }
  .dashboard-grid { padding: 0 5px 20px; }
  .dashboard-card { padding: 16px; gap: 12px; }
  .card-icon { width: 42px; height: 42px; font-size: 1.15rem; }
  .card-value { font-size: 1.5rem; }
  .panel-header { padding: 14px 18px; }
  .panel-header h2 { font-size: 0.95rem; }
  .panel-body-chart { padding: 15px; height: 280px; }
  .top-item { grid-template-columns: 34px 1fr auto; gap: 12px; }
  .top-rank { width: 34px; height: 34px; font-size: 1rem; }
  .top-titulo { font-size: 0.82rem; }
  .top-count { font-size: 1rem; min-width: 46px; }

  .footer-content { grid-template-columns: 1fr; gap: 30px; padding: 30px 8px 20px; width: auto; }
  .footer-title { font-size: 1rem; }
  .footer-description { font-size: 0.85rem; }
  .footer-bottom { padding: 16px 20px; }
  .footer-bottom p { font-size: 0.7rem; }
  .social-links { flex-wrap: wrap; justify-content: left; }

  .p-toast { width: 100%; left: 0; right: 0; padding: 0 12px; }
  .p-toast-top-right, .p-toast-top-left, .p-toast-bottom-right, .p-toast-bottom-left { width: 100%; max-width: 100%; left: 0; right: 0; padding: 12px; }
  .p-toast .p-toast-message { margin: 0 0 10px 0; width: 100%; }
  .p-toast .p-toast-message-content { padding: 12px 14px; gap: 10px; }
  .p-toast .p-toast-summary { font-size: 0.9rem; }
  .p-toast .p-toast-detail { font-size: 0.8rem; }

  .minhas-tab:hover { color: var(--light-text); background: transparent; }
  .minha-card:hover { box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15); }
  .btn-ver:hover, .btn-motivo:hover, .btn-excluir:hover { transform: none; }
  .nova-tempo-toggle:hover { background: #fff; color: var(--header-color); }
  .nova-file-label:hover { border-color: rgba(139, 0, 0, 0.3); background: #faf8f5; }
  .nova-submit-button:hover { background: var(--header-color); color: #fff; border: 2px solid var(--header-color); }
  .nova-add-btn:hover { color: var(--accent-color); background-color: white; border: 2px solid var(--accent-color); }
  .tab-button:hover { color: var(--light-text); background: transparent; }
  .card:hover { transform: none; box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15); }
  .card-favorite-btn:hover { background: #fff; color: var(--header-color); }
  .card-link:hover { background: var(--header-color); color: #fff; }
  .detalhe-favorite-btn:hover, .detalhe-print-btn:hover { transform: none; box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15); }
  .detalhe-ingrediente-item:hover { border-color: rgba(139, 0, 0, 0.15); transform: none; }
  .detalhe-preparo-item:hover { border-color: rgba(139, 0, 0, 0.15); transform: none; }
  .carousel-control:hover { background: #fff; color: var(--header-color); transform: none; box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.25); }
  .admin-recipe-card:hover { box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15); }
  .admin-btn-view:hover, .admin-btn-approve:hover, .admin-btn-reject:hover { transform: none; box-shadow: 2px 2px 0 rgba(139, 0, 0, 0.15); }
  .admin-recipe-tab:hover { color: var(--light-text); background: transparent; }
  .action-btn.btn-view:hover { transform: none; }
  .header-nav a:hover { border-color: var(--header-color); transform: none; box-shadow: none; }
  .header-nav a:hover i { color: var(--header-color); opacity: 0.9; }
  .header-nav a.active:hover { color: var(--header-color); background: var(--accent-color); border-color: var(--accent-color); transform: none; box-shadow: none; }
  .header-user-profile:hover, .header-logout-btn:hover, .header-notification-btn:hover { color: white; background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.25); transform: none; box-shadow: none; }
  .header-full-width.scrolled .menu-icon:hover { color: white; background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.3); }
  .header-nav.open .header-nav-close:hover { opacity: 0.7; transform: none; }
  .header-full-width.scrolled .header-nav.open > a:hover { color: var(--header-color); background: transparent; border-color: var(--header-color); }
  .header-full-width.scrolled .header-nav.open > a:hover i { color: var(--header-color); }
  .header-full-width.scrolled .header-nav.open .header-user-profile:hover { color: var(--header-color); background: transparent; border-color: var(--header-color); transform: none; box-shadow: none; }
  .header-full-width.scrolled .header-nav.open .header-user-profile:hover i, .header-full-width.scrolled .header-nav.open .header-user-profile:hover span { color: var(--header-color); }
  .header-nav .header-user-profile:hover, .header-nav .header-user-mobile:hover, .header-nav .header-notification-sidebar:hover, .header-nav .header-logout-sidebar:hover { color: var(--header-color); background: transparent; border-color: var(--header-color); }
  .header-nav .header-user-profile:hover i, .header-nav .header-user-profile:hover span, .header-nav .header-user-mobile:hover i, .header-nav .header-notification-sidebar:hover i, .header-nav .header-logout-sidebar:hover i { color: var(--header-color); }
  .menu-icon:hover { color: white; background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.3); }
  .admin-sidebar-btn:hover { color: var(--header-color); background: transparent; border-color: var(--header-color); }
  .admin-sidebar-btn:hover i { color: var(--header-color); }
  .admin-sidebar-btn-sair:hover, .admin-sidebar-btn-sair:hover i { color: var(--header-color); background: transparent; border-color: var(--header-color); }
  .admin-sidebar-toggle:hover { color: white; background: none; border-color: white; }
}

@media (max-width: 768px) and (orientation: landscape) {
  .carousel-container { height: 300px; }
  .newspaper-title { font-size: 2.2rem; }
}

@media (max-width: 600px) {
  .modal-content { max-width: 100%; max-height: 95vh; }
  .modal-header { padding: 16px 20px; }
  .modal-header h2 { font-size: 1rem; }
  .modal-body { padding: 20px; }
  .modal-footer { flex-direction: column-reverse; padding: 14px 20px; }
  .modal-actions { flex-direction: column-reverse; }
  .modal-btn { width: 100%; }
  .modal-body .form-grid { grid-template-columns: 1fr; }
  .notificacoes-footer { flex-direction: column; }
  .notificacao-item { padding: 12px; gap: 10px; }
  .notificacao-icon { width: 34px; height: 34px; font-size: 1rem; }
  .user-form-row { grid-template-columns: 1fr; gap: 14px; }
  .cadastro-form-row { grid-template-columns: 1fr; }
  .resumo-card-value { font-size: 1.5rem; }
  .resumo-card-icon { width: 42px; height: 42px; font-size: 1.2rem; }
  .resumo-ingrediente-header { flex-direction: column; align-items: flex-start; }
  .ver-receita-grid { grid-template-columns: 1fr; }
  .top-item { grid-template-columns: 34px 1fr auto; gap: 12px; }
  .top-rank { width: 34px; height: 34px; font-size: 1rem; }
  .top-titulo { font-size: 0.82rem; }
  .top-count { font-size: 1rem; min-width: 46px; }
}

@media (max-width: 480px) {
  .header-container { padding: 10px 12px; }
  .header-full-width.scrolled .newspaper-title { font-size: 1.1rem; }
  .menu-icon { width: 38px; height: 38px; font-size: 1.5rem; }
  .header-nav a { padding: 12px 16px; }

  .tab-buttons { justify-content: space-between; }
  .recipe-filters { padding: 15px; margin: 20px 0 0 0; }
  .recipe-filters h3 { font-size: 1.3rem; }
  .filter-group input { padding: 10px 10px 10px 40px; }
  .filter-buttons { margin-top: 0; gap: 8px; }

  .receitas-grid { grid-template-columns: 1fr 1fr !important; gap: 5px; margin: 30px 0; }
  .card { margin-bottom: 15px; }
  .card-image { height: 110px; min-height: 100px !important; }
  .card-content { padding: 10px; }
  .card-titulo { font-size: 0.75rem; margin-bottom: 6px; }
  .card-meta-row { display: flex; flex-direction: column-reverse; justify-content: flex-start; align-items: normal; }
  .card-meta-chefe { display: none; }
  .card-meta-item { font-size: 0.7rem; }
  .card-link { font-size: 0.62rem; padding: 7px 8px; justify-content: center; }
  .card-favorite-btn { width: 28px; height: 28px; font-size: 0.8rem; }
  .card-badge-categoria { display: none; }
  .category-title { font-size: 1.6rem; }

  .detalhe-container { padding: 70px 5px 0; }
  .detalhe-image { min-height: 220px; height: 220px; }
  .detalhe-info { padding: 20px 16px; }
  .detalhe-titulo { font-size: 1.4rem; }
  .detalhe-meta-item { font-size: 0.7rem; padding: 4px 10px; }
  .detalhe-meta-item i { font-size: 0.8rem; }
  .detalhe-body { padding: 20px 16px; gap: 25px; }
  .detalhe-section-header h2 { font-size: 0.9rem; }
  .detalhe-section-header i { font-size: 0.9rem; }
  .detalhe-section-count { font-size: 0.6rem; padding: 3px 8px; }
  .detalhe-ingrediente-item { padding: 9px 12px; gap: 10px; }
  .detalhe-ingrediente-text { font-size: 0.85rem; }
  .detalhe-preparo-item { padding: 11px 12px; gap: 11px; }
  .detalhe-preparo-number { min-width: 24px; height: 24px; font-size: 0.72rem; }
  .detalhe-preparo-text { font-size: 0.85rem; line-height: 1.5; }
  .detalhe-favorite-btn, .detalhe-print-btn { padding: 9px 10px; font-size: 0.68rem; gap: 5px; }

  .minhas-tab { padding: 8px 10px; font-size: 0.65rem; }
  .tab-count { display: none; }
  .minhas-tab i { font-size: 0.8rem; }
  .minha-imagem { height: 110px; }
  .minha-info h3 { font-size: 0.85rem; }
  .minha-meta { font-size: 0.65rem; }

  .nova-main-layout { padding: 70px 5px 0; }
  .nova-recipe-form { padding: 15px; }
  .nova-form-group label { font-size: 0.75rem; gap: 4px; }
  .nova-form-group label i { font-size: 0.8rem; width: 14px; }
  .nova-form-group input, .nova-form-group select { padding: 10px 12px; font-size: 0.88rem; }
  .nova-ingrediente-row { grid-template-columns: 1fr; gap: 8px; padding: 10px; }
  .nova-quantidade, .nova-unidade { grid-column: span 1; }
  .nova-file-label { align-items: stretch; gap: 10px; padding: 12px; }
  .nova-file-text { font-size: 0.65rem; white-space: normal; }
  .nova-file-button { font-size: 0.8rem; width: 38px; height: 38px; }
  .nova-add-btn { width: 100%; justify-content: center; padding: 10px; font-size: 0.75rem; }
  .nova-passo-input { padding: 10px 42px 10px 12px; font-size: 0.85rem; }
  .nova-remove-btn { width: 26px; height: 26px; font-size: 14px; }
  .nova-submit-button { padding: 13px; font-size: 0.85rem; }
  .nova-info-header h3 { font-size: 0.9rem; gap: 8px; }
  .nova-info-body { padding: 14px; }
  .nova-info-section h4 { font-size: 0.72rem; }

  .sobre-header h1 { font-size: 1.5rem; }
  .sobre-section { padding: 20px 18px; }
  .sobre-section h2 { font-size: 1.1rem; }

  .modal-content { width: 100% !important; max-width: 100% !important; margin: 10px auto !important; border-radius: 4px !important; }
  .modal-body { padding: 15px !important; max-height: calc(90vh - 120px) !important; }
  .modal-body .form-group input, .modal-body .form-group select, .modal-body .form-group textarea { font-size: 16px !important; }
  .logout-modal-content { padding: 28px 20px 22px; }
  .logout-modal-icon { width: 60px; height: 60px; }
  .logout-modal-title { font-size: 1.1rem; }
  .logout-modal-message { font-size: 0.88rem; }
  .logout-modal-actions { flex-direction: column; gap: 10px; }
  .logout-btn-cancel, .logout-btn-confirm { flex: none; width: 100%; font-size: 0.75rem; padding: 10px 18px; }

  .admin-topbar { padding: 12px; padding-left: 65px; }
  .admin-topbar h1 { font-size: 1rem; }
  .admin-topbar-actions > span { font-size: 0.72rem; }
  .admin-search-box input { font-size: 0.82rem; padding: 10px 12px 10px 38px; }
  .admin-cards-grid { gap: 16px; }
  .admin-recipe-image { height: 160px; }
  .admin-recipe-content { padding: 15px; }
  .admin-recipe-content h2 { font-size: 1.1rem; }
  .admin-btn { padding: 9px 12px; font-size: 0.78rem; }

  .dashboard-cards { grid-template-columns: 1fr; }
  .panel-body-chart { height: 240px; }

  .footer-content { grid-template-columns: 1fr; gap: 25px; text-align: left; }
  .social-links a { width: 38px; height: 38px; font-size: 1rem; }

  .carousel-caption h3 { font-size: 1.15rem; }
  .carousel-caption p { font-size: 0.82rem; }
  .carousel-control { width: 36px; height: 36px; font-size: 0.85rem; }
  .carousel-controls { padding: 0 8px; }

  .p-toast .p-toast-message-content { padding: 10px 12px; }
  .p-toast .p-toast-summary { font-size: 0.85rem; }
  .p-toast .p-toast-detail { font-size: 0.75rem; }
}

@media (max-width: 378px) {
  .minhas-tabs { flex-direction: column; }
  .admin-recipe-tab span { display: none; }
  .admin-table-header .count { font-size: 0.7rem !important; }
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
  body { background: white; color: black; }
  .card, .minha-card, .admin-recipe-card { break-inside: avoid; box-shadow: none; border: 1px solid #ddd; }
  .detalhe-container { padding: 0; }
  .detalhe-card { box-shadow: none; border: none; }
  .detalhe-hero { background: white; }
  .detalhe-image { min-height: 200px; }
}

.menu-icon i,
.header-nav-close i {
  pointer-events: none;
}
`;

  document.head.appendChild(style);
}
