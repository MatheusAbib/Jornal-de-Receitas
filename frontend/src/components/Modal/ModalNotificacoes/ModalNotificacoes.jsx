import { useState, useEffect } from 'react';
import Modal from '../Modal';
import LoaderInline from '../../Global/LoaderInline/LoaderInline';
import { useToast } from '../../../context/ToastContext';
import api, { extrairMensagemErro } from '../../../services/api';
import './ModalNotificacoes.css';

function ModalNotificacoes({ aberto, onFechar, onAtualizarContador }) {
  const { mostrarToast } = useToast();

  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [notificacoesProcessando, setNotificacoesProcessando] = useState([]);

  useEffect(() => {
    if (!aberto) return;

    let ativo = true;

    async function carregar() {
      setCarregando(true);

      try {
        const response = await api.get('/api/notificacoes', {
          silent: true
        });

        if (ativo) {
          setNotificacoes(response.data.notificacoes || []);
        }
      } catch (err) {
        if (ativo) {
          const msg = extrairMensagemErro(
            err,
            'Erro ao carregar notificações.'
          );

          mostrarToast(msg, 'error');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [aberto]);

  async function marcarComoLida(id) {
    if (processando || notificacoesProcessando.includes(id)) return;

    setNotificacoesProcessando(prev => [...prev, id]);

    try {
      await api.patch(`/api/notificacoes/${id}/ler`, null, {
        silent: true
      });

      setNotificacoes(prev =>
        prev.map(n =>
          n.id === id ? { ...n, lida: true } : n
        )
      );

      onAtualizarContador?.();
    } catch (err) {
      const msg = extrairMensagemErro(
        err,
        'Erro ao marcar notificação como lida.'
      );

      mostrarToast(msg, 'error');
    } finally {
      setNotificacoesProcessando(prev =>
        prev.filter(item => item !== id)
      );
    }
  }

  async function marcarTodasComoLidas() {
    if (processando || notificacoesProcessando.length > 0) return;

    setProcessando(true);

    try {
      await api.patch('/api/notificacoes/ler-todas', null, {
        silent: true
      });

      setNotificacoes(prev =>
        prev.map(n => ({ ...n, lida: true }))
      );

      mostrarToast(
        'Todas as notificações foram marcadas como lidas.',
        'success'
      );

      onAtualizarContador?.();
    } catch (err) {
      const msg = extrairMensagemErro(
        err,
        'Erro ao marcar notificações como lidas.'
      );

      mostrarToast(msg, 'error');
    } finally {
      setProcessando(false);
    }
  }

  async function excluirTodas() {
    if (processando || notificacoesProcessando.length > 0) return;

    setProcessando(true);

    try {
      await api.delete('/api/notificacoes/excluir-todas', {
        silent: true
      });

      setNotificacoes([]);

      mostrarToast(
        'Todas as notificações foram excluídas.',
        'success'
      );

      onAtualizarContador?.();
    } catch (err) {
      const msg = extrairMensagemErro(
        err,
        'Erro ao excluir notificações.'
      );

      mostrarToast(msg, 'error');
    } finally {
      setProcessando(false);
    }
  }

  function obterIcone(tipo) {
    switch (tipo) {
      case 'FAVORITOU':
        return 'pi pi-heart';

      case 'DESFAVORITOU':
        return 'pi pi-heart';

      case 'NOVA_RECEITA':
        return 'pi pi-book';

      case 'RECEITA_APROVADA':
        return 'pi pi-check-circle';

      case 'RECEITA_REJEITADA':
        return 'pi pi-times-circle';

      case 'RECEITA_EXCLUIDA':
        return 'pi pi-trash';

      default:
        return 'pi pi-bell';
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

  const possuiNotificacoes = notificacoes.length > 0;
  const possuiNaoLidas = notificacoes.some(n => !n.lida);
  const acoesBloqueadas =
    carregando || processando || notificacoesProcessando.length > 0;

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      maxWidth="580px"
      className="notificacoes-modal"
    >
      <Modal.Header
        titulo="Notificações"
        icone="pi pi-bell"
        onFechar={onFechar}
      />

      <Modal.Body className="notificacoes-body">
        {carregando && (
          <LoaderInline texto="Carregando notificações..." />
        )}

        {!carregando && !possuiNotificacoes && (
          <div className="notificacoes-vazia">
            <div className="notificacoes-vazia-icon">
              <i className="pi pi-bell-slash" aria-hidden="true"></i>
            </div>

            <h3>Nenhuma notificação</h3>

            <p>
              Quando houver novidades sobre suas receitas,
              elas aparecerão aqui.
            </p>
          </div>
        )}

        {!carregando && possuiNotificacoes && (
          <div className="notificacoes-lista">
            {notificacoes.map(n => {
              const naoLida = !n.lida;
              const processandoItem =
                notificacoesProcessando.includes(n.id);

              return (
                <div
                  key={n.id}
                  className={`notificacao-item ${naoLida ? 'nao-lida' : ''}`}
                >
                  <div
                    className="notificacao-icon"
                    aria-hidden="true"
                  >
                    <i className={obterIcone(n.tipo)}></i>
                  </div>

                  <div className="notificacao-info">
                    <p className="notificacao-mensagem">
                      {n.mensagem}
                    </p>

                    <span className="notificacao-data">
                      {formatarData(n.dataHora)}
                    </span>
                  </div>

                  {naoLida && (
                    <button
                      type="button"
                      className="notificacao-marcar-lida"
                      onClick={() => marcarComoLida(n.id)}
                      disabled={processando || processandoItem}
                      aria-label="Marcar notificação como lida"
                      title="Marcar como lida"
                    >
                      {processandoItem ? (
                        <i
                          className="pi pi-spin pi-spinner"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <span className="notificacao-nao-lida-indicador"></span>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>

      {possuiNotificacoes && !carregando && (
        <Modal.Footer className="notificacoes-footer">
          <button
            type="button"
            className="notificacoes-marcar-todas"
            onClick={marcarTodasComoLidas}
            disabled={!possuiNaoLidas || acoesBloqueadas}
          >
            <i className="pi pi-check" aria-hidden="true"></i>
            <span>Marcar todas como lidas</span>
          </button>

          <button
            type="button"
            className="notificacoes-excluir-todas"
            onClick={excluirTodas}
            disabled={acoesBloqueadas}
          >
            <i className="pi pi-trash" aria-hidden="true"></i>
            <span>Excluir todas</span>
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default ModalNotificacoes;