const mongoose = require('mongoose');

// Guarda o desempenho de cada aluno ao terminar uma atividade.
// É a base dos relatórios (análise de dados) no painel do professor.
const ResultadoSchema = new mongoose.Schema({
  atividade: { type: mongoose.Schema.Types.ObjectId, ref: 'Atividade', required: true },
  nomeAluno: { type: String, required: true, trim: true },
  acertos: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 1 },
  tempoSegundos: { type: Number, min: 0 },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resultado', ResultadoSchema);
