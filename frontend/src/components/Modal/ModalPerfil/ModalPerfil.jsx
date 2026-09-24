import { useState, useEffect } from 'react';
import Modal from "../Modal";
import LoaderInline from '../../Global/LoaderInline/LoaderInline';
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import api from '../../../services/api';
import './ModalPerfil.css';

function ModalPerfil({ aberto, onFechar }) {
  const { usuario, setUsuario } = useAuth();
  const { mostrarToast } = useToast();

  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    genero: '', dataCadastro: '', senha: '', confirmarSenha: ''
  });
  const [original, setOriginal] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    setModoEdicao(false);
    setMensagem({ tipo: '', texto: '' });
    setCarregando(false);
    setMostrarSenha(false);
    setMostrarConfirmar(false);

    async function carregarPerfil() {
      setCarregandoPerfil(true);
      try {
        const response = await api.get('/api/perfil/usuario-logado', { silent: true });
        const u = response.data.usuario;

        const dados = {
          nome: u.nome || '',
          email: u.email || '',
          cpf: formatarCpf(u.cpf || ''),
          telefone: formatarTelefone(u.telefone || ''),
          genero: (u.genero || '').toUpperCase(),
          dataCadastro: formatarData(u.dataCadastro),
          senha: '',
          confirmarSenha: ''
        };

        setForm(dados);
        setOriginal(dados);
      } catch {
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar dados do usuário.' });
        mostrarToast('Erro ao carregar dados do usuário.', 'error');
      } finally {
        setCarregandoPerfil(false);
      }
    }

    carregarPerfil();
  }, [aberto]);

  function formatarCpf(cpf) {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  function formatarTelefone(telefone) {
    const digits = telefone.replace(/\D/g, '');
    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }

  function formatarData(data) {
    if (!data) return '';
    try {
      const d = data.split('T')[0];
      const [ano, mes, dia] = d.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch {
      return data;
    }
  }

  function mascaraTelefone(valor) {
    let v = valor.replace(/\D/g, '').substring(0, 11);
    if (v.length > 0) v = '(' + v;
    if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
    if (v.length > 9) v = v.slice(0, 9) + '-' + v.slice(9, 14);
    return v;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensagem({ tipo: '', texto: '' });
  }

  function handleTelefone(e) {
    setForm({ ...form, telefone: mascaraTelefone(e.target.value) });
    setMensagem({ tipo: '', texto: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (form.senha && form.senha !== form.confirmarSenha) {
      setMensagem({ tipo: 'error', texto: 'As senhas não coincidem' });
      mostrarToast('As senhas não coincidem', 'error');
      return;
    }

    setCarregando(true);

    try {
      const dados = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone.replace(/\D/g, ''),
        genero: form.genero
      };

      if (form.senha) {
        dados.senha = form.senha;
        dados.confirmarSenha = form.confirmarSenha;
      }

      const response = await api.post('/api/perfil/editar', dados, { silent: true });

      if (response.data.message?.includes('sucesso')) {
        setMensagem({ tipo: 'success', texto: 'Perfil atualizado com sucesso!' });
        mostrarToast('Perfil atualizado com sucesso!', 'success');

        const novosDados = { ...form, senha: '', confirmarSenha: '' };
        setForm(novosDados);
        setOriginal(novosDados);

        if (setUsuario) {
          setUsuario({ ...usuario, ...dados, senha: undefined, confirmarSenha: undefined });
        }

        setTimeout(() => {
          setModoEdicao(false);
          setMensagem({ tipo: '', texto: '' });
        }, 1500);
      } else {
        const msg = response.data.message || 'Erro ao atualizar';
        setMensagem({ tipo: 'error', texto: msg });
        mostrarToast(msg, 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao atualizar perfil';
      setMensagem({ tipo: 'error', texto: msg });
      mostrarToast(msg, 'error');
    } finally {
      setCarregando(false);
    }
  }

  function toggleEdicao() {
    setModoEdicao(!modoEdicao);
    setMensagem({ tipo: '', texto: '' });
  }

  function handleFechar() {
    setModoEdicao(false);
    setMensagem({ tipo: '', texto: '' });
    setMostrarSenha(false);
    setMostrarConfirmar(false);
    onFechar();
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nomeValido = form.nome.trim().length >= 3;
  const emailValido = emailRegex.test(form.email.trim());
  const telefoneValido = form.telefone.replace(/\D/g, '').length >= 10;
  const generoValido = form.genero.trim() !== '';

  let senhaValida = true;
  if (form.senha || form.confirmarSenha) {
    senhaValida = form.senha.length >= 6 && form.senha === form.confirmarSenha;
  }

  const formularioValido = nomeValido && emailValido && telefoneValido && generoValido && senhaValida;

  const mudou =
    !original ||
    form.nome !== original.nome ||
    form.email !== original.email ||
    form.telefone !== original.telefone ||
    form.genero !== original.genero ||
    form.senha.length > 0 ||
    form.confirmarSenha.length > 0;

  const botaoHabilitado = formularioValido && mudou && !carregando;

  return (
    <Modal aberto={aberto} onFechar={handleFechar} maxWidth="600px">
      <Modal.Header
        titulo="Meu Perfil"
        icone="pi pi-user"
        onFechar={handleFechar}
      />

      <Modal.Body>

        {carregandoPerfil && <LoaderInline texto="Carregando perfil..." />}

        {!carregandoPerfil && !modoEdicao && (
          <div className="user-view-mode">

            <div className="user-view-info">

              <div className="user-view-item">
                <span className="user-view-label">Nome</span>
                <span className="user-view-value">{form.nome || '-'}</span>
              </div>

              <div className="user-view-item">
                <span className="user-view-label">E-mail</span>
                <span className="user-view-value">{form.email || '-'}</span>
              </div>

              <div className="user-view-item">
                <span className="user-view-label">CPF</span>
                <span className="user-view-value">{form.cpf || '-'}</span>
              </div>

              <div className="user-view-item">
                <span className="user-view-label">Telefone</span>
                <span className="user-view-value">{form.telefone || '-'}</span>
              </div>

              <div className="user-view-item">
                <span className="user-view-label">Gênero</span>
                <span className="user-view-value">
                  {form.genero === 'MASCULINO' ? 'Masculino' :
                   form.genero === 'FEMININO' ? 'Feminino' :
                   form.genero === 'OUTRO' ? 'Outro' : '-'}
                </span>
              </div>

              <div className="user-view-item">
                <span className="user-view-label">Data de Cadastro</span>
                <span className="user-view-value">{form.dataCadastro || '-'}</span>
              </div>

            </div>

            <div className="modal-actions">
              <button type="button" className="modal-btn modal-btn-cancel" onClick={handleFechar}>
                <i className="pi pi-times"></i> Fechar
              </button>
              <button type="button" className="modal-btn modal-btn-primary" onClick={toggleEdicao}>
                <i className="pi pi-pencil"></i> Editar Perfil
              </button>
            </div>

          </div>
        )}

        {!carregandoPerfil && modoEdicao && (
          <div className="user-edit-mode">
            <form onSubmit={handleSubmit}>

              <div className="user-form-row">
                <div className="user-form-group">
                  <div className="user-input-float">
                    <input
                      type="text"
                      id="editNome"
                      name="nome"
                      className="user-form-control-float"
                      placeholder=" "
                      value={form.nome}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="editNome">Nome</label>
                    <i className="pi pi-user"></i>
                  </div>
                </div>

                <div className="user-form-group">
                  <div className="user-input-float">
                    <input
                      type="email"
                      id="editEmail"
                      name="email"
                      className="user-form-control-float"
                      placeholder=" "
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="editEmail">E-mail</label>
                    <i className="pi pi-envelope"></i>
                  </div>
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <div className="user-input-float">
                    <input
                      type="text"
                      id="editCpf"
                      className="user-form-control-float"
                      placeholder=" "
                      value={form.cpf}
                      readOnly
                    />
                    <label htmlFor="editCpf">CPF</label>
                    <i className="pi pi-id-card"></i>
                  </div>
                </div>

                <div className="user-form-group">
                  <div className="user-input-float">
                    <input
                      type="tel"
                      id="editTelefone"
                      name="telefone"
                      className="user-form-control-float"
                      placeholder=" "
                      value={form.telefone}
                      onChange={handleTelefone}
                    />
                    <label htmlFor="editTelefone">Telefone</label>
                    <i className="pi pi-phone"></i>
                  </div>
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <div className="user-input-float">
                    <select
                      id="editGenero"
                      name="genero"
                      className="user-form-control-float"
                      value={form.genero}
                      onChange={handleChange}
                    >
                      <option value=""></option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="OUTRO">Outro</option>
                    </select>
                    <label htmlFor="editGenero">Gênero</label>
                    <i className="pi pi-users"></i>
                  </div>
                </div>

                <div className="user-form-group">
                  <div className="user-input-float">
                    <input
                      type="text"
                      id="editDataCadastro"
                      className="user-form-control-float"
                      placeholder=" "
                      value={form.dataCadastro}
                      readOnly
                    />
                    <label htmlFor="editDataCadastro">Data de Cadastro</label>
                    <i className="pi pi-calendar"></i>
                  </div>
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <div className="user-input-float">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      id="editSenha"
                      name="senha"
                      className="user-form-control-float"
                      placeholder=" "
                      value={form.senha}
                      onChange={handleChange}
                    />
                    <label htmlFor="editSenha">Nova Senha</label>
                    <i className="pi pi-lock"></i>
                    <span
                      className={`user-password-toggle pi ${mostrarSenha ? 'pi-eye-slash' : 'pi-eye'}`}
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                    ></span>
                  </div>
                </div>

                <div className="user-form-group">
                  <div className="user-input-float">
                    <input
                      type={mostrarConfirmar ? 'text' : 'password'}
                      id="confirmarSenha"
                      name="confirmarSenha"
                      className="user-form-control-float"
                      placeholder=" "
                      value={form.confirmarSenha}
                      onChange={handleChange}
                    />
                    <label htmlFor="confirmarSenha">Confirmar Senha</label>
                    <i className="pi pi-lock"></i>
                    <span
                      className={`user-password-toggle pi ${mostrarConfirmar ? 'pi-eye-slash' : 'pi-eye'}`}
                      onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    ></span>
                  </div>
                </div>
              </div>

              {mensagem.texto && (
                <div className={`modal-message modal-message-${mensagem.tipo === 'success' ? 'success' : 'error'}`}>
                  <i className={`pi ${mensagem.tipo === 'success' ? 'pi-check-circle' : 'pi-exclamation-circle'}`}></i>
                  {mensagem.texto}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="modal-btn modal-btn-cancel" onClick={toggleEdicao}>
                  <i className="pi pi-times"></i> Cancelar
                </button>
                <button type="submit" className="modal-btn modal-btn-save" disabled={!botaoHabilitado}>
                  {carregando ? (
                    <><i className="pi pi-spin pi-spinner"></i> Salvando...</>
                  ) : (
                    <><i className="pi pi-save"></i> Salvar</>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </Modal.Body>
    </Modal>
  );
}

export default ModalPerfil;
