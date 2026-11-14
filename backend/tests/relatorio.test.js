// Teste de unidade da análise de dados (não precisa de banco).
const { calcularResumo } = require('../utils/relatorio');

test('calcula participações, % de acertos e tempo médio', () => {
  const atividades = [{ _id: 'a1', titulo: 'Quiz RH', tipo: 'quiz' }];
  const resultados = [
    { atividade: 'a1', acertos: 1, total: 2, tempoSegundos: 30 }, // 50%
    { atividade: 'a1', acertos: 2, total: 2, tempoSegundos: 50 }  // 100%
  ];

  const [resumo] = calcularResumo(atividades, resultados);

  expect(resumo.participacoes).toBe(2);
  expect(resumo.percentualAcertos).toBe(75);
  expect(resumo.tempoMedioSegundos).toBe(40);
});

test('atividade sem ninguém jogando fica com zero', () => {
  const [resumo] = calcularResumo([{ _id: 'a2', titulo: 'V ou F', tipo: 'verdadeiro_falso' }], []);
  expect(resumo.participacoes).toBe(0);
  expect(resumo.percentualAcertos).toBe(0);
});
