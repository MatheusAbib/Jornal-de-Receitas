import { createContext, useContext, useEffect, useId, useRef } from 'react';
import './Modal.css';

const ModalTitleContext = createContext(null);

function Modal({ aberto, onFechar, children, maxWidth, className = '' }) {
  const modalRef = useRef(null);
  const tituloId = useId();
  const onFecharRef = useRef(onFechar);

  useEffect(() => {
    onFecharRef.current = onFechar;
  }, [onFechar]);

  useEffect(() => {
    if (!aberto) return;

    const overflowAnterior = document.body.style.overflow;
    const elementoAnterior = document.activeElement;

    document.body.style.overflow = 'hidden';

    const frameId = requestAnimationFrame(() => {
      const primeiroElemento = modalRef.current?.querySelector(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]'
      );

      if (primeiroElemento) {
        primeiroElemento.focus({ preventScroll: true });
      } else {
        modalRef.current?.focus({ preventScroll: true });
      }
    });

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onFecharRef.current?.();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const elementos = Array.from(
        modalRef.current.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((elemento) => elemento.getClientRects().length > 0);

      if (!elementos.length) {
        e.preventDefault();
        modalRef.current.focus();
        return;
      }

      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (
        e.shiftKey &&
        (document.activeElement === primeiro || document.activeElement === modalRef.current)
      ) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflowAnterior;

      if (elementoAnterior instanceof HTMLElement && elementoAnterior.isConnected) {
        elementoAnterior.focus({ preventScroll: true });
      }
    };
  }, [aberto]);

  if (!aberto) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onFechar?.();
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        ref={modalRef}
        className={`modal-content ${className}`}
        style={maxWidth ? { maxWidth } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
      >
        <ModalTitleContext.Provider value={tituloId}>
          {children}
        </ModalTitleContext.Provider>
      </div>
    </div>
  );
}

function ModalHeader({ titulo, icone, onFechar }) {
  const tituloId = useContext(ModalTitleContext);

  return (
    <div className="modal-header">
      <h2 id={tituloId || undefined}>
        {icone && <i className={icone} aria-hidden="true"></i>}
        <span>{titulo}</span>
      </h2>

      <button
        type="button"
        className="modal-close"
        onClick={onFechar}
        aria-label="Fechar janela"
      >
        <i className="pi pi-times" aria-hidden="true"></i>
      </button>
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