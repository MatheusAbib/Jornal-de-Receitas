
import { useNavigate, useLocation } from 'react-router-dom';
import { prefetchRota } from '../../../services/prefetch';
import './AdminSidebar.css';

function AdminSidebar({
  usuario,
  aberta,
  onFechar,
  onAbrirPerfil,
  onAbrirLogout
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { path: '/admin/dashboard', icone: 'pi-chart-line', label: 'Dashboard' },
    { path: '/admin/usuarios', icone: 'pi-users', label: 'Usuários' },
    { path: '/admin/pendentes', icone: 'pi-clock', label: 'Receitas Pendentes' },
    { path: '/admin/aprovadas', icone: 'pi-book', label: 'Receitas Aprovadas' },
    { path: '/admin/carrossel', icone: 'pi-images', label: 'Carrossel' }
  ];

  function irPara(path) {
    navigate(path);
    if (onFechar) onFechar();
  }

  return (
    <aside className={`admin-sidebar ${aberta ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-header-info">
          <span className="admin-sidebar-label">Painel administrativo</span>
          <h2>Administrador</h2>
          {usuario?.nome && (
            <span className="admin-user">{usuario.nome}</span>
          )}
        </div>

        <button
          type="button"
          className="admin-sidebar-close"
          onClick={onFechar}
          aria-label="Fechar menu"
        >
          <i className="pi pi-times" aria-hidden="true"></i>
        </button>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Navegação administrativa">
        <span className="admin-sidebar-section-title">Navegação</span>

        {menu.map(item => {
          const ativo = location.pathname === item.path;

          return (
            <a
              key={item.path}
              href={item.path}
              onMouseEnter={() => prefetchRota(item.path)}
              className={ativo ? 'active' : ''}
              aria-current={ativo ? 'page' : undefined}
              onClick={e => {
                e.preventDefault();
                irPara(item.path);
              }}
            >
              <i className={`pi ${item.icone}`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </a>
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
          <i className="pi pi-user-edit" aria-hidden="true"></i>
          <span>Editar Perfil</span>
        </button>

        <button
          type="button"
          className="admin-sidebar-btn admin-sidebar-btn-sair"
          onClick={onAbrirLogout}
        >
          <i className="pi pi-sign-out" aria-hidden="true"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
