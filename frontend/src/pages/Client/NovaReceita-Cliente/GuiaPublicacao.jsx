export default function GuiaPublicacao() {
  return (
    <aside
      className="nova-info-card"
      aria-label="Dicas para enviar sua receita"
    >
      <div className="nova-info-header">
        <span>Guia de publicação</span>
        <h2>
          <i className="pi pi-lightbulb" aria-hidden="true"></i>
          Dicas e informações
        </h2>
      </div>
      <div className="nova-info-body">
        <div className="nova-info-section">
          <h3>
            <i className="pi pi-info-circle" aria-hidden="true"></i>
            Como funciona?
          </h3>
          <p>
            Após enviar sua receita, ela passará por uma análise do nosso
            administrador. Você será notificado quando for aprovada ou
            reprovada.
          </p>
        </div>
        <div className="nova-info-section">
          <h3>
            <i className="pi pi-check-circle" aria-hidden="true"></i>O que faz
            uma receita ser aprovada?
          </h3>
          <ul>
            <li>
              <i className="pi pi-check" aria-hidden="true"></i>
              Título claro e descritivo
            </li>
            <li>
              <i className="pi pi-check" aria-hidden="true"></i>
              Ingredientes com quantidades e unidades corretas
            </li>
            <li>
              <i className="pi pi-check" aria-hidden="true"></i>
              Modo de preparo organizado em passos
            </li>
            <li>
              <i className="pi pi-check" aria-hidden="true"></i>
              Informação correta de tempo e porções
            </li>
            <li>
              <i className="pi pi-check" aria-hidden="true"></i>
              Imagem de qualidade da receita
            </li>
            <li>
              <i className="pi pi-check" aria-hidden="true"></i>
              Textos bem escritos e sem erros
            </li>
          </ul>
        </div>
        <div className="nova-info-section">
          <h3>
            <i className="pi pi-times-circle" aria-hidden="true"></i>O que causa
            reprovação?
          </h3>
          <ul>
            <li>
              <i className="pi pi-times" aria-hidden="true"></i>
              Ingredientes sem quantidade ou unidade
            </li>
            <li>
              <i className="pi pi-times" aria-hidden="true"></i>
              Modo de preparo confuso ou incompleto
            </li>
            <li>
              <i className="pi pi-times" aria-hidden="true"></i>
              Informações inconsistentes
            </li>
            <li>
              <i className="pi pi-times" aria-hidden="true"></i>
              Textos com muitos erros de português
            </li>
          </ul>
        </div>
        <div className="nova-info-section">
          <h3>
            <i className="pi pi-pencil" aria-hidden="true"></i>
            Dicas para uma boa receita
          </h3>
          <div className="nova-info-tip">
            <p>
              <i className="pi pi-check-circle" aria-hidden="true"></i>
              <span>
                <strong>Revise antes de enviar!</strong> Verifique as
                quantidades e unidades dos ingredientes.
              </span>
            </p>
            <p>
              <i className="pi pi-check-circle" aria-hidden="true"></i>
              <span>
                <strong>Seja específico</strong> nos passos do preparo.
              </span>
            </p>
            <p>
              <i className="pi pi-check-circle" aria-hidden="true"></i>
              <span>
                <strong>Use unidades padronizadas</strong> como xícara, colher e
                gramas.
              </span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
