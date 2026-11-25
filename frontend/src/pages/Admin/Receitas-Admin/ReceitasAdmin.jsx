import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import ImagemLoader from '../../../components/Global/ImagemLoader/ImagemLoader';
import Modal from '../../../components/Modal/Modal';
import ModalVerReceita from '../../../components/Modal/ModalVerReceita/ModalVerReceita';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import usePolling from '../../../hooks/usePolling';
import api, { extrairMensagemErro } from '../../../services/api';
import { getCache, setCache } from '../../../services/cache';
import './ReceitasAdmin.css';

const abas = [
  { id: 'pendentes', titulo: 'Pendentes', icone: 'pi-clock', total: 'totalPendentes', limite: 50 },
  { id: 'aprovadas', titulo: 'Aprovadas', icone: 'pi-check-circle', total: 'totalAprovadas', limite: 100 },
  { id: 'rejeitadas', titulo: 'Rejeitadas', icone: 'pi-times-circle', total: 'totalRejeitadas', limite: 50 }
];

const colunasBase = ['ID', 'Imagem', 'Título', 'Chefe', 'Tempo', 'Porções', 'Categoria'];
const camposEdicao = [
  { id: 'titulo', titulo: 'Título' },
  { id: 'chefe', titulo: 'Chefe' },
  { id: 'tempoPreparo', titulo: 'Tempo de preparo' },
  { id: 'porcoes', titulo: 'Porções', tipo: 'number' }
];

const acoes = {
  aprovar: { titulo: 'Aprovar receita', icone: 'pi-check-circle', botao: 'Aprovar' },
  rejeitar: { titulo: 'Rejeitar receita', icone: 'pi-times-circle', botao: 'Rejeitar' },
  excluir: { titulo: 'Excluir receita', icone: 'pi-exclamation-triangle', botao: 'Excluir' }
};

function obterImagem(imagem) {
  if (!imagem) return null;
  if (/^(https?:|blob:|data:|\/uploads\/)/i.test(imagem)) return imagem;
  return '/uploads/' + imagem.replace(/^\/+/, '');
}

function separarLinhas(texto, separador) {
  return String(texto ?? '').split(separador).map(linha => linha.trim()).filter(Boolean);
}

function BotaoAcao({ titulo, icone, classe, onClick }) {
  return (
    <button
      type="button"
      className={'action-btn ' + classe}
      aria-label={titulo}
      title={titulo}
      onClick={onClick}
    >
      <i className={'pi ' + icone} aria-hidden="true" />
    </button>
  );
}

function ReceitasAdmin() {
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const aba = abas.find(item => item.id === parametros.get('aba')) ?? abas[0];
  const ehAdmin = usuario?.role === 'ADMIN';
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');

  useEffect(() => {
    const termo = busca.trim();
    if (!termo) {
      setBuscaAplicada('');
      return;
    }

    const timer = setTimeout(() => setBuscaAplicada(termo), 300);
    return () => clearTimeout(timer);
  }, [busca]);

  function atualizarBuscaReceitas(event) {
    const valor = event.target.value;
    setBusca(valor);
    if (!valor.trim()) setBuscaAplicada('');
  }
  const [categoria, setCategoria] = useState('TODAS');
  const [resultado, setResultado] = useState(null);
  const [totais, setTotais] = useState({});
  const [erro, setErro] = useState(null);
  const [detalhes, setDetalhes] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [edicao, setEdicao] = useState(null);
  const [processando, setProcessando] = useState(false);
  const requisicao = useRef(null);

  const cacheKey = 'admin-receitas:' + usuario?.id + ':' + aba.id + ':' + buscaAplicada;
  const carregandoTela = carregandoAuth ||
    (resultado?.chave !== cacheKey && erro?.chave !== cacheKey);

  const carregar = useCallback(async (silencioso = false) => {
    if (!ehAdmin || carregandoAuth) return;

    requisicao.current?.abort();
    const controller = new AbortController();
    requisicao.current = controller;

    try {
      const { data } = await api.get('/api/receitas/' + aba.id, {
        params: { size: aba.limite, busca: buscaAplicada || undefined },
        signal: controller.signal,
        silent: silencioso
      });

      if (controller.signal.aborted) return;

      const novoResultado = { chave: cacheKey, receitas: data.receitas ?? [] };
      const novosTotais = Object.fromEntries(
        abas
          .filter(item => data[item.total] != null && (!buscaAplicada || item.id !== aba.id))
          .map(item => [item.id, data[item.total]])
      );

      if (!buscaAplicada && novosTotais[aba.id] == null && data.totalItems != null) {
        novosTotais[aba.id] = data.totalItems;
      }

      setResultado(novoResultado);
      setTotais(anteriores => ({ ...anteriores, ...novosTotais }));
      setCache(cacheKey, novoResultado);
      setErro(null);
    } catch (falha) {
      if (controller.signal.aborted) return;

      setErro({
        chave: cacheKey,
        mensagem: extrairMensagemErro(falha, 'Não foi possível carregar as receitas.')
      });
    }
  }, [aba, buscaAplicada, cacheKey, carregandoAuth, ehAdmin]);

  useEffect(() => {
    if (carregandoAuth) return;

    if (!ehAdmin) {
      navigate('/', { replace: true });
      return;
    }

    const cache = getCache(cacheKey);
    setResultado(cache ?? null);
    setErro(null);
    carregar(Boolean(cache));

    return () => requisicao.current?.abort();
  }, [cacheKey, carregar, carregandoAuth, ehAdmin, navigate]);

  usePolling(
    () => carregar(true),
    10000,
    ehAdmin && !carregandoTela && !detalhes && !confirmacao && !edicao && !processando
  );

  const previewArquivo = edicao?.previewArquivo;

  useEffect(() => {
    if (!previewArquivo) return;
    return () => URL.revokeObjectURL(previewArquivo);
  }, [previewArquivo]);


  function fecharConfirmacao() {
    if (processando) return;
    setConfirmacao(null);
    setMotivo('');
  }

  async function confirmarAcao() {
    if (!confirmacao || processando) return;

    const { tipo, receita } = confirmacao;
    if (tipo === 'rejeitar' && !motivo.trim()) return;

    requisicao.current?.abort();
    setProcessando(true);

    try {
      const url = '/api/receitas/' + receita.id;

      if (tipo === 'excluir') {
        await api.delete(url, { silent: true });
      } else {
        await api.post(url + '/' + tipo, null, {
          params: tipo === 'rejeitar' ? { motivo: motivo.trim() } : undefined,
          silent: true
        });
      }

      const mensagem = {
        aprovar: 'Receita aprovada com sucesso!',
        rejeitar: 'Receita rejeitada.',
        excluir: 'Receita excluída com sucesso!'
      };

      mostrarToast(mensagem[tipo], tipo === 'rejeitar' ? 'info' : 'success');
      setConfirmacao(null);
      setMotivo('');
      setTotais({});

      if (resultado?.chave === cacheKey) {
        const atualizado = {
          ...resultado,
          receitas: resultado.receitas.filter(item => item.id !== receita.id)
        };
        setResultado(atualizado);
        setCache(cacheKey, atualizado);
      }

      await carregar();
    } catch (falha) {
      mostrarToast(extrairMensagemErro(falha, 'Não foi possível concluir a ação.'), 'error');
    } finally {
      setProcessando(false);
    }
  }

  function abrirEdicao(receita) {
    const campos = {
      titulo: receita.titulo ?? '',
      chefe: receita.chefe ?? '',
      tempoPreparo: receita.tempoPreparo ?? '',
      porcoes: String(receita.porcoes ?? ''),
      categoria: receita.categoria || 'SALGADO',
      ingredientes: separarLinhas(receita.ingredientes, '||').join('\n'),
      modoPreparo: separarLinhas(receita.modoPreparo, '||').join('\n')
    };

    setEdicao({
      id: receita.id,
      campos,
      original: campos,
      imagemAtual: receita.imagem ?? null,
      arquivo: null,
      previewArquivo: null,
      ocultarImagemAtual: false
    });
  }

  function atualizarCampo(campo, valor) {
    setEdicao(atual => ({
      ...atual,
      campos: { ...atual.campos, [campo]: valor }
    }));
  }

  function selecionarImagem(event) {
    const arquivo = event.target.files?.[0];
    event.target.value = '';
    if (!arquivo) return;

    const preview = URL.createObjectURL(arquivo);
    setEdicao(atual => ({ ...atual, arquivo, previewArquivo: preview }));
  }

  const previewUrl = edicao?.previewArquivo ||
    (!edicao?.ocultarImagemAtual ? obterImagem(edicao?.imagemAtual) : null);

  const campos = edicao?.campos;
  const porcoes = Number(campos?.porcoes);
  const edicaoValida = Boolean(
    campos?.titulo.trim() &&
    campos?.chefe.trim() &&
    campos?.tempoPreparo.trim() &&
    Number.isInteger(porcoes) &&
    porcoes >= 1 &&
    campos?.categoria &&
    campos?.ingredientes.trim() &&
    campos?.modoPreparo.trim() &&
    previewUrl
  );
  const edicaoMudou = edicao && (
    edicao.arquivo ||
    Object.keys(edicao.original).some(campo => campos[campo] !== edicao.original[campo])
  );

  function fecharEdicao() {
    if (!processando) setEdicao(null);
  }

  async function salvarEdicao(event) {
    event.preventDefault();
    if (!edicaoValida || !edicaoMudou || processando) return;

    requisicao.current?.abort();
    setProcessando(true);

    try {
      const dados = new FormData();

      for (const campo of ['titulo', 'chefe', 'tempoPreparo', 'porcoes', 'categoria']) {
        dados.append(campo, campos[campo]);
      }

      for (const campo of ['ingredientes', 'modoPreparo']) {
        separarLinhas(campos[campo], '\n').forEach(linha => dados.append(campo, linha));
      }

      if (edicao.arquivo) dados.append('imagemFile', edicao.arquivo);

      await api.put('/api/receitas/' + edicao.id, dados, {
        headers: { 'Content-Type': 'multipart/form-data' },
        silent: true
      });

      mostrarToast('Receita atualizada com sucesso!', 'success');
      setEdicao(null);
      await carregar();
    } catch (falha) {
      mostrarToast(extrairMensagemErro(falha, 'Erro ao atualizar receita.'), 'error');
    } finally {
      setProcessando(false);
    }
  }

  const lista = resultado?.chave === cacheKey ? resultado.receitas : [];
  const receitas = lista.filter(receita =>
    categoria === 'TODAS' || receita.categoria?.toUpperCase() === categoria
  );
  const colunas = [
    ...colunasBase,
    ...(aba.id === 'rejeitadas' ? ['Motivo'] : []),
    'Ações'
  ];
  const acao = confirmacao && acoes[confirmacao.tipo];
  const erroAtual = erro?.chave === cacheKey ? erro.mensagem : '';

  if (!carregandoAuth && !ehAdmin) return null;

  return (
    <AdminLayout
  titulo="Receitas"
  descricao="Revise os envios e gerencie as receitas publicadas no Jornal."
  acao={
    <div className="admin-topbar-actions receitas-filtros">
      <div className="admin-filtro-categoria">
        <i className="pi pi-filter" aria-hidden="true" />
        <select
          value={categoria}
          onChange={event => setCategoria(event.target.value)}
          aria-label="Filtrar por categoria"
        >
          <option value="TODAS">Todas as categorias</option>
          <option value="SALGADO">Salgados</option>
          <option value="DOCE">Doces</option>
        </select>
        <i className="pi pi-chevron-down" aria-hidden="true" />
      </div>

      <form className="admin-search-box" onSubmit={event => event.preventDefault()} role="search">
        <i className="pi pi-search" aria-hidden="true" />
        <input
          type="search"
          aria-label="Buscar receita"
          placeholder="Buscar receita..."
          value={busca}
          onChange={atualizarBuscaReceitas}
        />
      </form>
    </div>
  }
>
      <div className="admin-receitas">

        <div className="admin-table-wrapper">
          <div className="admin-table-container">
            <div className="admin-table-header">
              <nav className="receitas-abas" aria-label="Status das receitas">
                {abas.map(item => (
                  <Link
                    key={item.id}
                    to={'/admin/pendentes?aba=' + item.id}
                    aria-current={aba.id === item.id ? 'page' : undefined}
                  >
                    <i className={'pi ' + item.icone} aria-hidden="true" />
                    {item.titulo}
                    {totais[item.id] != null && <span>{totais[item.id]}</span>}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="receitas-resultado" aria-busy={carregandoTela}>
              <p className="receitas-contagem" role="status">
                {carregandoTela
                  ? 'Carregando receitas…'
                  : receitas.length + (receitas.length === 1 ? ' receita na lista' : ' receitas na lista')}
              </p>

              {erroAtual && (
                <div className="receitas-erro" role="status">
                  <span>{erroAtual}</span>
                  <button type="button" onClick={() => carregar()}>
                    Tentar novamente
                  </button>
                </div>
              )}

              {(carregandoTela || receitas.length > 0) && (
                <div className="admin-table-scroll">
                  <table className="admin-table" aria-label={'Receitas ' + aba.titulo.toLowerCase()}>
                    <thead>
                      <tr>
                        {colunas.map(coluna => (
                          <th
                            key={coluna}
                            scope="col"
                            className={coluna === 'Ações' ? 'text-center' : undefined}
                          >
                            {coluna}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {carregandoTela ? (
                        Array.from({ length: 6 }, (_, indice) => (
                          <tr key={indice} aria-hidden="true">
                            {colunas.map(coluna => (
                              <td key={coluna} data-label={coluna}>
                                <div className={coluna === 'Imagem' ? 'skeleton-thumb' : 'skeleton-line skeleton-line-sm'} />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        receitas.map(receita => (
                          <tr key={receita.id}>
                            <td data-label="ID">{receita.id}</td>
                            <td data-label="Imagem">
                              <ImagemLoader
                                src={obterImagem(receita.imagem) || '/default-image.jpg'}
                                alt={receita.titulo}
                                wrapperClassName="admin-thumb-wrapper"
                                className="admin-thumb"
                              />
                            </td>
                            <td data-label="Título">{receita.titulo}</td>
                            <td data-label="Chefe">{receita.chefe || '—'}</td>
                            <td data-label="Tempo">{receita.tempoPreparo || '—'}</td>
                            <td data-label="Porções">{receita.porcoes || '—'}</td>
                            <td data-label="Categoria">
                              <span className={'receita-categoria ' + (receita.categoria?.toLowerCase() || '')}>
                                {receita.categoria || '—'}
                              </span>
                            </td>

                            {aba.id === 'rejeitadas' && (
                              <td data-label="Motivo" className="receitas-motivo">
                                {receita.motivoRejeicao || '—'}
                              </td>
                            )}

                            <td data-label="Ações" className="text-center">
                              <div className="actions-group">
                                <BotaoAcao
                                  titulo={'Visualizar ' + receita.titulo}
                                  icone="pi-eye"
                                  classe="btn-view"
                                  onClick={() => setDetalhes(receita)}
                                />

                                {aba.id === 'pendentes' && (
                                  <>
                                    <BotaoAcao
                                      titulo={'Aprovar ' + receita.titulo}
                                      icone="pi-check"
                                      classe="receitas-btn-aprovar"
                                      onClick={() => setConfirmacao({ tipo: 'aprovar', receita })}
                                    />
                                    <BotaoAcao
                                      titulo={'Rejeitar ' + receita.titulo}
                                      icone="pi-times"
                                      classe="btn-delete"
                                      onClick={() => setConfirmacao({ tipo: 'rejeitar', receita })}
                                    />
                                  </>
                                )}

                                {aba.id === 'aprovadas' && (
                                  <>
                                    <BotaoAcao
                                      titulo={'Editar ' + receita.titulo}
                                      icone="pi-pencil"
                                      classe="btn-edit"
                                      onClick={() => abrirEdicao(receita)}
                                    />
                                    <BotaoAcao
                                      titulo={'Excluir ' + receita.titulo}
                                      icone="pi-trash"
                                      classe="btn-delete"
                                      onClick={() => setConfirmacao({ tipo: 'excluir', receita })}
                                    />
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {!carregandoTela && !erroAtual && receitas.length === 0 && (
                <div className="admin-empty">
                  <i className="pi pi-inbox" aria-hidden="true" />
                  <h3>Nenhuma receita encontrada</h3>
                  <p>
                    {buscaAplicada || categoria !== 'TODAS'
                      ? 'Ajuste os filtros para consultar outras receitas.'
                      : 'Ainda não há receitas com este status.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ModalVerReceita
          aberto={Boolean(detalhes)}
          onFechar={() => setDetalhes(null)}
          receita={detalhes}
        />

        {confirmacao && (
          <Modal aberto onFechar={fecharConfirmacao} maxWidth="520px">
            <Modal.Header titulo={acao.titulo} icone={'pi ' + acao.icone} onFechar={fecharConfirmacao} />
            <Modal.Body>
              <p className="admin-modal-delete-text">
                {acao.botao} <strong>{confirmacao.receita.titulo}</strong>?
              </p>

              <p className="modal-warning">
                <i className="pi pi-info-circle" aria-hidden="true" />{' '}
                {confirmacao.tipo === 'aprovar' && 'A receita ficará visível para todos os usuários.'}
                {confirmacao.tipo === 'rejeitar' && 'O autor poderá ver o motivo da rejeição.'}
                {confirmacao.tipo === 'excluir' && 'Esta ação não pode ser desfeita.'}
              </p>

              {confirmacao.tipo === 'rejeitar' && (
                <div className="form-group">
                  <label htmlFor="receita-motivo">Motivo da rejeição</label>
                  <textarea
                    id="receita-motivo"
                    rows={4}
                    value={motivo}
                    onChange={event => setMotivo(event.target.value)}
                    disabled={processando}
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={fecharConfirmacao}
                  disabled={processando}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={'modal-btn ' + (confirmacao.tipo === 'aprovar' ? 'modal-btn-save' : 'modal-btn-danger')}
                  onClick={confirmarAcao}
                  disabled={processando || (confirmacao.tipo === 'rejeitar' && !motivo.trim())}
                >
                  {processando ? 'Processando…' : acao.botao}
                </button>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {edicao && (
          <Modal aberto onFechar={fecharEdicao} maxWidth="700px">
            <Modal.Header titulo="Editar receita" icone="pi pi-pencil" onFechar={fecharEdicao} />
            <Modal.Body>
              <form onSubmit={salvarEdicao} className="admin-modal-body">
                <div className="form-grid">
                  {camposEdicao.map(({ id, titulo, tipo = 'text' }) => (
                    <div className="form-group" key={id}>
                      <label htmlFor={'editar-receita-' + id}>{titulo}</label>
                      <input
                        id={'editar-receita-' + id}
                        type={tipo}
                        min={tipo === 'number' ? 1 : undefined}
                        value={campos[id]}
                        onChange={event => atualizarCampo(id, event.target.value)}
                        disabled={processando}
                        required
                      />
                    </div>
                  ))}

                  <div className="form-group">
                    <label htmlFor="editar-receita-categoria">Categoria</label>
                    <select
                      id="editar-receita-categoria"
                      value={campos.categoria}
                      onChange={event => atualizarCampo('categoria', event.target.value)}
                      disabled={processando}
                      required
                    >
                      <option value="SALGADO">Salgado</option>
                      <option value="DOCE">Doce</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="editar-receita-imagem">Imagem</label>
                  {previewUrl && (
                    <div className="carrossel-preview">
                      <img src={previewUrl} alt="Prévia da receita" />
                      <div className="carrossel-preview-actions">
                        <a className="preview-btn baixar" href={previewUrl} download={campos.titulo || 'imagem'}>
                          <i className="pi pi-download" aria-hidden="true" /> Baixar
                        </a>
                        <button
                          type="button"
                          className="preview-btn excluir"
                          disabled={processando}
                          onClick={() => setEdicao(atual => ({
                            ...atual,
                            arquivo: null,
                            previewArquivo: null,
                            ocultarImagemAtual: true
                          }))}
                        >
                          <i className="pi pi-trash" aria-hidden="true" /> Remover prévia
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    id="editar-receita-imagem"
                    type="file"
                    accept="image/*"
                    onChange={selecionarImagem}
                    disabled={processando}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editar-receita-ingredientes">Ingredientes (um por linha)</label>
                  <textarea
                    id="editar-receita-ingredientes"
                    rows={6}
                    value={campos.ingredientes}
                    onChange={event => atualizarCampo('ingredientes', event.target.value)}
                    disabled={processando}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editar-receita-preparo">Modo de preparo (um passo por linha)</label>
                  <textarea
                    id="editar-receita-preparo"
                    rows={6}
                    value={campos.modoPreparo}
                    onChange={event => atualizarCampo('modoPreparo', event.target.value)}
                    disabled={processando}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn modal-btn-cancel"
                    onClick={fecharEdicao}
                    disabled={processando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="modal-btn modal-btn-save"
                    disabled={!edicaoValida || !edicaoMudou || processando}
                  >
                    {processando ? 'Salvando…' : 'Salvar'}
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

export default ReceitasAdmin;