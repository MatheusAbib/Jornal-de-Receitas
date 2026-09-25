import api from './api';

export async function buscarUsuarioLogado() {
  try {
    const response = await api.get('/api/perfil/usuario-logado', { silent: true });
    return response.data.usuario;
  } catch {
    return null;
  }
}

export async function login(email, senha) {
  const response = await api.post('/api/login', { email, senha }, { silent: true });
  return response.data;
}

export async function logout() {
  await api.post('/api/logout', null, { silent: true });
}

export async function cadastrar(dados) {
  const response = await api.post('/api/cadastro', dados, { silent: true });
  return response.data;
}
