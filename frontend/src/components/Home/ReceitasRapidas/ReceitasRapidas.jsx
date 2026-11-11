
import { useState, useEffect } from 'react';
import CardReceita from '../CardReceita/CardReceita';
import { buscarReceitasRapidas } from '../../../services/siteConfigService';
import './ReceitasRapidas.css';

const RECEITAS = [
  {
    chave: 'pesto',
    id: 'rapida-pesto',
    titulo: 'Espaguete ao Pesto',
    tempo: '25 min',
    porcoes: '6 porções',
    descricao: 'Massa italiana com pesto de manjericão fresco e pinoli. Um clássico da culinária mediterrânea.',
    link: 'https://www.tudogostoso.com.br/receita/24230-espaguete-ao-pesto.html'
  },
  {
    chave: 'sopa',
    id: 'rapida-sopa',
    titulo: 'Sopa de Abóbora',
    tempo: '40 min',
    porcoes: '6 porções',
    descricao: 'Creme de abóbora com gengibre e toque de noz-moscada. Perfeita para dias frios.',
    link: 'https://www.tudogostoso.com.br/receita/131045-sopa-de-abobora.html'
  },
  {
    chave: 'ganache',
    id: 'rapida-ganache',
    titulo: 'Ganache',
    tempo: '7 min',
    porcoes: '1 porção',
    descricao: 'Calda de chocolate deliciosa para adicionar em suas sobremesas.',
    link: 'https://www.tudogostoso.com.br/receita/21429-ganache.html'
  },
  {
    chave: 'bolinho',
    id: 'rapida-bolinho',
    titulo: 'Bolinhos de Chuva',
    tempo: '30 min',
    porcoes: '8 porções',
    descricao: 'Clássica receita de bolinhos fofinhos com canela e açúcar. Ideal para o lanche da tarde.',
    link: 'https://www.tudogostoso.com.br/receita/76049-bolinho-de-chuva.html'
  }
];

function ReceitasRapidas() {
  const [urls, setUrls] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const dados = await buscarReceitasRapidas(true);

        if (ativo) {
          setUrls(dados || {});
        }
      } catch (erro) {
        console.error(erro);

        if (ativo) {
          setUrls({});
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  if (urls === null) return null;

  return (
    <section className="classifieds-section" aria-label="Receitas rápidas">
      <div className="classifieds-edicao">
        <span>
          <i className="pi pi-star-fill" aria-hidden="true" />
          Pequeno receituário
        </span>
        <span>Quatro sugestões para o dia a dia</span>
      </div>

      <div className="classifieds">
        {RECEITAS.map((receita, indice) => (
          <article
            className={`classifieds-item classifieds-item--${indice + 1}`}
            key={receita.chave}
          >
            <div className="classifieds-item-topo">
              <span className="classifieds-numero">
                Nº {String(indice + 1).padStart(2, '0')}
              </span>

              <span className="classifieds-categoria">
                {indice >= 2 ? 'Doces & quitutes' : 'Cozinha prática'}
              </span>
            </div>

            <div className="classifieds-card">
              <CardReceita
                variante="receita-rapida"
                linkExterno={receita.link}
                receita={{
                  id: receita.id,
                  titulo: receita.titulo,
                  imagem: urls[receita.chave],
                  tempo: receita.tempo,
                  porcoes: receita.porcoes,
                  descricao: receita.descricao,
                  categoria: indice >= 2 ? 'DOCE' : 'SALGADO'
                }}
              />
            </div>

            <div className="classifieds-item-rodape">
              <i className="pi pi-star-fill" aria-hidden="true" />
              <span>Do caderno de receitas</span>
              <i className="pi pi-star-fill" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>

      <div className="classifieds-fechamento">
        <span className="classifieds-fechamento-linha" />
        <i className="pi pi-star-fill" aria-hidden="true" />
        <span>Bom apetite!</span>
        <i className="pi pi-star-fill" aria-hidden="true" />
        <span className="classifieds-fechamento-linha" />
      </div>
    </section>
  );
}

export default ReceitasRapidas;
