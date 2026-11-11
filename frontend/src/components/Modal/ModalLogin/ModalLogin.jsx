import { useState } from 'react';
import Modal from '../Modal';
import Button from '../../Home/Button/Button';
import Input from '../../Home/Input/Input';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './ModalLogin.css';

function ModalLogin({ aberto, onFechar, onIrParaCadastro }) {
  const { login } = useAuth();
  const { mostrarToast } = useToast();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const senhaValida = senha.trim().length > 0;
  const botaoHabilitado = emailValido && senhaValida && !carregando;

  function limparFormulario() {
    setEmail('');
    setSenha('');
    setErro('');
    setMostrarSenha(false);
  }

  function handleFechar() {
    if (carregando) return;

    limparFormulario();
    onFechar();
  }

  function handleIrParaCadastro() {
    if (carregando) return;

    limparFormulario();
    onFechar();
    onIrParaCadastro();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!botaoHabilitado) return;

    setErro('');
    setCarregando(true);

    try {
      const resultado = await login(email.trim(), senha);

      if (resultado.success) {
        mostrarToast('Login realizado com sucesso!', 'success');

        limparFormulario();
        onFechar();

        if (resultado.role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        }
      } else {
        const msg = resultado.message || 'E-mail ou senha incorretos.';

        setErro(msg);
        mostrarToast(msg, 'error');
        setSenha('');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Erro de conexão. Tente novamente.';

      setErro(msg);
      mostrarToast(msg, 'error');
      setSenha('');
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

          <p>
            Entre com seus dados para acessar suas receitas,
            favoritos e publicações.
          </p>
        </div>

        {erro && (
          <div
            className="modal-message modal-message-error"
            role="alert"
          >
            <i
              className="pi pi-exclamation-circle"
              aria-hidden="true"
            ></i>

            <span>{erro}</span>
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
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
                <i
                  className="pi pi-spin pi-spinner"
                  aria-hidden="true"
                ></i>
                Entrando...
              </>
            ) : (
              <>
                Entrar na conta
                <i
                  className="pi pi-arrow-right"
                  aria-hidden="true"
                ></i>
              </>
            )}
          </Button>
        </form>

        <div className="login-register-link">
          <span>Ainda não tem uma conta?</span>

          <button
            type="button"
            onClick={handleIrParaCadastro}
          >
            Cadastre-se
            <i
              className="pi pi-arrow-right"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalLogin;