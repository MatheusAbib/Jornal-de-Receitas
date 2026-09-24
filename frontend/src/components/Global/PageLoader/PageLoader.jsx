import { useLoader } from "../../../context/LoaderContext";
import './PageLoader.css';

function PageLoader() {
  const { ativo } = useLoader();

  return (
    <div className={`page-loader ${ativo ? '' : 'is-hidden'}`}>
      <div className="loader-content">
        <div className="loader-spinner">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        <p className="loader-text">
          Carregando
          <span className="loader-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
