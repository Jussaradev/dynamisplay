// Testes de unidade das regras do jogo. Rodar com:  npm test
import { describe, test, expect } from 'vitest';
import { normalizar, verificarResposta, montarCartasMemoria } from '../utils/jogo';

describe('verificarResposta', () => {
  test('aceita maiúsculas, acentos e espaços diferentes', () => {
    expect(verificarResposta('  CONTROLAR ', 'controlar')).toBe(true);
    expect(verificarResposta('gestao', 'Gestão')).toBe(true);
  });

  test('recusa resposta errada ou vazia', () => {
    expect(verificarResposta('organizar', 'controlar')).toBe(false);
    expect(verificarResposta('', '')).toBe(false);
  });
});

test('normalizar remove acentos', () => {
  expect(normalizar('Ação')).toBe('acao');
});

test('jogo da memória cria 2 cartas para cada par', () => {
  const cartas = montarCartasMemoria([
    { pergunta: 'SWOT', respostaCorreta: 'Análise de cenário' },
    { pergunta: 'PDCA', respostaCorreta: 'Ciclo de melhoria' }
  ]);
  expect(cartas).toHaveLength(4);
  expect(cartas.filter((c) => c.par === 0)).toHaveLength(2);
});
