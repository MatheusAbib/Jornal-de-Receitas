import './ModalLogout.css';

function ModalLogout({ aberto, onFechar, onConfirmar }) {
  if (!aberto) return null;

  return (
    <div className="logout-modal-box show" onClick={onFechar}>
      <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="logout-modal-close" onClick={onFechar}>
          &times;
        </button>

        <div className="logout-modal-icon">
          <i className="pi pi-sign-out"></i>
        </div>

        <h3 className="logout-modal-title">Sair da Conta</h3>
        <p className="logout-modal-message">Tem certeza que deseja sair da sua conta?</p>

        <div className="logout-modal-actions">
          <button className="logout-btn-cancel" onClick={onFechar}>
            <i className="pi pi-times"></i> Cancelar
          </button>
          <button className="logout-btn-confirm" onClick={onConfirmar}>
            <i className="pi pi-sign-out"></i> Sair
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalLogout;
