import { Link, useLocation } from 'react-router-dom';
import { prefetchRota } from '../../../services/prefetch';
import './AdminSidebar.css';

const menu = [
  { path: '/admin/dashboard', icone: 'pi-chart-line', label: 'Dashboard' },
  { path: '/admin/usuarios', icone: 'pi-users', label: 'Usuários' },
  { path: '/admin/pendentes', icone: 'pi-book', label: 'Receitas' },
  { path: '/admin/carrossel', icone: 'pi-images', label: 'Carrossel' }
];

function AdminSidebar({ aberta, onFechar, onAbrirPerfil, onAbrirLogout }) {
  const { pathname } = useLocation();
  const caminhoAtual = pathname.replace(/\/+$/, '');

  return (
    <aside className={'admin-sidebar' + (aberta ? ' open' : '')}>
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-header-info">
          <span className="admin-sidebar-label">Painel administrativo</span>
          <h2 className="admin-sidebar-brand" aria-label="Jornal de Receitas">
              <span>Jornal</span>
              <span className="admin-sidebar-brand-linha">
                <span className="admin-sidebar-brand-de">de</span>
                <span>Receitas</span>
              </span>
            </h2>
        </div>

        <button
          type="button"
          className="admin-sidebar-close"
          onClick={onFechar}
          aria-label="Fechar menu"
        >
          <i className="pi pi-times" aria-hidden="true" />
        </button>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Navegação administrativa">
        <span className="admin-sidebar-section-title">Gerenciamento</span>

        {menu.map(({ path, icone, label }) => {
          const ativo = caminhoAtual === path;

          return (
            <Link
              key={path}
              to={path}
              className={'admin-sidebar-link' + (ativo ? ' active' : '')}
              aria-current={ativo ? 'page' : undefined}
              onMouseEnter={() => prefetchRota(path)}
              onFocus={() => prefetchRota(path)}
              onClick={event => {
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

                onFechar?.();
              }}
            >
              <i className={'pi ' + icone} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <span className="admin-sidebar-section-title">Conta</span>

        <button
          type="button"
          className="admin-sidebar-btn"
          onClick={onAbrirPerfil}
        >
          <i className="pi pi-user" aria-hidden="true" />
          <span>Editar perfil</span>
        </button>

        <button
          type="button"
          className="admin-sidebar-btn admin-sidebar-btn-sair"
          onClick={onAbrirLogout}
        >
          <i className="pi pi-sign-out" aria-hidden="true" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;