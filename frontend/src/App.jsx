import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DetalhesReceita from './pages/DetalhesReceita';
import MinhasReceitas from './pages/MinhasReceitas';
import NovaReceita from './pages/NovaReceita';
import Sobre from './pages/Sobre';
import Dashboard from './pages/admin/Dashboard';
import Usuarios from './pages/admin/Usuarios';
import ReceitasPendentes from './pages/admin/ReceitasPendentes';
import ReceitasAprovadas from './pages/admin/ReceitasAprovadas';
import Carrossel from './pages/admin/Carrossel';
import PageLoader from './components/PageLoader/PageLoader';
import RouteLoader from './components/RouteLoader';
import { useAuth } from './context/AuthContext';
import { useLoader } from './context/LoaderContext';
import useGlobalButtonLoader from './hooks/useGlobalButtonLoader';

function App() {
  const { carregando } = useAuth();
  const { show, hide } = useLoader();

  useGlobalButtonLoader();

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
    </BrowserRouter>
  );
}

export default App;
