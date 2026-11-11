
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagemLoader from '../../Global/ImagemLoader/ImagemLoader';
import { useToast } from '../../../context/ToastContext';
import { prefetchRota } from '../../../services/prefetch';
import './CardReceita.css';

function CardReceita({
  receita,
  favorito,
  onToggleFavorito,
  usuarioLogado,
  variante = 'default',
  linkExterno
}) {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const [carregandoFav, setCarregandoFav] = useState(false);

  const imagemUrl = receita.imagem
    ? (
        receita.imagem.startsWith('http://') ||
        receita.imagem.startsWith('https://') ||
        receita.imagem.startsWith('data:') ||
        receita.imagem.startsWith('blob:') ||
        receita.imagem.startsWith('/uploads/')
          ? receita.imagem
          : `/uploads/${receita.imagem.replace(/^\/+/, '')}`
      )
    : null;

  const ehSalgado = receita.categoria === 'SALGADO';
  const ehReceitaRapida = variante === 'receita-rapida';
  const tempo = receita.tempoPreparo || receita.tempo;
  const categoria = ehSalgado ? 'Salgados' : 'Doces';

  async function handleFavorito(event) {
    event.preventDefault();
    event.stopPropagation();

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
          favorito
            ? 'Receita removida dos favoritos.'
            : 'Receita adicionada aos favoritos!',
          favorito ? 'info' : 'success'
        );
      }
    } catch (erro) {
      console.error(erro);
      mostrarToast('Erro ao atualizar favorito.', 'error');
    } finally {
      setCarregandoFav(false);
    }
  }

  function handleVerReceita() {
    if (linkExterno) {
      window.open(linkExterno, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/detalhe/${receita.id}`);
    }
  }

  function handlePrefetchDetalhe() {
    if (!linkExterno) {
      prefetchRota('/detalhe');
    }
  }

  const imagem = (
    <ImagemLoader src={imagemUrl} alt={receita.titulo} />
  );

  if (ehReceitaRapida) {
    return (
      <article
        className="card card-receita-rapida"
        onMouseEnter={handlePrefetchDetalhe}
      >
        <button
          type="button"
          className="card-image card-image--clicavel"
          onClick={handleVerReceita}
          aria-label={`Abrir receita de ${receita.titulo}`}
        >
          {imagem}
        </button>

        <div className="card-content">
          <div className="card-editoria">
            <span>{categoria}</span>
            <span className="card-editoria-linha" />
          </div>

          <h3 className="card-titulo">{receita.titulo}</h3>

          {receita.descricao && (
            <p className="card-descricao-rapida">
              {receita.descricao}
            </p>
          )}

          <div className="card-meta">
            {tempo && (
              <div className="card-meta-item">
                <i className="pi pi-clock" aria-hidden="true" />
                <span>{tempo}</span>
              </div>
            )}

            {receita.porcoes && (
              <div className="card-meta-item">
                <i className="pi pi-users" aria-hidden="true" />
                <span>{receita.porcoes}</span>
              </div>
            )}
          </div>

          <div className="card-actions">
            <button
              type="button"
              className="card-link"
              onClick={handleVerReceita}
            >
              <span>Ler receita</span>
              <i className="pi pi-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`card card-receita ${ehSalgado ? 'card-receita--salgado' : 'card-receita--doce'}`}
      onMouseEnter={handlePrefetchDetalhe}
    >
      <div className="card-image">
        <button
          type="button"
          className="card-image-abrir"
          onClick={handleVerReceita}
          aria-label={`Abrir receita de ${receita.titulo}`}
        >
          {imagem}
        </button>

        <button
          type="button"
          className={`card-favorite-btn ${favorito ? 'active' : ''}`}
          onClick={handleFavorito}
          aria-label={
            favorito
              ? `Remover ${receita.titulo} dos favoritos`
              : `Adicionar ${receita.titulo} aos favoritos`
          }
          aria-pressed={Boolean(favorito)}
          disabled={carregandoFav}
        >
          {carregandoFav ? (
            <i className="pi pi-spin pi-spinner" aria-hidden="true" />
          ) : (
            <i
              className={favorito ? 'pi pi-heart-fill' : 'pi pi-heart'}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      <div className="card-content">
        <div className="card-editoria">
          <span>{categoria}</span>
          <span className="card-editoria-linha" />
        </div>

        <h3 className="card-titulo">{receita.titulo}</h3>

        <div className="card-meta">
          {tempo && (
            <div className="card-meta-item">
              <i className="pi pi-clock" aria-hidden="true" />
              <span>{tempo}</span>
            </div>
          )}

          {receita.porcoes && (
            <div className="card-meta-item">
              <i className="pi pi-users" aria-hidden="true" />
              <span>{receita.porcoes}</span>
            </div>
          )}

          {receita.chefe && (
            <div className="card-meta-item card-meta-chefe">
              <i className="pi pi-user" aria-hidden="true" />
              <span>{receita.chefe}</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="card-link"
            onClick={handleVerReceita}
          >
            <span>Ler receita completa</span>
            <i className="pi pi-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default CardReceita;
