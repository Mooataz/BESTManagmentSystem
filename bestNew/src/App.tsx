import './App.css';
import { Route, Routes } from 'react-router-dom';
import './Translate/i18n';
import SignIn from './pages/Athentification/sign-in/SignIn.tsx';
import Dashboard from './pages/Dashboard/dashboardV2/Dashboard.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/Dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App
