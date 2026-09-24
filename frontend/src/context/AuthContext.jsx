import { createContext, useState, useEffect, useContext } from 'react';
import { buscarUsuarioLogado, login as loginService, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const u = await buscarUsuarioLogado();
      setUsuario(u);
      setCarregando(false);
    }
    carregar();
  }, []);

  async function login(email, senha) {
    const resultado = await loginService(email, senha);
    if (resultado.success) {
      const u = await buscarUsuarioLogado();
      setUsuario(u);
    }
    return resultado;
  }

  async function logout() {
    await logoutService();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
