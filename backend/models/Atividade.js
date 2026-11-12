const mongoose = require('mongoose');

const AtividadeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tipo: { 
    type: String, 
    required: true, 
    enum: ['quiz', 'cartas', 'palavra_ausente', 'verdadeiro_falso'] 
  },
  professor: { type: String, required: true },
  conteudo: [{
    pergunta: { type: String, required: true },
    tipoQuestao: { type: String },
    opcoes: [String],
    respostaCorreta: { type: String, required: true },
    dica: { type: String }
  }],
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Atividade', AtividadeSchema);