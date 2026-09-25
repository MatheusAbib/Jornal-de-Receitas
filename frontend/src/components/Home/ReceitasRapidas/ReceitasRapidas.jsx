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
    async function carregar() {
      try {
        const dados = await buscarReceitasRapidas(true);
        setUrls(dados || {});
      } catch (e) {
        console.error(e);
        setUrls({});
      }
    }
    carregar();
  }, []);

  if (urls === null) return null;

  return (
    <section className="classifieds-section">
      <div className="section-title">
        <h2>Receitas Rápidas</h2>
        <p>Pratos deliciosos indicados para você preparar em pouco tempo</p>
      </div>

      <div className="classifieds">
        {RECEITAS.map(r => (
          <CardReceita
            key={r.chave}
            variante="receita-rapida"
            linkExterno={r.link}
            receita={{
              id: r.id,
              titulo: r.titulo,
              imagem: urls[r.chave],
              tempo: r.tempo,
              porcoes: r.porcoes,
              descricao: r.descricao,
              categoria: 'SALGADO'
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default ReceitasRapidas;
