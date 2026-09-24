import { useState } from 'react';
import './Filtros.css';

function Filtros({ onFiltrar }) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [porcoes, setPorcoes] = useState('');

  function aplicar() {
    onFiltrar({ nome: nome.toLowerCase().trim(), categoria, porcoes });
  }

  function limpar() {
    setNome('');
    setCategoria('');
    setPorcoes('');
    onFiltrar({ nome: '', categoria: '', porcoes: '' });
  }

  return (
    <div className="recipe-filters">
      <h3><i className="pi pi-filter"></i> Filtrar Receitas</h3>

      <div className="filtros-grid">
        <div className="filter-group">
          <i className="pi pi-search filter-icon"></i>
          <input
            type="text"
            placeholder="Digite o nome da receita"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <i className="pi pi-tag filter-icon"></i>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="SALGADO">Salgado</option>
            <option value="DOCE">Doce</option>
          </select>
        </div>

        <div className="filter-group">
          <i className="pi pi-users filter-icon"></i>
          <input
            type="number"
            min="1"
            placeholder="Quantidade de porções"
            value={porcoes}
            onChange={(e) => setPorcoes(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button type="button" onClick={aplicar}>
            <i className="pi pi-check"></i> Aplicar Filtros
          </button>
          <button type="button" onClick={limpar}>
            <i className="pi pi-times"></i> Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filtros;
