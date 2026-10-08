import { useState, useEffect, lazy, Suspense } from 'react';
import Header from '../Header/Header';
import Rodape from '../Rodape/Rodape';
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import useStickyHeader from "../../../hooks/useStickyHeader";
import useNotificacoesAutomaticas from "../../../hooks/useNotificacoesAutomaticas";
import api from "../../../services/api";
import './PageWrapper.css';

const ModalLogin = lazy(() => import("../../Modal/ModalLogin/ModalLogin"));
const ModalCadastro = lazy(() => import("../../Modal/ModalCadastro/ModalCadastro"));
const ModalLogout = lazy(() => import("../../Modal/ModalLogout/ModalLogout"));
const ModalPerfil = lazy(() => import("../../Modal/ModalPerfil/ModalPerfil"));
const ModalNotificacoes = lazy(() => import("../../Modal/ModalNotificacoes/ModalNotificacoes"));

function PageWrapper({ paginaAtual, children, mostrarRodape = true }) {
  const { usuario, logout } = useAuth();
  const { mostrarToast } = useToast();

  const [loginAberto, setLoginAberto] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [logoutAberto, setLogoutAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [notificacoesAberto, setNotificacoesAberto] = useState(false);
  const [contadorNotificacoes, setContadorNotificacoes] = useState(0);

  const sempreScrollado = paginaAtual === 'nova' || paginaAtual === 'detalhe' || paginaAtual === 'minhas-receitas';

  useStickyHeader('.header-full-width', '.page-wrapper', sempreScrollado);

  const algumModalAberto = loginAberto || cadastroAberto || logoutAberto || perfilAberto || notificacoesAberto;

  useNotificacoesAutomaticas(!algumModalAberto);

  async function atualizarContador() {
    if (!usuario) {
      setContadorNotificacoes(0);
      return;
    }
    try {
      const response = await api.get('/api/notificacoes/contador', { silent: true });
      setContadorNotificacoes(response.data.quantidade || 0);
    } catch {
      setContadorNotificacoes(0);
    }
  }

  useEffect(() => {
    atualizarContador();

    if (!usuario) return;

    const intervalo = setInterval(atualizarContador, 10000);
    return () => clearInterval(intervalo);
  }, [usuario]);

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

  return (
    <>
      <Header
        usuario={usuario}
        paginaAtual={paginaAtual}
        onAbrirLogin={() => setLoginAberto(true)}
        onAbrirLogout={() => setLogoutAberto(true)}
        onAbrirPerfil={() => setPerfilAberto(true)}
        onAbrirNotificacoes={() => setNotificacoesAberto(true)}
        notificacoesNaoLidas={contadorNotificacoes}
      />

      <div className="page-wrapper">
        {children}
      </div>

      {mostrarRodape && <Rodape />}

      <Suspense fallback={null}>
        <ModalLogin
          aberto={loginAberto}
          onFechar={() => setLoginAberto(false)}
          onIrParaCadastro={() => { setLoginAberto(false); setCadastroAberto(true); }}
        />
        <ModalCadastro
          aberto={cadastroAberto}
          onFechar={() => setCadastroAberto(false)}
          onIrParaLogin={() => { setCadastroAberto(false); setLoginAberto(true); }}
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