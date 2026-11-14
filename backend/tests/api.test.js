// Testes das rotas da API (Jest + Supertest).
// O banco de dados é "simulado" com jest.mock, então os testes
// rodam em qualquer computador, sem internet e sem MongoDB.
// Para rodar:  npm test
const request = require('supertest');
const bcrypt = require('bcryptjs');

jest.mock('../models/Usuario');
jest.mock('../models/Atividade');
const Usuario = require('../models/Usuario');
const Atividade = require('../models/Atividade');
const app = require('../app');
const { gerarToken } = require('../middleware/auth');

const professor = { _id: '665f1f77bcf86cd799439011', nome: 'Prof. Teste', email: 'teste@senac.br', tipo: 'professor' };
const token = gerarToken(professor);

afterEach(() => jest.resetAllMocks());

test('GET / mostra que a API está no ar', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});

describe('Autenticação', () => {
  test('cadastro devolve token', async () => {
    Usuario.findOne.mockResolvedValue(null);             // e-mail ainda não existe
    Usuario.create.mockResolvedValue({ ...professor });

    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nome: 'Prof. Teste', email: 'teste@senac.br', senha: '123456' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.nome).toBe('Prof. Teste');
  });

  test('cadastro recusa e-mail repetido', async () => {
    Usuario.findOne.mockResolvedValue({ ...professor });
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nome: 'Outro', email: 'teste@senac.br', senha: '123456' });
    expect(res.status).toBe(400);
  });

  test('cadastro recusa senha curta', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nome: 'X', email: 'x@x.com', senha: '123' });
    expect(res.status).toBe(400);
  });

  test('login com senha certa funciona e com senha errada não', async () => {
    const senha = await bcrypt.hash('123456', 4);
    Usuario.findOne.mockResolvedValue({ ...professor, senha });

    const ok = await request(app).post('/api/auth/login').send({ email: 'teste@senac.br', senha: '123456' });
    expect(ok.status).toBe(200);
    expect(ok.body.token).toBeDefined();

    const errado = await request(app).post('/api/auth/login').send({ email: 'teste@senac.br', senha: 'errada' });
    expect(errado.status).toBe(400);
  });
});

describe('Atividades', () => {
  const atividade = {
    titulo: 'Conceitos de Administração',
    tipo: 'cartas',
    conteudo: [{ pergunta: 'SWOT', respostaCorreta: 'Forças, Fraquezas, Oportunidades e Ameaças' }]
  };

  test('não deixa criar atividade sem login', async () => {
    const res = await request(app).post('/api/atividades').send(atividade);
    expect(res.status).toBe(401);
  });

  test('cria atividade com o nome do professor vindo do token', async () => {
    Atividade.create.mockImplementation(async (dados) => ({ _id: 'novo', ...dados }));

    const res = await request(app)
      .post('/api/atividades')
      .set('Authorization', `Bearer ${token}`)
      .send(atividade);

    expect(res.status).toBe(201);
    expect(res.body.professor).toBe('Prof. Teste');
    expect(res.body.professorId).toBe(professor._id);
  });

  test('id inválido responde 404', async () => {
    const res = await request(app).get('/api/atividades/abc');
    expect(res.status).toBe(404);
  });

  test('professor não apaga atividade de outro professor', async () => {
    Atividade.findById.mockResolvedValue({ professorId: '000000000000000000000000', deleteOne: jest.fn() });
    const res = await request(app)
      .delete('/api/atividades/665f1f77bcf86cd799439099')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
