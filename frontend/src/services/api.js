import axios from 'axios';

//Axios é a biblioteca que o frontend usa para fazer as chamadas HTTP (GET, POST, etc.) para o backend.
// O api.js é a configuração central do Axios no frontend.

let contador = 0;

function mostrarLoader() {
  if (contador === 0 && window.__showLoader) {
    window.__showLoader();
  }
  contador++;
}

function esconderLoader() {
  contador--;
  if (contador <= 0 && window.__hideLoader) {
    contador = 0;
    window.__hideLoader();
  }
}

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken && !config.headers['X-XSRF-TOKEN']) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  if (config.showLoader === true) {
    mostrarLoader();
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.showLoader === true) {
      esconderLoader();
    }
    return response;
  },
  (error) => {
    if (error.config?.showLoader === true) {
      esconderLoader();
    }
    return Promise.reject(error);
  }
);

export function extrairMensagemErro(err, fallback = 'Erro de conexão. Tente novamente.') {
  if (!err) return fallback;
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

export default api;
