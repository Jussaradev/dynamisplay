// middleware/auth.js - "Porteiro" das rotas protegidas.
// Confere se a requisição trouxe um token JWT válido no cabeçalho:
//   Authorization: Bearer <token>
// Se estiver tudo certo, coloca os dados do usuário em req.usuario.
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_dynamisplay';

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, nome: usuario.nome, tipo: usuario.tipo },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: 'Faça login para continuar.' });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next(); // tudo certo, segue para a rota
  } catch {
    return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente.' });
  }
}

module.exports = { autenticar, gerarToken };
