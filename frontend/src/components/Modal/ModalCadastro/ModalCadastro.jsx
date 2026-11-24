import { useState } from 'react';
import Modal from '../Modal';
import BotaoGoogle from '../BotaoGoogle';
import Button from '../../Home/Button/Button';
import Input from '../../Home/Input/Input';
import { cadastrar } from '../../../services/authService';
import { extrairMensagemErro } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './ModalCadastro.css';

const dadosIniciais = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
};

function ModalCadastro({ aberto, onFechar, onIrParaLogin }) {
  const { login, loginComGoogle } = useAuth();
  const { mostrarToast } = useToast();

  const [dados, setDados] = useState(dadosIniciais);
  const [alerta, setAlerta] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [processandoGoogle, setProcessandoGoogle] = useState(false);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const ocupado = carregando || processandoGoogle;
  const nomeValido = dados.nome.trim().length >= 3;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim());
  const senhaValida = dados.senha.trim().length >= 6;
  const confirmarValido = dados.confirmarSenha === dados.senha;

  let erroSenha = '';
  if ((dados.senha || dados.confirmarSenha) && !senhaValida) {
    erroSenha = 'A senha deve ter pelo menos 6 caracteres.';
  } else if (dados.confirmarSenha && !confirmarValido) {
    erroSenha = 'As senhas não coincidem.';
  }

  const botaoHabilitado =
    nomeValido &&
    emailValido &&
    senhaValida &&
    confirmarValido &&
    !ocupado &&
    !cadastroConcluido;

  function limparFormulario() {
    setDados(dadosIniciais);
    setAlerta(null);
    setMostrarSenha(false);
    setMostrarConfirmar(false);
    setCadastroConcluido(false);
  }

  function handleFechar() {
    if (ocupado) return;

    limparFormulario();
    onFechar();
  }

  function handleIrParaLogin() {
    if (ocupado) return;

    handleFechar();
    onIrParaLogin();
  }

  function handleChange(evento) {
    const { name, value } = evento.target;
    setDados(anterior => ({ ...anterior, [name]: value }));
    setAlerta(null);
  }

  function mostrarErro(mensagem) {
    setAlerta({ tipo: 'error', texto: mensagem });
    mostrarToast(mensagem, 'error');
  }

  function concluirLogin(resultado, mensagem) {
    mostrarToast(mensagem, 'success');
    limparFormulario();
    onFechar();

    if (resultado.role === 'ADMIN') {
      window.location.href = '/admin/dashboard';
    }
  }

  async function handleLoginGoogle(credential) {
    setAlerta(null);

    const resultado = await loginComGoogle(credential);
    if (!resultado.success) {
      mostrarErro(resultado.message || 'Não foi possível continuar com o Google.');
      return;
    }

    concluirLogin(resultado, 'Você entrou com sua conta Google!');
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (!botaoHabilitado) return;

    const email = dados.email.trim();
    const senha = dados.senha;

    setAlerta(null);
    setCarregando(true);

    try {
      const cadastro = await cadastrar({
        nome: dados.nome.trim(),
        email,
        senha,
      });

      if (!cadastro.success) {
        mostrarErro(cadastro.message || 'Não foi possível realizar o cadastro.');
        return;
      }

      setCadastroConcluido(true);
      setDados(anterior => ({ ...anterior, senha: '', confirmarSenha: '' }));

      try {
        const resultado = await login(email, senha);

        if (resultado.success) {
          concluirLogin(resultado, 'Conta criada com sucesso! Você já está logado.');
          return;
        }
      } catch {
        setMostrarSenha(false);
        setMostrarConfirmar(false);
      }

      setAlerta({
        tipo: 'info',
        texto: 'Sua conta foi criada. Clique em Fazer login para acessar.',
      });
    } catch (err) {
      mostrarErro(extrairMensagemErro(err, 'Não foi possível realizar o cadastro.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={handleFechar}
      maxWidth="640px"
      className="cadastro-modal"
    >
      <Modal.Header
        titulo="Criar conta"
        icone="pi pi-user-plus"
        onFechar={handleFechar}
      />

      <Modal.Body className="cadastro-modal-body">
        <div className="cadastro-intro">
          <h3>Faça parte do nosso jornal</h3>
          <p>Crie sua conta para salvar receitas, organizar seus favoritos e compartilhar suas próprias preparações.</p>
        </div>

        {alerta && (
          <div
            className={`modal-message modal-message-${alerta.tipo}`}
            role={alerta.tipo === 'error' ? 'alert' : 'status'}
          >
            <i
              className={`pi ${alerta.tipo === 'error' ? 'pi-exclamation-circle' : 'pi-info-circle'}`}
              aria-hidden="true"
            />
            <span>{alerta.texto}</span>
          </div>
        )}

        {aberto && !carregando && !cadastroConcluido && (
          <BotaoGoogle
            onCredencial={handleLoginGoogle}
            onProcessando={setProcessandoGoogle}
            variante="cadastro"
            titulo="Cadastre-se com o Google"
          />
        )}

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="cadastro-secao">
            <div className="cadastro-secao-header">
              <span className="cadastro-secao-numero">01</span>
              <h4>Dados pessoais</h4>
            </div>

            <div className="cadastro-form-group">
              <Input
                id="cadastroNome"
                label="Nome completo"
                name="nome"
                icon="pi pi-user"
                value={dados.nome}
                onChange={handleChange}
                autoComplete="name"
                disabled={ocupado || cadastroConcluido}
                required
              />
            </div>

            <div className="cadastro-form-group">
              <Input
                id="cadastroEmail"
                label="E-mail"
                name="email"
                type="email"
                icon="pi pi-envelope"
                value={dados.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={ocupado || cadastroConcluido}
                required
              />
            </div>
          </div>

          <div className="cadastro-secao cadastro-secao-acesso">
            <div className="cadastro-secao-header">
              <span className="cadastro-secao-numero">02</span>
              <h4>Dados de acesso</h4>
            </div>

            <div className="cadastro-form-row">
              <div className="cadastro-form-group">
                <Input
                  id="cadastroSenha"
                  label="Senha"
                  name="senha"
                  icon="pi pi-lock"
                  value={dados.senha}
                  onChange={handleChange}
                  autoComplete="new-password"
                  mostrarSenha={mostrarSenha}
                  onToggleSenha={() => setMostrarSenha(anterior => !anterior)}
                  disabled={ocupado || cadastroConcluido}
                  required
                />
              </div>

              <div className="cadastro-form-group">
                <Input
                  id="cadastroConfirmarSenha"
                  label="Confirmar senha"
                  name="confirmarSenha"
                  icon="pi pi-lock"
                  value={dados.confirmarSenha}
                  onChange={handleChange}
                  autoComplete="new-password"
                  mostrarSenha={mostrarConfirmar}
                  onToggleSenha={() => setMostrarConfirmar(anterior => !anterior)}
                  disabled={ocupado || cadastroConcluido}
                  required
                />
              </div>
            </div>

            {erroSenha && (
              <div className="modal-message modal-message-error" role="status">
                <i className="pi pi-exclamation-circle" aria-hidden="true" />
                <span>{erroSenha}</span>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={!botaoHabilitado}
            className="cadastro-submit"
            style={{ width: '100%' }}
          >
            {carregando ? (
              <>
                <i className="pi pi-spin pi-spinner" aria-hidden="true" />
                {cadastroConcluido ? 'Entrando...' : 'Cadastrando...'}
              </>
            ) : cadastroConcluido ? (
              <>
                <i className="pi pi-check" aria-hidden="true" />
                Conta criada
              </>
            ) : (
              <>
                Criar minha conta
                <i className="pi pi-arrow-right" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>

        <div className="cadastro-login-link">
          {!cadastroConcluido && <span>Já tem uma conta?</span>}
          <button type="button" onClick={handleIrParaLogin} disabled={ocupado}>
            Fazer login
            <i className="pi pi-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCadastro;