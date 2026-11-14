const express = require('express');
const mongoose = require('mongoose');
const Atividade = require('../models/Atividade');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

// Regras extras do quiz: cada pergunta precisa de pelo menos 3 alternativas
// e a resposta correta tem que ser uma delas. Devolve a mensagem de erro (ou null).
function validarQuiz(conteudo) {
  for (const [i, item] of (conteudo || []).entries()) {
    const opcoes = (item.opcoes || []).map((o) => String(o).trim()).filter(Boolean);
    if (opcoes.length < 3) {
      return `Pergunta ${i + 1}: cadastre pelo menos 3 alternativas.`;
    }
    if (new Set(opcoes).size !== opcoes.length) {
      return `Pergunta ${i + 1}: há alternativas repetidas.`;
    }
    if (!opcoes.includes(String(item.respostaCorreta || '').trim())) {
      return `Pergunta ${i + 1}: marque qual alternativa é a correta.`;
    }
  }
  return null;
}

// GET /api/atividades - lista pública (aparece na página inicial para os alunos)
router.get('/', async (req, res) => {
  try {
    const atividades = await Atividade.find().sort({ criadoEm: -1 });
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar atividades.', detalhe: error.message });
  }
});

// GET /api/atividades/minhas - só as atividades do professor logado
// (precisa vir ANTES de "/:id", senão o Express acha que "minhas" é um id)
router.get('/minhas', autenticar, async (req, res) => {
  try {
    const atividades = await Atividade.find({ professorId: req.usuario.id }).sort({ criadoEm: -1 });
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar atividades.', detalhe: error.message });
  }
});

// GET /api/atividades/:id - uma atividade (usada na tela do jogo)
// Esta rota NÃO existia e por isso o jogo mostrava "Atividade não encontrada".
router.get('/:id', async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(404).json({ erro: 'Atividade não encontrada.' });
    const atividade = await Atividade.findById(req.params.id);
    if (!atividade) return res.status(404).json({ erro: 'Atividade não encontrada.' });
    res.json(atividade);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar atividade.', detalhe: error.message });
  }
});

// POST /api/atividades - cria atividade (somente professor logado)
router.post('/', autenticar, async (req, res) => {
  try {
    const { titulo, tipo, conteudo } = req.body;

    if (tipo === 'quiz') {
      const erroQuiz = validarQuiz(conteudo);
      if (erroQuiz) return res.status(400).json({ erro: erroQuiz });
    }

    const atividade = await Atividade.create({
      titulo,
      tipo,
      conteudo,
      professor: req.usuario.nome,   // vem do token, não do formulário
      professorId: req.usuario.id
    });
    res.status(201).json(atividade);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar atividade. Confira os campos.', detalhe: error.message });
  }
});

// DELETE /api/atividades/:id - apaga (somente o dono da atividade)
// Esta rota também NÃO existia, por isso o botão "Apagar" dava erro.
router.delete('/:id', autenticar, async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(404).json({ erro: 'Atividade não encontrada.' });
    const atividade = await Atividade.findById(req.params.id);
    if (!atividade) return res.status(404).json({ erro: 'Atividade não encontrada.' });

    if (String(atividade.professorId) !== String(req.usuario.id)) {
      return res.status(403).json({ erro: 'Você só pode apagar as suas atividades.' });
    }

    await atividade.deleteOne();
    res.json({ mensagem: 'Atividade apagada.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao apagar atividade.', detalhe: error.message });
  }
});

module.exports = router;
