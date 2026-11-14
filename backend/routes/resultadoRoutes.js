const express = require('express');
const mongoose = require('mongoose');
const Resultado = require('../models/Resultado');
const Atividade = require('../models/Atividade');
const { autenticar } = require('../middleware/auth');
const { calcularResumo } = require('../utils/relatorio');

const router = express.Router();

// POST /api/resultados - o aluno terminou a atividade (não precisa de login)
router.post('/', async (req, res) => {
  try {
    const { atividadeId, nomeAluno, acertos, total, tempoSegundos } = req.body;
    if (!mongoose.Types.ObjectId.isValid(atividadeId)) {
      return res.status(400).json({ erro: 'Atividade inválida.' });
    }
    const resultado = await Resultado.create({
      atividade: atividadeId, nomeAluno, acertos, total, tempoSegundos
    });
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao salvar resultado.', detalhe: error.message });
  }
});

// GET /api/resultados/resumo - relatório do professor logado (análise de dados)
// Para cada atividade dele: quantas vezes foi jogada, % média de acertos e tempo médio.
router.get('/resumo', autenticar, async (req, res) => {
  try {
    const atividades = await Atividade.find({ professorId: req.usuario.id }, 'titulo tipo');
    const ids = atividades.map((a) => a._id);
    const resultados = await Resultado.find({ atividade: { $in: ids } });

    const resumo = calcularResumo(atividades, resultados);
    res.json(resumo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar relatório.', detalhe: error.message });
  }
});

module.exports = router;
