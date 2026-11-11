import { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import LoaderInline from '../../Global/LoaderInline/LoaderInline';
import { buscarResumoPorIngrediente } from '../../../services/favoritoService';
import './ModalResumoFavoritos.css';

function ModalResumoFavoritos({ aberto, onFechar, resumo, carregando }) {
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState('');
  const [detalheIngrediente, setDetalheIngrediente] = useState(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState(false);

  const requisicaoRef = useRef(0);

  useEffect(() => {
    if (!aberto) {
      requisicaoRef.current += 1;
      setIngredienteSelecionado('');
      setDetalheIngrediente(null);
      setErroDetalhe(false);
      setCarregandoDetalhe(false);
    }
  }, [aberto]);

  useEffect(() => {
    return () => {
      requisicaoRef.current += 1;
    };
  }, []);

  async function handleTrocarIngrediente(e) {
    const nome = e.target.value;
    const requisicaoAtual = ++requisicaoRef.current;

    setIngredienteSelecionado(nome);
    setDetalheIngrediente(null);
    setErroDetalhe(false);
    setCarregandoDetalhe(Boolean(nome));

    if (!nome) return;

    try {
      const dados = await buscarResumoPorIngrediente(nome);

      if (requisicaoAtual !== requisicaoRef.current) return;

      setDetalheIngrediente(dados);
    } catch (err) {
      if (requisicaoAtual !== requisicaoRef.current) return;

      console.error(err);
      setErroDetalhe(true);
    } finally {
      if (requisicaoAtual === requisicaoRef.current) {
        setCarregandoDetalhe(false);
      }
    }
  }

  const ingredientesDisponiveis = resumo?.ingredientesDisponiveis || [];
  const ingredientesRepetidos = resumo?.ingredientesRepetidos || [];
  const temIngredientes = ingredientesDisponiveis.length > 0;

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      maxWidth="560px"
      className="resumo-favoritos-modal"
    >
      <Modal.Header
        titulo="Resumo dos favoritos"
        icone="pi pi-chart-bar"
        onFechar={onFechar}
      />

      <Modal.Body className="resumo-favoritos-body">
        {carregando && (
          <LoaderInline texto="Calculando resumo..." />
        )}

        {!carregando && resumo && (
          <div className="resumo-favoritos">
            <div className="resumo-card resumo-card-total">
              <div className="resumo-card-info">
                <span className="resumo-card-label">
                  Receitas favoritas
                </span>

                <span className="resumo-card-value">
                  {resumo.totalFavoritos ?? 0}
                </span>

                <span className="resumo-card-descricao">
                  Total de receitas salvas na sua coleção
                </span>
              </div>

              <div className="resumo-card-icon" aria-hidden="true">
                <i className="pi pi-heart"></i>
              </div>
            </div>

            {temIngredientes && (
              <section className="resumo-ingrediente">
                <div className="resumo-secao-cabecalho">
                  <div className="resumo-secao-titulo">
                    <span className="resumo-secao-indice">
                      01
                    </span>

                    <h3>Buscar por ingrediente</h3>
                  </div>

                  <p>
                    Consulte quais receitas favoritas utilizam
                    um determinado ingrediente.
                  </p>
                </div>

                <div className="resumo-ingrediente-select-wrapper">
                  <i
                    className="pi pi-search resumo-ingrediente-icon"
                    aria-hidden="true"
                  ></i>

                  <select
                    className="resumo-ingrediente-select"
                    value={ingredienteSelecionado}
                    onChange={handleTrocarIngrediente}
                    aria-label="Selecionar ingrediente"
                  >
                    <option value="">
                      Selecione um ingrediente
                    </option>

                    {ingredientesDisponiveis.map((ing, i) => (
                      <option key={`${ing}-${i}`} value={ing}>
                        {ing}
                      </option>
                    ))}
                  </select>

                  <i
                    className="pi pi-chevron-down resumo-select-seta"
                    aria-hidden="true"
                  ></i>
                </div>

                {carregandoDetalhe && (
                  <div
                    className="resumo-ingrediente-loading"
                    role="status"
                  >
                    <i
                      className="pi pi-spin pi-spinner"
                      aria-hidden="true"
                    ></i>
                    <span>Buscando receitas...</span>
                  </div>
                )}

                {!carregandoDetalhe && erroDetalhe && (
                  <p
                    className="resumo-ingrediente-erro"
                    role="alert"
                  >
                    <i
                      className="pi pi-exclamation-circle"
                      aria-hidden="true"
                    ></i>
                    Erro ao buscar receitas deste ingrediente.
                  </p>
                )}

                {!carregandoDetalhe &&
                  !erroDetalhe &&
                  detalheIngrediente && (
                    <div className="resumo-ingrediente-resultado">
                      <div className="resumo-ingrediente-header">
                        <span className="resumo-ingrediente-nome">
                          {detalheIngrediente.ingrediente}
                        </span>

                        <span className="resumo-ingrediente-count">
                          {detalheIngrediente.quantidade}{' '}
                          {detalheIngrediente.quantidade === 1
                            ? 'receita'
                            : 'receitas'}
                        </span>
                      </div>

                      {detalheIngrediente.receitas?.length > 0 ? (
                        <ul className="resumo-ingrediente-lista">
                          {detalheIngrediente.receitas.map(
                            (titulo, i) => (
                              <li key={`${titulo}-${i}`}>
                                <i
                                  className="pi pi-book"
                                  aria-hidden="true"
                                ></i>

                                <span>{titulo}</span>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="resumo-vazio">
                          Nenhuma receita favorita tem esse ingrediente.
                        </p>
                      )}
                    </div>
                  )}
              </section>
            )}

            <section className="resumo-repetidos">
              <div className="resumo-secao-cabecalho">
                <div className="resumo-secao-titulo">
                  <span className="resumo-secao-indice">
                    {temIngredientes ? '02' : '01'}
                  </span>

                  <h3>Ingredientes repetidos</h3>
                </div>

                <p>
                  Ingredientes presentes em mais de uma receita
                  da sua coleção.
                </p>
              </div>

              {ingredientesRepetidos.length > 0 ? (
                <ul className="resumo-lista">
                  {ingredientesRepetidos.map((ing, i) => (
                    <li key={`${ing}-${i}`}>
                      {ing}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="resumo-vazio">
                  Nenhum ingrediente se repete entre suas receitas favoritas.
                </p>
              )}
            </section>
          </div>
        )}

        {!carregando && !resumo && (
          <div className="resumo-indisponivel">
            <i
              className="pi pi-info-circle"
              aria-hidden="true"
            ></i>

            <p>Não foi possível exibir o resumo dos favoritos.</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="resumo-favoritos-footer">
        <button
          type="button"
          className="modal-btn modal-btn-cancel"
          onClick={onFechar}
        >
          Fechar
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalResumoFavoritos;