import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from "../../../components/Global/PageWrapper/PageWrapper";
import ImagemLoader from "../../../components/Global/ImagemLoader/ImagemLoader";
import Modal from "../../../components/Modal/Modal";
import ModalVerReceita from "../../../components/Modal/ModalVerReceita/ModalVerReceita";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import usePolling from "../../../hooks/usePolling";
import { minhasReceitas, excluirReceita } from "../../../services/receitaService";
import { extrairMensagemErro } from "../../../services/api";
import { getCache, setCache } from "../../../services/cache";
import './MinhasReceitas.css';

const CACHE_KEY = 'minhas-receitas';

function MinhasReceitas() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const [aba, setAba] = useState('aprovadas');
  const [dados, setDados] = useState({ pendentes: [], aprovadas: [], rejeitadas: [] });
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(null);
  const [motivoAberto, setMotivoAberto] = useState(null);
  const [excluindoAgora, setExcluindoAgora] = useState(false);
  const [verReceita, setVerReceita] = useState(null);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const resultado = await minhasReceitas(silencioso);
      setDados(resultado);
      setCache(CACHE_KEY, resultado);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    if (carregandoAuth) return;

    if (!usuario) {
      navigate('/');
      return;
    }

    const cached = getCache(CACHE_KEY);

    if (cached) {
      setDados(cached);
      setCarregando(false);
      carregar(true);
    } else {
      carregar();
    }
  }, [usuario, carregandoAuth, navigate]);

  const modalAberto = !!excluindo || !!motivoAberto || !!verReceita;

  usePolling(() => carregar(true), 10000, !carregando && !carregandoAuth && !modalAberto);

  async function confirmarExclusao() {
    if (!excluindo) return;

    setExcluindoAgora(true);
    try {
      await excluirReceita(excluindo.id);

      setDados(prev => {
        const novo = {
          pendentes: prev.pendentes.filter(r => r.id !== excluindo.id),
          aprovadas: prev.aprovadas.filter(r => r.id !== excluindo.id),
          rejeitadas: prev.rejeitadas.filter(r => r.id !== excluindo.id)
        };
        setCache(CACHE_KEY, novo);
        return novo;
      });

      mostrarToast('Receita excluída com sucesso!', 'success');
      setExcluindo(null);
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao excluir receita. Tente novamente.');
      mostrarToast(msg, 'error');
    } finally {
      setExcluindoAgora(false);
    }
  }

  if (carregandoAuth || carregando) {
    return (
      <PageWrapper paginaAtual="minhas-receitas">
        <div style={{ paddingTop: '320px', textAlign: 'center' }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#8b0000' }}></i>
        </div>
      </PageWrapper>
    );
  }

  const lista = dados[aba] || [];

  const totalCurtidas =
    [...dados.pendentes, ...dados.aprovadas, ...dados.rejeitadas]
      .reduce((acc, r) => acc + (r.totalFavoritos || 0), 0);

  const stats = [
    { icone: 'pi-book', valor: dados.pendentes.length + dados.aprovadas.length + dados.rejeitadas.length, label: 'Total', cor: 'total' },
    { icone: 'pi-check-circle', valor: dados.aprovadas.length, label: 'Aprovadas', cor: 'aprovadas' },
    { icone: 'pi-clock', valor: dados.pendentes.length, label: 'Pendentes', cor: 'pendentes' },
    { icone: 'pi-times-circle', valor: dados.rejeitadas.length, label: 'Rejeitadas', cor: 'rejeitadas' },
    { icone: 'pi-heart-fill', valor: totalCurtidas, label: 'Curtidas', cor: 'curtidas' }
  ];

  const statusLabel = {
    pendentes: { icone: 'pi-clock', texto: 'Pendente', cor: 'pendente' },
    aprovadas: { icone: 'pi-check-circle', texto: 'Aprovada', cor: 'aprovada' },
    rejeitadas: { icone: 'pi-times-circle', texto: 'Rejeitada', cor: 'rejeitada' }
  };

  return (
    <PageWrapper paginaAtual="minhas-receitas">
      <div className="minhas-wrapper">

        <div className="minhas-stats">
          {stats.map((s, i) => (
            <div key={i} className={`stat-card ${s.cor === 'curtidas' ? 'destaque' : ''}`}>
              <div className={`stat-icon ${s.cor}`}>
                <i className={`pi ${s.icone}`}></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{s.valor}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="minhas-tabs">
          <button
            className={`minhas-tab ${aba === 'pendentes' ? 'active' : ''}`}
            onClick={() => setAba('pendentes')}
          >
            <i className="pi pi-clock"></i>
            Pendentes
            <span className="tab-count">{dados.pendentes?.length || 0}</span>
          </button>

          <button
            className={`minhas-tab ${aba === 'aprovadas' ? 'active' : ''}`}
            onClick={() => setAba('aprovadas')}
          >
            <i className="pi pi-check-circle"></i>
            Aprovadas
            <span className="tab-count">{dados.aprovadas?.length || 0}</span>
          </button>

          <button
            className={`minhas-tab ${aba === 'rejeitadas' ? 'active' : ''}`}
            onClick={() => setAba('rejeitadas')}
          >
            <i className="pi pi-times-circle"></i>
            Rejeitadas
            <span className="tab-count">{dados.rejeitadas?.length || 0}</span>
          </button>
        </div>

        {lista.length > 0 ? (
          <div className="minhas-grid">
            {lista.map(r => {
              const status = statusLabel[aba];
              const imagemUrl = r.imagem
                ? (r.imagem.startsWith('http') ? r.imagem : `/uploads/${r.imagem}`)
                : '/default-image.jpg';

              return (
                <div key={r.id} className="minha-card">
                  <div className="minha-imagem">
                    <ImagemLoader src={imagemUrl} alt={r.titulo} />
                    <span className={`status-badge ${status.cor}`}>
                      <i className={`pi ${status.icone}`}></i>
                      {status.texto}
                    </span>
                  </div>

                  <div className="minha-info">
                    <h3>{r.titulo}</h3>

                    <div className="minha-meta">
                      <span><i className="pi pi-clock"></i> {r.tempoPreparo}</span>
                      <span><i className="pi pi-users"></i> {r.porcoes}</span>
                      <span><i className="pi pi-heart-fill"></i> {r.totalFavoritos || 0}</span>
                    </div>

                    <div className="minha-actions">
                      <button className="btn-ver" onClick={() => setVerReceita(r)}>
                        <i className="pi pi-eye"></i> Ver
                      </button>

                      {aba === 'rejeitadas' && (
                        <button className="btn-motivo" onClick={() => setMotivoAberto(r)}>
                          <i className="pi pi-info-circle"></i> Motivo
                        </button>
                      )}

                      {(aba === 'pendentes' || aba === 'rejeitadas') && (
                        <button className="btn-excluir" onClick={() => setExcluindo(r)}>
                          <i className="pi pi-trash"></i> Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="minhas-empty">
            <i className="pi pi-inbox"></i>
            <h3>Nenhuma receita {statusLabel[aba].texto.toLowerCase()}</h3>
            <p>Você ainda não tem receitas nesta categoria.</p>
          </div>
        )}
      </div>

      <Modal aberto={!!motivoAberto} onFechar={() => setMotivoAberto(null)} maxWidth="480px">
        <Modal.Header
          titulo="Motivo da Rejeição"
          icone="pi pi-info-circle"
          onFechar={() => setMotivoAberto(null)}
        />
        <Modal.Body>
          <p className="motivo-texto">
            {motivoAberto?.motivoRejeicao || 'Sem motivo informado.'}
          </p>
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={() => setMotivoAberto(null)}
            >
              <i className="pi pi-times"></i> Fechar
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal aberto={!!excluindo} onFechar={() => setExcluindo(null)} maxWidth="480px">
        <Modal.Header
          titulo="Excluir Receita"
          icone="pi pi-exclamation-triangle"
          onFechar={() => setExcluindo(null)}
        />
        <Modal.Body>
          <p className="admin-modal-delete-text">
            Tem certeza que deseja excluir <strong>{excluindo?.titulo}</strong>?
          </p>
          <p className="admin-modal-delete-warning">
            <i className="pi pi-exclamation-circle"></i> Esta ação não pode ser desfeita.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={() => setExcluindo(null)}
              disabled={excluindoAgora}
            >
              <i className="pi pi-times"></i> Cancelar
            </button>
            <button
              type="button"
              className="modal-btn modal-btn-danger"
              onClick={confirmarExclusao}
              disabled={excluindoAgora}
            >
              {excluindoAgora ? (
                <><i className="pi pi-spin pi-spinner"></i> Excluindo...</>
              ) : (
                <><i className="pi pi-trash"></i> Excluir</>
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <ModalVerReceita
        aberto={!!verReceita}
        onFechar={() => setVerReceita(null)}
        receita={verReceita}
      />
    </PageWrapper>
  );
}

export default MinhasReceitas;
