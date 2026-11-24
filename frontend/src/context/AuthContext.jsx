import { createContext, useState, useEffect, useContext } from 'react';
import {
  buscarUsuarioLogado,
  login as loginService,
  loginComGoogle as loginComGoogleService,
  logout as logoutService,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const usuarioLogado = await buscarUsuarioLogado();
      setUsuario(usuarioLogado);
      setCarregando(false);
    }

    carregar();
  }, []);

  async function atualizarUsuarioAposLogin(resultado) {
    if (resultado.success) {
      const usuarioLogado = resultado.usuario ?? await buscarUsuarioLogado();
      setUsuario(usuarioLogado);
    }

    return resultado;
  }

  async function login(email, senha) {
    const resultado = await loginService(email, senha);
    return atualizarUsuarioAposLogin(resultado);
  }

  async function loginComGoogle(credential) {
    const resultado = await loginComGoogleService(credential);
    return atualizarUsuarioAposLogin(resultado);
  }

  async function logout() {
    await logoutService();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, loginComGoogle, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}