import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfissionalSaudeList from './components/ProfissionalSaudeList';
import ProfissionalSaudeForm from './components/ProfissionalSaudeForm';
import AtendimentoList from './components/AtendimentoList';
import AtendimentoForm from './components/AtendimentoForm';
import ExameLabList from './components/ExameLabList';
import ExameLabForm from './components/ExameLabForm';
import { exportarBancoLocal, limparBancoLocal } from './services/api';
import './App.css';

function App() {
  const baixarBackup = () => {
    const conteudo = exportarBancoLocal();
    const blob = new Blob([conteudo], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup-agenda-medica.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const limparDados = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os dados do LocalStorage?')) {
      limparBancoLocal();
      window.location.href = '/profissionais';
    }
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>🏥 Agenda Médica</h1>
          <div className="nav-links">
            <Link to="/profissionais">Profissionais</Link>
            <Link to="/atendimentos">Atendimentos</Link>
            <Link to="/exames-lab">Exames Lab</Link>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProfissionalSaudeList />} />
            <Route path="/profissionais" element={<ProfissionalSaudeList />} />
            <Route path="/profissionais/novo" element={<ProfissionalSaudeForm />} />
            <Route path="/profissionais/editar/:id" element={<ProfissionalSaudeForm />} />
            <Route path="/atendimentos" element={<AtendimentoList />} />
            <Route path="/atendimentos/novo" element={<AtendimentoForm />} />
            <Route path="/atendimentos/editar/:id" element={<AtendimentoForm />} />
            <Route path="/exames-lab" element={<ExameLabList />} />
            <Route path="/exames-lab/novo" element={<ExameLabForm />} />
            <Route path="/exames-lab/editar/:id" element={<ExameLabForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
