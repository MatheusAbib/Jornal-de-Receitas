import './Rodape.css';

function Rodape() {
  return (
    <footer className="newspaper-footer">
      <div className="footer-content">

        <div className="footer-section">
          <h3 className="footer-title">Jornal de Receitas</h3>
          <p className="footer-description">
            Delícias do dia a dia para todos os gostos. Compartilhe suas receitas favoritas e descubra novas.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Navegação</h3>
          <ul className="footer-links">
            <li><a href="/"><i className="pi pi-home"></i> Início</a></li>
            <li><a href="/sobre"><i className="pi pi-info-circle"></i> Sobre</a></li>
            <li><a href="/nova"><i className="pi pi-shop"></i> Enviar Receita</a></li>
            <li><a href="/minhas-receitas"><i className="pi pi-book"></i> Minhas Receitas</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Redes Sociais</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="pi pi-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i className="pi pi-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i className="pi pi-twitter"></i></a>
            <a href="#" aria-label="YouTube"><i className="pi pi-youtube"></i></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Jornal de Receitas. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Rodape;