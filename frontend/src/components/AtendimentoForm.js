import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { atendimentoService, profissionalService } from '../services/api';

function AtendimentoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [atendimento, setAtendimento] = useState({
    data: '',
    horario: '',
    problemaTexto: '',
    receitaSaude: '',
    profissionalSaude: null
  });
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    profissionalService.listar().then(res => setProfissionais(res.data));
    if (id) {
      atendimentoService.buscar(id).then(res => setAtendimento(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await atendimentoService.atualizar(id, atendimento);
      } else {
        await atendimentoService.criar(atendimento);
      }
      navigate('/atendimentos');
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error);
      alert('Erro ao salvar atendimento. Verifique os campos obrigatórios.');
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Atendimento' : 'Novo Atendimento'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Data *</label>
          <input type="date" value={atendimento.data || ''} required
            onChange={e => setAtendimento({...atendimento, data: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Horário *</label>
          <input type="time" value={atendimento.horario || ''} required
            onChange={e => setAtendimento({...atendimento, horario: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Profissional de Saúde</label>
          <select value={atendimento.profissionalSaude?.id || ''}
            onChange={e => setAtendimento({...atendimento,
              profissionalSaude: e.target.value ? {id: parseInt(e.target.value)} : null})}>
            <option value="">Selecione um profissional</option>
            {profissionais.map(profissional => (
              <option key={profissional.id} value={profissional.id}>
                {profissional.nome} - {profissional.categoria}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Problema relatado</label>
          <textarea value={atendimento.problemaTexto || ''}
            onChange={e => setAtendimento({...atendimento, problemaTexto: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Receita / orientação de saúde</label>
          <textarea value={atendimento.receitaSaude || ''}
            placeholder="Ex.: remédio, atividade física ou atividade mental"
            onChange={e => setAtendimento({...atendimento, receitaSaude: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary">Salvar</button>
        <button type="button" className="btn" onClick={() => navigate('/atendimentos')}>Cancelar</button>
      </form>
    </div>
  );
}

export default AtendimentoForm;
