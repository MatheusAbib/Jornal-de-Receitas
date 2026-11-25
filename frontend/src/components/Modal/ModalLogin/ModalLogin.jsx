import { useEffect, useState } from 'react';
import Modal from '../Modal';
import BotaoGoogle from '../BotaoGoogle';
import Button from '../../Home/Button/Button';
import Input from '../../Home/Input/Input';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import api from '../../../services/api';
import './ModalLogin.css';

const telas = {
  login: {
    titulo: 'Acessar conta',
    icone: 'pi pi-sign-in',
    introducao: 'Bem-vindo de volta',
    descricao: 'Entre com seus dados para acessar suas receitas, favoritos e publicações.',
    acao: 'Entrar na conta',
    carregando: 'Entrando...',
  },
  recuperar: {
    titulo: 'Esqueci minha senha',
    icone: 'pi pi-envelope',
    introducao: 'Recupere o acesso',
    descricao: 'Informe o e-mail da sua conta para receber um link de redefinição.',
    acao: 'Enviar link',
    carregando: 'Enviando...',
  },
  redefinir: {
    titulo: 'Redefinir senha',
    icone: 'pi pi-lock',
    introducao: 'Escolha uma nova senha',
    descricao: 'Use pelo menos 6 caracteres e confirme a nova senha.',
    acao: 'Salvar nova senha',
    carregando: 'Salvando...',
  },
};

function ModalLogin({ aberto, onFechar, onIrParaCadastro }) {
  const { login, loginComGoogle } = useAuth();
  const { mostrarToast } = useToast();

  const [tela, setTela] = useState('login');
  const [abertoPorLink, setAbertoPorLink] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aviso, setAviso] = useState(null);
  const [linkSolicitado, setLinkSolicitado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [processandoGoogle, setProcessandoGoogle] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const fragmento = new URLSearchParams(url.hash.slice(1));
    const tokenRecebido = fragmento.get('redefinir-senha');

    if (!tokenRecebido) return;

    fragmento.delete('redefinir-senha');
    url.hash = fragmento.toString();
    window.history.replaceState(window.history.state, '', url);

    setToken(tokenRecebido);
    setTela('redefinir');
    setAbertoPorLink(true);
  }, []);

  const modalAberto = aberto || abertoPorLink;
  const ocupado = carregando || processandoGoogle;
  const conteudo = telas[tela];
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const senhaValida = senha.trim().length >= 6;
  const limiteSenhaValido = new TextEncoder().encode(senha).length <= 72;
  const senhasIguais = senha === confirmarSenha;

  let erroSenha = '';

  if (tela === 'redefinir') {
    if ((senha || confirmarSenha) && !senhaValida) {
      erroSenha = 'A senha deve ter pelo menos 6 caracteres.';
    } else if (!limiteSenhaValido) {
      erroSenha = 'A senha deve ter no máximo 72 bytes.';
    } else if (confirmarSenha && !senhasIguais) {
      erroSenha = 'As senhas não coincidem.';
    }
  }

  const formularioValido = {
    login: emailValido && senha.trim().length > 0,
    recuperar: emailValido && !linkSolicitado,
    redefinir: Boolean(token) && senhaValida && limiteSenhaValido && senhasIguais,
  }[tela];

  const podeEnviar = formularioValido && !ocupado;

  function limparSenhas() {
    setSenha('');
    setConfirmarSenha('');
    setMostrarSenha(false);
    setMostrarConfirmarSenha(false);
  }

  function trocarTela(proximaTela) {
    limparSenhas();
    setAviso(null);
    setLinkSolicitado(false);
    setToken('');
    setTela(proximaTela);
  }

  function fecharModal() {
    setEmail('');
    setAbertoPorLink(false);
    trocarTela('login');
    onFechar();
  }

function handleFechar() {
  if (ocupado) return;

  if (tela === 'recuperar' || tela === 'redefinir') {
    trocarTela('login');
    return;
  }

  fecharModal();
}

  function handleIrParaCadastro() {
    if (ocupado) return;

    fecharModal();
    onIrParaCadastro();
  }

  function concluirLogin(resultado) {
    mostrarToast('Login realizado com sucesso!', 'success');
    fecharModal();

    if (resultado.role === 'ADMIN') {
      window.location.href = '/admin/dashboard';
    }
  }

  function mostrarErroLogin(mensagem) {
    setAviso({ tipo: 'error', texto: mensagem });
    mostrarToast(mensagem, 'error');
    setSenha('');
  }

  async function handleLoginGoogle(credential) {
    setAviso(null);

    const resultado = await loginComGoogle(credential);

    if (resultado.success) {
      concluirLogin(resultado);
    } else {
      mostrarErroLogin(resultado.message || 'Não foi possível continuar com o Google.');
    }
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (!podeEnviar) return;

    setAviso(null);
    setCarregando(true);

    try {
      if (tela === 'login') {
        const resultado = await login(email.trim(), senha);

        if (resultado.success) {
          concluirLogin(resultado);
        } else {
          mostrarErroLogin(resultado.message || 'E-mail ou senha incorretos.');
        }

        return;
      }

      if (tela === 'recuperar') {
        await api.post(
          '/api/auth/esqueci-senha',
          { email: email.trim() },
          { silent: true },
        );

        setLinkSolicitado(true);
        setAviso({
          tipo: 'info',
        texto: 'Se houver uma conta com esse e-mail, enviaremos um link. Confira sua caixa de entrada e o spam. Se o endereço não existe ou você perdeu o acesso, fale com o administrador em matheus.abib.ma@gmail.com.',
        });
        return;
      }

      await api.post(
        '/api/auth/redefinir-senha',
        { token, novaSenha: senha, confirmarSenha },
        { silent: true },
      );

      trocarTela('login');
      setAviso({
        tipo: 'success',
        texto: 'Senha redefinida com sucesso. Entre com sua nova senha.',
      });
    } catch (err) {
      const mensagem = err?.response?.data?.message ||
        'Não foi possível concluir a solicitação. Tente novamente.';

      if (tela === 'login') {
        mostrarErroLogin(mensagem);
      } else {
        setAviso({ tipo: 'error', texto: mensagem });
      }
    } finally {
      setCarregando(false);
    }
  }

  const iconeAviso = {
    error: 'pi-exclamation-circle',
    info: 'pi-info-circle',
    success: 'pi-check-circle',
  };

  return (
    <Modal aberto={modalAberto} onFechar={handleFechar} maxWidth="480px" className="login-modal">
      <Modal.Header titulo={conteudo.titulo} icone={conteudo.icone} onFechar={handleFechar} />

      <Modal.Body className="login-modal-body">
        <div className="login-intro">
          <h3>{conteudo.introducao}</h3>
          <p>{conteudo.descricao}</p>
        </div>

        {aviso && (
          <div
            className={`modal-message modal-message-${aviso.tipo}`}
            role={aviso.tipo === 'error' ? 'alert' : 'status'}
          >
            <i className={`pi ${iconeAviso[aviso.tipo]}`} aria-hidden="true" />
            <span>{aviso.texto}</span>
          </div>
        )}

        {modalAberto && tela === 'login' && !carregando && (
          <BotaoGoogle
            onCredencial={handleLoginGoogle}
            onProcessando={setProcessandoGoogle}
            titulo="Entre com sua conta Google"
          />
        )}

        {!linkSolicitado && (
          <form key={tela} className="login-form" onSubmit={handleSubmit}>
            {tela !== 'redefinir' && (
              <div className="login-form-group">
                <Input
                  id={tela === 'login' ? 'username' : 'recuperacaoEmail'}
                  label="E-mail"
                  type="email"
                  icon="pi pi-envelope"
                  value={email}
                  onChange={evento => {
                    setEmail(evento.target.value);
                    if (aviso?.tipo === 'error') setAviso(null);
                  }}
                  autoComplete="email"
                  disabled={ocupado}
                  required
                />
              </div>
            )}

            {tela !== 'recuperar' && (
              <div className="login-form-group">
                <Input
                  id={tela === 'login' ? 'password' : 'redefinicaoSenha'}
                  label={tela === 'login' ? 'Senha' : 'Nova senha'}
                  icon="pi pi-lock"
                  value={senha}
                  onChange={evento => {
                    setSenha(evento.target.value);
                    if (aviso?.tipo === 'error') setAviso(null);
                  }}
                  autoComplete={tela === 'login' ? 'current-password' : 'new-password'}
                  mostrarSenha={mostrarSenha}
                  onToggleSenha={() => setMostrarSenha(valor => !valor)}
                  disabled={ocupado}
                  required
                />
              </div>
            )}

            {tela === 'redefinir' && (
              <div className="login-form-group">
                <Input
                  id="redefinicaoConfirmarSenha"
                  label="Confirmar nova senha"
                  icon="pi pi-lock"
                  value={confirmarSenha}
                  onChange={evento => {
                    setConfirmarSenha(evento.target.value);
                    if (aviso?.tipo === 'error') setAviso(null);
                  }}
                  autoComplete="new-password"
                  mostrarSenha={mostrarConfirmarSenha}
                  onToggleSenha={() => setMostrarConfirmarSenha(valor => !valor)}
                  disabled={ocupado}
                  required
                />
              </div>
            )}

            {erroSenha && (
              <p className="login-validation-message" role="status">
                <i className="pi pi-exclamation-circle" aria-hidden="true" />
                {erroSenha}
              </p>
            )}

            {tela === 'login' && (
              <button
                type="button"
                className="login-forgot-link"
                onClick={() => trocarTela('recuperar')}
                disabled={ocupado}
              >
                Esqueci minha senha
              </button>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={!podeEnviar}
              className="login-submit"
              style={{ width: '100%' }}
            >
              {carregando && <i className="pi pi-spin pi-spinner" aria-hidden="true" />}
              {carregando ? conteudo.carregando : conteudo.acao}
              {!carregando && <i className="pi pi-arrow-right" aria-hidden="true" />}
            </Button>
          </form>
        )}

        <div className="login-register-link">
          {tela === 'login' ? (
            <>
              <span>Ainda não tem uma conta?</span>
              <button type="button" onClick={handleIrParaCadastro} disabled={ocupado}>
                Cadastre-se
                <i className="pi pi-arrow-right" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => trocarTela('login')} disabled={ocupado}>
                <i className="pi pi-arrow-left" aria-hidden="true" />
                Voltar para o login
              </button>

              {tela === 'redefinir' && (
                <button type="button" onClick={() => trocarTela('recuperar')} disabled={ocupado}>
                  Solicitar outro link
                  <i className="pi pi-arrow-right" aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalLogin;