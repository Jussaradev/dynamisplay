const mongoose = require('mongoose');

// Cada atividade tem uma lista de ITENS. Todos os tipos usam o mesmo formato:
//
//  tipo               | pergunta            | respostaCorreta
//  -------------------|---------------------|-------------------------
//  quiz               | a pergunta          | o texto da alternativa certa
//                     | (+ opcoes: lista com as alternativas, mínimo 3)
//  verdadeiro_falso   | a afirmação         | "verdadeiro" ou "falso"
//  cartas             | o termo (frente)    | a definição (verso)
//  palavra_ausente    | frase com ___       | a palavra que falta
//
// Antes cada tipo mandava campos diferentes (termo, afirmacao, frase...)
// e o banco recusava, porque exigia "pergunta" e "respostaCorreta".
const ItemSchema = new mongoose.Schema({
  pergunta: { type: String, required: true, trim: true },
  respostaCorreta: { type: String, required: true, trim: true },
  opcoes: [{ type: String, trim: true }],   // alternativas (só no quiz)
  dica: { type: String, trim: true }
});

const AtividadeSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  tipo: {
    type: String,
    required: true,
    enum: ['quiz', 'cartas', 'palavra_ausente', 'verdadeiro_falso']
  },
  professor: { type: String, required: true },   // nome exibido para o aluno
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  conteudo: {
    type: [ItemSchema],
    validate: [(lista) => lista.length > 0, 'A atividade precisa ter pelo menos 1 item.']
  },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Atividade', AtividadeSchema);
