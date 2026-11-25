import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../../components/Global/PageWrapper/PageWrapper';
import Filtros from '../../../components/Home/Filtros/Filtros';
import CardReceita from '../../../components/Home/CardReceita/CardReceita';
import ReceitasRapidas from '../../../components/Home/ReceitasRapidas/ReceitasRapidas';
import ModalResumoFavoritos from '../../../components/Modal/ModalResumoFavoritos/ModalResumoFavoritos';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import usePolling from '../../../hooks/usePolling';
import { listarReceitas } from '../../../services/receitaService';
import { listarCarrossel } from '../../../services/carrosselService';
import {
  listarFavoritos,
  adicionarFavorito,
  removerFavorito,
  buscarResumoFavoritos,
} from '../../../services/favoritoService';
import { extrairMensagemErro } from '../../../services/api';
import { getCache, setCache } from '../../../services/cache';
import obterImagemUrl from '../../../utils/obterImagemUrl';
import ModalImagemHome from './ModalImagemHome';
import './Home.css';
const CACHE_KEY = 'home';

const DICAS = [
  {
    titulo: 'O ponto da frigideira',
    texto:
      'Para dourar carnes, aqueça a frigideira antes de adicionar os alimentos. Evite colocar muitas porções de uma só vez.',
  },
  {
    titulo: 'Temperos frescos',
    texto:
      'Salsinha, cebolinha e outras ervas delicadas conservam melhor o aroma quando adicionadas perto do final do preparo.',
  },
  {
    titulo: 'Atenção ao forno',
    texto:
      'Preaquecer o forno ajuda a manter o tempo de preparo mais previsível, especialmente em massas, pães e assados.',
  },
  {
    titulo: 'Na hora de cozinhar',
    texto:
      'Prove o alimento durante o preparo. Corrigir o sal aos poucos costuma dar mais controle sobre o resultado.',
  },
  {
    titulo: 'Como guardar sobras',
    texto:
      'Coloque os alimentos preparados em recipientes rasos e leve-os à geladeira em até duas horas. Não espere que esfriem completamente fora dela.',
  },
  {
    titulo: 'Para legumes mais uniformes',
    texto:
      'Corte os ingredientes em pedaços de tamanhos semelhantes. Isso ajuda a evitar que alguns fiquem crus enquanto outros passam do ponto.',
  },
];

function obterChaveDia(data) {
  return [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0'),
  ].join('-');
}
function obterNumeroDia(chave) {
  const [ano, mes, dia] = chave.split('-').map(Number);
  return Math.floor(Date.UTC(ano, mes - 1, dia) / 86400000);
}
function selecionarEdicao(receitas, chaveDia) {
  const ordenadas = [...receitas].sort((a, b) =>
    String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }),
  );
  if (!ordenadas.length) {
    return { principal: null, secundarias: [] };
  }
  const numeroDia = obterNumeroDia(chaveDia);
  const indice =
    ((numeroDia % ordenadas.length) + ordenadas.length) % ordenadas.length;
  const principal = ordenadas[indice];
  const secundarias = [];
  for (let deslocamento = 1; deslocamento < ordenadas.length; deslocamento++) {
    if (secundarias.length === 4) break;
    secundarias.push(ordenadas[(indice + deslocamento) % ordenadas.length]);
  }
  return { principal, secundarias };
}
function Estrela({ className = '' }) {
  return (
    <i
      className={`pi pi-star-fill jornal-estrela ${className}`}
      aria-hidden="true"
    />
  );
}
function Anuncio({ imagem, legenda, classe = '', adaptavel = false, onAbrir }) {
  if (!imagem) return null;
  return (
    <figure
      className={`jornal-anuncio ${classe} ${adaptavel ? 'jornal-anuncio--adaptavel' : ''}`}
    >
      <button
        type="button"
        className="jornal-anuncio-imagem jornal-anuncio-imagem--clicavel"
        onClick={() => onAbrir(imagem, legenda)}
        aria-label={`Ampliar imagem: ${legenda || 'Ilustração publicitária'}`}
      >
        <img
          src={imagem}
          alt={legenda || 'Ilustração publicitária'}
          loading="lazy"
        />
        <span className="jornal-anuncio-ampliar" aria-hidden="true">
          <i className="pi pi-search-plus" />
        </span>
      </button>
      {legenda && <figcaption>{legenda}</figcaption>}
    </figure>
  );
}
function Divisoria({ texto }) {
  return (
    <div className="jornal-divisoria">
      <span className="jornal-divisoria-linha" />
      <Estrela />
      <span className="jornal-divisoria-texto">{texto}</span>
      <Estrela />
      <span className="jornal-divisoria-linha" />
    </div>
  );
}
function ReceitasVazias({ icone, titulo, texto }) {
  return (
    <div className="empty-category">
      <i className={`pi ${icone}`} aria-hidden="true" />
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="jornal-skeleton-card">
      <div className="jornal-skeleton-imagem skeleton-shimmer" />
      <div className="jornal-skeleton-linha skeleton-shimmer" />
      <div className="jornal-skeleton-linha curta skeleton-shimmer" />
      <div className="jornal-skeleton-linha skeleton-shimmer" />
    </div>
  );
}
function Home() {
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();
  const [receitas, setReceitas] = useState([]);
  const [carrossel, setCarrossel] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: '',
    porcoes: '',
  });
  const [aba, setAba] = useState('todas');
  const [resumoAberto, setResumoAberto] = useState(false);
  const [resumo, setResumo] = useState(null);
  const [carregandoResumo, setCarregandoResumo] = useState(false);
  const [chaveDia, setChaveDia] = useState(() => obterChaveDia(new Date()));
  const usuarioRef = useRef(usuario);
  const [restauracao] = useState(() => {
    if (sessionStorage.getItem('restaurarReceitas') !== 'true') {
      return null;
    }
    try {
      return JSON.parse(sessionStorage.getItem('estadoReceitas'));
    } catch {
      return null;
    }
  });
  const [imagemAmpliada, setImagemAmpliada] = useState(null);
  useEffect(() => {
    if (!imagemAmpliada) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const fecharComEscape = (evento) => {
      if (evento.key === 'Escape') {
        setImagemAmpliada(null);
      }
    };
    document.addEventListener('keydown', fecharComEscape);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', fecharComEscape);
    };
  }, [imagemAmpliada]);
  const abrirImagem = (imagem, legenda) => {
    setImagemAmpliada({ imagem, legenda });
  };
  useLayoutEffect(() => {
    if (!restauracao || carregando) return;
    setAba(restauracao.aba || 'todas');
    setFiltros(
      restauracao.filtros || {
        nome: '',
        categoria: '',
        porcoes: '',
      },
    );
  }, [restauracao, carregando]);
  useLayoutEffect(() => {
    if (!restauracao || carregando) return;
    let frame;
    let tentativas = 0;
    let cancelado = false;
    function restaurarPosicao() {
      if (cancelado) return;
      const alturaDisponivel =
        document.documentElement.scrollHeight - window.innerHeight;
      if (alturaDisponivel >= restauracao.scrollY || tentativas >= 60) {
        window.scrollTo(0, restauracao.scrollY);
        sessionStorage.removeItem('restaurarReceitas');
        sessionStorage.removeItem('estadoReceitas');
        return;
      }
      tentativas++;
      frame = requestAnimationFrame(restaurarPosicao);
    }
    frame = requestAnimationFrame(restaurarPosicao);
    return () => {
      cancelado = true;
      cancelAnimationFrame(frame);
    };
  }, [restauracao, carregando]);
  useEffect(() => {
    usuarioRef.current = usuario;
  }, [usuario]);
  useEffect(() => {
    const atualizarData = () => setChaveDia(obterChaveDia(new Date()));
    const intervalo = window.setInterval(atualizarData, 30000);
    const atualizarVisibilidade = () => {
      if (document.visibilityState === 'visible') atualizarData();
    };
    document.addEventListener('visibilitychange', atualizarVisibilidade);
    return () => {
      window.clearInterval(intervalo);
      document.removeEventListener('visibilitychange', atualizarVisibilidade);
    };
  }, []);
  function salvarPosicaoReceitas() {
    sessionStorage.setItem(
      'estadoReceitas',
      JSON.stringify({
        scrollY: window.scrollY,
        aba,
        filtros,
      }),
    );
  }
  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setCarregando(true);
    try {
      const [receitasData, carrosselData] = await Promise.all([
        listarReceitas(silencioso),
        listarCarrossel(silencioso),
      ]);
      const favs = usuarioRef.current ? await listarFavoritos() : [];
      const receitasAtualizadas = Array.isArray(receitasData)
        ? receitasData
        : [];
      const carrosselAtualizado = Array.isArray(carrosselData)
        ? carrosselData
        : [];
      const favoritosAtualizados = Array.isArray(favs) ? favs : [];
      setReceitas(receitasAtualizadas);
      setCarrossel(carrosselAtualizado);
      setFavoritos(favoritosAtualizados);
      setCache(CACHE_KEY, {
        receitas: receitasAtualizadas,
        carrossel: carrosselAtualizado,
        favoritos: favoritosAtualizados,
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }, []);
  useEffect(() => {
    const cached = getCache(CACHE_KEY);
    if (cached) {
      setReceitas(cached.receitas || []);
      setCarrossel(cached.carrossel || []);
      setFavoritos(usuario ? cached.favoritos || [] : []);
      setCarregando(false);
      carregar(true);
    } else {
      carregar();
    }
  }, [usuario, carregar]);
  usePolling(() => carregar(true), 10000, !carregando);
  async function handleToggleFavorito(receitaId, estaFavorito) {
    try {
      if (estaFavorito) {
        await removerFavorito(receitaId);
        setFavoritos((anteriores) =>
          anteriores.filter((id) => id !== receitaId),
        );
      } else {
        await adicionarFavorito(receitaId);
        setFavoritos((anteriores) =>
          anteriores.includes(receitaId)
            ? anteriores
            : [...anteriores, receitaId],
        );
      }
    } catch (erro) {
      mostrarToast(
        extrairMensagemErro(erro, 'Erro ao atualizar favorito.'),
        'error',
      );
    }
  }
  async function abrirResumo() {
    setResumoAberto(true);
    setCarregandoResumo(true);
    setResumo(null);
    try {
      setResumo(await buscarResumoFavoritos());
    } catch (erro) {
      mostrarToast(
        extrairMensagemErro(erro, 'Erro ao carregar resumo dos favoritos.'),
        'error',
      );
    } finally {
      setCarregandoResumo(false);
    }
  }
  function filtrar(lista) {
    return lista.filter((receita) => {
      const nome = filtros.nome?.toLowerCase().trim();
      if (nome && !receita.titulo?.toLowerCase().includes(nome)) return false;
      if (filtros.categoria && receita.categoria !== filtros.categoria)
        return false;
      if (
        filtros.porcoes &&
        Number(receita.porcoes) !== Number(filtros.porcoes)
      )
        return false;
      return true;
    });
  }
  const receitasFiltradas = filtrar(receitas);
  const salgados = receitasFiltradas.filter(
    (receita) => receita.categoria === 'SALGADO',
  );
  const doces = receitasFiltradas.filter(
    (receita) => receita.categoria === 'DOCE',
  );
  const receitasFavoritas = receitas.filter((receita) =>
    favoritos.includes(receita.id),
  );
  const filtrosAtivos = Boolean(
    filtros.nome?.trim() || filtros.categoria || filtros.porcoes,
  );
  const exibirSalgados = !filtrosAtivos || salgados.length > 0;
  const exibirDoces = !filtrosAtivos || doces.length > 0;
  const semResultados = filtrosAtivos && receitasFiltradas.length === 0;
  const { principal, secundarias } = useMemo(
    () => selecionarEdicao(receitas, chaveDia),
    [receitas, chaveDia],
  );
  const imagensCarrossel = carrossel.filter((item) => item.imagemUrl);
  const anuncioColunaEsquerda = imagensCarrossel[0];
  const anuncioColunaDireita = imagensCarrossel[1];
  const anunciosDinamicos = [
    ...imagensCarrossel.slice(2, 4),
    ...imagensCarrossel.slice(6, 7),
  ];
  const imagemReceitaRecortar = imagensCarrossel[4];
  const dicaDoDia = DICAS[((obterNumeroDia(chaveDia) % DICAS.length) + DICAS.length) % DICAS.length];
  const salgadosPublicados = receitas.filter(receita => receita.categoria === 'SALGADO').length;
  const docesPublicados = receitas.filter(receita => receita.categoria === 'DOCE').length;

  const dataEdicao = useMemo(() => {
    const [ano, mes, dia] = chaveDia.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(ano, mes - 1, dia));
  }, [chaveDia]);
  const cardProps = (receita) => ({
    receita,
    favorito: favoritos.includes(receita.id),
    onToggleFavorito: handleToggleFavorito,
    usuarioLogado: !!usuario,
    onAbrirReceita: salvarPosicaoReceitas,
  });
  function renderizarReceitas(lista, tipo) {
    if (!lista.length) {
      return (
        <ReceitasVazias
          icone="pi-search"
          titulo="Nenhuma receita encontrada nesta edição"
          texto="Experimente alterar os filtros para consultar outras receitas."
        />
      );
    }
    return (
      <div className={`receitas-grid receitas-grid--${tipo}`}>
        {lista.map((receita, indice) => (
          <article className="jornal-receita-item" key={receita.id}>
            <div className="jornal-receita-numero">
              <Estrela />
              <span>Receita nº {String(indice + 1).padStart(2, '0')}</span>
            </div>
            <CardReceita {...cardProps(receita)} variante="grade" />
          </article>
        ))}
      </div>
    );
  }
  return (
    <PageWrapper
      paginaAtual="inicio"
      modais={
        <>
          <ModalImagemHome
            imagem={imagemAmpliada}
            onFechar={() => setImagemAmpliada(null)}
          />
          <ModalResumoFavoritos
            aberto={resumoAberto}
            onFechar={() => setResumoAberto(false)}
            resumo={resumo}
            carregando={carregandoResumo}
          />
        </>
      }
    >
      {({ abrirLogin }) => (
        <>
          <div className="jornal-faixa-noticias">
            <div className="jornal-faixa-edicao">
              <strong>Boletim da edição</strong>
              <time dateTime={chaveDia}>{dataEdicao}</time>
            </div>

            <dl className="jornal-faixa-contagem">
              <div><dt>Publicadas</dt><dd>{carregando ? '—' : receitas.length}</dd></div>
              <div><dt>Salgados</dt><dd>{carregando ? '—' : salgadosPublicados}</dd></div>
              <div><dt>Doces</dt><dd>{carregando ? '—' : docesPublicados}</dd></div>
            </dl>
          </div>

          <section className="jornal-primeira-pagina" aria-label="Destaques da edição">
            <article className="jornal-materia-principal" aria-labelledby="jornal-capa-titulo">
              <div className="jornal-editoria"><Estrela /> Receita de capa</div>

              {carregando ? (
                <>
                  <h2 id="jornal-capa-titulo" className="jornal-capa-titulo">Destaque da edição</h2>
                  <SkeletonCard />
                </>
              ) : principal ? (
                <>
                  <h2 id="jornal-capa-titulo" className="jornal-capa-titulo">
                    <Link to={`/detalhe/${principal.id}`}>{principal.titulo}</Link>
                  </h2>
                  <div className="jornal-capa-dados">
                    <span>{principal.categoria === 'DOCE' ? 'Confeitaria' : 'Cozinha salgada'}</span>
                   {principal.tempoPreparo && (
                        <span>
                          <i className="pi pi-clock" aria-hidden="true" />
                          {principal.tempoPreparo}
                        </span>
                      )}

                      {principal.porcoes && (
                        <span>
                          <i className="pi pi-users" aria-hidden="true" />
                          {principal.porcoes} porções
                        </span>
                      )}

                      {principal.chefe && (
                        <span>
                          <i className="pi pi-user" aria-hidden="true" />
                          {principal.chefe}
                        </span>
                      )}
                  </div>
                  <div className="jornal-destaque-card">
                    <CardReceita {...cardProps(principal)} variante="destaque" />
                  </div>
                  <Link className="jornal-capa-link" to={`/detalhe/${principal.id}`}>
                    Ler receita completa <i className="pi pi-arrow-right" aria-hidden="true" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 id="jornal-capa-titulo" className="jornal-capa-titulo">A primeira receita</h2>
                  <ReceitasVazias
                    icone="pi-book"
                    titulo="Aguardando publicação"
                    texto="A receita aprovada aparecerá aqui."
                  />
                </>
              )}
            </article>

            <aside className="jornal-coluna-esquerda" aria-labelledby="jornal-dica-titulo">
              <div className="jornal-editoria"><Estrela /> Segredos da cozinha</div>
              <h2 id="jornal-dica-titulo" className="jornal-coluna-titulo">{dicaDoDia.titulo}</h2>
              <p className="jornal-coluna-texto">{dicaDoDia.texto}</p>

              <section className="jornal-redacao" aria-labelledby="jornal-redacao-titulo">
                <p className="jornal-redacao-editoria">Cartas à redação</p>
                <h3 id="jornal-redacao-titulo">Publique no Jornal</h3>
                <p>
                  {usuario
                    ? 'Use o formulário para compartilhar uma receita sua.'
                    : 'Faça login para enviar suas receitas ao Jornal.'}
                </p>
                {usuario ? (
                  <Link to="/nova" className="jornal-redacao-acao">
                    Enviar receita
                    <i className="pi pi-arrow-right" aria-hidden="true" />
                  </Link>
                ) : (
                  <button type="button" className="jornal-redacao-acao" onClick={abrirLogin}>
                    Fazer login
                    <i className="pi pi-arrow-right" aria-hidden="true" />
                  </button>
                )}
              </section>
{anuncioColunaDireita && (
  <Anuncio
    imagem={obterImagemUrl(anuncioColunaDireita.imagemUrl)}
    legenda={anuncioColunaDireita.titulo || ''}
    classe="jornal-anuncio--redacao"
    onAbrir={abrirImagem}
  />
)}
            </aside>

            <aside className="jornal-coluna-direita" aria-labelledby="jornal-edicao-titulo">
              <h2 id="jornal-edicao-titulo" className="jornal-editoria jornal-editoria--vermelha">
                <Estrela /> Também nesta edição
              </h2>
              {carregando ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : secundarias.length ? (
                <div className="jornal-lista-manchetes">
                  {secundarias.map((receita, indice) => (
                    <article
                      className="jornal-manchete-secundaria"
                      key={receita.id}
                    >
                      <span className="jornal-manchete-indice">
                        {String(indice + 1).padStart(2, '0')}
                      </span>
                      <div className="jornal-manchete-conteudo">
                        <span>
                          {receita.categoria === 'DOCE'
                            ? 'Confeitaria'
                            : 'Cozinha salgada'}
                        </span>
                        <h3>
                          <Link to={`/detalhe/${receita.id}`}>
                            {receita.titulo}
                          </Link>
                        </h3>
                        <div className="jornal-manchete-dados">
                          {receita.tempoPreparo && (
                            <span>
                              <i className="pi pi-clock" aria-hidden="true" />
                              {receita.tempoPreparo}
                            </span>
                          )}
                          {receita.porcoes && (
                            <span>
                              <i className="pi pi-users" aria-hidden="true" />
                              {receita.porcoes}
                            </span>
                          )}
                        </div>
                        <Link
                          className="jornal-manchete-link"
                          to={`/detalhe/${receita.id}`}
                        >
                          Ler receita
                          <i className="pi pi-arrow-right" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="jornal-coluna-texto">
                  Outras receitas publicadas aparecerão nesta coluna.
                </p>
              )}

            </aside>
          </section>
          {anunciosDinamicos.length > 0 && (
            <section
              className="jornal-classificados"
              aria-labelledby="jornal-classificados-titulo"
            >
              <div className="jornal-classificados-cabecalho">
                <div className="jornal-classificados-edicao">
                  <span>JORNAL DE RECEITAS</span>
                  <span>CADERNO DE PUBLICIDADE</span>
                </div>
                <div className="jornal-classificados-manchete">
                  <span className="jornal-classificados-chapeu">
                    INTERVALO COMERCIAL
                  </span>
                  <h2 id="jornal-classificados-titulo">
                    Reclames <em>& novidades</em>
                  </h2>
                  <p>
                    Um espaço para os anúncios que também fazem parte das páginas do
                    nosso jornal.
                  </p>
                </div>
                <div className="jornal-classificados-registro">
                  <span>PUBLICIDADE</span>
                  <strong>
                    {String(anunciosDinamicos.length).padStart(2, '0')}
                  </strong>
                  <span>ANÚNCIOS NESTA EDIÇÃO</span>
                </div>
              </div>
              <div className="jornal-classificados-lista">
                {anunciosDinamicos.map((item, indice) => (
                  <article
                    className="jornal-classificados-item"
                    key={item.id ?? indice}
                  >
                    <div className="jornal-classificados-item-topo">
                      <span>ANÚNCIO Nº {String(indice + 1).padStart(2, '0')}</span>
                      <span>RECLAME ILUSTRADO</span>
                    </div>
                    <Anuncio
                      imagem={obterImagemUrl(item.imagemUrl)}
                      legenda={item.titulo || 'Anúncio da edição'}
                      classe="jornal-anuncio--classificado"
                      adaptavel
                      onAbrir={abrirImagem}
                    />
                    <div className="jornal-classificados-item-rodape">
                      <i className="pi pi-star-fill" aria-hidden="true" />
                      <span>ESPAÇO PUBLICITÁRIO</span>
                      <i className="pi pi-star-fill" aria-hidden="true" />
                    </div>
                  </article>
                ))}
              </div>
              <div className="jornal-classificados-rodape">
                <span>FIM DO CADERNO PUBLICITÁRIO</span>
                <span className="jornal-classificados-rodape-centro">
                  <i className="pi pi-star-fill" aria-hidden="true" />
                  JORNAL DE RECEITAS
                  <i className="pi pi-star-fill" aria-hidden="true" />
                </span>
                <span>CONTINUE A LEITURA</span>
              </div>
            </section>
          )}
          <section className="jornal-catalogo" id="receitas-do-dia">
            <div className="jornal-catalogo-cabecalho">
              <div>
                <span className="jornal-catalogo-numero">
                  <Estrela />O caderno da boa cozinha
                </span>
                <h2>
                  O grande <em>receituário</em>
                </h2>
                <p>Abra o caderno, escolha um prato e mãos à obra.</p>
              </div>
              <div className="jornal-catalogo-selo">
                <strong>{receitas.length}</strong>
                <span>receitas no acervo</span>
              </div>
            </div>
            <div className="jornal-navegacao-receitas">
              <div
                className="tab-buttons"
                role="tablist"
                aria-label="Consultar receitas"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={aba === 'todas'}
                  className={`tab-button ${aba === 'todas' ? 'active' : ''}`}
                  onClick={() => setAba('todas')}
                >
                  <i className="pi pi-list" aria-hidden="true" />
                  Todas as receitas
                </button>
                {usuario && (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={aba === 'favoritas'}
                    className={`tab-button ${aba === 'favoritas' ? 'active' : ''}`}
                    onClick={() => setAba('favoritas')}
                  >
                    <i className="pi pi-heart" aria-hidden="true" />
                    Minhas favoritas
                    <span className="badge">{favoritos.length}</span>
                  </button>
                )}
              </div>
            </div>
            {aba === 'todas' && (
              <>
                <div className="jornal-busca-editorial">
                  <div className="jornal-busca-titulo">
                    <span>Índice de receitas</span>
                    <h3>À procura de um prato?</h3>
                    <p>Encontre pelo nome, categoria ou número de porções.</p>
                  </div>
                  <div className="jornal-busca-campos">
                    <Filtros onFiltrar={setFiltros} />
                  </div>
                </div>
                {exibirSalgados && (
                  <section className="category-section category-section--salgados">
                    <div className="jornal-secao-cabecalho">
                      <div className="jornal-secao-numeracao">
                        <Estrela />
                        <span>Caderno I</span>
                      </div>
                      <div className="jornal-secao-titulo">
                        <span>Para o almoço e o jantar</span>
                        <h2>
                          Pratos <em>salgados</em>
                        </h2>
                      </div>
                      <div className="jornal-secao-contagem">
                        <strong>{salgados.length}</strong>
                        <span>receitas</span>
                      </div>
                    </div>
                    {carregando ? (
                      <div className="receitas-grid">
                        {Array.from({ length: 4 }, (_, indice) => (
                          <SkeletonCard key={indice} />
                        ))}
                      </div>
                    ) : (
                      renderizarReceitas(salgados, 'salgados')
                    )}
                  </section>
                )}
                {!filtrosAtivos && (
                  <section className="jornal-interludio">
                    <div className="jornal-interludio-cabecalho">
                      <span>JORNAL DE RECEITAS</span>
                      <span>SUPLEMENTO ESPECIAL · RECEITUÁRIO ILUSTRADO</span>
                    </div>
                    <div className="jornal-interludio-corpo">
                      <div className="jornal-interludio-texto">
                        <span className="jornal-interludio-sobretitulo">
                          <i className="pi pi-book" aria-hidden="true" />
                          Do caderno da cozinheira
                        </span>
                        <h2>
                          Uma receita
                          <em>para recortar</em>e guardar.
                        </h2>
                        <p>
                          Havia sempre uma receita especial esperando pela tesoura,
                          pela cola e por um lugar no caderno de família.
                        </p>
                        <div className="jornal-interludio-carimbo">
                          <span>EDIÇÃO ESPECIAL</span>
                          <strong>Para</strong>
                          <strong>guardar!</strong>
                          <i className="pi pi-star-fill" aria-hidden="true" />
                        </div>
                        <div className="jornal-interludio-detalhe">
                          <span>TRADIÇÃO DE COZINHA</span>
                          <Estrela />
                          <span>MEMÓRIAS À MESA</span>
                        </div>
                      </div>
                      <div className="jornal-interludio-ilustracao">
                        <div className="jornal-interludio-recorte">
                          <div className="jornal-interludio-folha">
                            <div className="jornal-interludio-folha-topo">
                              <span>RECEITUÁRIO POPULAR</span>
                              <span>ILUSTRAÇÃO Nº 01</span>
                            </div>
                            <div className="jornal-interludio-folha-titulo">
                              <span>DO ARQUIVO DA COZINHEIRA</span>
                              <strong>Uma boa receita merece ser guardada.</strong>
                            </div>
                            {imagemReceitaRecortar && (
                              <Anuncio
                                imagem={obterImagemUrl(
                                  imagemReceitaRecortar.imagemUrl,
                                )}
                                legenda={
                                  imagemReceitaRecortar.titulo ||
                                  'Receita ilustrada · Acervo culinário'
                                }
                                classe="jornal-anuncio--receita"
                                onAbrir={abrirImagem}
                              />
                            )}
                            <div className="jornal-interludio-folha-rodape">
                              <span>COLE EM SEU CADERNO</span>
                              <i className="pi pi-star-fill" aria-hidden="true" />
                              <span>JORNAL DE RECEITAS</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="jornal-interludio-rodape">
                      <span>COLECIONE NOSSAS RECEITAS</span>
                      <span>UMA TRADIÇÃO QUE PASSA DE COZINHA EM COZINHA</span>
                    </div>
                  </section>
                )}
                {exibirDoces && (
                  <section className="category-section category-section--doces">
                    <div className="jornal-secao-cabecalho">
                      <div className="jornal-secao-numeracao">
                        <Estrela />
                        <span>Caderno II</span>
                      </div>
                      <div className="jornal-secao-titulo">
                        <span>Bolos, sobremesas e outras delícias</span>
                        <h2>
                          Coisas <em>doces</em>
                        </h2>
                      </div>
                      <div className="jornal-secao-contagem">
                        <strong>{doces.length}</strong>
                        <span>receitas</span>
                      </div>
                    </div>
                    {carregando ? (
                      <div className="receitas-grid">
                        {Array.from({ length: 4 }, (_, indice) => (
                          <SkeletonCard key={indice} />
                        ))}
                      </div>
                    ) : (
                      renderizarReceitas(doces, 'doces')
                    )}
                  </section>
                )}
                {!carregando && semResultados && (
                  <ReceitasVazias
                    icone="pi-search"
                    titulo="Nenhuma receita encontrada"
                    texto="Experimente alterar os filtros para encontrar outras receitas."
                  />
                )}
                {!filtrosAtivos && (
                  <div className="jornal-rapidas-wrapper">
                    <div className="jornal-rapidas-cabecalho">
                      <span>
                        <Estrela />
                        Suplemento da cozinha
                      </span>
                      <h2>
                        Para quem tem <em>pressa</em>
                      </h2>
                    </div>
                    <ReceitasRapidas />
                  </div>
                )}
              </>
            )}
            {aba === 'favoritas' && (
              <section className="jornal-favoritas">
                <div className="jornal-favoritas-cabecalho">
                  <div>
                    <span>
                      <Estrela />
                      Meu arquivo particular
                    </span>
                    <h2>
                      Meu caderno <em>de receitas</em>
                    </h2>
                    <p>Os pratos que você escolheu guardar.</p>
                  </div>
                  <button
                    type="button"
                    className="favoritas-resumo-btn"
                    onClick={abrirResumo}
                    disabled={favoritos.length === 0}
                  >
                    <i className="pi pi-chart-bar" aria-hidden="true" />
                    Ver resumo
                  </button>
                </div>
                {receitasFavoritas.length ? (
                  renderizarReceitas(receitasFavoritas, 'favoritas')
                ) : (
                  <ReceitasVazias
                    icone="pi-heart"
                    titulo="Seu caderno ainda está vazio"
                    texto="Clique no coração das receitas para guardá-las aqui."
                  />
                )}
              </section>
            )}
          </section>
          <footer className="jornal-fechamento">
            <Estrela />
            <div>
              <span>Fim desta edição</span>
              <h2>Até a próxima receita!</h2>
              <p>Jornal de Receitas · Da sua cozinha para o mundo</p>
            </div>
            <Estrela />
          </footer>
        </>

      )}
    </PageWrapper>

  );
}
export default Home;
