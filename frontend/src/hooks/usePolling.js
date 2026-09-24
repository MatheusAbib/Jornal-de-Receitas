import { useEffect, useRef } from 'react';

function usePolling(callback, intervalo = 10000, ativo = true) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!ativo) return;

    let intervaloId = null;

    function executar() {
      if (document.hidden) return;
      callbackRef.current();
    }

    intervaloId = setInterval(executar, intervalo);

    function handleVisibility() {
      if (!document.hidden) {
        callbackRef.current();
      }
    }

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervaloId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [intervalo, ativo]);
}

export default usePolling;
