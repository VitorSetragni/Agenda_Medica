import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { exameLabService, atendimentoService } from '../services/api';

function ExameLabForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exame, setExame] = useState({
    descricao: '',
    dataSolicitacao: '',
    resultado: '',
    atendimento: null
  });
  const [atendimentos, setAtendimentos] = useState([]);

  useEffect(() => {
    atendimentoService.listar().then(res => setAtendimentos(res.data));
    if (id) {
      exameLabService.buscar(id).then(res => setExame(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await exameLabService.atualizar(id, exame);
      } else {
        await exameLabService.criar(exame);
      }
      navigate('/exames-lab');
    } catch (error) {
      console.error('Erro ao salvar exame:', error);
      alert('Erro ao salvar exame. Verifique os campos obrigatórios.');
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Exame' : 'Novo Exame'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Descrição *</label>
          <input type="text" value={exame.descricao || ''} required
            onChange={e => setExame({...exame, descricao: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Data da solicitação</label>
          <input type="date" value={exame.dataSolicitacao || ''}
            onChange={e => setExame({...exame, dataSolicitacao: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Atendimento vinculado</label>
          <select value={exame.atendimento?.id || ''}
            onChange={e => setExame({...exame,
              atendimento: e.target.value ? {id: parseInt(e.target.value)} : null})}>
            <option value="">Selecione um atendimento</option>
            {atendimentos.map(atendimento => (
              <option key={atendimento.id} value={atendimento.id}>
                {atendimento.data} {atendimento.horario} - {atendimento.profissionalSaude?.nome || 'sem profissional'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Resultado</label>
          <textarea value={exame.resultado || ''}
            onChange={e => setExame({...exame, resultado: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary">Salvar</button>
        <button type="button" className="btn" onClick={() => navigate('/exames-lab')}>Cancelar</button>
      </form>
    </div>
  );
}

export default ExameLabForm;
