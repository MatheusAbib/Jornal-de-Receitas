import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import ImagemLoader from '../../components/ImagemLoader/ImagemLoader';
import Modal from '../../components/Modal/Modal';
import ModalVerReceita from '../../components/ModalVerReceita/ModalVerReceita';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import usePolling from '../../hooks/usePolling';
import api from '../../services/api';
import './ReceitasAprovadas.css';

function ReceitasAprovadas() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  const [detalhes, setDetalhes] = useState(null);
  const [editando, setEditando] = useState(null);
  const [originalEdicao, setOriginalEdicao] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindoAgora, setExcluindoAgora] = useState(false);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const params = { size: 100 };
      if (busca) params.busca = busca;

      const response = await api.get('/api/receitas/aprovadas', { params, silent: silencioso });
      setReceitas(response.data.receitas || []);
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
    carregar();
  }, [usuario, carregandoAuth, navigate]);

  const modalAberto = !!detalhes || !!editando || !!excluindo;

  usePolling(() => carregar(true), 10000, !carregando && !carregandoAuth && !modalAberto);

  function handleBusca(e) {
    e.preventDefault();
    carregar();
  }

  async function confirmarExclusao() {
    if (!excluindo) return;
    setExcluindoAgora(true);

    try {
      await api.delete(`/api/receitas/${excluindo.id}`);
      mostrarToast('Receita excluída com sucesso!', 'success');
      setExcluindo(null);
      carregar();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao excluir receita.', 'error');
    } finally {
      setExcluindoAgora(false);
    }
  }

  function abrirEdicao(r) {
    const dados = {
      id: r.id,
      titulo: r.titulo,
      chefe: r.chefe,
      tempoPreparo: r.tempoPreparo,
      porcoes: r.porcoes,
      categoria: r.categoria,
      ingredientes: (r.ingredientes || '').split('||').filter(i => i.trim()).join('\n'),
      modoPreparo: (r.modoPreparo || '').split('||').filter(p => p.trim()).join('\n'),
      imagem: r.imagem || '',
      imagemFile: null
    };
    setEditando(dados);
    setOriginalEdicao({ ...dados });
  }

  function fecharEdicao() {
    setEditando(null);
    setOriginalEdicao(null);
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    setSalvando(true);

    try {
      const formData = new FormData();
      formData.append('titulo', editando.titulo);
      formData.append('chefe', editando.chefe);
      formData.append('tempoPreparo', editando.tempoPreparo);
      formData.append('porcoes', editando.porcoes);
      formData.append('categoria', editando.categoria);

      editando.ingredientes
        .split('\n')
        .map(i => i.trim())
        .filter(i => i)
        .forEach(i => formData.append('ingredientes', i));

      editando.modoPreparo
        .split('\n')
        .map(p => p.trim())
        .filter(p => p)
        .forEach(p => formData.append('modoPreparo', p));

      if (editando.imagemFile) {
        formData.append('imagemFile', editando.imagemFile);
      }

      await api.put(`/api/receitas/${editando.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      mostrarToast('Receita atualizada com sucesso!', 'success');
      fecharEdicao();
      carregar();
    } catch (e) {
      console.error(e);
      mostrarToast('Erro ao atualizar receita.', 'error');
    } finally {
      setSalvando(false);
    }
  }

  const editandoValido = editando &&
    editando.titulo?.trim() &&
    editando.chefe?.trim() &&
    editando.tempoPreparo?.trim() &&
    editando.porcoes &&
    editando.categoria &&
    editando.ingredientes?.trim() &&
    editando.modoPreparo?.trim();

  const editandoMudou = editando && originalEdicao && (
    editando.titulo !== originalEdicao.titulo ||
    editando.chefe !== originalEdicao.chefe ||
    editando.tempoPreparo !== originalEdicao.tempoPreparo ||
    editando.porcoes !== originalEdicao.porcoes ||
    editando.categoria !== originalEdicao.categoria ||
    editando.ingredientes !== originalEdicao.ingredientes ||
    editando.modoPreparo !== originalEdicao.modoPreparo ||
    editando.imagemFile
  );

  const botaoSalvarHabilitado = editandoValido && editandoMudou && !salvando;

  if (carregandoAuth) {
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
        <h1><i className="pi pi-book"></i> Receitas Aprovadas</h1>
        <div className="admin-topbar-actions">
          <span><i className="pi pi-list"></i> Total: <strong>{receitas.length}</strong></span>
          <form className="admin-search-box" onSubmit={handleBusca}>
            <i className="pi pi-search"></i>
            <input
              type="text"
              placeholder="Buscar receita..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-container">

          <div className="admin-table-header">
            <div className="count">
              <i className="pi pi-list"></i> {receitas.length} receitas aprovadas
            </div>
          </div>

          {carregando && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#8b0000' }}></i>
            </div>
          )}

          {!carregando && receitas.length > 0 && (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagem</th>
                    <th>Título</th>
                    <th>Chefe</th>
                    <th>Tempo</th>
                    <th>Porções</th>
                    <th>Categoria</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {receitas.map(r => {
                    const imagemUrl = r.imagem
                      ? (r.imagem.startsWith('http') ? r.imagem : `/uploads/${r.imagem}`)
                      : '/default-image.jpg';

                    return (
                      <tr key={r.id}>
                        <td data-label="ID">{r.id}</td>
                        <td data-label="Imagem">
                          <ImagemLoader src={imagemUrl} alt={r.titulo} wrapperClassName="admin-thumb-wrapper" className="admin-thumb" />
                        </td>
                        <td data-label="Título">{r.titulo}</td>
                        <td data-label="Chefe">{r.chefe}</td>
                        <td data-label="Tempo">{r.tempoPreparo}</td>
                        <td data-label="Porções">{r.porcoes}</td>
                        <td data-label="Categoria">
                          <span className={`receita-categoria ${r.categoria?.toLowerCase()}`}>
                            {r.categoria}
                          </span>
                        </td>
                        <td data-label="Ações" className="text-center">
                          <div className="actions-group">
                            <button
                              type="button"
                              className="action-btn btn-view"
                              onClick={() => setDetalhes(r)}
                            >
                              <i className="pi pi-eye"></i>
                            </button>

                            <button
                              type="button"
                              className="action-btn btn-edit"
                              onClick={() => abrirEdicao(r)}
                            >
                              <i className="pi pi-pencil"></i>
                            </button>

                            <button
                              type="button"
                              className="action-btn btn-delete"
                              onClick={() => setExcluindo(r)}
                            >
                              <i className="pi pi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!carregando && receitas.length === 0 && (
            <div className="admin-empty">
              <i className="pi pi-book"></i>
              <h3>Nenhuma receita aprovada</h3>
              <p>Não há receitas aprovadas no momento.</p>
            </div>
          )}

        </div>
      </div>

      <ModalVerReceita
        aberto={!!detalhes}
        onFechar={() => setDetalhes(null)}
        receita={detalhes}
      />

      <Modal aberto={!!editando} onFechar={fecharEdicao} maxWidth="700px">
        <Modal.Header
          titulo="Editar Receita"
          icone="pi pi-pencil"
          onFechar={fecharEdicao}
        />

        <Modal.Body>
          <form onSubmit={salvarEdicao}>
            <div className="form-grid">
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  placeholder="Título da receita"
                  value={editando?.titulo || ''}
                  onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Chefe</label>
                <input
                  type="text"
                  placeholder="Nome do chefe"
                  value={editando?.chefe || ''}
                  onChange={(e) => setEditando({ ...editando, chefe: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tempo de Preparo</label>
                <input
                  type="text"
                  placeholder="Ex: 30 min"
                  value={editando?.tempoPreparo || ''}
                  onChange={(e) => setEditando({ ...editando, tempoPreparo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Porções</label>
                <input
                  type="number"
                  placeholder="Ex: 4"
                  value={editando?.porcoes || ''}
                  onChange={(e) => setEditando({ ...editando, porcoes: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={editando?.categoria || 'SALGADO'}
                  onChange={(e) => setEditando({ ...editando, categoria: e.target.value })}
                  required
                >
                  <option value="SALGADO">Salgado</option>
                  <option value="DOCE">Doce</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nova Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditando({ ...editando, imagemFile: e.target.files[0] })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ingredientes (um por linha)</label>
              <textarea
                placeholder="Ex: 200g de farinha&#10;3 ovos&#10;100ml de leite"
                value={editando?.ingredientes || ''}
                onChange={(e) => setEditando({ ...editando, ingredientes: e.target.value })}
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Modo de Preparo (um passo por linha)</label>
              <textarea
                placeholder="Ex: Misture os ingredientes secos&#10;Adicione os ovos&#10;Asse por 30 minutos"
                value={editando?.modoPreparo || ''}
                onChange={(e) => setEditando({ ...editando, modoPreparo: e.target.value })}
                rows="6"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="modal-btn modal-btn-cancel" onClick={fecharEdicao} disabled={salvando}>
                <i className="pi pi-times"></i> Cancelar
              </button>
              <button type="submit" className="modal-btn modal-btn-save" disabled={!botaoSalvarHabilitado}>
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
          titulo="Excluir Receita"
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

export default ReceitasAprovadas;
