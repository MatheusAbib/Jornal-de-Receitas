export default function DetalhesReceitaSkeleton() {
  return (
    <article className="detalhe-card detalhe-carregando" aria-busy="true">
      <div className="detalhe-hero">
        <div className="detalhe-image detalhe-skeleton-block"></div>
        <div className="detalhe-info">
          <div className="detalhe-skeleton-line detalhe-skeleton-badge"></div>
          <div className="detalhe-skeleton-line detalhe-skeleton-titulo"></div>
          <div className="detalhe-skeleton-line detalhe-skeleton-titulo-curto"></div>
          <div className="detalhe-skeleton-line detalhe-skeleton-meta"></div>
          <div className="detalhe-meta">
            <div className="detalhe-skeleton-line detalhe-skeleton-meta-item"></div>
            <div className="detalhe-skeleton-line detalhe-skeleton-meta-item"></div>
            <div className="detalhe-skeleton-line detalhe-skeleton-meta-item"></div>
          </div>
          <div className="detalhe-info-actions">
            <div className="detalhe-skeleton-line detalhe-skeleton-action"></div>
            <div className="detalhe-skeleton-line detalhe-skeleton-action"></div>
          </div>
        </div>
      </div>
      <div className="detalhe-body">
        <section className="detalhe-section">
          <div className="detalhe-skeleton-line detalhe-skeleton-section-title"></div>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="detalhe-skeleton-line detalhe-skeleton-item"
            ></div>
          ))}
        </section>
        <section className="detalhe-section">
          <div className="detalhe-skeleton-line detalhe-skeleton-section-title"></div>
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="detalhe-skeleton-line detalhe-skeleton-item"
            ></div>
          ))}
        </section>
      </div>
    </article>
  );
}
