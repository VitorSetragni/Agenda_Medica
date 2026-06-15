import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { atendimentoService } from '../services/api';

function AtendimentoList() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAtendimentos();
  }, []);

  const carregarAtendimentos = async () => {
    try {
      const response = await atendimentoService.listar();
      setAtendimentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletarAtendimento = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este atendimento?')) {
      try {
        await atendimentoService.deletar(id);
        carregarAtendimentos();
      } catch (error) {
        console.error('Erro ao deletar atendimento:', error);
        alert('Não foi possível excluir. Verifique se existe exame ligado a este atendimento.');
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="header">
        <h2>📅 Atendimentos</h2>
        <Link to="/atendimentos/novo" className="btn btn-primary">+ Novo Atendimento</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Horário</th>
            <th>Profissional</th>
            <th>Problema</th>
            <th>Receita / orientação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {atendimentos.map(atendimento => (
            <tr key={atendimento.id}>
              <td>{atendimento.data}</td>
              <td>{atendimento.horario}</td>
              <td>{atendimento.profissionalSaude?.nome || '-'}</td>
              <td>{atendimento.problemaTexto || '-'}</td>
              <td>{atendimento.receitaSaude || '-'}</td>
              <td>
                <Link to={`/atendimentos/editar/${atendimento.id}`} className="btn btn-sm">Editar</Link>
                <button onClick={() => deletarAtendimento(atendimento.id)} className="btn btn-danger btn-sm">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {atendimentos.length === 0 && <p className="empty">Nenhum atendimento cadastrado.</p>}
    </div>
  );
}

export default AtendimentoList;
