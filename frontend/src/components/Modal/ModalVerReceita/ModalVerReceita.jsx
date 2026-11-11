import Modal from "../Modal";
import ImagemLoader from "../../Global/ImagemLoader/ImagemLoader";
import "./ModalVerReceita.css";

function ModalVerReceita({ aberto, onFechar, receita }) {
  if (!receita) return null;

  const imagemUrl = receita.imagem
    ? receita.imagem.startsWith("http")
      ? receita.imagem
      : `/uploads/${receita.imagem}`
    : "/default-image.jpg";

  const ingredientes = receita.ingredientes
    ? receita.ingredientes.split("||").filter((item) => item.trim())
    : [];

  const passos = receita.modoPreparo
    ? receita.modoPreparo.split("||").filter((item) => item.trim())
    : [];

  const categoria = receita.categoria === "DOCE" ? "Doce" : "Salgado";

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      maxWidth="1100px"
      className="modal-ver-receita"
    >
      <Modal.Header
        titulo={receita.titulo}
        onFechar={onFechar}
      />

      <Modal.Body>
        <div className="ver-receita">
          <div className="ver-receita-destaque">
            <section className="ver-receita-imagem-bloco">
              <div className="ver-receita-section-heading">
                <span className="ver-receita-section-index">
                  01 / Fotografia
                </span>
                <h3>Imagem da receita</h3>
              </div>

              <div className="ver-receita-imagem">
                <ImagemLoader
                  src={imagemUrl}
                  alt={receita.titulo}
                />
              </div>
            </section>

            <section className="ver-receita-info-bloco">
              <div className="ver-receita-section-heading">
                <span className="ver-receita-section-index">
                  02 / Ficha técnica
                </span>
                <h3>Informações</h3>
              </div>

              <div className="ver-receita-meta">
                <div className="ver-receita-meta-item">
                  <div className="ver-receita-meta-icon">
                    <i className="pi pi-user" aria-hidden="true"></i>
                  </div>

                  <div className="ver-receita-meta-conteudo">
                    <span>Chefe</span>
                    <strong>{receita.chefe || "Não informado"}</strong>
                  </div>
                </div>

                <div className="ver-receita-meta-item">
                  <div className="ver-receita-meta-icon">
                    <i className="pi pi-clock" aria-hidden="true"></i>
                  </div>

                  <div className="ver-receita-meta-conteudo">
                    <span>Tempo de preparo</span>
                    <strong>{receita.tempoPreparo || "Não informado"}</strong>
                  </div>
                </div>

                <div className="ver-receita-meta-item">
                  <div className="ver-receita-meta-icon">
                    <i className="pi pi-users" aria-hidden="true"></i>
                  </div>

                  <div className="ver-receita-meta-conteudo">
                    <span>Porções</span>
                    <strong>{receita.porcoes ?? "Não informado"}</strong>
                  </div>
                </div>

                <div className="ver-receita-meta-item">
                  <div className="ver-receita-meta-icon">
                    <i className="pi pi-tag" aria-hidden="true"></i>
                  </div>

                  <div className="ver-receita-meta-conteudo">
                    <span>Categoria</span>
                    <strong>{categoria}</strong>
                  </div>
                </div>

                <div className="ver-receita-meta-item">
                  <div className="ver-receita-meta-icon">
                    <i className="pi pi-heart" aria-hidden="true"></i>
                  </div>

                  <div className="ver-receita-meta-conteudo">
                    <span>Favoritos</span>
                    <strong>{receita.totalFavoritos || 0}</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="ver-receita-conteudo">
            <section className="ver-receita-ingredientes">
              <div className="ver-receita-section-heading">
                <span className="ver-receita-section-index">
                  03 / O que você vai precisar
                </span>

                <div className="ver-receita-heading-linha">
                  <h3>Ingredientes</h3>

                  <span className="ver-receita-contador">
                    {ingredientes.length}{" "}
                    {ingredientes.length === 1 ? "item" : "itens"}
                  </span>
                </div>
              </div>

              {ingredientes.length > 0 ? (
                <ul className="ver-receita-lista-ingredientes">
                  {ingredientes.map((ingrediente, index) => (
                    <li key={index}>
                      <span className="ver-receita-ingrediente-marcador">
                        <i
                          className="pi pi-check"
                          aria-hidden="true"
                        ></i>
                      </span>

                      <span>{ingrediente}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ver-receita-vazio">
                  Nenhum ingrediente informado.
                </p>
              )}
            </section>

            <section className="ver-receita-preparo">
              <div className="ver-receita-section-heading">
                <span className="ver-receita-section-index">
                  04 / Passo a passo
                </span>

                <div className="ver-receita-heading-linha">
                  <h3>Modo de preparo</h3>

                  <span className="ver-receita-contador">
                    {passos.length}{" "}
                    {passos.length === 1 ? "etapa" : "etapas"}
                  </span>
                </div>
              </div>

              {passos.length > 0 ? (
                <ol className="ver-receita-lista-passos">
                  {passos.map((passo, index) => (
                    <li key={index}>
                      <span className="ver-receita-passo-numero">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p>{passo}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="ver-receita-vazio">
                  Nenhuma etapa de preparo informada.
                </p>
              )}
            </section>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="modal-btn modal-btn-cancel"
          onClick={onFechar}
        >
          <i className="pi pi-times" aria-hidden="true"></i>
          Fechar
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalVerReceita;