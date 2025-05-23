 import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { NotificationProvider } from './pages/Componants/NotificationContext.tsx'
import './i18n';
import { CssVarsProvider } from '@mui/joy/styles';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <CssVarsProvider>
      <NotificationProvider>  
        <App />
      </NotificationProvider>
      </CssVarsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
