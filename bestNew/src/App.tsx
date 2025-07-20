import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ThemeProvider, CssBaseline } from '@mui/material';
import  Box  from '@mui/material/Box'
import theme from './Theme/theme';
import { Route, Routes } from 'react-router-dom';
import Authentification from './pages/Athentification/Authentification';
 import './Translate/i18n';
import SignIn from './pages/Athentification/sign-in/SignIn.tsx';
import Dashboard from './pages/Dashboard/dashboardV2/Dashboard.tsx';
function App() {
 
  return (
    <>       <Routes>
        {/* <Route path="/" element={<Authentification />} /> */}
        <Route path="/" element={<SignIn />} />
            {/* <Route path="/Dashboard/*" element={<Dashboard />} />   */}
            <Route path="/Dashboard/*" element={<Dashboard />} />  
      </Routes>  

    </>
  )
}

export default App
