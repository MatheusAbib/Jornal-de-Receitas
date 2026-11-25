import { useId } from 'react';
import './AdminPageHeader.css';

function AdminPageHeader({ titulo, descricao, acao }) {
  const tituloId = useId();

  return (
    <header className="admin-page-header" aria-labelledby={tituloId}>
      <div className="admin-page-header-texto">
        <h1 id={tituloId}>{titulo}</h1>
        {descricao && <p>{descricao}</p>}
      </div>

      {acao && <div className="admin-page-header-acao">{acao}</div>}
    </header>
  );
}

export default AdminPageHeader;