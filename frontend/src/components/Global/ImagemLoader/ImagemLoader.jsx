import { useState } from 'react';
import './ImagemLoader.css';

function ImagemLoader({
  src,
  alt = '',
  className = '',
  wrapperClassName = ''
}) {
  const [estado, setEstado] = useState({
    src,
    carregada: false,
    erro: false
  });

  const estadoAtual = estado.src === src
    ? estado
    : {
        src,
        carregada: false,
        erro: false
      };

  const carregada = estadoAtual.carregada;
  const erro = estadoAtual.erro;

  function handleLoad() {
    setEstado({
      src,
      carregada: true,
      erro: false
    });
  }

  function handleError() {
    setEstado({
      src,
      carregada: false,
      erro: true
    });
  }

  if (!src || erro) {
    return (
      <div
        className={`imagem-loader-fallback ${wrapperClassName}`}
        role="img"
        aria-label={alt || 'Imagem indisponível'}
      >
        <div className="imagem-loader-fallback-icon">
          <i className="pi pi-image" aria-hidden="true"></i>
        </div>

        <span>Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div
      className={`imagem-loader-wrapper ${wrapperClassName} ${
        carregada ? 'imagem-loader-concluida' : 'imagem-loader-carregando'
      }`}
    >
      {!carregada && (
        <div
          className="imagem-loader-skeleton"
          aria-hidden="true"
        >
          <div className="imagem-loader-skeleton-icon">
            <i className="pi pi-image"></i>
          </div>
        </div>
      )}

      <img
        key={src}
        src={src}
        alt={alt}
        className={`${className} ${carregada ? 'loaded' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default ImagemLoader;