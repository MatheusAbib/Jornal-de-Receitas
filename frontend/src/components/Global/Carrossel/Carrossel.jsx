import { useState, useEffect } from 'react';
import ImagemLoader from '../ImagemLoader/ImagemLoader';
import './Carrossel.css';

function Carrossel({ itens }) {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (!itens || itens.length <= 1) return;

    const intervalo = setInterval(() => {
      setAtual((prev) => (prev + 1) % itens.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [itens]);

  if (!itens || itens.length === 0) return null;

  function proximo() {
    setAtual((prev) => (prev + 1) % itens.length);
  }

  function anterior() {
    setAtual((prev) => (prev - 1 + itens.length) % itens.length);
  }

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${atual * 100}%)` }}
        >
          {itens.map((item, index) => {
            const imagemUrl = item.imagemUrl?.startsWith('http')
              ? item.imagemUrl
              : `/uploads/${item.imagemUrl}`;

            return (
              <div key={item.id} className={`carousel-item ${index === atual ? 'active' : ''}`}>
                <ImagemLoader src={imagemUrl} alt={item.titulo} />
                <div className="carousel-caption">
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>

        {itens.length > 1 && (
          <>
            <div className="carousel-controls">
              <button className="carousel-control prev" onClick={anterior}>
                <i className="pi pi-chevron-left"></i>
              </button>
              <button className="carousel-control next" onClick={proximo}>
                <i className="pi pi-chevron-right"></i>
              </button>
            </div>

            <div className="carousel-indicators">
              {itens.map((_, index) => (
                <div
                  key={index}
                  className={`carousel-indicator ${index === atual ? 'active' : ''}`}
                  onClick={() => setAtual(index)}
                ></div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Carrossel;
