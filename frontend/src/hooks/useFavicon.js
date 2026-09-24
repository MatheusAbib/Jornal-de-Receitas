import { useEffect } from 'react';
import api from '../services/api';

function useFavicon() {
  useEffect(() => {
    async function carregarFavicon() {
      try {
        const response = await api.get('/api/site-config/favicon', { silent: true });
        const url = response.data?.url;

        if (!url) return;

        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = url;
      } catch {
      }
    }

    carregarFavicon();
  }, []);
}

export default useFavicon;
