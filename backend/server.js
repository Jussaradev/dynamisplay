const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas com sucesso!'))
  .catch((err) => console.error('❌ Erro de conexão com MongoDB:', err));

  // Rotas de Autenticação
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Importar e usar as rotas de atividades
const atividadeRoutes = require('./routes/atividadeRoutes');
app.use('/api/atividades', atividadeRoutes);

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});