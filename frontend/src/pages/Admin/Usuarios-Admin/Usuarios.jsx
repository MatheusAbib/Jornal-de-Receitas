import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import Modal from '../../../components/Modal/Modal';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import usePolling from '../../../hooks/usePolling';
import api, { extrairMensagemErro } from '../../../services/api';
import { getCache, setCache } from '../../../services/cache';
import './Usuarios.css';

const CACHE_KEY = 'admin-usuarios';

const colunas = ['ID', 'Nome', 'E-mail', 'CPF', 'Cadastro', 'Status', 'Ações'];
const largurasSkeleton = ['xs', 'md', 'lg', 'md', 'md', 'sm', 'sm'];

function formatarTelefone(valor) {
  let telefone = String(valor || '').replace(/\D/g, '').substring(0, 11);

  if (telefone.length > 0) telefone = '(' + telefone;
  if (telefone.length > 3) telefone = telefone.slice(0, 3) + ') ' + telefone.slice(3);
  if (telefone.length > 9) telefone = telefone.slice(0, 9) + '-' + telefone.slice(9, 14);

  return telefone;
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

  const ehAdmin = usuario?.role === 'ADMIN';
  const carregandoTela = carregandoAuth || carregando;
  const modalAberto = Boolean(editando || excluindo);

  async function carregar(silencioso = false) {
    if (!silencioso) setCarregando(true);

    try {
      const response = await api.get('/api/usuarios?size=100', {
        silent: silencioso
      });

      const lista = response.data.usuarios || [];
      setUsuarios(lista);
      setCache(CACHE_KEY, lista);
    } catch (erro) {
      console.error(erro);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    if (carregandoAuth) return;

    if (!ehAdmin) {
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
  }, [usuario, ehAdmin, carregandoAuth, navigate]);

  usePolling(
    () => carregar(true),
    10000,
    ehAdmin && !carregandoTela && !modalAberto
  );

  async function toggleAtivo(id) {
    try {
      const response = await api.patch(`/api/usuarios/${id}/ativar`, null, {
        silent: true
      });

      const atualizado = response.data.usuario;

      setUsuarios(anteriores => {
        const lista = anteriores.map(item => item.id === id ? atualizado : item);
        setCache(CACHE_KEY, lista);
        return lista;
      });

      mostrarToast(
        atualizado.ativo
          ? `Usuário ${atualizado.nome} ativado.`
          : `Usuário ${atualizado.nome} desativado.`,
        'success'
      );
    } catch (erro) {
      mostrarToast(
        extrairMensagemErro(erro, 'Erro ao alterar status do usuário.'),
        'error'
      );
    }
  }

  async function salvarEdicao(event) {
    event.preventDefault();

    if (!botaoSalvarHabilitado) return;

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

      setUsuarios(anteriores => {
        const lista = anteriores.map(item =>
          item.id === editando.id ? response.data.usuario : item
        );
        setCache(CACHE_KEY, lista);
        return lista;
      });

      mostrarToast('Usuário atualizado com sucesso!', 'success');
      fecharEdicao();
    } catch (erro) {
      mostrarToast(
        extrairMensagemErro(erro, 'Erro ao atualizar usuário.'),
        'error'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!excluindo || excluindoAgora) return;

    setExcluindoAgora(true);

    try {
      await api.delete(`/api/usuarios/${excluindo.id}`, { silent: true });

      setUsuarios(anteriores => {
        const lista = anteriores.filter(item => item.id !== excluindo.id);
        setCache(CACHE_KEY, lista);
        return lista;
      });

      mostrarToast('Usuário excluído com sucesso!', 'success');
      setExcluindo(null);
    } catch (erro) {
      mostrarToast(
        extrairMensagemErro(erro, 'Erro ao excluir usuário.'),
        'error'
      );
    } finally {
      setExcluindoAgora(false);
    }
  }

  function abrirEdicao(item) {
    const dados = {
      ...item,
      senha: '',
      telefone: formatarTelefone(item.telefone)
    };

    setEditando(dados);
    setOriginalEdicao({ ...dados });
  }

  function fecharEdicao() {
    setEditando(null);
    setOriginalEdicao(null);
  }

  function handleTelefone(event) {
    setEditando({ ...editando, telefone: formatarTelefone(event.target.value) });
  }

  const termo = busca.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter(item =>
    item.nome?.toLowerCase().includes(termo) ||
    item.email?.toLowerCase().includes(termo) ||
    item.cpf?.includes(termo)
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nomeValido = (editando?.nome || '').trim().length >= 3;
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
    Boolean(editando.senha)
  );

  const botaoSalvarHabilitado = Boolean(editando && formValido && mudou && !salvando);

  if (!carregandoAuth && !ehAdmin) return null;

  return (
    <AdminLayout
  titulo="Usuários"
  descricao="Consulte as contas cadastradas e gerencie o acesso ao Jornal."
  acao={
    <div className="admin-topbar-actions">
      <span>
        <i className="pi pi-users" aria-hidden="true" /> Total:{' '}
        <strong>{carregandoTela ? '…' : usuarios.length}</strong>
      </span>

      <div className="admin-search-box">
        <i className="pi pi-search" aria-hidden="true" />
        <input
          type="search"
          aria-label="Buscar usuário por nome, e-mail ou CPF"
          placeholder="Buscar usuário..."
          value={busca}
          onChange={event => setBusca(event.target.value)}
          disabled={carregandoTela}
        />
      </div>
    </div>
  }
>
      <div className="admin-usuarios">

        <div className="admin-table-wrapper" aria-busy={carregandoTela}>
          <div className="admin-table-container">
            <div className="admin-table-header">
              <div className="count" role="status">
                <i className="pi pi-list" aria-hidden="true" />{' '}
                {carregandoTela
                  ? 'Carregando…'
                  : `${usuariosFiltrados.length} ${usuariosFiltrados.length === 1 ? 'registro' : 'registros'}`}
              </div>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-table" aria-label="Usuários cadastrados">
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
                    Array.from({ length: 8 }, (_, indice) => (
                      <tr key={indice} aria-hidden="true">
                        {colunas.map((coluna, colunaIndice) => (
                          <td key={coluna} data-label={coluna}>
                            <div className={`skeleton-line skeleton-line-${largurasSkeleton[colunaIndice]}`} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    usuariosFiltrados.map(item => (
                      <tr key={item.id}>
                        <td data-label="ID">{item.id}</td>
                        <td data-label="Nome">{item.nome}</td>
                        <td data-label="E-mail">{item.email}</td>
                        <td data-label="CPF">{item.cpf || '—'}</td>
                        <td data-label="Cadastro">{item.dataCadastro}</td>
                        <td data-label="Status">
                          <span className={`status-badge ${item.ativo ? 'active' : 'inactive'}`}>
                            {item.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>

                        <td data-label="Ações" className="text-center">
                          <div className="actions-group">
                            <button
                              type="button"
                              className="action-btn btn-edit"
                              aria-label={`Editar ${item.nome}`}
                              title="Editar usuário"
                              onClick={() => abrirEdicao(item)}
                            >
                              <i className="pi pi-pencil" aria-hidden="true" />
                            </button>

                            <label className="switch">
                              <input
                                type="checkbox"
                                role="switch"
                                aria-label={`Conta ativa de ${item.nome}`}
                                checked={Boolean(item.ativo)}
                                onChange={() => toggleAtivo(item.id)}
                              />
                              <span className="slider round" aria-hidden="true" />
                            </label>

                            <button
                              type="button"
                              className="action-btn btn-delete"
                              aria-label={`Excluir ${item.nome}`}
                              title="Excluir usuário"
                              onClick={() => setExcluindo(item)}
                            >
                              <i className="pi pi-trash" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!carregandoTela && usuariosFiltrados.length === 0 && (
              <div className="admin-empty">
                <i className="pi pi-users" aria-hidden="true" />
                <h3>Nenhum usuário encontrado</h3>
                {termo && <p>Tente buscar por outro nome, e-mail ou CPF.</p>}
              </div>
            )}
          </div>
        </div>

        <Modal
          aberto={Boolean(editando)}
          onFechar={fecharEdicao}
          maxWidth="600px"
          className="admin-usuarios"
        >
          <Modal.Header
            titulo="Editar usuário"
            icone="pi pi-user-edit"
            onFechar={fecharEdicao}
          />

          <Modal.Body>
            <form onSubmit={salvarEdicao}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="admin-usuario-nome">Nome</label>
                  <input
                    id="admin-usuario-nome"
                    type="text"
                    value={editando?.nome || ''}
                    onChange={event => setEditando({ ...editando, nome: event.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-usuario-email">E-mail</label>
                  <input
                    id="admin-usuario-email"
                    type="email"
                    value={editando?.email || ''}
                    onChange={event => setEditando({ ...editando, email: event.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-usuario-telefone">Telefone</label>
                  <input
                    id="admin-usuario-telefone"
                    type="tel"
                    value={editando?.telefone || ''}
                    onChange={handleTelefone}
                    placeholder="(11) 98765-4321"
                    maxLength={15}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-usuario-genero">Gênero</label>
                  <select
                    id="admin-usuario-genero"
                    value={editando?.genero || ''}
                    onChange={event => setEditando({ ...editando, genero: event.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="admin-usuario-tipo">Tipo</label>
                  <select
                    id="admin-usuario-tipo"
                    value={editando?.role || 'USER'}
                    onChange={event => setEditando({ ...editando, role: event.target.value })}
                  >
                    <option value="USER">Usuário</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="admin-usuario-senha">Nova senha</label>
                  <input
                    id="admin-usuario-senha"
                    type="password"
                    autoComplete="new-password"
                    value={editando?.senha || ''}
                    onChange={event => setEditando({ ...editando, senha: event.target.value })}
                    placeholder="Deixe em branco para não alterar"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={fecharEdicao}
                  disabled={salvando}
                >
                  <i className="pi pi-times" aria-hidden="true" /> Cancelar
                </button>

                <button
                  type="submit"
                  className="modal-btn modal-btn-save"
                  disabled={!botaoSalvarHabilitado}
                >
                  {salvando ? (
                    <><i className="pi pi-spin pi-spinner" aria-hidden="true" /> Salvando…</>
                  ) : (
                    <><i className="pi pi-save" aria-hidden="true" /> Salvar</>
                  )}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        <Modal
          aberto={Boolean(excluindo)}
          onFechar={() => setExcluindo(null)}
          maxWidth="480px"
          className="admin-usuarios"
        >
          <Modal.Header
            titulo="Excluir usuário"
            icone="pi pi-exclamation-triangle"
            onFechar={() => setExcluindo(null)}
          />

          <Modal.Body>
            <p className="admin-modal-delete-text">
              Tem certeza que deseja excluir <strong>{excluindo?.nome}</strong>?
            </p>

            <p className="admin-modal-delete-warning">
              <i className="pi pi-exclamation-circle" aria-hidden="true" />
              Esta ação não pode ser desfeita.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={() => setExcluindo(null)}
                disabled={excluindoAgora}
              >
                <i className="pi pi-times" aria-hidden="true" /> Cancelar
              </button>

              <button
                type="button"
                className="modal-btn modal-btn-danger"
                onClick={confirmarExclusao}
                disabled={excluindoAgora}
              >
                {excluindoAgora ? (
                  <><i className="pi pi-spin pi-spinner" aria-hidden="true" /> Excluindo…</>
                ) : (
                  <><i className="pi pi-trash" aria-hidden="true" /> Excluir</>
                )}
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default Usuarios;