import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from "../../../components/Global/PageWrapper/PageWrapper";
import ImagemLoader from "../../../components/Global/ImagemLoader/ImagemLoader";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { buscarReceita } from "../../../services/receitaService";
import { listarFavoritos, adicionarFavorito, removerFavorito } from "../../../services/favoritoService";
import { extrairMensagemErro } from "../../../services/api";
import { prefetchRota } from "../../../services/prefetch";
import './DetalhesReceita.css';

function DetalhesReceita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();

  const [receita, setReceita] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoFav, setCarregandoFav] = useState(false);
  const [ingredientesMarcados, setIngredientesMarcados] = useState(new Set());


useEffect(() => {
  let ativo = true;
  let requisicaoEmAndamento = false;

  setReceita(null);
  setCarregando(true);
  setIngredientesMarcados(new Set());

  async function carregar() {
    if (requisicaoEmAndamento) return;

    requisicaoEmAndamento = true;

    try {
      const data = await buscarReceita(id);

      if (!ativo) return;

      setReceita((anterior) => {
        if (JSON.stringify(anterior) === JSON.stringify(data)) {
          return anterior;
        }

        return data;
      });
    } catch (erro) {
      if (ativo) {
        console.error(erro);
      }
    } finally {
      requisicaoEmAndamento = false;

      if (ativo) {
        setCarregando(false);
      }
    }
  }

  carregar();

  const intervalo = setInterval(carregar, 10000);

  return () => {
    ativo = false;
    clearInterval(intervalo);
  };
}, [id]);


  useEffect(() => {
    let ativo = true;

    if (!usuario) {
      setFavoritos([]);
      return;
    }

    async function carregarFavoritos() {
      try {
        const dados = await listarFavoritos();

        if (ativo) {
          setFavoritos(Array.isArray(dados) ? dados : []);
        }
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarFavoritos();

    return () => {
      ativo = false;
    };
  }, [usuario]);

  function toggleIngrediente(index) {
    setIngredientesMarcados((anteriores) => {
      const atualizados = new Set(anteriores);

      if (atualizados.has(index)) {
        atualizados.delete(index);
      } else {
        atualizados.add(index);
      }

      return atualizados;
    });
  }

  async function handleToggleFavorito() {
    if (!usuario) {
      mostrarToast('Faça login para favoritar receitas!', 'info');
      return;
    }

    if (carregandoFav || !receita) return;

    const estaFavorito = favoritos.some(
      (favorito) => String(favorito) === String(receita.id)
    );

    setCarregandoFav(true);

    try {
      if (estaFavorito) {
        await removerFavorito(receita.id);

        setFavoritos((anteriores) =>
          anteriores.filter(
            (favorito) => String(favorito) !== String(receita.id)
          )
        );

        mostrarToast('Receita removida dos favoritos.', 'info');
      } else {
        await adicionarFavorito(receita.id);

        setFavoritos((anteriores) => [...anteriores, receita.id]);

        mostrarToast('Receita adicionada aos favoritos!', 'success');
      }
    } catch (erro) {
      const mensagem = extrairMensagemErro(
        erro,
        'Erro ao atualizar favorito. Tente novamente.'
      );

      mostrarToast(mensagem, 'error');
    } finally {
      setCarregandoFav(false);
    }
  }

  function imprimir() {
    window.print();
  }

function voltarInicio() {
  if (sessionStorage.getItem('estadoReceitas')) {
    sessionStorage.setItem('restaurarReceitas', 'true');
  }

  navigate('/');
}

  if (carregando) {
    return (
      <PageWrapper paginaAtual="detalhe">
        <main className="detalhe-container">

          <article className="detalhe-card detalhe-carregando" aria-busy="true">
            <div className="detalhe-hero">
              <div className="detalhe-image skeleton-block"></div>

              <div className="detalhe-info">
                <div className="skeleton-line skeleton-badge"></div>
                <div className="skeleton-line skeleton-titulo"></div>
                <div className="skeleton-line skeleton-titulo-curto"></div>
                <div className="skeleton-line skeleton-meta"></div>

                <div className="detalhe-meta">
                  <div className="skeleton-line skeleton-meta-item"></div>
                  <div className="skeleton-line skeleton-meta-item"></div>
                  <div className="skeleton-line skeleton-meta-item"></div>
                </div>

                <div className="detalhe-info-actions">
                  <div className="skeleton-line skeleton-action"></div>
                  <div className="skeleton-line skeleton-action"></div>
                </div>
              </div>
            </div>

            <div className="detalhe-body">
              <section className="detalhe-section">
                <div className="skeleton-line skeleton-section-title"></div>

                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={index}
                    className="skeleton-line skeleton-item"
                  ></div>
                ))}
              </section>

              <section className="detalhe-section">
                <div className="skeleton-line skeleton-section-title"></div>

                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="skeleton-line skeleton-item"
                  ></div>
                ))}
              </section>
            </div>
          </article>
        </main>
      </PageWrapper>
    );
  }

  if (!receita) {
    return (
      <PageWrapper paginaAtual="detalhe">
        <main className="detalhe-container">
          <div className="detalhe-estado-vazio">
            <span className="detalhe-estado-selo">
              Jornal de Receitas
            </span>

            <i className="pi pi-book" aria-hidden="true"></i>

            <h1>Receita não encontrada</h1>

            <p>
              Não foi possível encontrar a receita solicitada.
            </p>

            <button
              type="button"
              className="detalhe-voltar-btn"
              onClick={voltarInicio}
              onMouseEnter={() => prefetchRota('/')}
            >
              <i className="pi pi-arrow-left" aria-hidden="true"></i>
              Voltar ao início
            </button>
          </div>
        </main>
      </PageWrapper>
    );
  }

  const imagemUrl = receita.imagem
    ? receita.imagem.startsWith('http')
      ? receita.imagem
      : `/uploads/${receita.imagem}`
    : '/default-image.jpg';

  const ingredientes = receita.ingredientes
    ? receita.ingredientes.split('||').filter((item) => item.trim())
    : [];

  const passos = receita.modoPreparo
    ? receita.modoPreparo.split('||').filter((item) => item.trim())
    : [];

  const ehSalgado = receita.categoria === 'SALGADO';

  const estaFavorito = favoritos.some(
    (favorito) => String(favorito) === String(receita.id)
  );

  const totalIngredientesMarcados = ingredientes.filter(
    (_, index) => ingredientesMarcados.has(index)
  ).length;

  const quantidadePorcoes = Number(receita.porcoes);

  const textoPorcoes = receita.porcoes
    ? `${receita.porcoes} ${quantidadePorcoes === 1 ? 'porção' : 'porções'}`
    : 'Não informado';

  return (
    <PageWrapper paginaAtual="detalhe">
      <main className="detalhe-container">

            <article className="detalhe-card">
              <div className="detalhe-rodape">
                <div className="detalhe-rodape-identidade">
                  <span className="detalhe-rodape-marca">JR</span>

                  <div>
                    <strong>Jornal de Receitas</strong>
                    <span>Caderno culinário</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="detalhe-voltar-link"
                  onClick={voltarInicio}
                  onMouseEnter={() => prefetchRota('/')}
                >
                  <i className="pi pi-arrow-left" aria-hidden="true"></i>
                  Voltar às receitas
                </button>
              </div>

              <div className="detalhe-hero">
            <div className="detalhe-image">
              <ImagemLoader
                src={imagemUrl}
                alt={receita.titulo}
              />

              <div className="detalhe-image-legenda">
                <span>Jornal de Receitas</span>
                <span>Arquivo culinário</span>
              </div>
            </div>

            <div className="detalhe-info">
              <div className="detalhe-info-header">
                <span className="detalhe-chamada">
                  Uma receita para preparar e compartilhar
                </span>

                <h1 className="detalhe-titulo">
                  {receita.titulo}
                </h1>

                <div className="detalhe-titulo-ornamento" aria-hidden="true">
                  <span></span>
                  <i className="pi pi-star-fill"></i>
                  <span></span>
                </div>
              </div>

              <div className="detalhe-meta">
                <div className="detalhe-meta-item">
                  <i className="pi pi-clock" aria-hidden="true"></i>

                  <div>
                    <span>Preparo</span>
                    <strong>{receita.tempoPreparo || 'Não informado'}</strong>
                  </div>
                </div>

                <div className="detalhe-meta-item">
                  <i className="pi pi-users" aria-hidden="true"></i>

                  <div>
                    <span>Rendimento</span>
                    <strong>{textoPorcoes}</strong>
                  </div>
                </div>

                {receita.chefe && (
                  <div className="detalhe-meta-item">
                    <i className="pi pi-user" aria-hidden="true"></i>

                    <div>
                      <span>Receita de</span>
                      <strong>{receita.chefe}</strong>
                    </div>
                  </div>
                )}

                <div className="detalhe-meta-item">
                  <i className="pi pi-book" aria-hidden="true"></i>

                  <div>
                    <span>Categoria</span>
                    
                    <strong
                      className={`detalhe-badge-categoria ${
                        ehSalgado ? 'salgado' : 'doce'
                      }`}
                    >

                      Receita {ehSalgado ? 'salgada' : 'doce'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="detalhe-info-rodape">
                <span className="detalhe-info-rodape-titulo">
                  Guarde esta receita
                </span>

                <div className="detalhe-info-actions">
                  <button
                    type="button"
                    className={`detalhe-favorite-btn ${
                      estaFavorito ? 'active' : ''
                    }`}
                    onClick={handleToggleFavorito}
                    disabled={carregandoFav}
                    aria-pressed={estaFavorito}
                  >
                    {carregandoFav ? (
                      <>
                        <i
                          className="pi pi-spin pi-spinner"
                          aria-hidden="true"
                        ></i>
                        Aguarde...
                      </>
                    ) : (
                      <>
                        <i
                          className={
                            estaFavorito
                              ? 'pi pi-heart-fill'
                              : 'pi pi-heart'
                          }
                          aria-hidden="true"
                        ></i>

                        {estaFavorito ? 'Favoritado' : 'Favoritar'}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="detalhe-print-btn"
                    onClick={imprimir}
                  >
                    <i className="pi pi-print" aria-hidden="true"></i>
                    Imprimir / Salvar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="detalhe-divisoria">
            <span className="detalhe-divisoria-linha"></span>

            <span className="detalhe-divisoria-texto">
              A receita completa
            </span>

            <span className="detalhe-divisoria-linha"></span>
          </div>

          <div className="detalhe-body">
            <section className="detalhe-section detalhe-section-ingredientes">
              <div className="detalhe-section-topo">
                <span className="detalhe-section-indice">
                  Parte I
                </span>

                <span className="detalhe-section-descricao">
                  Separe tudo antes de começar
                </span>
              </div>

              <div className="detalhe-section-header">
                <div className="detalhe-section-titulo">
                  <i className="pi pi-list" aria-hidden="true"></i>
                  <h2>Ingredientes</h2>
                </div>

                <span className="detalhe-section-count">
                  {ingredientes.length} {ingredientes.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              <div className="detalhe-ingredientes-progresso">
                <span>
                  Marque os ingredientes que já separou
                </span>

                <strong>
                  {totalIngredientesMarcados}/{ingredientes.length}
                </strong>
              </div>

              <div
                className="detalhe-progresso-barra"
                role="progressbar"
                aria-label="Ingredientes separados"
                aria-valuemin={0}
                aria-valuemax={ingredientes.length}
                aria-valuenow={totalIngredientesMarcados}
              >
                <span
                  style={{
                    width: ingredientes.length
                      ? `${(totalIngredientesMarcados / ingredientes.length) * 100}%`
                      : '0%'
                  }}
                ></span>
              </div>

              {ingredientes.length > 0 ? (
                <ul className="detalhe-ingredientes">
                  {ingredientes.map((ingrediente, index) => (
                    <li
                      key={index}
                      className={`detalhe-ingrediente-item ${
                        ingredientesMarcados.has(index) ? 'marcado' : ''
                      }`}
                    >
                      <label className="detalhe-ingrediente-label">
                        <input
                          type="checkbox"
                          checked={ingredientesMarcados.has(index)}
                          onChange={() => toggleIngrediente(index)}
                        />

                        <span
                          className="detalhe-ingrediente-check"
                          aria-hidden="true"
                        ></span>

                        <span className="detalhe-ingrediente-text">
                          {ingrediente}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="detalhe-sem-conteudo">
                  Nenhum ingrediente informado.
                </p>
              )}
            </section>

            <section className="detalhe-section detalhe-section-preparo">
              <div className="detalhe-section-topo">
                <span className="detalhe-section-indice">
                  Parte II
                </span>

                <span className="detalhe-section-descricao">
                  Siga o preparo passo a passo
                </span>
              </div>

              <div className="detalhe-section-header">
                <div className="detalhe-section-titulo">
                  <i className="pi pi-book" aria-hidden="true"></i>
                  <h2>Modo de preparo</h2>
                </div>

                <span className="detalhe-section-count">
                  {passos.length} {passos.length === 1 ? 'etapa' : 'etapas'}
                </span>
              </div>

              {passos.length > 0 ? (
                <ol className="detalhe-preparo">
                  {passos.map((passo, index) => (
                    <li
                      key={index}
                      className="detalhe-preparo-item"
                    >
                      <span className="detalhe-preparo-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <p className="detalhe-preparo-text">
                        {passo}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="detalhe-sem-conteudo">
                  Nenhuma etapa de preparo informada.
                </p>
              )}
            </section>
          </div>
        </article>
      </main>
    </PageWrapper>
  );
}

export default DetalhesReceita;