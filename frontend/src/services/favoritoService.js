import api from './api';

export async function listarFavoritos() {
  const response = await api.get('/api/favoritos', { silent: true });
  return response.data.favoritos || [];
}

export async function adicionarFavorito(receitaId) {
  const response = await api.post(`/api/favoritos/${receitaId}`, null, { silent: true });
  return response.data;
}

export async function removerFavorito(receitaId) {
  const response = await api.delete(`/api/favoritos/${receitaId}`, { silent: true });
  return response.data;
}

export async function buscarResumoFavoritos() {
  const response = await api.get('/api/favoritos/resumo', { silent: true });
  return response.data;
}

export async function buscarResumoPorIngrediente(nome) {
  const response = await api.get(
    `/api/favoritos/resumo/ingrediente?nome=${encodeURIComponent(nome)}`,
    { silent: true }
  );
  return response.data;
}
