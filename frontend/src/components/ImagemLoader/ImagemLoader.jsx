import { useState } from 'react';
import './ImagemLoader.css';

function ImagemLoader({ src, alt = '', className = '', wrapperClassName = '' }) {
  const [carregada, setCarregada] = useState(false);
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <div className={`imagem-loader-fallback ${wrapperClassName}`}>
        <i className="pi pi-image"></i>
        <span>Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div className={`imagem-loader-wrapper ${wrapperClassName}`}>
      {!carregada && (
        <div className="imagem-loader-spinner"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${carregada ? 'loaded' : ''}`}
        onLoad={() => setCarregada(true)}
        onError={() => setErro(true)}
      />
    </div>
  );
}

export default ImagemLoader;
