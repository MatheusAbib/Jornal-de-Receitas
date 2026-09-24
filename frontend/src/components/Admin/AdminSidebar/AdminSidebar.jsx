import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

function AdminSidebar({ usuario, aberta, onFechar, onAbrirPerfil, onAbrirLogout }) {
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
        <h2>Administrador</h2>
        <button
          type="button"
          className="admin-sidebar-close"
          onClick={onFechar}
          aria-label="Fechar menu"
        >
          &times;
        </button>
        <span className="admin-user">{usuario?.nome || ''}</span>
      </div>

      <nav className="admin-sidebar-nav">
        {menu.map(item => (
          <a
            key={item.path}
            href={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); irPara(item.path); }}
          >
            <i className={`pi ${item.icone}`}></i>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button type="button" className="admin-sidebar-btn" onClick={onAbrirPerfil}>
          <i className="pi pi-user-edit"></i> Editar Perfil
        </button>
        <button type="button" className="admin-sidebar-btn admin-sidebar-btn-sair" onClick={onAbrirLogout}>
          <i className="pi pi-sign-out"></i> Sair
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
