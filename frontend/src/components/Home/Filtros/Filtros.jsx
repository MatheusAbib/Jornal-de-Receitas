
import { useState } from 'react';
import './Filtros.css';

function Filtros({ onFiltrar }) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [porcoes, setPorcoes] = useState('');

  const possuiFiltros = Boolean(nome.trim() || categoria || porcoes);

  function atualizarFiltros(novoNome, novaCategoria, novasPorcoes) {
    if (!novoNome.trim() && !novaCategoria && !novasPorcoes) {
      onFiltrar({
        nome: '',
        categoria: '',
        porcoes: ''
      });
    }
  }

  function alterarNome(event) {
    const valor = event.target.value;
    setNome(valor);
    atualizarFiltros(valor, categoria, porcoes);
  }

  function alterarCategoria(event) {
    const valor = event.target.value;
    setCategoria(valor);
    atualizarFiltros(nome, valor, porcoes);
  }

  function alterarPorcoes(event) {
    const valor = event.target.value;
    setPorcoes(valor);
    atualizarFiltros(nome, categoria, valor);
  }

  function aplicar(event) {
    event.preventDefault();

    onFiltrar({
      nome: nome.toLowerCase().trim(),
      categoria,
      porcoes
    });
  }

  function limpar() {
    setNome('');
    setCategoria('');
    setPorcoes('');

    onFiltrar({
      nome: '',
      categoria: '',
      porcoes: ''
    });
  }

  return (
    <section className="recipe-filters" aria-label="Filtros do receituário">
      <form className="filtros-grid" onSubmit={aplicar}>
        <div className="filter-group filter-group-search">
          <label htmlFor="filtro-nome">
            <span className="filter-number">01</span>
            Nome da receita
          </label>

          <div className="filter-field">
            <input
              id="filtro-nome"
              type="search"
              placeholder="Ex.: Bolo de cenoura"
              value={nome}
              onChange={alterarNome}
            />
            <i className="pi pi-search filter-icon" aria-hidden="true" />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-categoria">
            <span className="filter-number">02</span>
            Categoria
          </label>

          <div className="filter-field filter-field-select">
            <select
              id="filtro-categoria"
              value={categoria}
              onChange={alterarCategoria}
            >
              <option value="">Todas as categorias</option>
              <option value="SALGADO">Pratos salgados</option>
              <option value="DOCE">Doces e sobremesas</option>
            </select>

            <i
              className="pi pi-chevron-down filter-select-arrow"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-porcoes">
            <span className="filter-number">03</span>
            Rendimento
          </label>

          <div className="filter-field">
            <input
              id="filtro-porcoes"
              type="number"
              min="1"
              step="1"
              placeholder="Nº de porções"
              value={porcoes}
              onChange={alterarPorcoes}
            />
            <i className="pi pi-users filter-icon" aria-hidden="true" />
          </div>
        </div>

        <div className="filter-buttons">
          <button
            type="button"
            className="filter-clear"
            onClick={limpar}
            disabled={!possuiFiltros}
          >
            <i className="pi pi-times" aria-hidden="true" />
            <span>Limpar</span>
          </button>

          <button type="submit" className="filter-submit">
            <span>Procurar receita</span>
            <i className="pi pi-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}

export default Filtros;
