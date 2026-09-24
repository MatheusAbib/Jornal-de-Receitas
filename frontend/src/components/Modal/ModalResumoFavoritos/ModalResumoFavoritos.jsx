import { useState, useEffect } from 'react';
import Modal from "../Modal";
import LoaderInline from '../../Global/LoaderInline/LoaderInline';
import { buscarResumoPorIngrediente } from '../../../services/favoritoService';
import './ModalResumoFavoritos.css';

function ModalResumoFavoritos({ aberto, onFechar, resumo, carregando }) {
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState('');
  const [detalheIngrediente, setDetalheIngrediente] = useState(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState(false);

  useEffect(() => {
    if (!aberto) {
      setIngredienteSelecionado('');
      setDetalheIngrediente(null);
      setErroDetalhe(false);
      setCarregandoDetalhe(false);
    }
  }, [aberto]);

  async function handleTrocarIngrediente(e) {
    const nome = e.target.value;
    setIngredienteSelecionado(nome);
    setDetalheIngrediente(null);
    setErroDetalhe(false);

    if (!nome) return;

    setCarregandoDetalhe(true);
    try {
      const dados = await buscarResumoPorIngrediente(nome);
      setDetalheIngrediente(dados);
    } catch (err) {
      console.error(err);
      setErroDetalhe(true);
    } finally {
      setCarregandoDetalhe(false);
    }
  }

  const temIngredientes =
    resumo?.ingredientesDisponiveis && resumo.ingredientesDisponiveis.length > 0;

  return (
    <Modal aberto={aberto} onFechar={onFechar} maxWidth="560px">
      <Modal.Header
        titulo="Resumo dos Favoritos"
        icone="pi pi-chart-bar"
        onFechar={onFechar}
      />

      <Modal.Body>
        {carregando && <LoaderInline texto="Calculando resumo..." />}

        {!carregando && resumo && (
          <div className="resumo-favoritos">
            <div className="resumo-card resumo-card-total">
              <div className="resumo-card-icon">
                <i className="pi pi-heart-fill"></i>
              </div>
              <div className="resumo-card-info">
                <span className="resumo-card-label">Total de Favoritos</span>
                <span className="resumo-card-value">{resumo.totalFavoritos}</span>
              </div>
            </div>

            {temIngredientes && (
              <div className="resumo-ingrediente">
                <h3>
                  <i className="pi pi-search"></i> Buscar por ingrediente
                </h3>

                <div className="resumo-ingrediente-select-wrapper">
                  <i className="pi pi-filter resumo-ingrediente-icon"></i>
                  <select
                    className="resumo-ingrediente-select"
                    value={ingredienteSelecionado}
                    onChange={handleTrocarIngrediente}
                  >
                    <option value="">Selecione um ingrediente...</option>
                    {resumo.ingredientesDisponiveis.map((ing, i) => (
                      <option key={i} value={ing}>{ing}</option>
                    ))}
                  </select>
                </div>

                {carregandoDetalhe && (
                  <div className="resumo-ingrediente-loading">
                    <i className="pi pi-spin pi-spinner"></i> Buscando receitas...
                  </div>
                )}

                {!carregandoDetalhe && erroDetalhe && (
                  <p className="resumo-ingrediente-erro">
                    <i className="pi pi-exclamation-circle"></i> Erro ao buscar receitas deste ingrediente.
                  </p>
                )}

                {!carregandoDetalhe && !erroDetalhe && detalheIngrediente && (
                  <div className="resumo-ingrediente-resultado">
                    <div className="resumo-ingrediente-header">
                      <span className="resumo-ingrediente-nome">
                        {detalheIngrediente.ingrediente}
                      </span>
                      <span className="resumo-ingrediente-count">
                        {detalheIngrediente.quantidade}{' '}
                        {detalheIngrediente.quantidade === 1 ? 'receita' : 'receitas'}
                      </span>
                    </div>

                    {detalheIngrediente.receitas && detalheIngrediente.receitas.length > 0 ? (
                      <ul className="resumo-ingrediente-lista">
                        {detalheIngrediente.receitas.map((titulo, i) => (
                          <li key={i}>
                            <i className="pi pi-book"></i>
                            {titulo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="resumo-vazio">
                        Nenhuma receita favorita tem esse ingrediente.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="resumo-repetidos">
              <h3>
                <i className="pi pi-refresh"></i> Ingredientes repetidos
              </h3>

              {resumo.ingredientesRepetidos && resumo.ingredientesRepetidos.length > 0 ? (
                <ul className="resumo-lista">
                  {resumo.ingredientesRepetidos.map((ing, i) => (
                    <li key={i}>
                      <i className="pi pi-check"></i>
                      {ing}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="resumo-vazio">
                  Nenhum ingrediente se repete entre suas receitas favoritas.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={onFechar}
          >
            <i className="pi pi-times"></i> Fechar
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalResumoFavoritos;
