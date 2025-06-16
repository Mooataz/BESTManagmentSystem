import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { NotificationProvider } from './Componants/NotificationContext.tsx'
import './i18n';
 import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './Redux/store.ts';
import { Provider } from 'react-redux';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { createTheme,  ThemeProvider } from '@mui/material/styles'; // ✅ prend le bon ThemeProvider
import CssBaseline from  '@mui/joy/CssBaseline';
import {theme} from './Theme.ts'
 const MatTheme = createTheme();
 const joyTheme = extendTheme();
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>

      <BrowserRouter>
           
            
          <NotificationProvider>

            <App />

          </NotificationProvider>

           
      </BrowserRouter>

    </Provider>
  </React.StrictMode>,
)
