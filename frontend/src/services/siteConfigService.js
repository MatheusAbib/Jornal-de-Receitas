import api from './api';

export async function buscarReceitasRapidas(silent = false) {
  const response = await api.get('/api/site-config/receitas-rapidas', { silent });
  return response.data;
}
