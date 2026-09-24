import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'primeicons/primeicons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'primereact/resources/themes/lara-light-amber/theme.css';
import 'primereact/resources/primereact.min.css';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';
import { ToastProvider } from './context/ToastContext';
import { applyResponsiveStyles } from './styles/responsive';
import App from './App.jsx';
import './index.css';

applyResponsiveStyles();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LoaderProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LoaderProvider>
    </AuthProvider>
  </StrictMode>
);
