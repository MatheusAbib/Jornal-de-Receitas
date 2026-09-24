import { useState } from 'react';
import Modal from "../Modal";
import Button from '../../Home/Button/Button';
import Input from '../../Home/Input/Input';
import { useAuth } from "../../../context/AuthContext";
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

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resultado = await login(email, senha);
      if (resultado.success) {
        mostrarToast('Login realizado com sucesso!', 'success');
        onFechar();
        setEmail('');
        setSenha('');

        if (resultado.role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        }
      } else {
        const msg = resultado.message || 'Email ou senha incorretos';
        setErro(msg);
        mostrarToast(msg, 'error');
        setSenha('');
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.');
      mostrarToast('Erro de conexão. Tente novamente.', 'error');
    } finally {
      setCarregando(false);
    }
  }

  function handleFechar() {
    setEmail('');
    setSenha('');
    setErro('');
    setMostrarSenha(false);
    onFechar();
  }

  return (
    <Modal aberto={aberto} onFechar={handleFechar} maxWidth="480px">
      <Modal.Header
        titulo="Acessar Conta"
        icone="pi pi-sign-in"
        onFechar={handleFechar}
      />

      <Modal.Body>

        {erro && (
          <div className="modal-message modal-message-error">
            <i className="pi pi-exclamation-circle"></i>
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="login-form-group">
            <Input
              id="username"
              label="E-mail"
              type="email"
              icon="pi pi-envelope"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              mostrarSenha={mostrarSenha}
              onToggleSenha={() => setMostrarSenha(!mostrarSenha)}
              required
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              Lembrar-me
            </label>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={!botaoHabilitado}
            style={{ width: '100%' }}
          >
            {carregando ? (
              <><i className="pi pi-spin pi-spinner"></i> Entrando...</>
            ) : (
              <><i className="pi pi-sign-in"></i> Entrar</>
            )}
          </Button>

        </form>

        <div className="login-register-link">
          Não tem uma conta?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); handleFechar(); onIrParaCadastro(); }}>
            Cadastre-se aqui
          </a>
        </div>

      </Modal.Body>
    </Modal>
  );
}

export default ModalLogin;
