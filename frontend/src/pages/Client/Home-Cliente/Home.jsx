import { useState, useEffect } from 'react';
import PageWrapper from "../../../components/Global/PageWrapper/PageWrapper";
import Carrossel from "../../../components/Global/Carrossel/Carrossel";
import Filtros from "../../../components/Home/Filtros/Filtros";
import CardReceita from "../../../components/Home/CardReceita/CardReceita";
import ReceitasRapidas from "../../../components/Home/ReceitasRapidas/ReceitasRapidas";
import ModalResumoFavoritos from "../../../components/Modal/ModalResumoFavoritos/ModalResumoFavoritos";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import usePolling from "../../../hooks/usePolling";
import { listarReceitas } from "../../../services/receitaService";
import { listarCarrossel } from "../../../services/carrosselService";
import { listarFavoritos, adicionarFavorito, removerFavorito, buscarResumoFavoritos } from "../../../services/favoritoService";
import { extrairMensagemErro } from "../../../services/api";
import { getCache, setCache } from "../../../services/cache";
import './Home.css';

const CACHE_KEY = 'home';

function Home() {
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();

  const [receitas, setReceitas] = useState([]);
  const [carrossel, setCarrossel] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [filtros, setFiltros] = useState({ nome: '', categoria: '', porcoes: '' });
  const [aba, setAba] = useState('todas');

  const [resumoAberto, setResumoAberto] = useState(false);
  const [resumo, setResumo] = useState(null);
  const [carregandoResumo, setCarregandoResumo] = useState(false);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const [receitasData, carrosselData] = await Promise.all([
        listarReceitas(silencioso),
        listarCarrossel(silencioso)
      ]);

      let favs = favoritos;
      if (usuario) {
        favs = await listarFavoritos();
      }

      setReceitas(receitasData);
      setCarrossel(carrosselData);
      setFavoritos(favs);

      setCache(CACHE_KEY, {
        receitas: receitasData,
        carrossel: carrosselData,
        favoritos: favs
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    const cached = getCache(CACHE_KEY);

    if (cached) {
      setReceitas(cached.receitas || []);
      setCarrossel(cached.carrossel || []);
      setFavoritos(cached.favoritos || []);
      setCarregando(false);
      carregar(true);
    } else {
      carregar();
    }
  }, [usuario]);

  usePolling(() => carregar(true), 10000, !carregando);

  async function handleToggleFavorito(receitaId, estaFavorito) {
    try {
      if (estaFavorito) {
        await removerFavorito(receitaId);
        setFavoritos(favoritos.filter(id => id !== receitaId));
      } else {
        await adicionarFavorito(receitaId);
        setFavoritos([...favoritos, receitaId]);
      }
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao atualizar favorito.');
      mostrarToast(msg, 'error');
    }
  }

  async function abrirResumo() {
    setResumoAberto(true);
    setCarregandoResumo(true);
    setResumo(null);

    try {
      const dados = await buscarResumoFavoritos();
      setResumo(dados);
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao carregar resumo dos favoritos.');
      mostrarToast(msg, 'error');
    } finally {
      setCarregandoResumo(false);
    }
  }

  function filtrar(lista) {
    return lista.filter(r => {
      if (filtros.nome && !r.titulo?.toLowerCase().includes(filtros.nome)) return false;
      if (filtros.categoria && r.categoria !== filtros.categoria) return false;
      if (filtros.porcoes && Number(r.porcoes) !== Number(filtros.porcoes)) return false;
      return true;
    });
  }

  const receitasFiltradas = filtrar(receitas);
  const salgados = receitasFiltradas.filter(r => r.categoria === 'SALGADO');
  const doces = receitasFiltradas.filter(r => r.categoria === 'DOCE');
  const receitasFavoritas = receitas.filter(r => favoritos.includes(r.id));

  function SkeletonCarrossel() {
    return (
      <div className="carousel-container skeleton-shimmer">
        <div className="skeleton-carrossel-caption">
          <div className="skeleton-line skeleton-line-caption-title"></div>
          <div className="skeleton-line skeleton-line-caption-text"></div>
        </div>
      </div>
    );
  }

  function SkeletonCard() {
    return (
      <div className="card skeleton-card-shimmer">
        <div className="card-image skeleton-shimmer-block">
          <span className="skeleton-badge"></span>
          <span className="skeleton-fav-btn"></span>
        </div>

        <div className="card-content">
          <div className="skeleton-line skeleton-line-title"></div>
          <div className="skeleton-line skeleton-line-title-short"></div>

          <div className="card-meta">
            <div className="card-meta-row">
              <div className="skeleton-line skeleton-line-meta"></div>
              <div className="skeleton-line skeleton-line-meta"></div>
            </div>
            <div className="skeleton-line skeleton-line-chefe"></div>
          </div>

          <div className="card-actions">
            <div className="skeleton-line skeleton-line-btn"></div>
          </div>
        </div>
      </div>
    );
  }

  function SkeletonCardRapida() {
    return (
      <div className="card card-receita-rapida skeleton-card-shimmer">
        <div className="card-image skeleton-shimmer-block">
          <div className="skeleton-rapida-titulo"></div>
        </div>

        <div className="card-content">
          <div className="card-meta">
            <div className="card-meta-row">
              <div className="skeleton-line skeleton-line-meta"></div>
              <div className="skeleton-line skeleton-line-meta"></div>
            </div>
          </div>

          <div className="skeleton-line skeleton-line-desc"></div>
          <div className="skeleton-line skeleton-line-desc"></div>
          <div className="skeleton-line skeleton-line-desc-short"></div>

          <div className="card-actions">
            <div className="skeleton-line skeleton-line-btn"></div>
          </div>
        </div>
      </div>
    );
  }

  function SkeletonGrid({ quantidade = 6 }) {
    return (
      <div className="receitas-grid">
        {Array.from({ length: quantidade }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  function SkeletonReceitasRapidas() {
    return (
      <section className="classifieds-section">
        <div className="section-title">
          <h2>Receitas Rápidas</h2>
          <p>Pratos deliciosos indicados para você preparar em pouco tempo</p>
        </div>

        <div className="classifieds">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCardRapida key={i} />
          ))}
        </div>
      </section>
    );
  }

  function SkeletonFiltros() {
    return (
      <div className="filtros-skeleton">
        <div className="skeleton-line skeleton-line-filtro"></div>
        <div className="skeleton-line skeleton-line-filtro"></div>
        <div className="skeleton-line skeleton-line-filtro"></div>
      </div>
    );
  }

  if (carregando) {
    return (
      <PageWrapper paginaAtual="inicio">
        <div className="home-wrapper">
          <SkeletonCarrossel />

          <div className="tab-buttons">
            <button className="tab-button active" disabled>Todas as Receitas</button>
          </div>

          <SkeletonFiltros />

          <div className="category-section">
            <h2 className="category-title">
              Salgados
              <span className="recipe-count">carregando...</span>
            </h2>
            <SkeletonGrid quantidade={4} />
          </div>

          <div className="category-section">
            <h2 className="category-title">
              Doces
              <span className="recipe-count">carregando...</span>
            </h2>
            <SkeletonGrid quantidade={4} />
          </div>

          <SkeletonReceitasRapidas />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper paginaAtual="inicio">
      <div className="home-wrapper">
        <Carrossel itens={carrossel} />

        <div className="tab-buttons">
          <button
            className={`tab-button ${aba === 'todas' ? 'active' : ''}`}
            onClick={() => setAba('todas')}
          >
            Todas as Receitas
          </button>

          {usuario && (
            <button
              className={`tab-button ${aba === 'favoritas' ? 'active' : ''}`}
              onClick={() => setAba('favoritas')}
            >
              <i className="pi pi-heart"></i> Favoritas
              <span className="badge">{favoritos.length}</span>
            </button>
          )}
        </div>

        {aba === 'todas' && (
          <>
            <Filtros onFiltrar={setFiltros} />

            <div className="category-section">
              <h2 className="category-title">
                Salgados
                <span className="recipe-count">{salgados.length} receitas</span>
              </h2>

              {salgados.length > 0 ? (
                <div className="receitas-grid">
                  {salgados.map(r => (
                    <CardReceita
                      key={r.id}
                      receita={r}
                      favorito={favoritos.includes(r.id)}
                      onToggleFavorito={handleToggleFavorito}
                      usuarioLogado={!!usuario}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-category">
                  <i className="pi pi-bolt"></i>
                  <h3>Nenhuma receita salgada encontrada</h3>
                </div>
              )}
            </div>

            <div className="category-section">
              <h2 className="category-title">
                Doces
                <span className="recipe-count">{doces.length} receitas</span>
              </h2>

              {doces.length > 0 ? (
                <div className="receitas-grid">
                  {doces.map(r => (
                    <CardReceita
                      key={r.id}
                      receita={r}
                      favorito={favoritos.includes(r.id)}
                      onToggleFavorito={handleToggleFavorito}
                      usuarioLogado={!!usuario}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-category">
                  <i className="pi pi-star"></i>
                  <h3>Nenhuma receita doce encontrada</h3>
                </div>
              )}
            </div>

            <ReceitasRapidas />
          </>
        )}

        {aba === 'favoritas' && (
          <>
            <div className="favoritas-header">
              <button
                type="button"
                className="favoritas-resumo-btn"
                onClick={abrirResumo}
                disabled={favoritos.length === 0}
              >
                <i className="pi pi-chart-bar"></i> Ver resumo
              </button>
            </div>

            {receitasFavoritas.length > 0 ? (
              <div className="receitas-grid">
                {receitasFavoritas.map(r => (
                  <CardReceita
                    key={r.id}
                    receita={r}
                    favorito={true}
                    onToggleFavorito={handleToggleFavorito}
                    usuarioLogado={!!usuario}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-category">
                <i className="pi pi-heart"></i>
                <h3>Nenhuma receita favoritada</h3>
                <p>Clique no coração das receitas para adicioná-las aos favoritos.</p>
              </div>
            )}
          </>
        )}
      </div>

      <ModalResumoFavoritos
        aberto={resumoAberto}
        onFechar={() => setResumoAberto(false)}
        resumo={resumo}
        carregando={carregandoResumo}
      />
    </PageWrapper>
  );
}

export default Home;