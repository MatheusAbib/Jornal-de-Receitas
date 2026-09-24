import { useEffect } from 'react';
import './Modal.css';

function Modal({ aberto, onFechar, children, maxWidth, className = '' }) {
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [aberto]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape' && aberto && onFechar) {
        onFechar();
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div
        className={`modal-content ${className}`}
        style={maxWidth ? { maxWidth } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ titulo, icone, onFechar }) {
  return (
    <div className="modal-header">
      <h2>
        {icone && <i className={icone}></i>}
        {titulo}
      </h2>
      <span className="modal-close" onClick={onFechar}>&times;</span>
    </div>
  );
}

function ModalBody({ children, className = '' }) {
  return <div className={`modal-body ${className}`}>{children}</div>;
}

function ModalFooter({ children, className = '' }) {
  return <div className={`modal-footer ${className}`}>{children}</div>;
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
