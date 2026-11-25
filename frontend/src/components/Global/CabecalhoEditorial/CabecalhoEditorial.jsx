import './CabecalhoEditorial.css';

function CabecalhoEditorial({
  anotacao,
  editoria,
  titulo,
  descricao,
  rodape,
  acao,
  variante,
}) {
  const conteudo = (
    <>
      {editoria && (
        <span className="cabecalho-editorial-editoria">{editoria}</span>
      )}
      <h1>{titulo}</h1>
      {descricao && <p>{descricao}</p>}
    </>
  );

  return (
    <header className="cabecalho-editorial" data-variante={variante}>
      <div className="cabecalho-editorial-topo">
        <div className="cabecalho-editorial-identidade">
          <span className="cabecalho-editorial-marca">JR</span>
          <span>Jornal de Receitas</span>
        </div>
        {anotacao && <span>{anotacao}</span>}
      </div>

      <div className="cabecalho-editorial-conteudo">
        {acao ? <div>{conteudo}</div> : conteudo}
        {acao}
      </div>

      {rodape && <div className="cabecalho-editorial-rodape">{rodape}</div>}
    </header>
  );
}

export default CabecalhoEditorial;
