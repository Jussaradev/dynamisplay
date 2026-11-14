const express = require('express');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../models/Usuario');
const { gerarToken } = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client();

// Monta a resposta padrão de login (token + dados públicos do usuário)
function respostaLogin(usuario) {
  return {
    token: gerarToken(usuario),
    usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
  };
}

// POST /api/auth/registro - cria conta com e-mail e senha
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    const usuarioExiste = await Usuario.findOne({ email: email.toLowerCase() });
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10); // nunca salvar a senha "pura"
    const novoUsuario = await Usuario.create({ nome, email, senha: senhaHash, tipo: 'professor' });

    // Já devolve o token, assim o professor entra direto após se cadastrar
    res.status(201).json(respostaLogin(novoUsuario));
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.', detalhe: error.message });
  }
});

// POST /api/auth/login - entra com e-mail e senha
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    // usuario.senha vazio = conta criada pelo Google
    if (!usuario || !usuario.senha) {
      return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
    }

    res.json(respostaLogin(usuario));
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao realizar login.', detalhe: error.message });
  }
});

// POST /api/auth/google - entra com a conta Google (API externa do Google)
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ erro: 'Token do Google não enviado.' });

    // Pergunta ao Google se o token é verdadeiro
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { email, name } = ticket.getPayload();

    let usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      // Primeiro acesso: cria o professor automaticamente (sem senha)
      usuario = await Usuario.create({ nome: name, email, tipo: 'professor' });
    }

    res.json(respostaLogin(usuario));
  } catch (error) {
    console.error('Erro na autenticação Google:', error.message);
    res.status(401).json({ erro: 'Falha ao autenticar com o Google.', detalhe: error.message });
  }
});

module.exports = router;
