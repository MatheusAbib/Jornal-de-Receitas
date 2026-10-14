import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import PageLoader from './components/Global/PageLoader/PageLoader';
import { useLoader } from './context/LoaderContext';
import useGlobalButtonLoader from './hooks/useGlobalButtonLoader';
import useFavicon from './hooks/useFavicon';
import { applyResponsiveStyles } from './styles/responsive';

const Home = lazy(() => import('./pages/Client/Home-Cliente/Home'));
const DetalhesReceita = lazy(() => import('./pages/Client/DetalhesReceita-Cliente/DetalhesReceita'));
const MinhasReceitas = lazy(() => import('./pages/Client/MinhasReceitas-Cliente/MinhasReceitas'));
const NovaReceita = lazy(() => import('./pages/Client/NovaReceita-Cliente/NovaReceita'));
const Sobre = lazy(() => import('./pages/Client/Sobre-Cliente/Sobre'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard-Admin/Dashboard'));
const Usuarios = lazy(() => import('./pages/Admin/Usuarios-Admin/Usuarios'));
const ReceitasPendentes = lazy(() => import('./pages/Admin/Receitas-Admin/ReceitasPendentes'));
const ReceitasAprovadas = lazy(() => import('./pages/Admin/Receitas-Admin/ReceitasAprovadas'));
const Carrossel = lazy(() => import('./pages/Admin/Carrossel-Admin/Carrossel'));

function ResponsiveStylesManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyResponsiveStyles();
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PrefetchRotas() {
  useEffect(() => {
    const timer = setTimeout(() => {
      import('./pages/Client/Sobre-Cliente/Sobre');
      import('./pages/Client/DetalhesReceita-Cliente/DetalhesReceita');
      import('./pages/Client/MinhasReceitas-Cliente/MinhasReceitas');
      import('./pages/Client/NovaReceita-Cliente/NovaReceita');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

function App() {
  const { show, hide } = useLoader();

  useGlobalButtonLoader();
  useFavicon();

  useEffect(() => {
    window.__showLoader = show;
    window.__hideLoader = hide;

    return () => {
      delete window.__showLoader;
      delete window.__hideLoader;
    };
  }, [show, hide]);

  return (
    <BrowserRouter>
      <PrefetchRotas />
      <ResponsiveStylesManager />

      <PageLoader />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detalhe/:id" element={<DetalhesReceita />} />
          <Route path="/minhas-receitas" element={<MinhasReceitas />} />
          <Route path="/nova" element={<NovaReceita />} />
          <Route path="/sobre" element={<Sobre />} />

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/admin/pendentes" element={<ReceitasPendentes />} />
          <Route path="/admin/aprovadas" element={<ReceitasAprovadas />} />
          <Route path="/admin/carrossel" element={<Carrossel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;