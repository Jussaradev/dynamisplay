const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // A senha NÃO é obrigatória porque quem entra pelo Google não tem senha.
  // (Antes estava "required: true" e o login com Google sempre falhava.)
  senha: { type: String },
  tipo: { type: String, enum: ['professor', 'aluno'], default: 'professor' },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
