import './ComplexidadeBadge.css';

function ComplexidadeBadge({ complexidade, variante = 'default' }) {
  if (!complexidade || !complexidade.descricao) {
    return null;
  }

  const descricao = complexidade.descricao.toLowerCase();

  return (
    <span
      className={`complexidade-badge complexidade-badge--${descricao} complexidade-badge--${variante}`}
      title={`Complexidade: ${complexidade.descricao} (${complexidade.pontuacao} pontos)`}
    >
      {complexidade.descricao}
    </span>
  );
}

export default ComplexidadeBadge;