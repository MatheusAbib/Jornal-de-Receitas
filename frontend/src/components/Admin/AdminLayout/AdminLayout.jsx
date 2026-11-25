import { useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminPageHeader from './AdminPageHeader';
import ModalLogout from '../../Modal/ModalLogout/ModalLogout';
import ModalPerfil from '../../Modal/ModalPerfil/ModalPerfil';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.css';

function AdminLayout({ titulo, descricao, acao, children }) {
  const { logout } = useAuth();

  const [logoutAberto, setLogoutAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    if (!sidebarAberta) return;

    const overflowAnterior = document.body.style.overflow;
    const telaMovel = window.matchMedia('(max-width: 768px)');

    function sincronizarSidebar() {
      if (telaMovel.matches) {
        document.body.style.overflow = 'hidden';
      } else {
        setSidebarAberta(false);
      }
    }

    function fecharComEscape(event) {
      if (event.key === 'Escape') setSidebarAberta(false);
    }

    sincronizarSidebar();
    telaMovel.addEventListener('change', sincronizarSidebar);
    document.addEventListener('keydown', fecharComEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      telaMovel.removeEventListener('change', sincronizarSidebar);
      document.removeEventListener('keydown', fecharComEscape);
    };
  }, [sidebarAberta]);

  function fecharSidebar() {
    setSidebarAberta(false);
  }

  function abrirPerfil() {
    fecharSidebar();
    setPerfilAberto(true);
  }

  function abrirLogout() {
    fecharSidebar();
    setLogoutAberto(true);
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
        className={'admin-sidebar-overlay' + (sidebarAberta ? ' open' : '')}
        onClick={fecharSidebar}
        aria-hidden="true"
      />

      <AdminSidebar
        aberta={sidebarAberta}
        onFechar={fecharSidebar}
        onAbrirPerfil={abrirPerfil}
        onAbrirLogout={abrirLogout}
      />

      <main className="admin-content-wrapper">
        <button
          type="button"
          className="admin-sidebar-toggle"
          onClick={() => setSidebarAberta(true)}
          aria-label="Abrir menu"
          aria-expanded={sidebarAberta}
        >
          <i className="pi pi-bars" aria-hidden="true" />
        </button>

        <div className="admin-page-content">
          {titulo && (
            <AdminPageHeader titulo={titulo} descricao={descricao} acao={acao} />
          )}
          {children}
        </div>
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