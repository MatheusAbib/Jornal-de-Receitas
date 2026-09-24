import './LoaderInline.css';

function LoaderInline({ texto = 'Carregando...' }) {
  return (
    <div className="loader-inline">
      <div className="loader-inline-spinner">
        <div className="loader-inline-ring"></div>
        <div className="loader-inline-ring"></div>
        <div className="loader-inline-ring"></div>
      </div>
      {texto && <p className="loader-inline-text">{texto}</p>}
    </div>
  );
}

export default LoaderInline;
