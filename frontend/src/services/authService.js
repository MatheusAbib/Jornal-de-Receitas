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
  const response = await api.post('/api/login', { email, senha }, { showLoader: true });
  return response.data;
}

export async function solicitarNonceGoogle() {
  const response = await api.post('/api/login/google/nonce', null, {
    silent: true,
    withCredentials: true,
  });

  return response.data.nonce;
}

export async function loginComGoogle(credential) {
  const response = await api.post(
    '/api/login/google',
    { credential },
    { silent: true, withCredentials: true },
  );

  return response.data;
}

export async function vincularGoogle(credential, senhaAtual) {
  const response = await api.post(
    '/api/perfil/google/vincular',
    { credential, senhaAtual },
    { silent: true, withCredentials: true },
  );

  return response.data;
}

export async function logout() {
  await api.post('/api/logout', null, { showLoader: true });
}

export async function cadastrar(dados) {
  const response = await api.post('/api/cadastro', dados, { silent: true });
  return response.data;
}