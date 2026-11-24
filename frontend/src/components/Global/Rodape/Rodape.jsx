import { useNavigate } from 'react-router-dom';
import { prefetchRota } from '../../../services/prefetch';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './Rodape.css';

const emailAdministrador = 'matheus.abib.ma@gmail.com';

function Rodape() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  function navegar(event, caminho) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(caminho);
  }

  const links = [
    {
      caminho: '/',
      texto: 'Página inicial',
      icone: 'pi-home',
    },
    {
      caminho: '/sobre',
      texto: 'Sobre o jornal',
      icone: 'pi-info-circle',
    },
    ...(usuario
      ? [
          {
            caminho: '/nova',
            texto: 'Enviar receita',
            icone: 'pi-pencil',
          },
          {
            caminho: '/minhas-receitas',
            texto: 'Minhas receitas',
            icone: 'pi-book',
          },
        ]
      : []),
  ];

  const { mostrarToast } = useToast();

      async function copiarEmail() {
        try {
          await navigator.clipboard.writeText(emailAdministrador);
          mostrarToast('E-mail copiado!', 'success');
        } catch {
          mostrarToast('Não foi possível copiar o e-mail.', 'error');
        }
      }

  return (
    <footer className="newspaper-footer">
      <div className="footer-edition">
        <div className="footer-edition-inner">
          <div className="footer-edition-identity">
            <span className="footer-edition-mark">JR</span>
            <span>Jornal de receitas</span>
          </div>

          <span className="footer-edition-center"></span>
          <span className="footer-edition-number">Edição nº 04</span>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-main-inner">
          <div className="footer-signature">
            <span className="footer-eyebrow">
              <span className="footer-eyebrow-line"></span>
              O seu jornal de cozinha
              <span className="footer-eyebrow-line"></span>
            </span>

            <h2 className="footer-brand">
              <span>Jornal</span>

              <span className="footer-brand-middle">
                <span className="footer-brand-de">de</span>
                <span>Receitas</span>
              </span>
            </h2>

            <div className="footer-brand-bottom">
              <span className="footer-brand-rule"></span>
              <span>Bom de ler. Melhor de fazer.</span>
              <span className="footer-brand-rule"></span>
            </div>

            <p className="footer-tagline">
              Um lugar para descobrir receitas, compartilhar
              seus pratos e guardar os sabores que merecem
              ser lembrados.
            </p>
          </div>

          <div className="footer-content">
            <div className="footer-section footer-section-about">
              <div className="footer-section-heading">
                <span className="footer-section-number">01</span>
                <h3 className="footer-title">Nosso jornal</h3>
              </div>

              <div className="footer-about-seal">
                <span className="footer-about-seal-star">
                  <i className="pi pi-star-fill" aria-hidden="true"></i>
                </span>

                <div>
                  <strong>Feito para compartilhar</strong>
                  <span>Da sua cozinha para o mundo</span>
                </div>
              </div>
            </div>

            <nav className="footer-section" aria-label="Navegação do rodapé">
              <div className="footer-section-heading">
                <span className="footer-section-number">02</span>
                <h3 className="footer-title">Navegação</h3>
              </div>

              <ul className="footer-links">
                {links.map(link => (
                  <li key={link.caminho}>
                    <a
                      href={link.caminho}
                      onMouseEnter={() => prefetchRota(link.caminho)}
                      onClick={event => navegar(event, link.caminho)}
                    >
                      <i className={`pi ${link.icone}`} aria-hidden="true"></i>
                      <span>{link.texto}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-section">
              <div className="footer-section-heading">
                <span className="footer-section-number">03</span>
                <h3 className="footer-title">Contato</h3>
              </div>

              <ul className="footer-links">
                <li>
                <button
                  type="button"
                  className="footer-contact-email"
                  aria-label={`Copiar e-mail do administrador: ${emailAdministrador}`}
                  title="Copiar e-mail"
                  onClick={copiarEmail}
                >
                  <i className="pi pi-envelope" aria-hidden="true" />
                  <span>{emailAdministrador}</span>
                  <i className="pi pi-copy" aria-hidden="true" />
                </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-closing">
        <div className="footer-closing-inner">
          <span className="footer-closing-rule"></span>

          <span className="footer-closing-star">
            <i className="pi pi-star-fill" aria-hidden="true"></i>
          </span>

          <span className="footer-closing-rule"></span>
        </div>

        <div className="footer-bottom">
          <span>Jornal de Receitas</span>

          <span className="footer-copyright">
            © {currentYear} — Todos os direitos reservados
          </span>

          <span>Edição nº 04</span>
        </div>
      </div>
    </footer>
  );
}

export default Rodape;