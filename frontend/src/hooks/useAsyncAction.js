import { useState } from 'react';

function useAsyncAction() {
  const [loading, setLoading] = useState(false);

  async function executar(fn) {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }

  return { loading, executar };
}

export default useAsyncAction;
