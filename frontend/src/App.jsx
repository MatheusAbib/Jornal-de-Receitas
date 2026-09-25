import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLoader from './components/Global/PageLoader/PageLoader';
import RouteLoader from './components/RouteLoader';
import { useAuth } from './context/AuthContext';
import { useLoader } from './context/LoaderContext';
import useGlobalButtonLoader from './hooks/useGlobalButtonLoader';
import useFavicon from './hooks/useFavicon';

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

function App() {
  const { carregando } = useAuth();
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

  if (carregando) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <PageLoader />
      <RouteLoader />
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
