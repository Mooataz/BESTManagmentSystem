import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './Translate/i18n.ts'
import { store } from './Redux/store.ts'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './Componants/NotificationContext.tsx'
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
