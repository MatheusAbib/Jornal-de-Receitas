import { useEffect, useId, useState } from 'react';
import Modal from '../Modal';
import BotaoGoogle from '../BotaoGoogle';
import LoaderInline from '../../Global/LoaderInline/LoaderInline';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { vincularGoogle } from '../../../services/authService';
import api, { extrairMensagemErro } from '../../../services/api';
import { listarCamposPendentesDoPerfil } from '../../../utils/perfilIncompleto';
import './ModalPerfil.css';

const googleConfigurado = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());

const generos = {
  MASCULINO: 'Masculino',
  FEMININO: 'Feminino',
  OUTRO: 'Outro',
};

function somenteDigitos(valor) {
  return valor.replace(/\D/g, '');
}

function mascaraCpf(valor) {
  return somenteDigitos(valor).slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

function mascaraTelefone(valor) {
  const digitos = somenteDigitos(valor).slice(0, 11);

  if (!digitos) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;

  const divisao = digitos.length <= 10 ? 6 : 7;

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, divisao)}-${digitos.slice(divisao)}`;
}

function criarFormulario(usuario) {
  return {
    nome: usuario.nome ?? '',
    email: usuario.email ?? '',
    cpf: usuario.cpf ?? '',
    telefone: usuario.telefone ? mascaraTelefone(usuario.telefone) : '',
    genero: (usuario.genero ?? '').toUpperCase(),
    senha: '',
    confirmarSenha: '',
  };
}

function formatarData(data) {
  if (!data) return '';

  const [ano, mes, dia] = data.split('T')[0].split('-');

  return dia && mes && ano ? `${dia}/${mes}/${ano}` : data;
}

function CampoPerfil({ id, label, icone, children, ...props }) {
  return (
    <div className="user-form-group">
      <div className="user-input-float">
        <input
          id={id}
          className="user-form-control-float"
          placeholder=" "
          {...props}
        />
        <label htmlFor={id}>{label}</label>
        <i className={`pi ${icone}`} aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

function ModalPerfil({ aberto, onFechar }) {
  const { setUsuario } = useAuth();
  const { mostrarToast } = useToast();
  const tituloGoogleId = useId();
  const painelVinculoId = useId();

  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [modoVinculo, setModoVinculo] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [vinculando, setVinculando] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    let ativo = true;

    setPerfil(null);
    setForm(null);
    setModoEdicao(false);
    setModoVinculo(false);
    setSenhaAtual('');
    setMensagem(null);
    setMostrarSenha(false);
    setMostrarConfirmar(false);
    setCarregandoPerfil(true);

    async function carregarPerfil() {
      try {
        const response = await api.get('/api/perfil/usuario-logado', { silent: true });
        const usuario = response.data.usuario;

        if (!ativo) return;

        if (!usuario) {
          setMensagem({
            tipo: 'error',
            texto: 'Entre novamente para acessar seu perfil.',
          });
          return;
        }

        setPerfil(usuario);
        setForm(criarFormulario(usuario));
      } catch (err) {
        if (ativo) {
          setMensagem({
            tipo: 'error',
            texto: extrairMensagemErro(err, 'Erro ao carregar dados do usuário.'),
          });
        }
      } finally {
        if (ativo) setCarregandoPerfil(false);
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [aberto]);

  const original = perfil ? criarFormulario(perfil) : null;
  const camposPendentes = listarCamposPendentesDoPerfil(perfil);
  const ocupado = carregando || vinculando;
  const cpfMudou = form && original && form.cpf !== original.cpf;
  const cpfValido = !cpfMudou || !form.cpf || somenteDigitos(form.cpf).length === 11;
  const telefone = somenteDigitos(form?.telefone ?? '');
  const telefoneValido = !telefone || telefone.length === 10 || telefone.length === 11;
  const senhaValida = (!form?.senha && !form?.confirmarSenha) ||
    (form?.senha.length >= 6 && form.senha === form.confirmarSenha);

  const mudou = form && original && (
    form.nome !== original.nome ||
    form.email !== original.email ||
    cpfMudou ||
    form.telefone !== original.telefone ||
    form.genero !== original.genero ||
    form.senha ||
    form.confirmarSenha
  );

  const podeSalvar = Boolean(
    mudou &&
    (form.nome === original.nome || form.nome.trim().length >= 3) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    cpfValido &&
    telefoneValido &&
    senhaValida &&
    !ocupado
  );

  function alternarEdicao() {
    if (ocupado) return;

    setForm(criarFormulario(perfil));
    setMensagem(null);
    setMostrarSenha(false);
    setMostrarConfirmar(false);
    setModoVinculo(false);
    setSenhaAtual('');
    setModoEdicao(valor => !valor);
  }

  function alternarVinculo() {
    if (ocupado) return;

    setSenhaAtual('');
    setMensagem(null);
    setModoVinculo(valor => !valor);
  }

  function handleFechar() {
    if (ocupado) return;

    setSenhaAtual('');
    setModoVinculo(false);
    setForm(null);
    onFechar();
  }

  function atualizarCampo(nome, valor) {
    setForm(anterior => ({ ...anterior, [nome]: valor }));
    setMensagem(null);
  }

  function handleChange(evento) {
    atualizarCampo(evento.target.name, evento.target.value);
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    if (!podeSalvar) return;

    setCarregando(true);
    setMensagem(null);

    try {
      const dados = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        genero: form.genero,
      };

      if (form.telefone !== original.telefone) {
        dados.telefone = telefone;
      }

      if (cpfMudou) {
        dados.cpf = somenteDigitos(form.cpf) || null;
      }

      if (form.senha) {
        dados.senha = form.senha;
        dados.confirmarSenha = form.confirmarSenha;
      }

      const response = await api.post('/api/perfil/editar', dados, { silent: true });
      const atualizado = response.data.usuario;

      if (!atualizado) {
        throw new Error(response.data.message || 'Erro ao atualizar o perfil.');
      }

      setPerfil(atualizado);
      setForm(criarFormulario(atualizado));
      setUsuario(atualizado);
      setModoEdicao(false);
      mostrarToast('Perfil atualizado com sucesso!', 'success');
    } catch (err) {
      const texto = extrairMensagemErro(err, 'Erro ao atualizar o perfil.');

      setMensagem({ tipo: 'error', texto });
      mostrarToast(texto, 'error');
    } finally {
      setCarregando(false);
    }
  }

  async function handleVincularGoogle(credential) {
    try {
      const resultado = await vincularGoogle(credential, senhaAtual);

      if (!resultado.success) {
        throw new Error(resultado.message || 'Não foi possível vincular o Google.');
      }

      setPerfil(anterior => ({ ...anterior, googleVinculado: true }));
      setUsuario(anterior => anterior ? { ...anterior, googleVinculado: true } : anterior);
      setModoVinculo(false);
      mostrarToast(resultado.message || 'Conta Google vinculada com sucesso!', 'success');
    } finally {
      setSenhaAtual('');
    }
  }

  const informacoes = perfil ? [
    ['Nome', perfil.nome],
    ['E-mail', perfil.email],
    ['CPF', perfil.cpf ? mascaraCpf(perfil.cpf) : ''],
    ['Telefone', perfil.telefone ? mascaraTelefone(perfil.telefone) : ''],
    ['Gênero', generos[(perfil.genero ?? '').toUpperCase()]],
    ['Data de Cadastro', formatarData(perfil.dataCadastro)],
  ] : [];

  return (
    <Modal aberto={aberto} onFechar={handleFechar} maxWidth="600px">
      <Modal.Header titulo="Meu Perfil" icone="pi pi-user" onFechar={handleFechar} />

      <Modal.Body>
        {carregandoPerfil && <LoaderInline texto="Carregando perfil..." />}

        {mensagem && (
          <div className={`modal-message modal-message-${mensagem.tipo}`} role="alert">
            <i className="pi pi-exclamation-circle" aria-hidden="true" />
            {mensagem.texto}
          </div>
        )}

        {!carregandoPerfil && perfil && !modoEdicao && (
          <div className="user-view-mode">
            {camposPendentes.length > 0 && (
              <div className="user-profile-notice">
                <i className="pi pi-exclamation-circle" aria-hidden="true" />
                <div>
                  <strong>Complete seu perfil</strong>
                  <p>
                    Em <strong>Editar Perfil</strong>, você pode adicionar{' '}
                    {new Intl.ListFormat('pt-BR', { type: 'conjunction' }).format(camposPendentes)}
                    {' '}para manter seus dados atualizados.
                  </p>
                </div>
              </div>
            )}

            <div className="user-view-info">
              {informacoes.map(([label, valor]) => (
                <div key={label} className="user-view-item">
                  <span className="user-view-label">{label}</span>
                  <span className="user-view-value">{valor || '-'}</span>
                </div>
              ))}
            </div>

            {(perfil.googleVinculado || googleConfigurado) && (
              <section className="user-google" aria-labelledby={tituloGoogleId}>
                <div className="user-google-cabecalho">
                  <div className="user-google-identificacao">
                    <span className="user-google-icone" aria-hidden="true">
                      <i className={`pi ${perfil.googleVinculado ? 'pi-check' : 'pi-link'}`} />
                    </span>

                    <div>
                      <h3 id={tituloGoogleId}>Conta Google</h3>
                      <p>
                        {perfil.googleVinculado
                          ? 'Vinculada ao seu perfil'
                          : 'Vincule para entrar com o Google.'}
                      </p>
                    </div>
                  </div>

                  {googleConfigurado && perfil.googleVinculado === false && (
                    <button
                      type="button"
                      className="user-google-acao"
                      onClick={alternarVinculo}
                      disabled={ocupado}
                      aria-expanded={modoVinculo}
                      aria-controls={painelVinculoId}
                    >
                      {modoVinculo ? 'Cancelar vínculo' : 'Vincular conta'}
                      <i
                        className={`pi ${modoVinculo ? 'pi-minus' : 'pi-arrow-right'}`}
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>

                <div id={painelVinculoId} hidden={!modoVinculo}>
                  {aberto && modoVinculo && (
                    <div className="user-google-vinculo">
                      <p className="user-google-orientacao">
                        Digite sua senha atual do Jornal e selecione a conta Google com o mesmo e-mail do seu perfil.
                      </p>

                      <CampoPerfil
                        id="vinculoSenhaAtual"
                        label="Senha atual"
                        icone="pi-lock"
                        type="password"
                        autoComplete="current-password"
                        value={senhaAtual}
                        disabled={vinculando}
                        onChange={evento => setSenhaAtual(evento.target.value)}
                      />

                      <BotaoGoogle
                        onCredencial={handleVincularGoogle}
                        onProcessando={setVinculando}
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={handleFechar}
                disabled={ocupado}
              >
                <i className="pi pi-times" aria-hidden="true" /> Fechar
              </button>

              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={alternarEdicao}
                disabled={ocupado}
              >
                <i className="pi pi-pencil" aria-hidden="true" /> Editar Perfil
              </button>
            </div>
          </div>
        )}

        {!carregandoPerfil && modoEdicao && form && (
          <div className="user-edit-mode">
            <form onSubmit={handleSubmit}>
              <div className="user-form-row">
                <CampoPerfil
                  id="editNome"
                  label="Nome"
                  icone="pi-user"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

                <CampoPerfil
                  id="editEmail"
                  label="E-mail"
                  icone="pi-envelope"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="user-form-row">
                <CampoPerfil
                  id="editCpf"
                  label="CPF (opcional)"
                  icone="pi-id-card"
                  name="cpf"
                  value={form.cpf}
                  onChange={evento => atualizarCampo('cpf', mascaraCpf(evento.target.value))}
                  inputMode="numeric"
                  maxLength={14}
                />

                <CampoPerfil
                  id="editTelefone"
                  label="Telefone"
                  icone="pi-phone"
                  name="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={evento => atualizarCampo('telefone', mascaraTelefone(evento.target.value))}
                  autoComplete="tel"
                  maxLength={15}
                />
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
                      {Object.entries(generos).map(([valor, label]) => (
                        <option key={valor} value={valor}>{label}</option>
                      ))}
                    </select>
                    <label htmlFor="editGenero">Gênero</label>
                    <i className="pi pi-users" aria-hidden="true" />
                  </div>
                </div>

                <CampoPerfil
                  id="editDataCadastro"
                  label="Data de Cadastro"
                  icone="pi-calendar"
                  value={formatarData(perfil.dataCadastro)}
                  readOnly
                />
              </div>

              <div className="user-form-row">
                <CampoPerfil
                  id="editSenha"
                  label="Nova Senha"
                  icone="pi-lock"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={form.senha}
                  onChange={handleChange}
                  autoComplete="new-password"
                >
                  <button
                    type="button"
                    className={`user-password-toggle pi ${mostrarSenha ? 'pi-eye-slash' : 'pi-eye'}`}
                    aria-label={mostrarSenha ? 'Ocultar nova senha' : 'Mostrar nova senha'}
                    onClick={() => setMostrarSenha(valor => !valor)}
                  />
                </CampoPerfil>

                <CampoPerfil
                  id="confirmarSenha"
                  label="Confirmar Senha"
                  icone="pi-lock"
                  name="confirmarSenha"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  autoComplete="new-password"
                >
                  <button
                    type="button"
                    className={`user-password-toggle pi ${mostrarConfirmar ? 'pi-eye-slash' : 'pi-eye'}`}
                    aria-label={mostrarConfirmar ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                    onClick={() => setMostrarConfirmar(valor => !valor)}
                  />
                </CampoPerfil>
              </div>

              {cpfMudou && !cpfValido && (
                <p role="status">Informe um CPF com 11 dígitos ou deixe o campo em branco.</p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={alternarEdicao}
                  disabled={ocupado}
                >
                  <i className="pi pi-times" aria-hidden="true" /> Cancelar
                </button>

                <button
                  type="submit"
                  className="modal-btn modal-btn-save"
                  disabled={!podeSalvar}
                >
                  <i
                    className={`pi ${carregando ? 'pi-spin pi-spinner' : 'pi-save'}`}
                    aria-hidden="true"
                  />
                  {' '}{carregando ? 'Salvando...' : 'Salvar'}
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