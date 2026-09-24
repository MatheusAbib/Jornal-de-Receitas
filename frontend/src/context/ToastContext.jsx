import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const toast = useRef(null);

  function mostrarToast(mensagem, tipo = 'success', titulo = null) {
    if (!toast.current) return;

    const titulos = {
      success: titulo || 'Sucesso',
      error: titulo || 'Erro',
      info: titulo || 'Informação',
      warn: titulo || 'Atenção'
    };

    toast.current.show({
      severity: tipo,
      summary: titulos[tipo] || titulo,
      detail: mensagem,
      life: 3500
    });
  }

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      <Toast ref={toast} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  }
  return ctx;
}
