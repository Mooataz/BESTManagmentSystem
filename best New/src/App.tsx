import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ThemeProvider, CssBaseline } from '@mui/material';
import  Box  from '@mui/material/Box'
import theme from './Theme/theme';
import { Route, Routes } from 'react-router-dom';
import Authentification from './pages/Athentification/Authentification';
import Dashboard from './pages/Dashboard/Dashboard';
import './Translate/i18n';
function App() {
 
  return (
    <>       <Routes>
        <Route path="/" element={<Authentification />} />
            <Route path="/Dashboard/*" element={<Dashboard />} />  
      </Routes>  

    </>
  )
}

export default App
