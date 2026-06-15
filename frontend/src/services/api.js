// Serviço local que simula uma API usando o LocalStorage do navegador.
// Assim a aplicação funciona sem backend e sem banco PostgreSQL.

const CHAVES = {
  profissionais: 'agenda_medica_profissionais',
  atendimentos: 'agenda_medica_atendimentos',
  exames: 'agenda_medica_exames'
};

function ler(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch (error) {
    console.error('Erro ao ler LocalStorage:', error);
    return [];
  }
}

function salvar(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function gerarId(lista) {
  if (!lista.length) return 1;
  return Math.max(...lista.map(item => Number(item.id) || 0)) + 1;
}

function resposta(data) {
  return Promise.resolve({ data });
}

function erro(mensagem) {
  return Promise.reject(new Error(mensagem));
}

function buscarPorId(chave, id) {
  const lista = ler(chave);
  return lista.find(item => Number(item.id) === Number(id)) || null;
}

function completarAtendimento(atendimento) {
  if (!atendimento) return null;
  const profissionalId = atendimento.profissionalSaude?.id || atendimento.profissionalSaudeId;
  const profissional = profissionalId ? buscarPorId(CHAVES.profissionais, profissionalId) : null;

  return {
    ...atendimento,
    profissionalSaude: profissional || null
  };
}

function completarExame(exame) {
  if (!exame) return null;
  const atendimentoId = exame.atendimento?.id || exame.atendimentoId;
  const atendimento = atendimentoId ? completarAtendimento(buscarPorId(CHAVES.atendimentos, atendimentoId)) : null;

  return {
    ...exame,
    atendimento: atendimento || null
  };
}

export const profissionalService = {
  listar: () => resposta(ler(CHAVES.profissionais)),

  buscar: (id) => {
    const profissional = buscarPorId(CHAVES.profissionais, id);
    return profissional ? resposta(profissional) : erro('Profissional não encontrado');
  },

  criar: (profissional) => {
    const profissionais = ler(CHAVES.profissionais);
    const novo = {
      id: gerarId(profissionais),
      nome: profissional.nome,
      telefone: profissional.telefone || '',
      endereco: profissional.endereco || '',
      categoria: profissional.categoria || 'MEDICO'
    };

    salvar(CHAVES.profissionais, [...profissionais, novo]);
    return resposta(novo);
  },

  atualizar: (id, profissional) => {
    const profissionais = ler(CHAVES.profissionais);
    const existe = profissionais.some(item => Number(item.id) === Number(id));
    if (!existe) return erro('Profissional não encontrado');

    const atualizado = {
      id: Number(id),
      nome: profissional.nome,
      telefone: profissional.telefone || '',
      endereco: profissional.endereco || '',
      categoria: profissional.categoria || 'MEDICO'
    };

    salvar(CHAVES.profissionais, profissionais.map(item => Number(item.id) === Number(id) ? atualizado : item));
    return resposta(atualizado);
  },

  deletar: (id) => {
    const atendimentos = ler(CHAVES.atendimentos);
    const possuiAtendimento = atendimentos.some(item => Number(item.profissionalSaudeId) === Number(id));
    if (possuiAtendimento) return erro('Existe atendimento ligado a este profissional');

    const profissionais = ler(CHAVES.profissionais);
    salvar(CHAVES.profissionais, profissionais.filter(item => Number(item.id) !== Number(id)));
    return resposta(null);
  }
};

export const atendimentoService = {
  listar: () => resposta(ler(CHAVES.atendimentos).map(completarAtendimento)),

  buscar: (id) => {
    const atendimento = completarAtendimento(buscarPorId(CHAVES.atendimentos, id));
    return atendimento ? resposta(atendimento) : erro('Atendimento não encontrado');
  },

  criar: (atendimento) => {
    const atendimentos = ler(CHAVES.atendimentos);
    const profissionalId = atendimento.profissionalSaude?.id || atendimento.profissionalSaudeId || null;

    const novo = {
      id: gerarId(atendimentos),
      data: atendimento.data,
      horario: atendimento.horario,
      problemaTexto: atendimento.problemaTexto || '',
      receitaSaude: atendimento.receitaSaude || '',
      profissionalSaudeId: profissionalId ? Number(profissionalId) : null
    };

    salvar(CHAVES.atendimentos, [...atendimentos, novo]);
    return resposta(completarAtendimento(novo));
  },

  atualizar: (id, atendimento) => {
    const atendimentos = ler(CHAVES.atendimentos);
    const existe = atendimentos.some(item => Number(item.id) === Number(id));
    if (!existe) return erro('Atendimento não encontrado');

    const profissionalId = atendimento.profissionalSaude?.id || atendimento.profissionalSaudeId || null;
    const atualizado = {
      id: Number(id),
      data: atendimento.data,
      horario: atendimento.horario,
      problemaTexto: atendimento.problemaTexto || '',
      receitaSaude: atendimento.receitaSaude || '',
      profissionalSaudeId: profissionalId ? Number(profissionalId) : null
    };

    salvar(CHAVES.atendimentos, atendimentos.map(item => Number(item.id) === Number(id) ? atualizado : item));
    return resposta(completarAtendimento(atualizado));
  },

  deletar: (id) => {
    const exames = ler(CHAVES.exames);
    const possuiExame = exames.some(item => Number(item.atendimentoId) === Number(id));
    if (possuiExame) return erro('Existe exame ligado a este atendimento');

    const atendimentos = ler(CHAVES.atendimentos);
    salvar(CHAVES.atendimentos, atendimentos.filter(item => Number(item.id) !== Number(id)));
    return resposta(null);
  }
};

export const exameLabService = {
  listar: () => resposta(ler(CHAVES.exames).map(completarExame)),

  buscar: (id) => {
    const exame = completarExame(buscarPorId(CHAVES.exames, id));
    return exame ? resposta(exame) : erro('Exame não encontrado');
  },

  criar: (exame) => {
    const exames = ler(CHAVES.exames);
    const atendimentoId = exame.atendimento?.id || exame.atendimentoId || null;

    const novo = {
      id: gerarId(exames),
      descricao: exame.descricao,
      dataSolicitacao: exame.dataSolicitacao || '',
      resultado: exame.resultado || '',
      atendimentoId: atendimentoId ? Number(atendimentoId) : null
    };

    salvar(CHAVES.exames, [...exames, novo]);
    return resposta(completarExame(novo));
  },

  atualizar: (id, exame) => {
    const exames = ler(CHAVES.exames);
    const existe = exames.some(item => Number(item.id) === Number(id));
    if (!existe) return erro('Exame não encontrado');

    const atendimentoId = exame.atendimento?.id || exame.atendimentoId || null;
    const atualizado = {
      id: Number(id),
      descricao: exame.descricao,
      dataSolicitacao: exame.dataSolicitacao || '',
      resultado: exame.resultado || '',
      atendimentoId: atendimentoId ? Number(atendimentoId) : null
    };

    salvar(CHAVES.exames, exames.map(item => Number(item.id) === Number(id) ? atualizado : item));
    return resposta(completarExame(atualizado));
  },

  deletar: (id) => {
    const exames = ler(CHAVES.exames);
    salvar(CHAVES.exames, exames.filter(item => Number(item.id) !== Number(id)));
    return resposta(null);
  }
};

export function limparBancoLocal() {
  Object.values(CHAVES).forEach(chave => localStorage.removeItem(chave));
}

export function exportarBancoLocal() {
  const dados = {
    profissionais: ler(CHAVES.profissionais),
    atendimentos: ler(CHAVES.atendimentos),
    exames: ler(CHAVES.exames)
  };
  return JSON.stringify(dados, null, 2);
}
