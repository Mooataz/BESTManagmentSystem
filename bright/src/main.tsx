 import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { NotificationProvider } from './pages/Componants/NotificationContext.tsx'
import './i18n';
import { CssVarsProvider } from '@mui/joy/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './Redux/store.ts';
import { Provider } from 'react-redux';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> 
        <BrowserRouter>
    
          <CssVarsProvider  >
            <NotificationProvider>  
              <App />
            </NotificationProvider>
            </CssVarsProvider>
    
        </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
