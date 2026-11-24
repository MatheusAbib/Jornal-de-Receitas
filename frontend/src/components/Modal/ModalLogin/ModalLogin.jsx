import { useState } from 'react';
import Modal from '../Modal';
import BotaoGoogle from '../BotaoGoogle';
import Button from '../../Home/Button/Button';
import Input from '../../Home/Input/Input';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './ModalLogin.css';

function ModalLogin({ aberto, onFechar, onIrParaCadastro }) {
  const { login, loginComGoogle } = useAuth();
  const { mostrarToast } = useToast();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [processandoGoogle, setProcessandoGoogle] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const ocupado = carregando || processandoGoogle;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const senhaValida = senha.trim().length > 0;
  const botaoHabilitado = emailValido && senhaValida && !ocupado;

  function limparFormulario() {
    setEmail('');
    setSenha('');
    setErro('');
    setMostrarSenha(false);
  }

  function handleFechar() {
    if (ocupado) return;

    limparFormulario();
    onFechar();
  }

  function handleIrParaCadastro() {
    if (ocupado) return;

    limparFormulario();
    onFechar();
    onIrParaCadastro();
  }

  function concluirLogin(resultado) {
    mostrarToast('Login realizado com sucesso!', 'success');
    limparFormulario();
    onFechar();

    if (resultado.role === 'ADMIN') {
      window.location.href = '/admin/dashboard';
    }
  }

  function mostrarErroLogin(mensagem) {
    setErro(mensagem);
    mostrarToast(mensagem, 'error');
    setSenha('');
  }

  async function handleLoginGoogle(credential) {
    setErro('');

    const resultado = await loginComGoogle(credential);

    if (resultado.success) {
      concluirLogin(resultado);
    } else {
      mostrarErroLogin(resultado.message || 'Não foi possível continuar com o Google.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!botaoHabilitado) return;

    setErro('');
    setCarregando(true);

    try {
      const resultado = await login(email.trim(), senha);

      if (resultado.success) {
        concluirLogin(resultado);
      } else {
        mostrarErroLogin(resultado.message || 'E-mail ou senha incorretos.');
      }
    } catch (err) {
      mostrarErroLogin(
        err?.response?.data?.message || 'Erro de conexão. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={handleFechar}
      maxWidth="480px"
      className="login-modal"
    >
      <Modal.Header
        titulo="Acessar conta"
        icone="pi pi-sign-in"
        onFechar={handleFechar}
      />

      <Modal.Body className="login-modal-body">
        <div className="login-intro">
          <h3>Bem-vindo de volta</h3>
          <p>Entre com seus dados para acessar suas receitas, favoritos e publicações.</p>
        </div>

        {erro && (
          <div className="modal-message modal-message-error" role="alert">
            <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
            <span>{erro}</span>
          </div>
        )}

        {aberto && !carregando && (
          <BotaoGoogle
            onCredencial={handleLoginGoogle}
            onProcessando={setProcessandoGoogle}
            titulo="Entre com sua conta Google"
          />
        )}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <Input
              id="username"
              label="E-mail"
              type="email"
              icon="pi pi-envelope"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (erro) setErro('');
              }}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-form-group">
            <Input
              id="password"
              label="Senha"
              icon="pi pi-lock"
              value={senha}
              onChange={e => {
                setSenha(e.target.value);
                if (erro) setErro('');
              }}
              autoComplete="current-password"
              mostrarSenha={mostrarSenha}
              onToggleSenha={() => setMostrarSenha(prev => !prev)}
              required
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={!botaoHabilitado}
            className="login-submit"
            style={{ width: '100%' }}
          >
            {carregando ? (
              <>
                <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
                Entrando...
              </>
            ) : (
              <>
                Entrar na conta
                <i className="pi pi-arrow-right" aria-hidden="true"></i>
              </>
            )}
          </Button>
        </form>


        <div className="login-register-link">
          <span>Ainda não tem uma conta?</span>
          <button type="button" onClick={handleIrParaCadastro} disabled={ocupado}>
            Cadastre-se
            <i className="pi pi-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalLogin;