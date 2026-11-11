import './LoaderInline.css';

function LoaderInline({ texto = 'Carregando...' }) {
  return (
    <div
      className="loader-inline"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loader-inline-spinner" aria-hidden="true">
        <div className="loader-inline-ring"></div>
        <div className="loader-inline-center"></div>
      </div>

      {texto && (
        <div className="loader-inline-content">
          <p className="loader-inline-text">{texto}</p>
          <span className="loader-inline-line" aria-hidden="true"></span>
        </div>
      )}
    </div>
  );
}

export default LoaderInline;