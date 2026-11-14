// app.js - Monta o "aplicativo" Express (rotas e middlewares).
// Fica separado do server.js para que os testes possam usar o app
// sem precisar abrir uma porta nem conectar no MongoDB de verdade.
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const atividadeRoutes = require('./routes/atividadeRoutes');
const resultadoRoutes = require('./routes/resultadoRoutes');

const app = express();

app.use(cors());          // permite que o frontend (outro endereço) chame a API
app.use(express.json());  // permite ler JSON enviado no corpo das requisições

// Rota simples para verificar se a API está no ar (útil no Render)
app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API DynamiSplay funcionando 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/atividades', atividadeRoutes);
app.use('/api/resultados', resultadoRoutes);

// Qualquer rota que não existe cai aqui
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

module.exports = app;
