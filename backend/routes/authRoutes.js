const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // <-- 1. Importar a biblioteca do Google
const Usuario = require('../models/Usuario');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // <-- 2. Configurar o cliente com a variável do .env

// Rota de Cadastro (Register)
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHash,
      tipo: tipo || 'professor'
    });

    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhe: error.message });
  }
});

// Rota de Login Tradicional
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome, tipo: usuario.tipo },
      process.env.JWT_SECRET || 'chave_secreta_dynamisplay',
      { expiresIn: '1d' }
    );

    res.json({ token, usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo } });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao realizar login', detalhe: error.message });
  }
});

// === 3. NOVA ROTA: Login com Google ===
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Valida o token enviado pelo frontend junto ao Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Verifica se o usuário já existe no MongoDB
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Se for a primeira vez que entra com o Google, cria o usuário automaticamente
      usuario = new Usuario({
        nome: name,
        email: email,
        senha: '', // Sem senha tradicional necessária para contas Google
        tipo: 'professor'
      });
      await usuario.save();
    }

    // Gera o token JWT padrão da sua aplicação (igual ao login normal)
    const jwtToken = jwt.sign(
      { id: usuario._id, nome: usuario.nome, tipo: usuario.tipo },
      process.env.JWT_SECRET || 'chave_secreta_dynamisplay',
      { expiresIn: '1d' }
    );

    res.json({ 
      token: jwtToken, 
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo } 
    });
  } catch (error) {
    console.error("Erro na autenticação Google:", error);
    res.status(401).json({ erro: 'Falha ao autenticar com o Google. Verifique as credenciais.', detalhe: error.message });
  }
});

module.exports = router;