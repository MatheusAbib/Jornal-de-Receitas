import axios from 'axios';

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

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (config.silent === true) {
    return config;
  }
  mostrarLoader();
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.silent === true) {
      return response;
    }
    esconderLoader();
    return response;
  },
  (error) => {
    if (error.config?.silent === true) {
      return Promise.reject(error);
    }
    esconderLoader();
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
