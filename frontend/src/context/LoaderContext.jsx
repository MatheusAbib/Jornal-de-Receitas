import { createContext, useContext, useState, useRef, useCallback } from 'react';

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [ativo, setAtivo] = useState(false);
  const timeoutRef = useRef(null);

  const show = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAtivo(true);
  }, []);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setAtivo(false);
    }, 250);
  }, []);

  return (
    <LoaderContext.Provider value={{ ativo, show, hide }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
