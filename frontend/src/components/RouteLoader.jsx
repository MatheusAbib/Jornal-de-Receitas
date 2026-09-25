import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoader } from '../context/LoaderContext';
import { rotaJaVisitada, marcarRotaVisitada } from '../services/cache';

function RouteLoader() {
  const { pathname } = useLocation();
  const { show, hide } = useLoader();

  useEffect(() => {
    const jaVisitada = rotaJaVisitada(pathname);

    if (!jaVisitada) {
      show();
      const timeout = setTimeout(() => hide(), 400);
      marcarRotaVisitada(pathname);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return null;
}

export default RouteLoader;
