import Modal from '../Modal';
import './ModalLogout.css';

function ModalLogout({ aberto, onFechar, onConfirmar }) {
  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      maxWidth="420px"
      className="logout-modal"
    >
      <Modal.Header
        titulo="Sair da conta"
        icone="pi pi-sign-out"
        onFechar={onFechar}
      />

      <Modal.Body className="logout-modal-body">
        <p className="logout-modal-message">
          Tem certeza de que deseja sair da sua conta?
        </p>

        <div className="logout-modal-actions">
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={onFechar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="modal-btn modal-btn-primary"
            onClick={onConfirmar}
          >
            <i className="pi pi-sign-out" aria-hidden="true"></i>
            Confirmar saída
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalLogout;