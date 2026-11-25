export default function ModalImagemHome({ imagem, onFechar }) {
  if (!imagem) return null;

  return (
    <div
      className="jornal-modal-imagem-overlay"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onFechar();
        }
      }}
    >
      <div
        className="jornal-modal-imagem"
        role="dialog"
        aria-modal="true"
        aria-label={imagem.legenda || 'Imagem ampliada'}
      >
        <div className="jornal-modal-imagem-topo">
          <span>ACERVO PUBLICITÁRIO · JORNAL DE RECEITAS</span>
          <button
            type="button"
            className="jornal-modal-imagem-fechar"
            onClick={() => onFechar()}
            aria-label="Fechar imagem"
            autoFocus
          >
            <i className="pi pi-times" aria-hidden="true" />
          </button>
        </div>
        <div className="jornal-modal-imagem-conteudo">
          <img
            src={imagem.imagem}
            alt={imagem.legenda || 'Ilustração publicitária ampliada'}
          />
        </div>
        {imagem.legenda && (
          <div className="jornal-modal-imagem-rodape">
            <i className="pi pi-star-fill" aria-hidden="true" />
            <span>{imagem.legenda}</span>
            <i className="pi pi-star-fill" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
