import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Client/Home-Cliente/Home';
import DetalhesReceita from './pages/Client/DetalhesReceita-Cliente/DetalhesReceita';
import MinhasReceitas from './pages/Client/MinhasReceitas-Cliente/MinhasReceitas';
import NovaReceita from './pages/Client/NovaReceita-Cliente/NovaReceita';
import Sobre from './pages/Client/Sobre-Cliente/Sobre';
import Dashboard from './pages/Admin/Dashboard-Admin/Dashboard';
import Usuarios from './pages/Admin/Usuarios-Admin/Usuarios';
import ReceitasPendentes from './pages/Admin/Receitas-Admin/ReceitasPendentes';
import ReceitasAprovadas from './pages/Admin/Receitas-Admin/ReceitasAprovadas';
import Carrossel from './pages/Admin/Carrossel-Admin/Carrossel';
import PageLoader from './components/Global/PageLoader/PageLoader';
import RouteLoader from './components/RouteLoader';
import { useAuth } from './context/AuthContext';
import { useLoader } from './context/LoaderContext';
import useGlobalButtonLoader from './hooks/useGlobalButtonLoader';
import useFavicon from './hooks/useFavicon';

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
