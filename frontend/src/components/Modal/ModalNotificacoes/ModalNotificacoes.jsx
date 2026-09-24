import { useState, useEffect } from 'react';
import Modal from "../Modal";
import LoaderInline from '../../Global/LoaderInline/LoaderInline';
import { useToast } from "../../../context/ToastContext";
import api from '../../../services/api';
import './ModalNotificacoes.css';

function ModalNotificacoes({ aberto, onFechar, onAtualizarContador }) {
  const { mostrarToast } = useToast();
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!aberto) return;

    async function carregar() {
      setCarregando(true);
      try {
        const response = await api.get('/api/notificacoes', { silent: true });
        setNotificacoes(response.data.notificacoes || []);
      } catch (e) {
        console.error(e);
        mostrarToast('Erro ao carregar notificações.', 'error');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [aberto]);

  async function marcarComoLida(id) {
    try {
      await api.patch(`/api/notificacoes/${id}/ler`, null, { silent: true });

      setNotificacoes(prev =>
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      );

      if (onAtualizarContador) onAtualizarContador();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao marcar notificação como lida.', 'error');
    }
  }

  async function marcarTodasComoLidas() {
    try {
      await api.patch('/api/notificacoes/ler-todas', null, { silent: true });

      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));

      mostrarToast('Todas as notificações foram marcadas como lidas.', 'success');

      if (onAtualizarContador) onAtualizarContador();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao marcar notificações como lidas.', 'error');
    }
  }

  async function excluirTodas() {
    try {
      await api.delete('/api/notificacoes/excluir-todas', { silent: true });

      setNotificacoes([]);

      mostrarToast('Todas as notificações foram excluídas.', 'success');

      if (onAtualizarContador) onAtualizarContador();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao excluir notificações.', 'error');
    }
  }

  function obterIcone(tipo) {
    switch (tipo) {
      case 'FAVORITOU': return 'fas fa-heart';
      case 'DESFAVORITOU': return 'fas fa-heart-crack';
      case 'NOVA_RECEITA': return 'fas fa-utensils';
      case 'RECEITA_APROVADA': return 'fas fa-circle-check';
      case 'RECEITA_REJEITADA': return 'fas fa-circle-xmark';
      case 'RECEITA_EXCLUIDA': return 'fas fa-trash';
      default: return 'fas fa-bell';
    }
  }

  function formatarData(dataHora) {
    if (!dataHora) return '';
    const data = new Date(dataHora);
    if (Number.isNaN(data.getTime())) return '';
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} maxWidth="580px">
      <Modal.Header
        titulo="Notificações"
        icone="pi pi-bell"
        onFechar={onFechar}
      />

      <Modal.Body className="notificacoes-body">

        {carregando && <LoaderInline />}

        {!carregando && notificacoes.length === 0 && (
          <div className="notificacoes-vazia">
            <i className="pi pi-bell-slash"></i>
            <h3>Nenhuma notificação</h3>
            <p>Você não possui novas notificações.</p>
          </div>
        )}

        {!carregando && notificacoes.map(n => (
          <div
            key={n.id}
            className={`notificacao-item ${!n.lida ? 'nao-lida' : ''}`}
            onClick={() => !n.lida && marcarComoLida(n.id)}
          >
            <div className="notificacao-icon">
              <i className={`pi ${obterIcone(n.tipo)}`}></i>
            </div>

            <div className="notificacao-info">
              <p className="notificacao-mensagem">{n.mensagem}</p>
              <span className="notificacao-data">{formatarData(n.dataHora)}</span>
            </div>

            {!n.lida && <span className="notificacao-nao-lida-indicador"></span>}
          </div>
        ))}

      </Modal.Body>

      <Modal.Footer className="notificacoes-footer">
        <button
          type="button"
          className="notificacoes-marcar-todas"
          onClick={marcarTodasComoLidas}
          disabled={notificacoes.length === 0}
        >
          <i className="pi pi-check"></i> Marcar todas como lidas
        </button>

        <button
          type="button"
          className="notificacoes-excluir-todas"
          onClick={excluirTodas}
          disabled={notificacoes.length === 0}
        >
          <i className="pi pi-trash"></i> Excluir todas
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalNotificacoes;


