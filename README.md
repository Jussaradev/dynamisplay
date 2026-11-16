# 🎮 DynamiSplay

**Transformando aprendizado em experiência.**

Plataforma web para professores criarem **atividades gamificadas** com o próprio conteúdo e
compartilharem com a turma por **link ou QR Code**. Os alunos jogam pelo navegador ou pelo
celular, sem precisar de cadastro, e o professor acompanha os resultados em relatórios.

🌐 **Acesse:** https://dynamisplay.vercel.app

Projeto Integrador em Computação II · Engenharia de Computação · UNIVESP · Polo Ribeirão Preto · 2026

## Funcionalidades

- **Quatro tipos de atividade**
  - ❓ **Quiz**: perguntas de múltipla escolha, com 3 a 5 alternativas e a correta marcada pelo professor
  - ✅ **Verdadeiro ou Falso**: afirmações para o aluno julgar
  - 🃏 **Jogo da Memória**: o aluno associa cada termo à sua definição
  - ✍️ **Palavra Ausente**: o aluno completa a lacuna da frase
- **Professor:** cadastro e login (e-mail e senha ou conta Google), criação de atividades com quantos itens quiser, lista das próprias atividades com link e QR Code, exclusão e relatórios
- **Aluno:** entra só com nome ou apelido, recebe retorno imediato (certo ✔ / errado ✘), vê a pontuação e o tempo no final
- **Página inicial em abas:** Início (apresentação) e Atividades (busca por título e filtro por tipo)
- **Relatórios:** participações, % médio de acertos e tempo médio por atividade, em gráfico e tabela

## Como os requisitos do PI foram atendidos

| Requisito | Onde está no projeto |
|---|---|
| **Framework web** | React 19 + Vite (`frontend/`) e Express (`backend/`) |
| **Banco de dados** | MongoDB Atlas com Mongoose (`backend/models/`) |
| **Script web (JavaScript)** | Todo o projeto é JavaScript |
| **Nuvem** | Frontend na Vercel, backend no Render, banco no MongoDB Atlas |
| **API** | API REST própria (`backend/routes/`) + API do Google (login com Google) |
| **Acessibilidade** | `lang="pt-BR"`, rótulo em todos os campos, link "pular para o conteúdo", navegação por teclado com foco visível, avisos com `role="alert"` e `aria-live`, abas com `role="tab"`, tabela alternativa ao gráfico, respeito à preferência por menos animação |
| **Controle de versão** | Git + GitHub, com testes automáticos no GitHub Actions (`.github/workflows/`) |
| **Testes** | 20 testes: 14 no backend (Jest + Supertest) e 6 no frontend (Vitest + Testing Library) |
| **Análise de dados (opcional)** | Relatórios com Chart.js (`frontend/src/components/Relatorios.jsx`) |

## Arquitetura

```
 Navegador (professor e aluno)
        │
        ▼
 Frontend · React + Vite ············ hospedado na Vercel
        │  HTTP/JSON (Axios)
        ▼
 Backend · Node.js + Express + JWT ·· hospedado no Render ◄──► Google OAuth
        │  Mongoose
        ▼
 Banco · MongoDB Atlas ·············· coleções Usuario, Atividade e Resultado
```

## Estrutura de pastas

```
dynamisplay/
├── backend/                 → API (Node.js + Express + MongoDB)
│   ├── server.js            → liga o servidor e conecta no banco
│   ├── app.js               → rotas e configurações do Express
│   ├── middleware/auth.js   → confere o token de login (JWT)
│   ├── models/              → formato dos dados (Usuario, Atividade, Resultado)
│   ├── routes/              → endereços da API (auth, atividades, resultados)
│   ├── utils/relatorio.js   → cálculo dos relatórios (análise de dados)
│   └── tests/               → testes automatizados
└── frontend/                → site (React)
    └── src/
        ├── App.jsx          → menu e troca de telas
        ├── api.js           → comunicação com o backend
        ├── components/      → telas (Inicio, Atividades, Auth, PainelProfessor,
        │                      CriarAtividade, AlunoJogo, JogoMemoria, Relatorios)
        ├── utils/jogo.js    → regras do jogo (conferir resposta, embaralhar)
        └── tests/           → testes automatizados
```

## Rotas da API

| Método | Rota | Login? | O que faz |
|---|---|---|---|
| POST | `/api/auth/registro` | não | Cadastra professor |
| POST | `/api/auth/login` | não | Login com e-mail e senha |
| POST | `/api/auth/google` | não | Login com Google |
| GET | `/api/atividades` | não | Lista todas as atividades |
| GET | `/api/atividades/minhas` | sim | Atividades do professor logado |
| GET | `/api/atividades/:id` | não | Uma atividade (para jogar) |
| POST | `/api/atividades` | sim | Cria atividade (quiz exige 3+ alternativas) |
| DELETE | `/api/atividades/:id` | sim | Apaga atividade (só o dono) |
| POST | `/api/resultados` | não | Salva o resultado de um aluno |
| GET | `/api/resultados/resumo` | sim | Relatório do professor |

## Como rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org) versão 20 ou mais nova.

**1. Backend** (em um terminal):

```bash
cd backend
npm install
```

Copie `backend/.env.example` para `backend/.env` e preencha com seus dados. Depois:

```bash
npm start
```

Deve aparecer `✅ Conectado ao MongoDB Atlas com sucesso!` e `🚀 Servidor rodando na porta 5000`.

**2. Frontend** (em outro terminal):

```bash
cd frontend
npm install
```

Copie `frontend/.env.example` para `frontend/.env` e preencha. Depois:

```bash
npm run dev
```

Abra http://localhost:5173 no navegador.

## Como rodar os testes

```bash
cd backend
npm test
```

```bash
cd frontend
npm test
```

Os testes também rodam sozinhos no GitHub a cada envio de código (aba **Actions**).

## Publicação na nuvem

- **Banco:** MongoDB Atlas, com o IP `0.0.0.0/0` liberado em *IP Access List*.
- **Backend (Render):** Web Service com *Root Directory* `backend`, *Build Command* `npm install` e
  *Start Command* `npm start`. Variáveis: `MONGO_URI`, `GOOGLE_CLIENT_ID` e `JWT_SECRET`.
- **Frontend (Vercel):** projeto com *Root Directory* `frontend` e preset Vite. Variáveis:
  `VITE_API_URL` (endereço do Render) e `VITE_GOOGLE_CLIENT_ID`.
- **Google:** endereço da Vercel cadastrado em *Origens JavaScript autorizadas* do Client ID.

A cada `git push` na branch `main`, a Vercel e o Render publicam a nova versão automaticamente.

> No plano gratuito do Render, o servidor "dorme" após um tempo sem uso. O primeiro acesso
> pode levar cerca de 50 segundos.

## Próximos passos

- Edição de atividades já criadas
- Validação com professores e alunos do Senac Ribeirão Preto
- Login com Google aberto a todos (política de privacidade, termos de uso e logo)
- Integração com o Microsoft Teams
- Formato de caça ao tesouro

## Autora

**Jussara Maria Pereira** · Engenharia de Computação · UNIVESP
