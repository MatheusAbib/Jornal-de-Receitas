import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import ImagemLoader from "../../../components/Global/ImagemLoader/ImagemLoader";
import Modal from "../../../components/Modal/Modal";
import ModalVerReceita from "../../../components/Modal/ModalVerReceita/ModalVerReceita";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import usePolling from "../../../hooks/usePolling";
import api, { extrairMensagemErro } from "../../../services/api";
import { getCache, setCache } from "../../../services/cache";
import './ReceitasPendentes.css';

const CACHE_KEY = 'admin-receitas-pendentes';

function ReceitasPendentes() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const [aba, setAba] = useState('pendentes');
  const [receitas, setReceitas] = useState([]);
  const [totais, setTotais] = useState({ pendentes: 0, rejeitadas: 0 });
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [detalhes, setDetalhes] = useState(null);
  const [aprovando, setAprovando] = useState(null);
  const [rejeitando, setRejeitando] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [processando, setProcessando] = useState(false);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const url = aba === 'pendentes' ? '/api/receitas/pendentes' : '/api/receitas/rejeitadas';
      const params = { size: 50 };
      if (busca) params.busca = busca;

      const response = await api.get(url, { params, silent: silencioso });

      const lista = response.data.receitas || [];
      const novosTotais = {
        pendentes: response.data.totalPendentes || 0,
        rejeitadas: response.data.totalRejeitadas || 0
      };

      setReceitas(lista);
      setTotais(novosTotais);
      setCache(CACHE_KEY, { receitas: lista, totais: novosTotais, aba });
    } catch (e) {
      console.error(e);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    if (carregandoAuth) return;
    if (!usuario || usuario.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const cached = getCache(CACHE_KEY);

    if (cached && cached.aba === aba) {
      setReceitas(cached.receitas);
      setTotais(cached.totais);
      setCarregando(false);
      carregar(true);
    } else {
      carregar();
    }
  }, [usuario, carregandoAuth, aba, navigate]);

  const modalAberto = !!detalhes || !!aprovando || !!rejeitando;

  usePolling(() => carregar(true), 10000, !carregando && !carregandoAuth && !modalAberto);

  function handleBusca(e) {
    e.preventDefault();
    carregar();
  }

  async function confirmarAprovacao() {
    if (!aprovando) return;
    setProcessando(true);

    try {
      await api.post(`/api/receitas/${aprovando.id}/aprovar`, null, { silent: true });
      mostrarToast('Receita aprovada com sucesso!', 'success');
      setAprovando(null);
      carregar();
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao aprovar receita.');
      mostrarToast(msg, 'error');
    } finally {
      setProcessando(false);
    }
  }

  async function confirmarRejeicao() {
    if (!rejeitando || !motivo.trim()) return;
    setProcessando(true);

    try {
      await api.post(`/api/receitas/${rejeitando.id}/rejeitar`, null, {
        params: { motivo },
        silent: true
      });
      mostrarToast('Receita rejeitada.', 'info');
      setRejeitando(null);
      setMotivo('');
      carregar();
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao rejeitar receita.');
      mostrarToast(msg, 'error');
    } finally {
      setProcessando(false);
    }
  }

  if (carregandoAuth || carregando) {
    return (
      <AdminLayout>
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#8b0000' }}></i>
        </div>
      </AdminLayout>
    );
  }

  const tituloPagina = aba === 'rejeitadas' ? 'Receitas Rejeitadas' : 'Receitas Pendentes';
  const iconePagina = aba === 'rejeitadas' ? 'pi pi-times-circle' : 'pi pi-clock';

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1><i className={iconePagina}></i> {tituloPagina}</h1>
        <div className="admin-topbar-actions">
          <span><i className="pi pi-list"></i> Total: <strong>{receitas.length}</strong></span>
          <form className="admin-search-box" onSubmit={handleBusca}>
            <i className="pi pi-search"></i>
            <input
              type="text"
              placeholder="Buscar receita..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-container">

          <div className="admin-table-header">
            <div className="admin-recipe-tabs">
              <button
                className={`admin-recipe-tab ${aba === 'pendentes' ? 'active' : ''}`}
                onClick={() => setAba('pendentes')}
              >
                <i className="pi pi-clock"></i> Pendentes <span>{totais.pendentes}</span>
              </button>
              <button
                className={`admin-recipe-tab ${aba === 'rejeitadas' ? 'active' : ''}`}
                onClick={() => setAba('rejeitadas')}
              >
                <i className="pi pi-times-circle"></i> Rejeitadas <span>{totais.rejeitadas}</span>
              </button>
            </div>
          </div>

          {!carregando && receitas.length > 0 && (
            <div className="admin-cards-grid">
              {receitas.map(r => {
                const imagemUrl = r.imagem
                  ? (r.imagem.startsWith('http') ? r.imagem : `/uploads/${r.imagem}`)
                  : '/default-image.jpg';

                return (
                  <div key={r.id} className="admin-recipe-card">
                    <div className="admin-recipe-image">
                      <ImagemLoader src={imagemUrl} alt={r.titulo} />
                      <div className={`admin-recipe-badge ${aba === 'rejeitadas' ? 'rejected' : ''}`}>
                        <i className={aba === 'rejeitadas' ? 'pi pi-times-circle' : 'pi pi-clock'}></i>
                        {aba === 'rejeitadas' ? 'Rejeitada' : 'Pendente'}
                      </div>
                    </div>

                    <div className="admin-recipe-content">
                      <h2>{r.titulo}</h2>

                      <p className="admin-recipe-meta">
                        <span><i className="pi pi-clock"></i> {r.tempoPreparo}</span>
                        <span><i className="pi pi-users"></i> {r.porcoes} porções</span>
                      </p>

                      <div className="admin-recipe-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-view"
                          onClick={() => setDetalhes(r)}
                        >
                          <i className="pi pi-eye"></i> Ver Detalhes
                        </button>

                        {aba === 'pendentes' && (
                          <>
                            <button
                              type="button"
                              className="admin-btn admin-btn-approve"
                              onClick={() => setAprovando(r)}
                            >
                              <i className="pi pi-check"></i> Aprovar
                            </button>

                            <button
                              type="button"
                              className="admin-btn admin-btn-reject"
                              onClick={() => setRejeitando(r)}
                            >
                              <i className="pi pi-times"></i> Rejeitar
                            </button>
                          </>
                        )}

                        {aba === 'rejeitadas' && r.motivoRejeicao && (
                          <div className="admin-rejection-reason">
                            <i className="pi pi-comment"></i>
                            <span>{r.motivoRejeicao}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!carregando && receitas.length === 0 && (
            <div className="admin-empty">
              <i className={aba === 'rejeitadas' ? 'pi pi-times-circle' : 'pi pi-inbox'}></i>
              <h3>{aba === 'rejeitadas' ? 'Nenhuma receita rejeitada' : 'Nenhuma receita pendente'}</h3>
              <p>{aba === 'rejeitadas' ? 'Não há receitas rejeitadas no momento.' : 'Não há receitas aguardando aprovação no momento.'}</p>
            </div>
          )}

        </div>
      </div>

      <ModalVerReceita
        aberto={!!detalhes}
        onFechar={() => setDetalhes(null)}
        receita={detalhes}
      />

      <Modal aberto={!!aprovando} onFechar={() => setAprovando(null)} maxWidth="480px">
        <Modal.Header
          titulo="Aprovar Receita"
          icone="pi pi-check-circle"
          onFechar={() => setAprovando(null)}
        />
        <Modal.Body>
          <p className="admin-modal-delete-text">
            Tem certeza que deseja aprovar <strong>{aprovando?.titulo}</strong>?
          </p>
          <p className="modal-warning">
            <i className="pi pi-info-circle"></i> A receita ficará visível para todos os usuários.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={() => setAprovando(null)}
              disabled={processando}
            >
              <i className="pi pi-times"></i> Cancelar
            </button>
            <button
              type="button"
              className="modal-btn modal-btn-save"
              onClick={confirmarAprovacao}
              disabled={processando}
            >
              {processando ? (
                <><i className="pi pi-spin pi-spinner"></i> Aprovando...</>
              ) : (
                <><i className="pi pi-check"></i> Sim, Aprovar</>
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal aberto={!!rejeitando} onFechar={() => { setRejeitando(null); setMotivo(''); }} maxWidth="520px">
        <Modal.Header
          titulo="Rejeitar Receita"
          icone="pi pi-times-circle"
          onFechar={() => { setRejeitando(null); setMotivo(''); }}
        />
        <Modal.Body>
          <p className="admin-modal-delete-text">
            Explique o motivo da rejeição de <strong>{rejeitando?.titulo}</strong>.
          </p>
          <p className="modal-warning">
            <i className="pi pi-info-circle"></i> O autor poderá ver essa mensagem.
          </p>

          <div className="form-group">
            <label>Motivo da rejeição *</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows="4"
              placeholder="Ex: Ingredientes sem quantidade ou unidade..."
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={() => { setRejeitando(null); setMotivo(''); }}
              disabled={processando}
            >
              <i className="pi pi-times"></i> Cancelar
            </button>
            <button
              type="button"
              className="modal-btn modal-btn-danger"
              onClick={confirmarRejeicao}
              disabled={!motivo.trim() || processando}
            >
              {processando ? (
                <><i className="pi pi-spin pi-spinner"></i> Rejeitando...</>
              ) : (
                <><i className="pi pi-trash"></i> Sim, Rejeitar</>
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
}

export default ReceitasPendentes;
