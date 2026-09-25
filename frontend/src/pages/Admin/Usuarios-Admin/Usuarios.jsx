import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from "../../../components/Admin/AdminLayout/AdminLayout";
import Modal from "../../../components/Modal/Modal";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import usePolling from "../../../hooks/usePolling";
import api, { extrairMensagemErro } from "../../../services/api";
import { getCache, setCache } from "../../../services/cache";
import './Usuarios.css';

const CACHE_KEY = 'admin-usuarios';

function formatarTelefone(valor) {
  let v = String(valor || '').replace(/\D/g, '').substring(0, 11);
  if (v.length > 0) v = '(' + v;
  if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
  if (v.length > 9) v = v.slice(0, 9) + '-' + v.slice(9, 14);
  return v;
}

function Usuarios() {
  const navigate = useNavigate();
  const { usuario, carregando: carregandoAuth } = useAuth();
  const { mostrarToast } = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(null);
  const [originalEdicao, setOriginalEdicao] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindoAgora, setExcluindoAgora] = useState(false);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const response = await api.get('/api/usuarios?size=100', { silent: silencioso });
      const lista = response.data.usuarios || [];
      setUsuarios(lista);
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
      setUsuarios(cached);
      setCarregando(false);
      carregar(true);
    } else {
      carregar();
    }
  }, [usuario, carregandoAuth, navigate]);

  const modalAberto = !!editando || !!excluindo;

  usePolling(() => carregar(true), 10000, !carregando && !carregandoAuth && !modalAberto);

  async function toggleAtivo(id) {
    try {
      const response = await api.patch(`/api/usuarios/${id}/ativar`, null, { silent: true });
      const atualizado = response.data.usuario;

      setUsuarios(prev => {
        const nova = prev.map(u => u.id === id ? atualizado : u);
        setCache(CACHE_KEY, nova);
        return nova;
      });

      mostrarToast(
        atualizado.ativo
          ? `Usuário ${atualizado.nome} ativado.`
          : `Usuário ${atualizado.nome} desativado.`,
        'success'
      );
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao alterar status do usuário.');
      mostrarToast(msg, 'error');
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    setSalvando(true);

    try {
      const response = await api.put(`/api/usuarios/${editando.id}`, {
        nome: editando.nome,
        email: editando.email,
        telefone: editando.telefone.replace(/\D/g, ''),
        genero: editando.genero,
        role: editando.role,
        senha: editando.senha || undefined
      }, { silent: true });

      setUsuarios(prev => {
        const nova = prev.map(u => u.id === editando.id ? response.data.usuario : u);
        setCache(CACHE_KEY, nova);
        return nova;
      });
      mostrarToast('Usuário atualizado com sucesso!', 'success');
      setEditando(null);
      setOriginalEdicao(null);
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao atualizar usuário.');
      mostrarToast(msg, 'error');
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return;

    setExcluindoAgora(true);
    try {
      await api.delete(`/api/usuarios/${excluindo.id}`, { silent: true });
      setUsuarios(prev => {
        const nova = prev.filter(u => u.id !== excluindo.id);
        setCache(CACHE_KEY, nova);
        return nova;
      });
      mostrarToast('Usuário excluído com sucesso!', 'success');
      setExcluindo(null);
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao excluir usuário.');
      mostrarToast(msg, 'error');
    } finally {
      setExcluindoAgora(false);
    }
  }

  function abrirEdicao(u) {
    const dados = { ...u, senha: '', telefone: formatarTelefone(u.telefone || '') };
    setEditando(dados);
    setOriginalEdicao({ ...dados });
  }

  function fecharEdicao() {
    setEditando(null);
    setOriginalEdicao(null);
  }

  function handleTelefone(e) {
    setEditando({ ...editando, telefone: formatarTelefone(e.target.value) });
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const termo = busca.toLowerCase();
    return (
      u.nome?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo) ||
      u.cpf?.includes(termo)
    );
  });

  if (carregandoAuth || carregando) {
    return (
      <AdminLayout>
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#8b0000' }}></i>
        </div>
      </AdminLayout>
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nomeValido = editando?.nome?.trim().length >= 3;
  const emailValido = emailRegex.test(editando?.email?.trim() || '');
  const telefoneValido = (editando?.telefone || '').replace(/\D/g, '').length >= 10;
  const generoValido = (editando?.genero || '').trim() !== '';
  const senhaValida = !editando?.senha || editando.senha.length >= 6;

  const formValido = nomeValido && emailValido && telefoneValido && generoValido && senhaValida;

  const mudou = editando && originalEdicao && (
    editando.nome !== originalEdicao.nome ||
    editando.email !== originalEdicao.email ||
    editando.telefone !== originalEdicao.telefone ||
    editando.genero !== originalEdicao.genero ||
    editando.role !== originalEdicao.role ||
    (editando.senha || '').length > 0
  );

  const botaoSalvarHabilitado = editando && formValido && mudou && !salvando;

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1><i className="pi pi-users"></i> Usuários</h1>
        <div className="admin-topbar-actions">
          <span><i className="pi pi-user"></i> Total: <strong>{usuarios.length}</strong></span>
          <div className="admin-search-box">
            <i className="pi pi-search"></i>
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-container">

          <div className="admin-table-header">
            <div className="count">
              <i className="pi pi-list"></i> {usuariosFiltrados.length} registros
            </div>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Cadastro</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(u => (
                  <tr key={u.id}>
                    <td data-label="ID">{u.id}</td>
                    <td data-label="Nome">{u.nome}</td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="CPF">{u.cpf}</td>
                    <td data-label="Cadastro">{u.dataCadastro}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${u.ativo ? 'active' : 'inactive'}`}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td data-label="Ações" className="text-center">
                      <div className="actions-group">

                        <button
                          type="button"
                          className="action-btn btn-edit"
                          onClick={() => abrirEdicao(u)}
                        >
                          <i className="pi pi-pencil"></i>
                        </button>

                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={u.ativo}
                            onChange={() => toggleAtivo(u.id)}
                          />
                          <span className="slider round"></span>
                        </label>

                        <button
                          type="button"
                          className="action-btn btn-delete"
                          onClick={() => setExcluindo(u)}
                        >
                          <i className="pi pi-trash"></i>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usuariosFiltrados.length === 0 && (
            <div className="admin-empty">
              <i className="pi pi-users"></i>
              <h3>Nenhum usuário encontrado</h3>
              <p>Tente ajustar os filtros de busca</p>
            </div>
          )}

        </div>
      </div>

      <Modal aberto={!!editando} onFechar={fecharEdicao} maxWidth="600px">
        <Modal.Header
          titulo="Editar Usuário"
          icone="pi pi-user-edit"
          onFechar={fecharEdicao}
        />

        <Modal.Body>
          <form onSubmit={salvarEdicao}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={editando?.nome || ''}
                  onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editando?.email || ''}
                  onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={editando?.telefone || ''}
                  onChange={handleTelefone}
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                />
              </div>

              <div className="form-group">
                <label>Gênero</label>
                <select
                  value={editando?.genero || ''}
                  onChange={(e) => setEditando({ ...editando, genero: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={editando?.role || 'USER'}
                  onChange={(e) => setEditando({ ...editando, role: e.target.value })}
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nova Senha</label>
                <input
                  type="password"
                  value={editando?.senha || ''}
                  onChange={(e) => setEditando({ ...editando, senha: e.target.value })}
                  placeholder="Deixe em branco para não alterar"
                />
              </div>
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
          titulo="Excluir Usuário"
          icone="pi pi-exclamation-triangle"
          onFechar={() => setExcluindo(null)}
        />

        <Modal.Body>
          <p className="admin-modal-delete-text">
            Tem certeza que deseja excluir <strong>{excluindo?.nome}</strong>?
          </p>
          <p className="admin-modal-delete-warning">
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

export default Usuarios;
