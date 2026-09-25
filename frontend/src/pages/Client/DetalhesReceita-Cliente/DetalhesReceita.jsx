import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from "../../../components/Global/PageWrapper/PageWrapper";
import ImagemLoader from "../../../components/Global/ImagemLoader/ImagemLoader";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { buscarReceita } from "../../../services/receitaService";
import { listarFavoritos, adicionarFavorito, removerFavorito } from "../../../services/favoritoService";
import { extrairMensagemErro } from "../../../services/api";
import { getCache, setCache } from "../../../services/cache";
import './DetalhesReceita.css';

function DetalhesReceita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();

  const CACHE_KEY = `receita-${id}`;

  const [receita, setReceita] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoFav, setCarregandoFav] = useState(false);
  const [ingredientesMarcados, setIngredientesMarcados] = useState(new Set());

  function toggleIngrediente(index) {
    setIngredientesMarcados(prev => {
      const novo = new Set(prev);
      if (novo.has(index)) novo.delete(index);
      else novo.add(index);
      return novo;
    });
  }

  useEffect(() => {
    const cached = getCache(CACHE_KEY);

    async function carregar() {
      try {
        const data = await buscarReceita(id);
        setReceita(data);
        setCache(CACHE_KEY, data);

        if (usuario) {
          const favs = await listarFavoritos();
          setFavoritos(favs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    if (cached) {
      setReceita(cached);
      setCarregando(false);
    } else {
      carregar();
    }
  }, [id, usuario]);

  async function handleToggleFavorito() {
    if (!usuario) {
      mostrarToast('Faça login para favoritar receitas!', 'info');
      return;
    }

    if (carregandoFav) return;

    const estaFavorito = favoritos.includes(receita.id);

    setCarregandoFav(true);
    try {
      if (estaFavorito) {
        await removerFavorito(receita.id);
        setFavoritos(favoritos.filter(f => f !== receita.id));
        mostrarToast('Receita removida dos favoritos.', 'info');
      } else {
        await adicionarFavorito(receita.id);
        setFavoritos([...favoritos, receita.id]);
        mostrarToast('Receita adicionada aos favoritos!', 'success');
      }
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao atualizar favorito. Tente novamente.');
      mostrarToast(msg, 'error');
    } finally {
      setCarregandoFav(false);
    }
  }

  function imprimir() {
    window.print();
  }

  if (carregando) {
    return (
      <PageWrapper paginaAtual="detalhe">
        <div style={{ paddingTop: '320px', textAlign: 'center' }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#8b0000' }}></i>
        </div>
      </PageWrapper>
    );
  }

  if (!receita) {
    return (
      <PageWrapper paginaAtual="detalhe">
        <div style={{ paddingTop: '320px', textAlign: 'center' }}>
          <h2>Receita não encontrada</h2>
          <button onClick={() => navigate('/')}>Voltar</button>
        </div>
      </PageWrapper>
    );
  }

  const imagemUrl = receita.imagem
    ? (receita.imagem.startsWith('http') ? receita.imagem : `/uploads/${receita.imagem}`)
    : '/default-image.jpg';

  const ingredientes = receita.ingredientes
    ? receita.ingredientes.split('||').filter(s => s.trim())
    : [];

  const passos = receita.modoPreparo
    ? receita.modoPreparo.split('||').filter(s => s.trim())
    : [];

  const ehSalgado = receita.categoria === 'SALGADO';
  const estaFavorito = favoritos.includes(receita.id);

  return (
    <PageWrapper paginaAtual="detalhe">
      <div className="detalhe-container">
        <div className="detalhe-card">

          <div className="detalhe-hero">
            <div className="detalhe-image">
              <ImagemLoader src={imagemUrl} alt={receita.titulo} />
            </div>

            <div className="detalhe-info">
              <span className={`detalhe-badge-categoria ${ehSalgado ? 'salgado' : 'doce'}`}>
                {ehSalgado ? 'Salgado' : 'Doce'}
              </span>

              <div className="detalhe-info-header">
                <h1 className="detalhe-titulo">{receita.titulo}</h1>

                <div className="detalhe-info-actions">
                  <button
                    className={`detalhe-favorite-btn ${estaFavorito ? 'active' : ''}`}
                    onClick={handleToggleFavorito}
                    disabled={carregandoFav}
                  >
                    {carregandoFav ? (
                      <>
                        <i className="pi pi-spin pi-spinner"></i>
                        Aguarde...
                      </>
                    ) : (
                      <>
                        <i className={estaFavorito ? 'pi pi-heart-fill' : 'pi pi-heart'}></i>
                        {estaFavorito ? 'Favoritado' : 'Favoritar'}
                      </>
                    )}
                  </button>

                  <button className="detalhe-print-btn" onClick={imprimir}>
                    <i className="pi pi-print"></i> Baixar
                  </button>
                </div>
              </div>

              <div className="detalhe-meta">
                <span className="detalhe-meta-item">
                  <i className="pi pi-clock"></i> {receita.tempoPreparo}
                </span>
                <span className="detalhe-meta-item">
                  <i className="pi pi-users"></i> {receita.porcoes} {receita.porcoes > 1 ? 'porções' : 'porção'}
                </span>
                {receita.chefe && (
                  <span className="detalhe-meta-item">
                    <i className="pi pi-user"></i> {receita.chefe}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="detalhe-body">

            <div className="detalhe-section">
              <div className="detalhe-section-header">
                <i className="pi pi-list"></i>
                <h2>Ingredientes</h2>
                <span className="detalhe-section-count">{ingredientes.length}</span>
              </div>

              <ul className="detalhe-ingredientes">
                {ingredientes.map((ing, i) => (
                  <li key={i} className={`detalhe-ingrediente-item ${ingredientesMarcados.has(i) ? 'marcado' : ''}`}>
                    <label className="detalhe-ingrediente-label">
                      <input
                        type="checkbox"
                        checked={ingredientesMarcados.has(i)}
                        onChange={() => toggleIngrediente(i)}
                      />
                      <span className="detalhe-ingrediente-check"></span>
                      <span className="detalhe-ingrediente-text">{ing}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detalhe-section">
              <div className="detalhe-section-header">
                <i className="fas fa-mortar-pestle"></i> <h2>Modo de Preparo</h2>
                <span className="detalhe-section-count">{passos.length}</span>
              </div>

              <ol className="detalhe-preparo">
                {passos.map((passo, i) => (
                  <li key={i} className="detalhe-preparo-item">
                    <span className="detalhe-preparo-number">{i + 1}</span>
                    <span className="detalhe-preparo-text">{passo}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

export default DetalhesReceita;
