import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ usuario, paginaAtual, onAbrirLogin, onAbrirLogout, onAbrirPerfil, onAbrirNotificacoes, notificacoesNaoLidas }) {
  const [scrollado, setScrollado] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const navigate = useNavigate();

  const estaLogado = !!usuario;
  const sempreScrollado = paginaAtual === 'nova' || paginaAtual === 'detalhe' || paginaAtual === 'minhas-receitas';
  const scrolled = sempreScrollado || scrollado;

  useEffect(() => {
    if (sempreScrollado) return;

    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrollado(scrollTop > 150);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sempreScrollado]);

  function toggleSidebar() {
    setSidebarAberta(!sidebarAberta);
    document.body.style.overflow = !sidebarAberta ? 'hidden' : 'auto';
  }

  function fecharSidebar() {
    setSidebarAberta(false);
    document.body.style.overflow = 'auto';
  }

  function irPara(e, caminho) {
    e.preventDefault();
    fecharSidebar();
    navigate(caminho);
  }

  function irParaInicio() {
    if (scrolled) navigate('/');
  }

  const nomeUsuario = usuario?.nome || '';
  const primeiroNome = nomeUsuario.split(' ')[0];

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`header-full-width ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <header className="newspaper-header">
          <div className="header-top">
            <div className="header-left">
              <button type="button" className="menu-icon" onClick={toggleSidebar} aria-label="Abrir menu">
                <i className="pi pi-bars"></i>
              </button>
              <div className="newspaper-price">Edição #03</div>
            </div>
            <div className="header-center">
              <h1
                className={`newspaper-title ${scrolled ? 'clicavel' : ''}`}
                onClick={irParaInicio}
              >
                Jornal de Receitas
              </h1>
              {estaLogado ? (
                <div className="header-greeting">
                  <p className="newspaper-subtitle">
                    Bem vindo(a), <span style={{ fontWeight: 700, color: '#d4af37' }}>{nomeUsuario}</span>!
                  </p>
                  <p className="newspaper-date header-greeting-date">
                    {dataAtual}
                  </p>
                </div>
              ) : (
                <div className="header-greeting">
                  <p className="newspaper-subtitle">Delícias do dia a dia para todos os gostos</p>
                  <p className="newspaper-subtitle">Faça Login ou Cadastre-se</p>
                </div>
              )}
            </div>
            <div className="header-right">
              {!estaLogado && (
                <div className="newspaper-date header-date-deslogado">
                  {dataAtual}
                </div>
              )}

              {estaLogado && (
                <>
                  <div className="header-user-profile header-user-desktop" onClick={onAbrirPerfil}>
                    <i className="pi pi-user"></i>
                    <span>{primeiroNome}</span>
                  </div>
                  <button type="button" className="header-notification-btn header-notification-desktop" onClick={onAbrirNotificacoes} aria-label="Notificações">
                    <i className="pi pi-bell"></i>
                    {notificacoesNaoLidas > 0 && (
                      <span className="notification-badge">{notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}</span>
                    )}
                  </button>
                  <button type="button" className="header-logout-btn" onClick={onAbrirLogout}>
                    <i className="pi pi-sign-out"></i>
                    <span>Sair</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={`header-nav-overlay ${sidebarAberta ? 'open' : ''}`} onClick={fecharSidebar}></div>

          <nav className={`header-nav ${sidebarAberta ? 'open' : ''}`}>
            <div className="header-nav-top">
              <span className="header-nav-title">Jornal de Receitas</span>
              <button type="button" className="header-nav-close" onClick={fecharSidebar}>&times;</button>
            </div>

            <a href="/" onClick={(e) => irPara(e, '/')} className={paginaAtual === 'inicio' ? 'active' : ''}>
              <i className="pi pi-home"></i> Início
            </a>

            <a href="/sobre" className={paginaAtual === 'sobre' ? 'active' : ''}>
              <i className="pi pi-info-circle"></i> Sobre
            </a>

            {!estaLogado && (
              <a href="#" onClick={(e) => { e.preventDefault(); onAbrirLogin(); }}>
                <i className="pi pi-sign-in"></i> Acessar Conta
              </a>
            )}

            {estaLogado && (
              <>
                <a href="/nova" onClick={(e) => irPara(e, '/nova')} className={paginaAtual === 'nova' ? 'active' : ''}>
                  <i className="pi pi-shop"></i> Enviar Receita
                </a>
                <a href="/minhas-receitas" onClick={(e) => irPara(e, '/minhas-receitas')} className={paginaAtual === 'minhas-receitas' ? 'active' : ''}>
                  <i className="pi pi-book"></i> Minhas Receitas
                </a>
                <a href="#" className="header-notification-nav" onClick={(e) => { e.preventDefault(); onAbrirNotificacoes(); }}>
                  <i className="pi pi-bell"></i>
                  <span>Notificações</span>
                  {notificacoesNaoLidas > 0 && (
                    <span className="notification-sidebar-badge">{notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}</span>
                  )}
                </a>
                <a href="#" className="header-notification-sidebar" onClick={(e) => { e.preventDefault(); onAbrirNotificacoes(); }}>
                  <i className="pi pi-bell"></i>
                  <span>Notificações</span>
                  {notificacoesNaoLidas > 0 && (
                    <span className="notification-sidebar-badge">{notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}</span>
                  )}
                </a>
                <div className="header-user-profile header-user-mobile" onClick={onAbrirPerfil}>
                  <i className="pi pi-user"></i> Meu Perfil
                </div>
                <a href="#" className="header-logout-sidebar" onClick={(e) => { e.preventDefault(); onAbrirLogout(); }}>
                  <i className="pi pi-sign-out"></i> Sair
                </a>
              </>
            )}
          </nav>
        </header>
      </div>
    </div>
  );
}

export default Header;
