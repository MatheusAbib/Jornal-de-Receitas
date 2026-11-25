import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagemLoader from '../../Global/ImagemLoader/ImagemLoader';
import ComplexidadeBadge from '../ComplexidadeBadge/ComplexidadeBadge';
import { useToast } from '../../../context/ToastContext';
import { prefetchRota } from '../../../services/prefetch';
import obterImagemUrl from '../../../utils/obterImagemUrl';
import './CardReceita.css';
import './CardReceitaHome.css';

function CardReceita({
  receita,
  favorito,
  onToggleFavorito,
  onAbrirReceita,
  usuarioLogado,
  variante = 'default',
  linkExterno,
}) {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const [carregandoFav, setCarregandoFav] = useState(false);

  const ehSalgado = receita.categoria === 'SALGADO';
  const ehRapida = variante === 'receita-rapida';
  const ehDestaque = variante === 'destaque';
  const categoria = ehSalgado ? 'Salgados' : 'Doces';
  const classeCategoria = ehSalgado
    ? 'card-receita--salgado'
    : 'card-receita--doce';

  const classeApresentacao =
    {
      grade: 'card-receita--grade',
      destaque: 'card-receita--destaque',
    }[variante] ?? '';

  const classeCard = ehRapida
    ? 'card card-receita-rapida'
    : ['card', 'card-receita', classeCategoria, classeApresentacao]
        .filter(Boolean)
        .join(' ');

  async function handleFavorito(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!usuarioLogado) {
      mostrarToast('Faça login para favoritar receitas!', 'info');
      return;
    }

    if (carregandoFav || !onToggleFavorito) return;

    setCarregandoFav(true);

    try {
      await onToggleFavorito(receita.id, favorito);
      mostrarToast(
        favorito
          ? 'Receita removida dos favoritos.'
          : 'Receita adicionada aos favoritos!',
        favorito ? 'info' : 'success',
      );
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
      return;
    }

    onAbrirReceita?.();
    navigate(`/detalhe/${receita.id}`);
  }

  function handlePrefetchDetalhe() {
    if (!linkExterno) prefetchRota('/detalhe');
  }

  const imagem = (
    <ImagemLoader
      src={obterImagemUrl(receita.imagem, null)}
      alt={receita.titulo}
    />
  );
  const complexidade = (
    <ComplexidadeBadge complexidade={receita.complexidade} variante="selo" />
  );
  const rotuloImagem = `Abrir receita de ${receita.titulo}`;
  const metadados = [
    ['pi-clock', receita.tempoPreparo || receita.tempo],
    ['pi-users', receita.porcoes],
    ['pi-user', !ehRapida && receita.chefe, 'card-meta-chefe'],
  ];

  return (
    <article className={classeCard} onMouseEnter={handlePrefetchDetalhe}>
      {ehRapida ? (
        <button
          type="button"
          className="card-image card-image--clicavel"
          onClick={handleVerReceita}
          aria-label={rotuloImagem}
        >
          {imagem}
          {complexidade}
        </button>
      ) : (
        <div className="card-image">
          <button
            type="button"
            className="card-image-abrir"
            onClick={handleVerReceita}
            aria-label={rotuloImagem}
          >
            {imagem}
          </button>

          {complexidade}

          <button
            type="button"
            className={
              favorito ? 'card-favorite-btn active' : 'card-favorite-btn'
            }
            onClick={handleFavorito}
            aria-label={
              favorito
                ? `Remover ${receita.titulo} dos favoritos`
                : `Adicionar ${receita.titulo} aos favoritos`
            }
            aria-pressed={Boolean(favorito)}
            disabled={carregandoFav}
          >
            <i
              className={
                carregandoFav
                  ? 'pi pi-spin pi-spinner'
                  : favorito
                    ? 'pi pi-heart-fill'
                    : 'pi pi-heart'
              }
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {!ehDestaque && (
        <div className="card-content">
          <div className="card-editoria">
            <span>{categoria}</span>
            <span className="card-editoria-linha" />
          </div>

          <h3 className="card-titulo">{receita.titulo}</h3>

          {ehRapida && receita.descricao && (
            <p className="card-descricao-rapida">{receita.descricao}</p>
          )}

          <div className="card-meta">
            {metadados
              .filter(([, valor]) => valor)
              .map(([icone, valor, classe]) => (
                <div
                  key={icone}
                  className={
                    classe ? `card-meta-item ${classe}` : 'card-meta-item'
                  }
                >
                  <i className={`pi ${icone}`} aria-hidden="true" />
                  <span>{valor}</span>
                </div>
              ))}
          </div>

          <div className="card-actions">
            <button
              type="button"
              className="card-link"
              onClick={handleVerReceita}
            >
              <span>{ehRapida ? 'Ler receita' : 'Ler receita completa'}</span>
              <i className="pi pi-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default CardReceita;
