import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Header from '../Header/Header';
import Rodape from '../Rodape/Rodape';
import { useAuth } from '../../../context/AuthContext';
import useStickyHeader from '../../../hooks/useStickyHeader';
import useNotificacoesAutomaticas from '../../../hooks/useNotificacoesAutomaticas';
import api from '../../../services/api';
import './PageWrapper.css';

const ModalLogin = lazy(() => import('../../Modal/ModalLogin/ModalLogin'));
const ModalCadastro = lazy(
  () => import('../../Modal/ModalCadastro/ModalCadastro'),
);
const ModalLogout = lazy(() => import('../../Modal/ModalLogout/ModalLogout'));
const ModalPerfil = lazy(() => import('../../Modal/ModalPerfil/ModalPerfil'));
const ModalNotificacoes = lazy(
  () => import('../../Modal/ModalNotificacoes/ModalNotificacoes'),
);

function PageWrapper({
  paginaAtual,
  children,
  modais,
  mostrarRodape = true,
}) {
  const { usuario, logout } = useAuth();
  const [loginAberto, setLoginAberto] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [logoutAberto, setLogoutAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [notificacoesAberto, setNotificacoesAberto] = useState(false);
  const [contadorNotificacoes, setContadorNotificacoes] = useState(0);

  const sempreScrollado = ['nova', 'detalhe', 'minhas-receitas'].includes(
    paginaAtual,
  );
  const algumModalAberto =
    loginAberto ||
    cadastroAberto ||
    logoutAberto ||
    perfilAberto ||
    notificacoesAberto;

  useStickyHeader('.header-full-width', '.page-wrapper', sempreScrollado);
  useNotificacoesAutomaticas(!algumModalAberto);

  const atualizarContador = useCallback(async () => {
    if (!usuario) {
      setContadorNotificacoes(0);
      return;
    }

    try {
      const response = await api.get('/api/notificacoes/contador', {
        silent: true,
      });
      setContadorNotificacoes(response.data.quantidade || 0);
    } catch {
      setContadorNotificacoes(0);
    }
  }, [usuario]);

  useEffect(() => {
    atualizarContador();

    if (!usuario) return;

    const intervalo = setInterval(atualizarContador, 10000);
    return () => clearInterval(intervalo);
  }, [atualizarContador, usuario]);

  async function confirmarLogout() {
    try {
      await logout();
    } catch {
    } finally {
      setLogoutAberto(false);
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    }
  }

  function abrirCadastro() {
    setLoginAberto(false);
    setCadastroAberto(true);
  }

  function abrirLogin() {
    setCadastroAberto(false);
    setLoginAberto(true);
  }

  return (
    <>
      <div className="header-sticky-container">
        <Header
          usuario={usuario}
          paginaAtual={paginaAtual}
          onAbrirLogin={abrirLogin}
          onAbrirLogout={() => setLogoutAberto(true)}
          onAbrirPerfil={() => setPerfilAberto(true)}
          onAbrirNotificacoes={() => setNotificacoesAberto(true)}
          notificacoesNaoLidas={contadorNotificacoes}
        />
      </div>

      <main className="page-wrapper" data-pagina={paginaAtual}>
        {typeof children === 'function'
          ? children({ abrirLogin: () => setLoginAberto(true) })
          : children}
      </main>

      {modais}
      {mostrarRodape && <Rodape />}

      <Suspense fallback={null}>
        <ModalLogin
          aberto={loginAberto}
          onFechar={() => setLoginAberto(false)}
          onIrParaCadastro={abrirCadastro}
        />
        <ModalCadastro
          aberto={cadastroAberto}
          onFechar={() => setCadastroAberto(false)}
          onIrParaLogin={abrirLogin}
        />
        <ModalLogout
          aberto={logoutAberto}
          onFechar={() => setLogoutAberto(false)}
          onConfirmar={confirmarLogout}
        />
        <ModalPerfil
          aberto={perfilAberto}
          onFechar={() => setPerfilAberto(false)}
        />
        <ModalNotificacoes
          aberto={notificacoesAberto}
          onFechar={() => setNotificacoesAberto(false)}
          onAtualizarContador={atualizarContador}
        />
      </Suspense>
    </>
  );
}

export default PageWrapper;
