import ImagemLoader from '../../../components/Global/ImagemLoader/ImagemLoader';
import obterImagemUrl from '../../../utils/obterImagemUrl';

export default function MinhaReceitaCard({
  receita,
  aba,
  status,
  onVer,
  onVerMotivo,
  onExcluir,
}) {
  const imagemUrl = obterImagemUrl(receita.imagem, '/default-image.jpg');

  return (
    <article className="minha-card">
      <div className="minha-imagem">
        <ImagemLoader src={imagemUrl} alt={receita.titulo} />
        <span className={`status-badge ${status.cor}`}>
          <i className={`pi ${status.icone}`} aria-hidden="true"></i>
          {status.texto}
        </span>
      </div>
      <div className="minha-info">
        <div className="minha-info-top">
          <span className="minha-card-label">
            <i className="pi pi-book" aria-hidden="true"></i>
            Receita enviada
          </span>
          <h3>{receita.titulo}</h3>
        </div>
        <div className="minha-meta">
          <span title="Tempo de preparo">
            <i className="pi pi-clock" aria-hidden="true"></i>
            {receita.tempoPreparo}
          </span>
          <span title="Porções">
            <i className="pi pi-users" aria-hidden="true"></i>
            {receita.porcoes} porções
          </span>
          <span title="Curtidas">
            <i className="pi pi-heart" aria-hidden="true"></i>
            {receita.totalFavoritos || 0} curtidas
          </span>
        </div>
        <div className="minha-actions">
          <button
            type="button"
            className="btn-ver"
            onClick={() => onVer(receita)}
          >
            <i className="pi pi-eye" aria-hidden="true"></i>
            Ver receita
          </button>
          {aba === 'rejeitadas' && (
            <button
              type="button"
              className="btn-motivo"
              onClick={() => onVerMotivo(receita)}
            >
              <i className="pi pi-info-circle" aria-hidden="true"></i>
              Ver motivo
            </button>
          )}
          {(aba === 'pendentes' || aba === 'rejeitadas') && (
            <button
              type="button"
              className="btn-excluir"
              onClick={() => onExcluir(receita)}
            >
              <i className="pi pi-trash" aria-hidden="true"></i>
              Excluir
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
