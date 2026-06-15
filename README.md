# Agenda Médica Web - LocalStorage

Aplicação de agenda médica feita em React, baseada nas entidades do diagrama:

- Profissional de Saúde
- Atendimento
- Exame Lab

## Entidades

### Profissional de Saúde

Campos:

- id
- nome
- telefone
- endereco
- categoria

Categorias disponíveis:

- MEDICO
- FISIOTERAPEUTA
- PSICOLOGO

### Atendimento

Campos:

- id
- data
- horario
- problemaTexto
- receitaSaude
- profissionalSaudeId

Relacionamento:

```txt
Profissional de Saúde 1 --- N Atendimento
```

### Exame Lab

Campos:

- id
- descricao
- dataSolicitacao
- resultado
- atendimentoId

Relacionamento:

```txt
Atendimento 1 --- N Exame Lab
```

## Como rodar

Entre na pasta do frontend:

```bash
cd frontend
npm install
npm start
```

Depois acesse:

```txt
http://localhost:3000
```

## Onde os dados ficam salvos?

Os dados ficam no LocalStorage do navegador, usando estas chaves:

```txt
agenda_medica_profissionais
agenda_medica_atendimentos
agenda_medica_exames
```

## Vantagens dessa versão

- Mais simples para apresentar.
- Não precisa configurar banco de dados.
- Não precisa subir backend Java/Spring.
- Funciona apenas com React no navegador.

## Limitações

- Os dados ficam apenas no navegador atual.
- Outro computador não consegue ver os mesmos dados.
- Se limpar os dados do navegador, os registros são apagados.
- Não é recomendado para sistema real de clínica, apenas para atividade, protótipo ou demonstração.

## Build para deploy estático

```bash
cd frontend
npm install
npm run build
```

O resultado fica na pasta:

```txt
frontend/build
```

Essa pasta pode ser publicada como site estático no Render, Netlify, Vercel ou GitHub Pages.
