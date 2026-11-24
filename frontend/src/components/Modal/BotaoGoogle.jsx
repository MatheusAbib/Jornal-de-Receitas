import { useEffect, useRef, useState } from 'react';
import { solicitarNonceGoogle } from '../../services/authService';
import './BotaoGoogle.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const scriptUrl = 'https://accounts.google.com/gsi/client?hl=pt-BR';

let carregamentoGoogle;

function carregarGoogle() {
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google.accounts.id);
  }

  if (!carregamentoGoogle) {
    carregamentoGoogle = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;

      function falhar() {
        script.remove();
        reject(new Error('Não foi possível carregar o botão do Google.'));
      }

      script.onload = () => {
        const google = window.google?.accounts?.id;

        if (google) {
          resolve(google);
        } else {
          falhar();
        }
      };

      script.onerror = falhar;
      document.head.appendChild(script);
    }).catch(erro => {
      carregamentoGoogle = undefined;
      throw erro;
    });
  }

  return carregamentoGoogle;
}

export default function BotaoGoogle({
  onCredencial,
  onProcessando,
  titulo,
  tituloFormulario,
  variante = 'login',
}) {
  const containerRef = useRef(null);
  const callbackRef = useRef(onCredencial);
  const [tentativa, setTentativa] = useState(0);
  const [estado, setEstado] = useState('carregando');
  const [erro, setErro] = useState('');

  useEffect(() => {
    callbackRef.current = onCredencial;
  }, [onCredencial]);

  useEffect(() => {
    if (!clientId) return;

    const container = containerRef.current;
    let ativo = true;
    let emProcessamento = false;
    let timeout;

    async function preparar() {
      setEstado('carregando');
      setErro('');

      try {
        const google = await carregarGoogle();
        if (!ativo) return;

        const nonce = await solicitarNonceGoogle();
        if (!ativo) return;

        google.initialize({
          client_id: clientId,
          nonce,
          ux_mode: 'popup',
          callback: async ({ credential }) => {
            if (!ativo || emProcessamento) return;

            emProcessamento = true;
            clearTimeout(timeout);
            container.replaceChildren();
            setEstado('processando');
            onProcessando(true);

            try {
              if (!credential) {
                throw new Error('O Google não retornou uma credencial.');
              }

              await callbackRef.current(credential);
            } catch (err) {
              if (ativo) {
                setErro(
                  err?.response?.data?.message ||
                    'Não foi possível continuar com o Google. Tente novamente.',
                );
                setEstado('erro');
              }
            } finally {
              onProcessando(false);
            }
          },
        });

        google.renderButton(container, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'rectangular',
          logo_alignment: 'left',
          text: 'continue_with',
          locale: 'pt-BR',
          width: String(Math.min(container.clientWidth || 280, 400)),
        });
        setEstado('pronto');

        timeout = setTimeout(() => {
          container.replaceChildren();
          setErro('A confirmação com o Google expirou.');
          setEstado('erro');
        }, 4 * 60 * 1000 + 50 * 1000);
      } catch {
        if (ativo) {
          setErro('Não foi possível preparar o login com Google.');
          setEstado('erro');
        }
      }
    }

    preparar();

    return () => {
      ativo = false;
      clearTimeout(timeout);
      container.replaceChildren();
    };
  }, [tentativa, onProcessando]);

  if (!clientId) return null;

  const preparando = estado === 'carregando';
  const confirmando = estado === 'processando';

return (
  <div className={titulo ? `google-auth google-auth--${variante}` : 'google-auth'}>
    <div className={titulo ? 'google-auth-faixa' : undefined}>
      {titulo && <p className="google-auth-rotulo">{titulo}</p>}

      <div className="google-auth-controle">
        <div className="google-auth-botao" ref={containerRef} />

        {(preparando || confirmando) && (
          <div className="modal-message modal-message-info google-auth-mensagem" role="status">
            <i className="pi pi-spin pi-spinner" aria-hidden="true" />
            <span>
              {confirmando ? 'Confirmando sua conta Google…' : 'Carregando o botão do Google…'}
            </span>
          </div>
        )}

        {estado === 'erro' && (
          <div className="modal-message modal-message-error google-auth-mensagem" role="alert">
            <i className="pi pi-exclamation-circle" aria-hidden="true" />
            <div>
              <span>{erro}</span>
              <button
                className="google-auth-repetir"
                type="button"
                onClick={() => setTentativa(valor => valor + 1)}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {titulo && (
      <div className="google-auth-divisor">
        {tituloFormulario ? `ou ${tituloFormulario}` : 'ou'}
      </div>
    )}
  </div>
);
}