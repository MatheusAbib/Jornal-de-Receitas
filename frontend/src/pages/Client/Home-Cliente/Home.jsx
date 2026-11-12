
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  buscarResumoFavoritos
} from '../../../services/favoritoService';
import { extrairMensagemErro } from '../../../services/api';
import { getCache, setCache } from '../../../services/cache';
import './Home.css';

const CACHE_KEY = 'home';

const DICAS = [
  {
    titulo: 'Cozinhe e aprenda',
  },
  {
    titulo: 'O ponto da frigideira',
    texto: 'Para dourar carnes, aqueça a frigideira antes de adicionar os alimentos. Evite colocar muitas porções de uma só vez.'
  },
  {
    titulo: 'Temperos frescos',
    texto: 'Salsinha, cebolinha e outras ervas delicadas conservam melhor o aroma quando adicionadas perto do final do preparo.'
  },
  {
    titulo: 'Atenção ao forno',
    texto: 'Preaquecer o forno ajuda a manter o tempo de preparo mais previsível, especialmente em massas, pães e assados.'
  },
  {
    titulo: 'Na hora de cozinhar',
    texto: 'Prove o alimento durante o preparo, quando for seguro fazê-lo. Corrigir o sal aos poucos costuma dar mais controle sobre o resultado.'
  },
  {
    titulo: 'Como guardar sobras',
    texto: 'Coloque os alimentos preparados em recipientes rasos e leve-os à geladeira em até duas horas. Não espere que esfriem completamente fora dela.'
  },
  {
    titulo: 'Para legumes mais uniformes',
    texto: 'Corte os ingredientes em pedaços de tamanhos semelhantes. Isso ajuda a evitar que alguns fiquem crus enquanto outros passam do ponto.'
  }
];

function obterChaveDia(data) {
  return [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0')
  ].join('-');
}

function obterNumeroDia(chave) {
  const [ano, mes, dia] = chave.split('-').map(Number);
  return Math.floor(Date.UTC(ano, mes - 1, dia) / 86400000);
}

function selecionarEdicao(receitas, chaveDia) {
  const ordenadas = [...receitas].sort((a, b) =>
    String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true })
  );

  if (!ordenadas.length) {
    return { principal: null, secundarias: [] };
  }

  const numeroDia = obterNumeroDia(chaveDia);
  const indice = ((numeroDia % ordenadas.length) + ordenadas.length) % ordenadas.length;
  const principal = ordenadas[indice];
  const secundarias = [];

  for (let deslocamento = 1; deslocamento < ordenadas.length; deslocamento++) {
    if (secundarias.length === 4) break;
    secundarias.push(ordenadas[(indice + deslocamento) % ordenadas.length]);
  }

  return { principal, secundarias };
}

function obterImagemUrl(imagemUrl) {
  if (!imagemUrl) return '';

  if (
    imagemUrl.startsWith('http://') ||
    imagemUrl.startsWith('https://') ||
    imagemUrl.startsWith('data:') ||
    imagemUrl.startsWith('blob:')
  ) {
    return imagemUrl;
  }

  if (imagemUrl.startsWith('/uploads/')) return imagemUrl;

  return `/uploads/${imagemUrl.replace(/^\/+/, '')}`;
}

function Estrela({ className = '' }) {
  return (
    <i
      className={`pi pi-star-fill jornal-estrela ${className}`}
      aria-hidden="true"
    />
  );
}

function Anuncio({ imagem, legenda, classe = '', adaptavel = false }) {
  if (!imagem) return null;

  return (
    <figure className={`jornal-anuncio ${classe} ${adaptavel ? 'jornal-anuncio--adaptavel' : ''}`}>
      <div className="jornal-anuncio-imagem">
        <img src={imagem} alt={legenda || 'Ilustração publicitária'} loading="lazy" />
      </div>
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
    porcoes: ''
  });
  const [aba, setAba] = useState('todas');
  const [resumoAberto, setResumoAberto] = useState(false);
  const [resumo, setResumo] = useState(null);
  const [carregandoResumo, setCarregandoResumo] = useState(false);
  const [chaveDia, setChaveDia] = useState(() => obterChaveDia(new Date()));

  const usuarioRef = useRef(usuario);

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

  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setCarregando(true);

    try {
      const [receitasData, carrosselData] = await Promise.all([
        listarReceitas(silencioso),
        listarCarrossel(silencioso)
      ]);

      const favs = usuarioRef.current ? await listarFavoritos() : [];

      const receitasAtualizadas = Array.isArray(receitasData) ? receitasData : [];
      const carrosselAtualizado = Array.isArray(carrosselData) ? carrosselData : [];
      const favoritosAtualizados = Array.isArray(favs) ? favs : [];

      setReceitas(receitasAtualizadas);
      setCarrossel(carrosselAtualizado);
      setFavoritos(favoritosAtualizados);

      setCache(CACHE_KEY, {
        receitas: receitasAtualizadas,
        carrossel: carrosselAtualizado,
        favoritos: favoritosAtualizados
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
        setFavoritos(anteriores => anteriores.filter(id => id !== receitaId));
      } else {
        await adicionarFavorito(receitaId);
        setFavoritos(anteriores =>
          anteriores.includes(receitaId) ? anteriores : [...anteriores, receitaId]
        );
      }
    } catch (erro) {
      mostrarToast(extrairMensagemErro(erro, 'Erro ao atualizar favorito.'), 'error');
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
        'error'
      );
    } finally {
      setCarregandoResumo(false);
    }
  }

  function filtrar(lista) {
    return lista.filter(receita => {
      const nome = filtros.nome?.toLowerCase().trim();

      if (nome && !receita.titulo?.toLowerCase().includes(nome)) return false;
      if (filtros.categoria && receita.categoria !== filtros.categoria) return false;
      if (filtros.porcoes && Number(receita.porcoes) !== Number(filtros.porcoes)) return false;

      return true;
    });
  }

  const receitasFiltradas = filtrar(receitas);
  const salgados = receitasFiltradas.filter(receita => receita.categoria === 'SALGADO');
  const doces = receitasFiltradas.filter(receita => receita.categoria === 'DOCE');
  const receitasFavoritas = receitas.filter(receita => favoritos.includes(receita.id));
  const filtrosAtivos = Boolean(
  filtros.nome?.trim() ||
  filtros.categoria ||
  filtros.porcoes
);

const exibirSalgados = !filtrosAtivos || salgados.length > 0;
const exibirDoces = !filtrosAtivos || doces.length > 0;
const semResultados = filtrosAtivos && receitasFiltradas.length === 0;

  const { principal, secundarias } = useMemo(
    () => selecionarEdicao(receitas, chaveDia),
    [receitas, chaveDia]
  );

  const imagensCarrossel = carrossel.filter(item => item.imagemUrl);

  const anuncioColunaEsquerda = imagensCarrossel[0];
  const anuncioColunaDireita = imagensCarrossel[1];
  const anunciosDinamicos = imagensCarrossel.slice(2, 4);
  const imagemReceitaRecortar = imagensCarrossel[4];

  const dicaDoDia = DICAS[
    ((obterNumeroDia(chaveDia) % DICAS.length) + DICAS.length) % DICAS.length
  ];

  const dataEdicao = useMemo(() => {
    const [ano, mes, dia] = chaveDia.split('-').map(Number);

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(ano, mes - 1, dia));
  }, [chaveDia]);

  const cardProps = receita => ({
    receita,
    favorito: favoritos.includes(receita.id),
    onToggleFavorito: handleToggleFavorito,
    usuarioLogado: !!usuario
  });

  function renderizarReceitas(lista, tipo) {
    if (!lista.length) {
      return (
        <div className="empty-category">
          <i className="pi pi-search" aria-hidden="true" />
          <h3>Nenhuma receita encontrada nesta edição</h3>
          <p>Experimente alterar os filtros para consultar outras receitas.</p>
        </div>
      );
    }

    return (
      <div className={`receitas-grid receitas-grid--${tipo}`}>
        {lista.map((receita, indice) => (
          <article
            className={`jornal-receita-item jornal-receita-item--${indice % 5}`}
            key={receita.id}
          >
            <div className="jornal-receita-numero">
              <Estrela />
              <span>Receita nº {String(indice + 1).padStart(2, '0')}</span>
            </div>
            <CardReceita {...cardProps(receita)} />
          </article>
        ))}
      </div>
    );
  }

  return (
    <PageWrapper paginaAtual="inicio">
      <main className="home-wrapper">
        <div className="jornal-edicao-barra">
          <span>Jornal de Receitas · Caderno culinário</span>
          <span className="jornal-edicao-data">{dataEdicao}</span>
          <span>Uma nova edição periodicamente</span>
        </div>



<header className="jornal-chamada-superior">
  <div className="jornal-chamada-composicao">

<div className="jornal-chamada-esquerda">
  <div className="jornal-chamada-nota">
    <div className="jornal-chamada-nota-topo">
      <span>AVISO AOS COZINHEIROS</span>
    </div>

    <p>Uma receita não precisa ficar guardada!</p>

  </div>

  <div className="jornal-chamada-publicar">

    <strong>Procura-se receitas!</strong>

    <p>
      Tem uma receita para compartilhar?
      Publique no jornal.
    </p>


{usuario && (
  <Link to="/nova" className="jornal-chamada-publicar-botao">
    Enviar receita
    <i className="pi pi-arrow-up-right" aria-hidden="true" />
  </Link>
)}

{!usuario && (
  <span className="jornal-chamada-publicar-rodape">
    FAÇA LOGIN
  </span>
)}
  </div>
</div>


    <div className="jornal-recorte">
      <div className="jornal-recorte-etiqueta">
        <span>De caderno em caderno</span>
        <span>De cozinha em cozinha</span>
      </div>

      <div className="jornal-recorte-conteudo">
        <div className="jornal-recorte-topo">
          <span>RECEITUÁRIO POPULAR</span>
          <span>Em caso de dúvidas, entre em contato.</span>
        </div>

        <div className="jornal-recorte-corpo">
          <div className="jornal-recorte-numero">
            <span>SEÇÃO</span>
            <strong>01</strong>
          </div>

          <div className="jornal-recorte-texto">
            <span className="jornal-recorte-chapeu">
              RECEITAS PUBLICADAS POR QUEM COZINHA
            </span>
            <p>
              Bolos, almoços, massas e outras receitas
              compartilhadas por gente de todo lugar.
            </p>
          </div>
        </div>

        <div className="jornal-recorte-rodape">
          <span>LEIA • PREPARE • COMPARTILHE</span>
          <a href="#receitas-do-dia">
            Abrir o receituário
            <i className="pi pi-arrow-down-right" aria-hidden="true" />
          </a>
        </div>
      </div>

      <span className="jornal-recorte-marca" aria-hidden="true">
        JR
      </span>

      <div className="jornal-recorte-carimbo" aria-hidden="true">
        <span>ACERVO</span>
        <strong>ABERTO</strong>
        <span>AO PÚBLICO</span>
      </div>
    </div>

    <div className="jornal-chamada-direita">
      <div className="jornal-chamada-selo">
        <strong>{receitas.length}</strong>
        <span>receitas</span>
        <Estrela />
      </div>

      <div className="jornal-chamada-etiqueta">
        <span>ARQUIVO CULINÁRIO</span>
        <strong>EM CONSTANTE ATUALIZAÇÃO</strong>
        <span className="jornal-chamada-etiqueta-fio" />
        <span>CONSULTE À VONTADE</span>
      </div>
    </div>
  </div>
</header>


        <div className="jornal-faixa-noticias">
          <span className="jornal-faixa-marcador">Nesta edição</span>
          <span>{receitas.length} receitas publicadas</span>
          <Estrela className="jornal-faixa-separador" />
          <span>{receitas.filter(r => r.categoria === 'SALGADO').length} salgados</span>
          <Estrela className="jornal-faixa-separador" />
          <span>{receitas.filter(r => r.categoria === 'DOCE').length} doces</span>
          <span className="jornal-faixa-final">Feito para cozinhar</span>
        </div>

     
<section className="jornal-primeira-pagina" aria-label="Destaques da edição">
  <aside className="jornal-coluna-esquerda">
    <div className="jornal-editoria">
      <Estrela />
      <span>Segredinhos da cozinha</span>
    </div>

    <span className="jornal-coluna-sobretitulo">Conselho do dia</span>
    <h2 className="jornal-coluna-titulo">{dicaDoDia.titulo}</h2>
    <p className="jornal-coluna-texto">{dicaDoDia.texto}</p>

    <div className="jornal-linha-ornamental">
      <Estrela />
    </div>

    {anuncioColunaEsquerda && (
      <Anuncio
        imagem={obterImagemUrl(anuncioColunaEsquerda.imagemUrl)}
        legenda={anuncioColunaEsquerda.titulo || ''}
        classe="jornal-anuncio--cacula"
      />
    )}


    <div className="jornal-dicionario">
      <div className="jornal-dicionario-cabecalho">
        <span>CONSULTA RÁPIDA</span>
        <Estrela />
      </div>

      <h3>Glossário</h3>

      <div className="jornal-dicionario-lista">
        <div className="jornal-dicionario-item">
          <strong>Refogar</strong>
          <p>
            Cozinhar ingredientes em pouca gordura,
            geralmente mexendo.
          </p>
        </div>

        <div className="jornal-dicionario-item">
          <strong>Reduzir</strong>
          <p>
            Deixar um líquido evaporar parcialmente
            para concentrar o sabor.
          </p>
        </div>

        <div className="jornal-dicionario-item">
          <strong>Banho-maria</strong>
          <p>
            Aquecer uma preparação indiretamente
            utilizando água quente.
          </p>
        </div>
      </div>

      <span className="jornal-dicionario-rodape">
        TERMOS DO RECEITUÁRIO
      </span>
    </div>
  </aside>

  <article className="jornal-materia-principal">
    <div className="jornal-materia-topo">
      <span>Na capa desta edição</span>
      <Estrela />
      <span>{dataEdicao}</span>
    </div>

    <div className="jornal-materia-cabecalho">
      <span className="jornal-materia-chapeu">A escolha da cozinha</span>

      <h2>{principal?.titulo || 'Uma boa receita merece destaque'}</h2>

      <div className="jornal-materia-fio">
        <Estrela />
        <span>
          {principal
            ? `${principal.categoria === 'DOCE' ? 'Confeitaria' : 'Cozinha salgada'} · ${principal.porcoes || 'Confira as porções'}`
            : 'Receituário do dia'}
        </span>
        <Estrela />
      </div>
    </div>

    {carregando ? (
      <SkeletonCard />
    ) : principal ? (
      <>
        <div className="jornal-destaque-card">
          <CardReceita {...cardProps(principal)} />
        </div>

        <div className="jornal-ficha-culinaria">
          <div className="jornal-ficha-topo">
            <span>FICHA CULINÁRIA</span>
            <span>DESTAQUE DA EDIÇÃO</span>
          </div>

          <div className="jornal-ficha-cabecalho">
            <div>
              <span>REGISTRO DO RECEITUÁRIO</span>
              <h3>{principal.titulo}</h3>
            </div>

            <span className="jornal-ficha-numero">
              Nº {String(principal.id).padStart(3, '0')}
            </span>
          </div>

          <div className="jornal-ficha-informacoes">
            <div className="jornal-ficha-item">
              <i className="pi pi-tag" aria-hidden="true" />
              <span>Categoria</span>
              <strong>
                {principal.categoria === 'DOCE'
                  ? 'Confeitaria'
                  : 'Cozinha salgada'}
              </strong>
            </div>

            <div className="jornal-ficha-item">
              <i className="pi pi-clock" aria-hidden="true" />
              <span>Tempo de preparo</span>
              <strong>{principal.tempoPreparo || 'Não informado'}</strong>
            </div>

            <div className="jornal-ficha-item">
              <i className="pi pi-users" aria-hidden="true" />
              <span>Rendimento</span>
              <strong>{principal.porcoes || 'Não informado'}</strong>
            </div>
          </div>

          <div className="jornal-ficha-rodape">
            <span>
              <Estrela />
              RECEITA EM DESTAQUE
            </span>

            <Link
              to={`/detalhe/${principal.id}`}
              className="jornal-ficha-botao"
            >
              Ler receita completa
              <i className="pi pi-arrow-up-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </>
    ) : (
      <div className="empty-category">
        <i className="pi pi-book" aria-hidden="true" />
        <h3>Aguardando a primeira receita</h3>
        <p>As receitas aprovadas aparecerão aqui.</p>
      </div>
    )}

    <div className="jornal-materia-rodape">
      <span>Uma nova escolha todos os dias</span>
      <span>Jornal de Receitas</span>
    </div>
  </article>

  <aside className="jornal-coluna-direita">
    <div className="jornal-editoria jornal-editoria--vermelha">
      <Estrela />
      <span>Dos arquivos do jornal</span>
    </div>

    <div className="jornal-publicidade-titulo">
      <span>Publicidade cotidiana</span>
      <h2>Anúncios</h2>
    </div>

    {anuncioColunaDireita && (
      <Anuncio
        imagem={obterImagemUrl(anuncioColunaDireita.imagemUrl)}
        legenda={anuncioColunaDireita.titulo || ''}
        classe="jornal-anuncio--elefante"
      />
    )}

    <div className="jornal-mini-editoria">
      <Estrela />
      <span>Também nesta edição</span>
    </div>

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
          <>
            <Divisoria texto="Anúncios & novidades" />

            <section className="jornal-intervalo-publicitario" aria-label="Anúncios e novidades">
              <div className="jornal-intervalo-intro">
                <span className="jornal-intervalo-sobretitulo">
                  Páginas de publicidade
                </span>
                <Estrela />
                <h2>
                  Bons anúncios,
                  <em> boas lembranças.</em>
                </h2>
                <p>
                  Uma seleção de imagens e novidades para folhear
                  entre uma receita e outra.
                </p>
                <div className="jornal-carimbo">
                  <span>Seleção</span>
                  <strong>do jornal</strong>
                </div>
              </div>

              <div className="jornal-anuncios-dinamicos">
                {anunciosDinamicos.map((item, indice) => (
                  <Anuncio
                    key={item.id ?? indice}
                    imagem={obterImagemUrl(item.imagemUrl)}
                    legenda={item.titulo || 'Anúncio da edição'}
                    classe="jornal-anuncio--intervalo"
                    adaptavel
                  />
                ))}
              </div>
            </section>
          </>
        )}

        <section className="jornal-catalogo" id="receitas-do-dia">
          <div className="jornal-catalogo-cabecalho">
            <div>
              <span className="jornal-catalogo-numero">
                <Estrela />
                O caderno da boa cozinha
              </span>
              <h2>O grande <em>receituário</em></h2>
              <p>Abra o caderno, escolha um prato e mãos à obra.</p>
            </div>
            <div className="jornal-catalogo-selo">
              <strong>{receitas.length}</strong>
              <span>receitas no acervo</span>
            </div>
          </div>

          <div className="jornal-navegacao-receitas">
            <div className="tab-buttons" role="tablist" aria-label="Consultar receitas">
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
            <span className="jornal-navegacao-legenda">Escolha o seu caderno</span>
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
                    <h2>Pratos <em>salgados</em></h2>
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
                <div className="jornal-interludio-texto">
                  <span className="jornal-interludio-sobretitulo">
                    <Estrela />
                    Do caderno da cozinheira
                  </span>
                  <h2>
                    Uma receita
                    <em> para recortar</em>
                    e guardar.
                  </h2>
                  <p>
                    Havia sempre uma receita especial esperando
                    pela tesoura, pela cola e por um lugar no
                    caderno de família.
                  </p>
                  <div className="jornal-interludio-detalhe">
                    <span>Receituário ilustrado</span>
                    <Estrela />
                    <span>Para guardar com carinho</span>
                  </div>
                </div>

                <div className="jornal-interludio-ilustracao">
                  <div className="jornal-interludio-folha">
                    <div className="jornal-interludio-folha-topo">
                      <span>Receita ilustrada</span>
                      <Estrela />
                      <span>Do nosso arquivo</span>
                    </div>

                    {imagemReceitaRecortar && (
                      <Anuncio
                        imagem={obterImagemUrl(imagemReceitaRecortar.imagemUrl)}
                        legenda={imagemReceitaRecortar.titulo || 'Receita ilustrada · Acervo culinário'}
                        classe="jornal-anuncio--receita"
                      />
                    )}
                  </div>
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
                    <h2>Coisas <em>doces</em></h2>
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
              <div className="empty-category">
                <i className="pi pi-search" aria-hidden="true" />
                <h3>Nenhuma receita encontrada</h3>
                <p>Experimente alterar os filtros para encontrar outras receitas.</p>
              </div>
            )}
            {!filtrosAtivos && (
              <div className="jornal-rapidas-wrapper">
                <div className="jornal-rapidas-cabecalho">
                  <span>
                    <Estrela />
                    Suplemento da cozinha
                  </span>
                  <h2>Para quem tem <em>pressa</em></h2>
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
                  <h2>Meu caderno <em>de receitas</em></h2>
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
                <div className="empty-category">
                  <i className="pi pi-heart" aria-hidden="true" />
                  <h3>Seu caderno ainda está vazio</h3>
                  <p>Clique no coração das receitas para guardá-las aqui.</p>
                </div>
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
      </main>

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
