import api from './api';

export async function listarCarrossel(silent = false) {
  const response = await api.get('/api/carrossel', { silent });
  return response.data.itens || [];
}

export async function listarCarrosselAdmin(silent = false) {
  const response = await api.get('/api/carrossel/admin', { silent });
  return response.data.itens || [];
}
