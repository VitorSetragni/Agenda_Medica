import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exameLabService } from '../services/api';

function ExameLabList() {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarExames();
  }, []);

  const carregarExames = async () => {
    try {
      const response = await exameLabService.listar();
      setExames(response.data);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletarExame = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      try {
        await exameLabService.deletar(id);
        carregarExames();
      } catch (error) {
        console.error('Erro ao deletar exame:', error);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="header">
        <h2>🧪 Exames Laboratoriais</h2>
        <Link to="/exames-lab/novo" className="btn btn-primary">+ Novo Exame</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Data solicitação</th>
            <th>Atendimento</th>
            <th>Resultado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {exames.map(exame => (
            <tr key={exame.id}>
              <td>{exame.descricao}</td>
              <td>{exame.dataSolicitacao || '-'}</td>
              <td>{exame.atendimento ? `${exame.atendimento.data} ${exame.atendimento.horario}` : '-'}</td>
              <td>{exame.resultado || '-'}</td>
              <td>
                <Link to={`/exames-lab/editar/${exame.id}`} className="btn btn-sm">Editar</Link>
                <button onClick={() => deletarExame(exame.id)} className="btn btn-danger btn-sm">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {exames.length === 0 && <p className="empty">Nenhum exame cadastrado.</p>}
    </div>
  );
}

export default ExameLabList;
