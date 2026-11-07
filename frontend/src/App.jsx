import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota inicial do site: se acessar a raiz, carrega a tela de Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota do Painel do Professor */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
