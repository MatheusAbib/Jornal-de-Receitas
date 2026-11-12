
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { prefetchRota } from '../../../services/prefetch';
import { listarCarrossel } from '../../../services/carrosselService';
import './Header.css';

function Header({
  usuario,
  paginaAtual,
  onAbrirLogin,
  onAbrirLogout,
  onAbrirPerfil,
  onAbrirNotificacoes,
  notificacoesNaoLidas = 0
}) {
  const [scrollado, setScrollado] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [imagemHeader, setImagemHeader] = useState('/images/propaganda-elefante.jpg');

  const headerRef = useRef(null);
  const botaoMenuRef = useRef(null);
  const botaoFecharRef = useRef(null);
  const alturaOriginalRef = useRef(0);

  const navigate = useNavigate();

  const estaLogado = Boolean(usuario);
  const sempreScrollado = ['nova', 'detalhe', 'minhas-receitas'].includes(paginaAtual);
  const compacto = sempreScrollado || scrollado;

  const nomeUsuario = usuario?.nome || '';
  const primeiroNome = nomeUsuario.trim().split(' ')[0];
  const quantidadeNotificacoes = Math.max(0, Number(notificacoesNaoLidas) || 0);
  const contadorNotificacoes = quantidadeNotificacoes > 99 ? '99+' : quantidadeNotificacoes;

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    let ativo = true;

    async function carregarImagemHeader() {
      try {
        const dados = await listarCarrossel(true);

        const imagens = Array.isArray(dados)
          ? dados.filter(item => item.imagemUrl)
          : [];

        const sextaImagem = imagens[5];

        if (!ativo || !sextaImagem) return;

        const caminho = sextaImagem.imagemUrl;

        const url = (
          caminho.startsWith('http://') ||
          caminho.startsWith('https://') ||
          caminho.startsWith('data:') ||
          caminho.startsWith('blob:') ||
          caminho.startsWith('/uploads/')
        )
          ? caminho
          : `/uploads/${caminho.replace(/^\/+/, '')}`;

        setImagemHeader(url);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarImagemHeader();

    return () => {
      ativo = false;
    };
  }, []);


useLayoutEffect(() => {
  if (sempreScrollado) {
    setScrollado(false);
    return;
  }

  const header = headerRef.current;
  if (!header) return;

  let frame = null;
  let alturaOriginal = 0;

  const medirAltura = () => {
    if (header.classList.contains('scrolled')) return;

    const altura = header.offsetHeight;

    if (altura > 0) {
      alturaOriginal = altura;
      alturaOriginalRef.current = altura;
    }
  };

  const atualizarScroll = () => {
    if (frame !== null) return;

    frame = requestAnimationFrame(() => {
      const limite = alturaOriginal || alturaOriginalRef.current;

      if (limite > 0) {
        setScrollado(window.scrollY >= limite);
      }

      frame = null;
    });
  };

  medirAltura();
  atualizarScroll();

  const observer = new ResizeObserver(() => {
    medirAltura();
    atualizarScroll();
  });

  observer.observe(header);

  window.addEventListener('scroll', atualizarScroll, { passive: true });

  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', atualizarScroll);

    if (frame !== null) {
      cancelAnimationFrame(frame);
    }
  };
}, [sempreScrollado]);


  useEffect(() => {
    setSidebarAberta(false);
  }, [paginaAtual]);

  useEffect(() => {
    if (!sidebarAberta) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setSidebarAberta(false);
        botaoMenuRef.current?.focus();
      }

      if (event.key === 'Tab') {
        const elementos = document.querySelectorAll(
          '.header-nav.open a, .header-nav.open button:not([disabled])'
        );

        const focaveis = Array.from(elementos).filter(
          elemento => elemento.getClientRects().length > 0
        );

        if (!focaveis.length) return;

        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];

        if (event.shiftKey && document.activeElement === primeiro) {
          event.preventDefault();
          ultimo.focus();
        } else if (!event.shiftKey && document.activeElement === ultimo) {
          event.preventDefault();
          primeiro.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    botaoFecharRef.current?.focus();

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarAberta]);

  function fecharSidebar() {
    setSidebarAberta(false);
  }

  function abrirSidebar() {
    setSidebarAberta(true);
  }

  function irPara(event, caminho) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    fecharSidebar();
    navigate(caminho);
  }

  function executarAcao(acao) {
    fecharSidebar();
    acao?.();
  }

  const links = [
    {
      caminho: '/',
      texto: 'Início',
      icone: 'pi-home',
      ativo: paginaAtual === 'inicio'
    },
    {
      caminho: '/sobre',
      texto: 'Sobre o Jornal',
      icone: 'pi-info-circle',
      ativo: paginaAtual === 'sobre'
    },
    ...(estaLogado
      ? [
          {
            caminho: '/nova',
            texto: 'Enviar Receita',
            icone: 'pi-pencil',
            ativo: paginaAtual === 'nova'
          },
          {
            caminho: '/minhas-receitas',
            texto: 'Minhas Receitas',
            icone: 'pi-book',
            ativo: paginaAtual === 'minhas-receitas'
          }
        ]
      : [])
  ];

  return (
    <div
      ref={headerRef}
      className={`header-full-width ${compacto ? 'scrolled' : ''}`}
    >
      <div className="header-container">
        <header className="newspaper-header">
          <div className="header-edition-bar">
            <div className="header-edition-left">
              <span className="header-edition-mark">JR</span>
              <span className="header-edition-number">Edição nº 04</span>
            </div>

            <span className="header-edition-description">
              Da sua cozinha para o mundo
            </span>

            <time className="newspaper-date">
              {dataAtual}
            </time>
          </div>

          <div className="header-top">
            <div className="header-left">
              <button
                ref={botaoMenuRef}
                type="button"
                className="menu-icon"
                onClick={abrirSidebar}
                aria-label="Abrir menu de navegação"
                aria-expanded={sidebarAberta}
                aria-controls="header-navigation"
              >
                <i className="pi pi-bars" aria-hidden="true" />
                <span>Menu</span>
              </button>

              <div className="header-vintage-ad">
                <img
                  src={imagemHeader}
                  alt="Ilustração do Jornal de Receitas"
                  className="header-vintage-ad-image"
                />
              </div>
            </div>

            <div className="header-center">
              <a
                href="/"
                className="newspaper-title-link"
                onMouseEnter={() => prefetchRota('/')}
                onClick={event => irPara(event, '/')}
                aria-label="Jornal de Receitas — Página inicial"
              >
                <span className="header-title-kicker">
                  <span className="footer-eyebrow-line" />
                  O seu jornal de cozinha
                  <span className="footer-eyebrow-line" />
                </span>

                <span className="newspaper-title">
                  <span>Jornal</span>
                  <span className="newspaper-title-middle">
                    <span className="newspaper-title-de">de</span>
                    <span>Receitas</span>
                  </span>
                </span>

                <span className="header-title-bottom">
                  <span className="header-title-rule" />
                  <span>Bom de ler. Melhor de fazer.</span>
                  <span className="header-title-rule" />
                </span>
              </a>
            </div>

            <div className="header-right">
              {estaLogado ? (
                <div className="header-account">
                  <div className="header-account-greeting">
                    <span>Olá,</span>
                    <strong>{primeiroNome}</strong>
                  </div>

                  <div className="header-account-actions">
                    <button
                      type="button"
                      className="header-user-profile header-user-desktop"
                      onClick={() => executarAcao(onAbrirPerfil)}
                      aria-label="Abrir meu perfil"
                      title="Meu perfil"
                    >
                      <i className="pi pi-user" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      className="header-notification-btn header-notification-desktop"
                      onClick={() => executarAcao(onAbrirNotificacoes)}
                      aria-label={`Notificações: ${quantidadeNotificacoes} não lidas`}
                      title="Notificações"
                    >
                      <i className="pi pi-bell" aria-hidden="true" />
                      {quantidadeNotificacoes > 0 && (
                        <span className="notification-badge">
                          {contadorNotificacoes}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="header-logout-btn"
                      onClick={() => executarAcao(onAbrirLogout)}
                      aria-label="Sair da conta"
                      title="Sair"
                    >
                      <i className="pi pi-sign-out" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="header-login-button"
                  onClick={() => executarAcao(onAbrirLogin)}
                  aria-label="Entrar no Jornal"
                >
                  <i className="pi pi-user" aria-hidden="true" />
                  <span>Entrar no Jornal</span>
                </button>
              )}
            </div>
          </div>

          <div className="header-nav-frame">
            <div className="header-nav-decoration" aria-hidden="true">
              <span>Poste as suas receitas</span>
              <span>Feito para compartilhar</span>
            </div>

            <nav
              id="header-navigation"
              className={`header-nav ${sidebarAberta ? 'open' : ''}`}
              aria-label="Navegação principal"
              aria-hidden={compacto && !sidebarAberta ? true : undefined}
            >
              <div className="header-nav-top">
                <div>
                  <span className="header-nav-title">
                    Jornal de Receitas
                  </span>
                </div>

                <button
                  ref={botaoFecharRef}
                  type="button"
                  className="header-nav-close"
                  onClick={fecharSidebar}
                  aria-label="Fechar menu"
                >
                  <i className="pi pi-times" aria-hidden="true" />
                </button>
              </div>

              <div className="header-nav-links">
                {links.map(link => (
                  <a
                    key={link.caminho}
                    href={link.caminho}
                    onMouseEnter={() => prefetchRota(link.caminho)}
                    onClick={event => irPara(event, link.caminho)}
                    className={link.ativo ? 'active' : ''}
                    aria-current={link.ativo ? 'page' : undefined}
                  >
                    <i className={`pi ${link.icone}`} aria-hidden="true" />
                    <span>{link.texto}</span>
                  </a>
                ))}

                {!estaLogado && (
                  <button
                    type="button"
                    className="header-nav-login"
                    onClick={() => executarAcao(onAbrirLogin)}
                  >
                    <i className="pi pi-sign-in" aria-hidden="true" />
                    <span>Acessar Conta</span>
                  </button>
                )}
              </div>

              {estaLogado && (
                <div className="header-nav-account">
                  <span className="header-nav-account-title">
                    Minha conta
                  </span>

                  <button
                    type="button"
                    className="header-user-mobile"
                    onClick={() => executarAcao(onAbrirPerfil)}
                  >
                    <i className="pi pi-user" aria-hidden="true" />
                    <span>Meu Perfil</span>
                  </button>

                  <button
                    type="button"
                    className="header-notification-sidebar"
                    onClick={() => executarAcao(onAbrirNotificacoes)}
                  >
                    <i className="pi pi-bell" aria-hidden="true" />
                    <span>Notificações</span>
                    {quantidadeNotificacoes > 0 && (
                      <span className="notification-sidebar-badge">
                        {contadorNotificacoes}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className="header-logout-sidebar"
                    onClick={() => executarAcao(onAbrirLogout)}
                  >
                    <i className="pi pi-sign-out" aria-hidden="true" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              )}

              <div className="header-nav-footer">
                <span>Da sua cozinha para o mundo</span>
                <span>Edição nº 04</span>
              </div>
            </nav>
          </div>
        </header>
      </div>

      {sidebarAberta && (
        <button
          type="button"
          className="header-nav-overlay open"
          onClick={fecharSidebar}
          aria-label="Fechar menu de navegação"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

export default Header;
