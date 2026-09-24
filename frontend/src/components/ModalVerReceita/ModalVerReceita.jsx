import Modal from '../Modal/Modal';
import ImagemLoader from '../ImagemLoader/ImagemLoader';
import './ModalVerReceita.css';

function ModalVerReceita({ aberto, onFechar, receita }) {
  if (!receita) return null;

  const imagemUrl = receita.imagem
    ? (receita.imagem.startsWith('http') ? receita.imagem : `/uploads/${receita.imagem}`)
    : '/default-image.jpg';

  const ingredientes = receita.ingredientes
    ? receita.ingredientes.split('||').filter(s => s.trim())
    : [];

  const passos = receita.modoPreparo
    ? receita.modoPreparo.split('||').filter(s => s.trim())
    : [];

  return (
    <Modal aberto={aberto} onFechar={onFechar} maxWidth="1100px">
      <Modal.Header
        titulo={receita.titulo}
        icone="pi pi-book"
        onFechar={onFechar}
      />

      <Modal.Body>
        <div className="ver-receita-grid">

          <div className="ver-receita-col ver-receita-col-imagem">
            <div className="ver-receita-imagem">
              <ImagemLoader src={imagemUrl} alt={receita.titulo} />
            </div>
          </div>

          <div className="ver-receita-col ver-receita-col-info">
            <div className="ver-receita-section">
              <h3><i className="pi pi-info-circle"></i> Informações</h3>
            </div>

            <div className="ver-receita-meta">
              <div className="ver-receita-meta-item">
                <i className="pi pi-user"></i>
                <span><strong>Chefe:</strong> {receita.chefe || '-'}</span>
              </div>
              <div className="ver-receita-meta-item">
                <i className="pi pi-clock"></i>
                <span><strong>Tempo:</strong> {receita.tempoPreparo || '-'}</span>
              </div>
              <div className="ver-receita-meta-item">
                <i className="pi pi-users"></i>
                <span><strong>Porções:</strong> {receita.porcoes}</span>
              </div>
              <div className="ver-receita-meta-item">
                <i className="pi pi-tag"></i>
                <span><strong>Categoria:</strong> {receita.categoria === 'DOCE' ? 'Doce' : 'Salgado'}</span>
              </div>
              <div className="ver-receita-meta-item">
                <i className="pi pi-heart-fill"></i>
                <span><strong>Favoritos:</strong> {receita.totalFavoritos || 0}</span>
              </div>
            </div>
          </div>

          <div className="ver-receita-col">
            <div className="ver-receita-section">
              <h3><i className="pi pi-book"></i> Modo de Preparo</h3>
              <ol className="ver-receita-list">
                {passos.map((passo, i) => (
                  <li key={i}>{passo}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="ver-receita-col">
            <div className="ver-receita-section">
              <h3><i className="pi pi-list"></i> Ingredientes</h3>
              <ul className="ver-receita-list">
                {ingredientes.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

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

export default ModalVerReceita;
