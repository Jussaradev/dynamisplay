// server.js - Ponto de partida do backend.
// 1) lê o arquivo .env  2) conecta no MongoDB  3) liga o servidor
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI não definida. Crie o arquivo backend/.env (veja o .env.example).');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Erro de conexão com MongoDB:', err.message);
    process.exit(1);
  });
