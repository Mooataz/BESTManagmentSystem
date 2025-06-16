import './App.css'
import { Route, Routes } from 'react-router-dom'
import Authentification from './pages/Athentification/Authentification.tsx'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import './i18n';
function App() {
  return (
       <Routes>
        <Route path="/" element={<Authentification />} />
          <Route path="/Dashboard/*" element={<Dashboard />} />  
      </Routes>  
   )
}

export default App
