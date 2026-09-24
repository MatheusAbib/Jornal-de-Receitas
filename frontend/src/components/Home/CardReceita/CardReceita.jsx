import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagemLoader from '../../Global/ImagemLoader/ImagemLoader';
import { useToast } from "../../../context/ToastContext";
import './CardReceita.css';

function CardReceita({ receita, favorito, onToggleFavorito, usuarioLogado }) {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const [carregandoFav, setCarregandoFav] = useState(false);

  const imagemUrl = receita.imagem
    ? (receita.imagem.startsWith('http') ? receita.imagem : `/uploads/${receita.imagem}`)
    : '/default-image.jpg';

  const ehSalgado = receita.categoria === 'SALGADO';

  async function handleFavorito(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!usuarioLogado) {
      mostrarToast('Faça login para favoritar receitas!', 'info');
      return;
    }

    if (carregandoFav) return;

    setCarregandoFav(true);
    try {
      if (onToggleFavorito) {
        await onToggleFavorito(receita.id, favorito);
        mostrarToast(
          favorito ? 'Receita removida dos favoritos.' : 'Receita adicionada aos favoritos!',
          favorito ? 'info' : 'success'
        );
      }
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao atualizar favorito.', 'error');
    } finally {
      setCarregandoFav(false);
    }
  }

  function handleVerReceita() {
    navigate(`/detalhe/${receita.id}`);
  }

  return (
    <div className="card">
      <div className="card-image">
        <ImagemLoader src={imagemUrl} alt={receita.titulo} />

        <span className={`card-badge-categoria ${ehSalgado ? 'salgado' : 'doce'}`}>
          
          {ehSalgado ? 'Salgado' : 'Doce'}
        </span>

        <button
          className={`card-favorite-btn ${favorito ? 'active' : ''}`}
          onClick={handleFavorito}
          aria-label="Favoritar"
          disabled={carregandoFav}
        >
          {carregandoFav ? (
            <i className="pi pi-spin pi-spinner"></i>
          ) : (
            <i className={favorito ? 'pi pi-heart-fill' : 'pi pi-heart'}></i>
          )}
        </button>
      </div>

      <div className="card-content">
        <h3 className="card-titulo">{receita.titulo}</h3>

        <div className="card-meta">
          <div className="card-meta-row">
            <span className="card-meta-item">
              <i className="pi pi-clock"></i>
              <span>{receita.tempoPreparo}</span>
            </span>
            <span className="card-meta-item">
              <i className="pi pi-users"></i>
              <span>{receita.porcoes}</span>
            </span>
          </div>

          {receita.chefe && (
            <span className="card-meta-item card-meta-chefe">
              <i className="pi pi-user"></i>
              <span>{receita.chefe}</span>
            </span>
          )}
        </div>

        <div className="card-actions">
          <button type="button" className="card-link" onClick={handleVerReceita}>
            Ver receita <i className="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardReceita;
