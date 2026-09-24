import api from './api';

export async function listarReceitas(silent = false) {
  const response = await api.get('/api/receitas', { silent });
  return response.data.receitas || [];
}

export async function buscarReceita(id, silent = false) {
  const response = await api.get(`/api/receitas/${id}`, { silent });
  return response.data;
}

export async function minhasReceitas(silent = false) {
  const response = await api.get('/api/receitas/minhas', { silent });
  return response.data;
}

export async function listarPendentes(page = 0, size = 12, busca = '', silent = false) {
  const params = { page, size };
  if (busca) params.busca = busca;
  const response = await api.get('/api/receitas/pendentes', { params, silent });
  return response.data;
}

export async function listarRejeitadas(page = 0, size = 12, busca = '', silent = false) {
  const params = { page, size };
  if (busca) params.busca = busca;
  const response = await api.get('/api/receitas/rejeitadas', { params, silent });
  return response.data;
}

export async function listarAprovadasAdmin(page = 0, size = 12, busca = '', silent = false) {
  const params = { page, size };
  if (busca) params.busca = busca;
  const response = await api.get('/api/receitas/aprovadas', { params, silent });
  return response.data;
}

export async function criarReceita(formData) {
  const response = await api.post('/api/receitas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export async function editarReceita(id, formData) {
  const response = await api.put(`/api/receitas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export async function aprovarReceita(id) {
  const response = await api.post(`/api/receitas/${id}/aprovar`);
  return response.data;
}

export async function rejeitarReceita(id, motivo) {
  const response = await api.post(`/api/receitas/${id}/rejeitar`, null, {
    params: { motivo }
  });
  return response.data;
}

export async function excluirReceita(id) {
  const response = await api.delete(`/api/receitas/${id}`);
  return response.data;
}
