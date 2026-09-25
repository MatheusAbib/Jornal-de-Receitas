import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import ImagemLoader from "../../../components/Global/ImagemLoader/ImagemLoader";
import Modal from "../../../components/Modal/Modal";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import usePolling from "../../../hooks/usePolling";
import { extrairMensagemErro } from "../../../services/api";
import { getCache, setCache } from "../../../services/cache";
import {
  listarCarrosselAdmin,
  adicionarCarrossel,
  editarCarrossel,
  toggleCarrossel,
  excluirCarrossel
} from "../../../services/carrosselService";
import './Carrossel.css';

const CACHE_KEY = 'admin-carrossel';

function Carrossel() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [criando, setCriando] = useState(null);
  const [editando, setEditando] = useState(null);
  const [originalEdicao, setOriginalEdicao] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindoAgora, setExcluindoAgora] = useState(false);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const lista = await listarCarrosselAdmin(silencioso);
      setItens(lista);
      setCache(CACHE_KEY, lista);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    if (carregandoAuth) return;
    if (!usuario || usuario.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const cached = getCache(CACHE_KEY);

    if (cached) {
      setItens(cached);
      setCarregando(false);
      carregar(true);
    } else {
      carregar();
    }
  }, [usuario, carregandoAuth, navigate]);

  const modalAberto = !!criando || !!editando || !!excluindo;

  usePolling(() => carregar(true), 10000, !carregando && !carregandoAuth && !modalAberto);

  function abrirNovo() {
    const novo = {
      titulo: '',
      descricao: '',
      imagemUrl: '',
      ordemExibicao: '',
      linkDestino: '',
      imagemFile: null
    };
    setCriando(novo);
  }

  function abrirEdicao(item) {
    const dados = {
      id: item.id,
      titulo: item.titulo || '',
      descricao: item.descricao || '',
      imagemUrl: item.imagemUrl || '',
      ordemExibicao: item.ordemExibicao || '',
      linkDestino: item.linkDestino || '',
      imagemFile: null
    };
    setEditando(dados);
    setOriginalEdicao({ ...dados });
  }

  function fecharCriando() {
    setCriando(null);
  }

  function fecharEdicao() {
    setEditando(null);
    setOriginalEdicao(null);
  }

  async function salvarNovo(e) {
    e.preventDefault();
    setSalvando(true);

    try {
      const formData = new FormData();
      formData.append('titulo', criando.titulo);
      formData.append('descricao', criando.descricao);
      formData.append('imagemUrl', criando.imagemUrl || '');
      formData.append('ordemExibicao', criando.ordemExibicao || '');
      formData.append('linkDestino', criando.linkDestino || '');

      if (criando.imagemFile) {
        formData.append('imagemFile', criando.imagemFile);
      }

      await adicionarCarrossel(formData);

      mostrarToast('Item adicionado ao carrossel!', 'success');
      fecharCriando();
      carregar();
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao adicionar item ao carrossel.');
      mostrarToast(msg, 'error');
    } finally {
      setSalvando(false);
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    setSalvando(true);

    try {
      const formData = new FormData();
      formData.append('titulo', editando.titulo);
      formData.append('descricao', editando.descricao);
      formData.append('imagemUrl', editando.imagemUrl || '');
      formData.append('ordemExibicao', editando.ordemExibicao || '');
      formData.append('linkDestino', editando.linkDestino || '');

      if (editando.imagemFile) {
        formData.append('imagemFile', editando.imagemFile);
      }

      await editarCarrossel(editando.id, formData);

      mostrarToast('Item atualizado com sucesso!', 'success');
      fecharEdicao();
      carregar();
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao atualizar item.');
      mostrarToast(msg, 'error');
    } finally {
      setSalvando(false);
    }
  }

  async function toggleAtivo(id) {
    try {
      const response = await toggleCarrossel(id);
      const atualizado = response.item;

      setItens(prev => {
        const nova = prev.map(i => i.id === id ? atualizado : i);
        setCache(CACHE_KEY, nova);
        return nova;
      });

      mostrarToast(
        atualizado.ativo
          ? 'Item ativado no carrossel.'
          : 'Item desativado no carrossel.',
        'success'
      );
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao alterar status do item.');
      mostrarToast(msg, 'error');
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return;
    setExcluindoAgora(true);

    try {
      await excluirCarrossel(excluindo.id);
      setItens(prev => {
        const nova = prev.filter(i => i.id !== excluindo.id);
        setCache(CACHE_KEY, nova);
        return nova;
      });
      mostrarToast('Item excluído do carrossel!', 'success');
      setExcluindo(null);
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao excluir item.');
      mostrarToast(msg, 'error');
    } finally {
      setExcluindoAgora(false);
    }
  }

  const criandoValido = criando &&
    criando.titulo?.trim() &&
    (criando.imagemUrl?.trim() || criando.imagemFile);

  const editandoValido = editando &&
    editando.titulo?.trim() &&
    (editando.imagemUrl?.trim() || editando.imagemFile);

  const editandoMudou = editando && originalEdicao && (
    editando.titulo !== originalEdicao.titulo ||
    editando.descricao !== originalEdicao.descricao ||
    editando.imagemUrl !== originalEdicao.imagemUrl ||
    editando.ordemExibicao !== originalEdicao.ordemExibicao ||
    editando.linkDestino !== originalEdicao.linkDestino ||
    editando.imagemFile
  );

  const botaoSalvarNovoHabilitado = criandoValido && !salvando;
  const botaoSalvarEdicaoHabilitado = editandoValido && editandoMudou && !salvando;

  const formAberto = criando || editando;
  const formAtual = criando || editando;
  const fecharForm = () => { fecharCriando(); fecharEdicao(); };

  if (carregandoAuth || carregando) {
    return (
      <AdminLayout>
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#8b0000' }}></i>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1><i className="pi pi-images"></i> Carrossel</h1>
        <div className="admin-topbar-actions">
          <span><i className="pi pi-list"></i> Total: <strong>{itens.length}</strong></span>
          <button type="button" className="carrossel-btn-novo" onClick={abrirNovo}>
            <i className="pi pi-plus"></i> Novo Item
          </button>
        </div>
      </div>

      {!carregando && itens.length > 0 && (
        <div className="carrossel-grid">
          {itens.map(item => {
            const imagemUrl = item.imagemUrl
              ? (item.imagemUrl.startsWith('http') ? item.imagemUrl : `/uploads/${item.imagemUrl}`)
              : '/default-image.jpg';

            return (
              <div key={item.id} className="carrossel-card">

                <div className="carrossel-card-img">
                  <ImagemLoader src={imagemUrl} alt={item.titulo} />

                  <span className="carrossel-card-ordem">
                    <i className="pi pi-sort-numeric-up"></i> {item.ordemExibicao || 0}
                  </span>

                  <span className={`carrossel-card-status ${item.ativo ? 'ativo' : 'inativo'}`}>
                    <i className={item.ativo ? 'pi pi-eye' : 'pi pi-eye-slash'}></i>
                    {item.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="carrossel-card-body">
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>

                  {item.linkDestino && (
                    <span className="carrossel-card-link">
                      <i className="pi pi-link"></i> {item.linkDestino}
                    </span>
                  )}
                </div>

                <div className="carrossel-card-actions">
                  <button
                    type="button"
                    className="carrossel-action-btn edit"
                    onClick={() => abrirEdicao(item)}
                  >
                    <i className="pi pi-pencil"></i> Editar
                  </button>

                  <button
                    type="button"
                    className="carrossel-action-btn toggle"
                    onClick={() => toggleAtivo(item.id)}
                  >
                    <i className={item.ativo ? 'pi pi-eye-slash' : 'pi pi-eye'}></i>
                    {item.ativo ? 'Desativar' : 'Ativar'}
                  </button>

                  <button
                    type="button"
                    className="carrossel-action-btn delete"
                    onClick={() => setExcluindo(item)}
                  >
                    <i className="pi pi-trash"></i> Excluir
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {!carregando && itens.length === 0 && (
        <div className="carrossel-empty">
          <i className="pi pi-images"></i>
          <h3>Nenhum item no carrossel</h3>
          <p>Clique em "Novo Item" para adicionar o primeiro.</p>
        </div>
      )}

      <Modal aberto={!!formAberto} onFechar={fecharForm} maxWidth="700px">
        <Modal.Header
          titulo={criando ? 'Novo Item' : 'Editar Item'}
          icone={criando ? 'pi pi-plus' : 'pi pi-pencil'}
          onFechar={fecharForm}
        />

        <Modal.Body>
          <form onSubmit={criando ? salvarNovo : salvarEdicao}>
            <div className="form-grid">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  placeholder="Ex: Promoção de Inverno"
                  value={formAtual?.titulo || ''}
                  onChange={(e) =>
                    criando
                      ? setCriando({ ...criando, titulo: e.target.value })
                      : setEditando({ ...editando, titulo: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Ordem</label>
                <input
                  type="number"
                  placeholder="Ex: 1"
                  value={formAtual?.ordemExibicao || ''}
                  onChange={(e) =>
                    criando
                      ? setCriando({ ...criando, ordemExibicao: e.target.value })
                      : setEditando({ ...editando, ordemExibicao: e.target.value })
                  }
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                placeholder="Breve descrição que aparece no carrossel"
                value={formAtual?.descricao || ''}
                onChange={(e) =>
                  criando
                    ? setCriando({ ...criando, descricao: e.target.value })
                    : setEditando({ ...editando, descricao: e.target.value })
                }
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>URL da Imagem</label>
              <input
                type="text"
                placeholder="https://exemplo.com/imagem.jpg"
                value={formAtual?.imagemUrl || ''}
                onChange={(e) =>
                  criando
                    ? setCriando({ ...criando, imagemUrl: e.target.value })
                    : setEditando({ ...editando, imagemUrl: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Ou envie um arquivo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  criando
                    ? setCriando({ ...criando, imagemFile: e.target.files[0] })
                    : setEditando({ ...editando, imagemFile: e.target.files[0] })
                }
              />
            </div>

            <div className="form-group">
              <label>Link de Destino</label>
              <input
                type="text"
                placeholder="/detalhe/123"
                value={formAtual?.linkDestino || ''}
                onChange={(e) =>
                  criando
                    ? setCriando({ ...criando, linkDestino: e.target.value })
                    : setEditando({ ...editando, linkDestino: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="modal-btn modal-btn-cancel" onClick={fecharForm} disabled={salvando}>
                <i className="pi pi-times"></i> Cancelar
              </button>
              <button
                type="submit"
                className="modal-btn modal-btn-save"
                disabled={criando ? !botaoSalvarNovoHabilitado : !botaoSalvarEdicaoHabilitado}
              >
                {salvando ? (
                  <><i className="pi pi-spin pi-spinner"></i> Salvando...</>
                ) : (
                  <><i className="pi pi-save"></i> Salvar</>
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal aberto={!!excluindo} onFechar={() => setExcluindo(null)} maxWidth="480px">
        <Modal.Header
          titulo="Excluir Item"
          icone="pi pi-exclamation-triangle"
          onFechar={() => setExcluindo(null)}
        />
        <Modal.Body>
          <p className="admin-modal-delete-text">
            Tem certeza que deseja excluir <strong>{excluindo?.titulo}</strong>?
          </p>
          <p className="modal-warning">
            <i className="pi pi-exclamation-circle"></i> Esta ação não pode ser desfeita.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={() => setExcluindo(null)}
              disabled={excluindoAgora}
            >
              <i className="pi pi-times"></i> Cancelar
            </button>
            <button
              type="button"
              className="modal-btn modal-btn-danger"
              onClick={confirmarExclusao}
              disabled={excluindoAgora}
            >
              {excluindoAgora ? (
                <><i className="pi pi-spin pi-spinner"></i> Excluindo...</>
              ) : (
                <><i className="pi pi-trash"></i> Excluir</>
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
}

export default Carrossel;
