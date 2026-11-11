import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/Global/PageWrapper/PageWrapper';
import ImagemLoader from '../../../components/Global/ImagemLoader/ImagemLoader';
import Modal from '../../../components/Modal/Modal';
import ModalVerReceita from '../../../components/Modal/ModalVerReceita/ModalVerReceita';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import usePolling from '../../../hooks/usePolling';
import { minhasReceitas, excluirReceita } from '../../../services/receitaService';
import { extrairMensagemErro } from '../../../services/api';
import { getCache, setCache } from '../../../services/cache';
import './MinhasReceitas.css';

const CACHE_KEY = 'minhas-receitas';

const ABAS = [
  {
    id: 'aprovadas',
    titulo: 'Publicadas',
    icone: 'pi-check-circle',
    descricao: 'Receitas aprovadas e disponíveis para os leitores.',
    vazioTitulo: 'Nenhuma receita publicada',
    vazioDescricao: 'Quando uma receita sua for aprovada, ela aparecerá aqui.'
  },
  {
    id: 'pendentes',
    titulo: 'Em análise',
    icone: 'pi-clock',
    descricao: 'Receitas enviadas que aguardam a avaliação do administrador.',
    vazioTitulo: 'Nenhuma receita em análise',
    vazioDescricao: 'Você não possui receitas aguardando aprovação.'
  },
  {
    id: 'rejeitadas',
    titulo: 'Rejeitadas',
    icone: 'pi-times-circle',
    descricao: 'Receitas que não foram aprovadas e seus respectivos motivos.',
    vazioTitulo: 'Nenhuma receita rejeitada',
    vazioDescricao: 'Não há receitas rejeitadas na sua conta.'
  }
];

const STATUS = {
  pendentes: {
    icone: 'pi-clock',
    texto: 'Em análise',
    cor: 'pendente'
  },
  aprovadas: {
    icone: 'pi-check-circle',
    texto: 'Publicada',
    cor: 'aprovada'
  },
  rejeitadas: {
    icone: 'pi-times-circle',
    texto: 'Rejeitada',
    cor: 'rejeitada'
  }
};

function SkeletonCard() {
  return (
    <div className="minha-card skeleton" aria-hidden="true">
      <div className="skeleton-imagem"></div>

      <div className="minha-info">
        <div className="skeleton-line skeleton-line-title"></div>
        <div className="skeleton-line skeleton-line-meta"></div>
        <div className="skeleton-line skeleton-line-meta"></div>
        <div className="skeleton-line skeleton-line-btn"></div>
      </div>
    </div>
  );
}

function MinhasReceitas() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const [aba, setAba] = useState('aprovadas');
  const [dados, setDados] = useState({
    pendentes: [],
    aprovadas: [],
    rejeitadas: []
  });
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

  const modalAberto = Boolean(excluindo || motivoAberto || verReceita);

  usePolling(
    () => carregar(true),
    10000,
    !carregando && !carregandoAuth && !modalAberto
  );

  async function confirmarExclusao() {
    if (!excluindo || excluindoAgora) return;

    setExcluindoAgora(true);

    try {
      await excluirReceita(excluindo.id);

      const novo = {
        pendentes: dados.pendentes.filter(r => r.id !== excluindo.id),
        aprovadas: dados.aprovadas.filter(r => r.id !== excluindo.id),
        rejeitadas: dados.rejeitadas.filter(r => r.id !== excluindo.id)
      };

      setDados(novo);
      setCache(CACHE_KEY, novo);

      mostrarToast('Receita excluída com sucesso!', 'success');
      setExcluindo(null);
    } catch (err) {
      const msg = extrairMensagemErro(
        err,
        'Erro ao excluir receita. Tente novamente.'
      );

      mostrarToast(msg, 'error');
    } finally {
      setExcluindoAgora(false);
    }
  }

  const carregandoPagina = carregandoAuth || carregando;

  const pendentes = dados.pendentes || [];
  const aprovadas = dados.aprovadas || [];
  const rejeitadas = dados.rejeitadas || [];

  const totalReceitas =
    pendentes.length + aprovadas.length + rejeitadas.length;

  const totalCurtidas = [
    ...pendentes,
    ...aprovadas,
    ...rejeitadas
  ].reduce((acc, receita) => acc + (receita.totalFavoritos || 0), 0);

  const stats = [
    {
      icone: 'pi-book',
      valor: totalReceitas,
      label: 'Total de receitas',
      cor: 'total'
    },
    {
      icone: 'pi-check-circle',
      valor: aprovadas.length,
      label: 'Publicadas',
      cor: 'aprovadas'
    },
    {
      icone: 'pi-clock',
      valor: pendentes.length,
      label: 'Em análise',
      cor: 'pendentes'
    },
    {
      icone: 'pi-times-circle',
      valor: rejeitadas.length,
      label: 'Rejeitadas',
      cor: 'rejeitadas'
    },
    {
      icone: 'pi-heart',
      valor: totalCurtidas,
      label: 'Curtidas',
      cor: 'curtidas'
    }
  ];

  const abaAtual = ABAS.find(item => item.id === aba);
  const lista = dados[aba] || [];
  const status = STATUS[aba];

  return (
    <PageWrapper paginaAtual="minhas-receitas">
      <main className="minhas-wrapper">
        <header className="minhas-page-header">
          <div className="minhas-page-header-top">
            <span>Jornal de Receitas</span>
            <span>Área do colaborador</span>
          </div>

          <div className="minhas-page-header-content">
            <div>
              <span className="minhas-eyebrow">Seu espaço no jornal</span>

              <h1>Minhas receitas</h1>

              <p>
                Acompanhe suas publicações, consulte o andamento
                das receitas enviadas e veja os resultados de cada uma.
              </p>
            </div>

            <button
              type="button"
              className="minhas-nova-btn"
              onClick={() => navigate('/nova')}
            >
              <i className="pi pi-plus" aria-hidden="true"></i>
              Nova receita
            </button>
          </div>
        </header>

        <section className="minhas-resumo" aria-label="Resumo das receitas">
          <div className="minhas-section-heading">
            <div>
              <span className="minhas-section-index">01 / Resumo</span>
              <h2>Visão geral</h2>
            </div>

            <span className="minhas-section-note">
              <i className="pi pi-chart-bar" aria-hidden="true"></i>
              Suas receitas em números
            </span>
          </div>

          <div className="minhas-stats">
            {carregandoPagina
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="stat-card" aria-hidden="true">
                    <div className="stat-icon skeleton-icon"></div>

                    <div className="stat-info">
                      <div className="skeleton-line skeleton-line-value"></div>
                      <div className="skeleton-line skeleton-line-label"></div>
                    </div>
                  </div>
                ))
              : stats.map(item => (
                  <div key={item.cor} className={`stat-card stat-${item.cor}`}>
                    <div className={`stat-icon ${item.cor}`}>
                      <i className={`pi ${item.icone}`} aria-hidden="true"></i>
                    </div>

                    <div className="stat-info">
                      <span className="stat-value">{item.valor}</span>
                      <span className="stat-label">{item.label}</span>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        <section className="minhas-listagem" aria-label="Lista de receitas">
          <div className="minhas-section-heading">
            <div>
              <span className="minhas-section-index">02 / Acompanhamento</span>
              <h2>Suas publicações</h2>
            </div>
          </div>

          <div className="minhas-tabs" role="tablist" aria-label="Status das receitas">
            {ABAS.map(item => (
              <button
                key={item.id}
                id={`minhas-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={aba === item.id}
                aria-controls="minhas-tab-panel"
                className={`minhas-tab ${aba === item.id ? 'active' : ''}`}
                onClick={() => setAba(item.id)}
                disabled={carregandoPagina}
              >
                <i className={`pi ${item.icone}`} aria-hidden="true"></i>

                <span>{item.titulo}</span>

                {!carregandoPagina && (
                  <span className="tab-count">
                    {dados[item.id]?.length || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div
            id="minhas-tab-panel"
            className="minhas-tab-panel"
            role="tabpanel"
            aria-labelledby={`minhas-tab-${aba}`}
          >
            <div className="minhas-list-header">
              <div>
                <h3>{abaAtual.titulo}</h3>
                <p>{abaAtual.descricao}</p>
              </div>

              {!carregandoPagina && (
                <span className="minhas-result-count">
                  {lista.length} {lista.length === 1 ? 'receita' : 'receitas'}
                </span>
              )}
            </div>

            {carregandoPagina ? (
              <div className="minhas-grid" aria-label="Carregando receitas">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : lista.length > 0 ? (
              <div className="minhas-grid">
                {lista.map(receita => {
                  const imagemUrl = receita.imagem
                    ? receita.imagem.startsWith('http')
                      ? receita.imagem
                      : `/uploads/${receita.imagem}`
                    : '/default-image.jpg';

                  return (
                    <article key={receita.id} className="minha-card">
                      <div className="minha-imagem">
                        <ImagemLoader
                          src={imagemUrl}
                          alt={receita.titulo}
                        />

                        <span className={`status-badge ${status.cor}`}>
                          <i
                            className={`pi ${status.icone}`}
                            aria-hidden="true"
                          ></i>
                          {status.texto}
                        </span>
                      </div>

                      <div className="minha-info">
                        <div className="minha-info-top">
                          <span className="minha-card-label">
                            <i
                              className="pi pi-book"
                              aria-hidden="true"
                            ></i>
                            Receita enviada
                          </span>

                          <h3>{receita.titulo}</h3>
                        </div>

                        <div className="minha-meta">
                          <span title="Tempo de preparo">
                            <i className="pi pi-clock" aria-hidden="true"></i>
                            {receita.tempoPreparo}
                          </span>

                          <span title="Porções">
                            <i className="pi pi-users" aria-hidden="true"></i>
                            {receita.porcoes} porções
                          </span>

                          <span title="Curtidas">
                            <i className="pi pi-heart" aria-hidden="true"></i>
                            {receita.totalFavoritos || 0} curtidas
                          </span>
                        </div>

                        <div className="minha-actions">
                          <button
                            type="button"
                            className="btn-ver"
                            onClick={() => setVerReceita(receita)}
                          >
                            <i className="pi pi-eye" aria-hidden="true"></i>
                            Ver receita
                          </button>

                          {aba === 'rejeitadas' && (
                            <button
                              type="button"
                              className="btn-motivo"
                              onClick={() => setMotivoAberto(receita)}
                            >
                              <i
                                className="pi pi-info-circle"
                                aria-hidden="true"
                              ></i>
                              Ver motivo
                            </button>
                          )}

                          {(aba === 'pendentes' || aba === 'rejeitadas') && (
                            <button
                              type="button"
                              className="btn-excluir"
                              onClick={() => setExcluindo(receita)}
                            >
                              <i className="pi pi-trash" aria-hidden="true"></i>
                              Excluir
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="minhas-empty">
                <div className="minhas-empty-icon">
                  <i className="pi pi-inbox" aria-hidden="true"></i>
                </div>

                <h3>{abaAtual.vazioTitulo}</h3>
                <p>{abaAtual.vazioDescricao}</p>

                {aba !== 'rejeitadas' && (
                  <button
                    type="button"
                    className="minhas-empty-action"
                    onClick={() => navigate('/nova-receita')}
                  >
                    <i className="pi pi-plus" aria-hidden="true"></i>
                    Enviar uma receita
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Modal
        aberto={!!motivoAberto}
        onFechar={() => setMotivoAberto(null)}
        maxWidth="480px"
      >
        <Modal.Header
          titulo="Motivo da rejeição"
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
              <i className="pi pi-times" aria-hidden="true"></i>
              Fechar
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        aberto={!!excluindo}
        onFechar={() => {
          if (!excluindoAgora) setExcluindo(null);
        }}
        maxWidth="480px"
      >
        <Modal.Header
          titulo="Excluir receita"
          icone="pi pi-exclamation-triangle"
          onFechar={() => {
            if (!excluindoAgora) setExcluindo(null);
          }}
        />

        <Modal.Body>
          <p className="admin-modal-delete-text">
            Tem certeza que deseja excluir{' '}
            <strong>{excluindo?.titulo}</strong>?
          </p>

          <p className="admin-modal-delete-warning">
            <i
              className="pi pi-exclamation-circle"
              aria-hidden="true"
            ></i>
            Esta ação não pode ser desfeita.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={() => setExcluindo(null)}
              disabled={excluindoAgora}
            >
              <i className="pi pi-times" aria-hidden="true"></i>
              Cancelar
            </button>

            <button
              type="button"
              className="modal-btn modal-btn-danger"
              onClick={confirmarExclusao}
              disabled={excluindoAgora}
            >
              {excluindoAgora ? (
                <>
                  <i
                    className="pi pi-spin pi-spinner"
                    aria-hidden="true"
                  ></i>
                  Excluindo...
                </>
              ) : (
                <>
                  <i className="pi pi-trash" aria-hidden="true"></i>
                  Excluir
                </>
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