import api from './api';

export async function listarCarrossel(silent = false) {
  const response = await api.get('/api/carrossel', { silent });
  return response.data.itens || [];
}

export async function listarCarrosselAdmin(silent = false) {
  const response = await api.get('/api/carrossel/admin', { silent });
  return response.data.itens || [];
}

export async function adicionarCarrossel(formData) {
  const response = await api.post('/api/carrossel/adicionar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    silent: true
  });
  return response.data;
}

export async function editarCarrossel(id, formData) {
  const response = await api.post(`/api/carrossel/editar/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    silent: true
  });
  return response.data;
}

export async function toggleCarrossel(id) {
  const response = await api.post(`/api/carrossel/toggle/${id}`, null, { silent: true });
  return response.data;
}

export async function excluirCarrossel(id) {
  const response = await api.post(`/api/carrossel/excluir/${id}`, null, { silent: true });
  return response.data;
}
