import { prefetchRota } from '../../../services/prefetch';
import { useAuth } from '../../../context/AuthContext';
import './Rodape.css';

function Rodape() {
  const { usuario } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="newspaper-footer">
      <div className="footer-signature">
        <p className="footer-eyebrow">
          <span className="footer-eyebrow-line" />
          Delícias do dia a dia
        </p>
        <h2 className="footer-brand">
          Jornal de Receitas
        </h2>
        <p className="footer-tagline">
          Compartilhe suas receitas favoritas e descubra novas.
        </p>
      </div>

      <div className="footer-content">
      <div className="footer-section">
        <h3 className="footer-title">Navegação</h3>
        <ul className="footer-links">
          <li>
            <a href="/" onMouseEnter={() => prefetchRota('/')}>
              <i className="pi pi-home" aria-hidden="true" />
              Início
            </a>
          </li>
          <li>
            <a href="/sobre" onMouseEnter={() => prefetchRota('/sobre')}>
              <i className="pi pi-info-circle" aria-hidden="true" />
              Sobre
            </a>
          </li>
          {usuario && (
            <>
              <li>
                <a href="/nova" onMouseEnter={() => prefetchRota('/nova')}>
                  <i className="pi pi-shop" aria-hidden="true" />
                  Enviar receita
                </a>
              </li>
              <li>
                <a href="/minhas-receitas" onMouseEnter={() => prefetchRota('/minhas-receitas')}>
                  <i className="pi pi-book" aria-hidden="true" />
                  Minhas receitas
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

        <div className="footer-section">
          <h3 className="footer-title">Redes</h3>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <i className="pi pi-facebook" aria-hidden="true" />
            </a>
            <a href="#" aria-label="Instagram">
              <i className="pi pi-instagram" aria-hidden="true" />
            </a>
            <a href="#" aria-label="Twitter">
              <i className="pi pi-twitter" aria-hidden="true" />
            </a>
            <a href="#" aria-label="YouTube">
              <i className="pi pi-youtube" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copyright">
          © {currentYear} Jornal de Receitas
        </span>
      </div>
    </footer>
  );
}

export default Rodape;