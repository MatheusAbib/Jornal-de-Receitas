import { useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import ModalLogout from '../ModalLogout/ModalLogout';
import ModalPerfil from '../ModalPerfil/ModalPerfil';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const { usuario, logout } = useAuth();

  const [logoutAberto, setLogoutAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  function abrirSidebar() {
    setSidebarAberta(true);
    document.body.style.overflow = 'hidden';
  }

  function fecharSidebar() {
    setSidebarAberta(false);
    document.body.style.overflow = 'auto';
  }

  async function confirmarLogout() {
    try {
      await logout();
    } catch {
    } finally {
      setLogoutAberto(false);
      sessionStorage.clear();
      window.location.href = '/';
    }
  }

  return (
    <div className="admin-layout">
      <div
        className={`admin-sidebar-overlay ${sidebarAberta ? 'open' : ''}`}
        onClick={fecharSidebar}
      ></div>

      <AdminSidebar
        usuario={usuario}
        aberta={sidebarAberta}
        onFechar={fecharSidebar}
        onAbrirPerfil={() => setPerfilAberto(true)}
        onAbrirLogout={() => setLogoutAberto(true)}
      />

      <main className="admin-content-wrapper">
        <button
          type="button"
          className="admin-sidebar-toggle"
          onClick={abrirSidebar}
          aria-label="Abrir menu"
        >
          <i className="pi pi-bars"></i>
        </button>

        {children}
      </main>

      <ModalLogout
        aberto={logoutAberto}
        onFechar={() => setLogoutAberto(false)}
        onConfirmar={confirmarLogout}
      />

      <ModalPerfil
        aberto={perfilAberto}
        onFechar={() => setPerfilAberto(false)}
      />
    </div>
  );
}

export default AdminLayout;
