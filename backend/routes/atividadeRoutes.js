const express = require('express');
const router = express.Router();
const Atividade = require('../models/Atividade');

// Rota para Criar uma Nova Atividade (POST)
router.post('/', async (req, res) => {
  try {
    const novaAtividade = new Atividade(req.body);
    const atividadeSalva = await novaAtividade.save();
    res.status(201).json(atividadeSalva);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar atividade', detalhe: error.message });
  }
});

// Rota para Listar Todas as Atividades (GET)
router.get('/', async (req, res) => {
  try {
    const atividades = await Atividade.find();
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar atividades', detalhe: error.message });
  }
});

module.exports = router;