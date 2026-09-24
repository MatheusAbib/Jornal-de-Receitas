import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoader } from '../context/LoaderContext';

function RouteLoader() {
  const { pathname } = useLocation();
  const { show, hide } = useLoader();

  useEffect(() => {
    show();
    const timeout = setTimeout(() => hide(), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}

export default RouteLoader;
