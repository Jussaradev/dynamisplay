// utils/jogo.js - Regras do jogo, separadas da tela para poderem ser testadas.

export const TIPOS = {
  quiz: 'Quiz',
  verdadeiro_falso: 'Verdadeiro ou Falso',
  cartas: 'Jogo da Memória',
  palavra_ausente: 'Palavra Ausente'
};

// Deixa o texto "comparável": sem maiúsculas, acentos e espaços nas pontas.
// Assim "Controlar", " controlar " e "CONTROLAR" contam como a mesma resposta.
export function normalizar(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function verificarResposta(respostaAluno, respostaCorreta) {
  return normalizar(respostaAluno) !== '' && normalizar(respostaAluno) === normalizar(respostaCorreta);
}

// Embaralha uma lista (algoritmo de Fisher-Yates) sem alterar a original
export function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Para o jogo da memória: cada item vira 2 cartas (termo e definição) com o mesmo "par"
export function montarCartasMemoria(conteudo) {
  const cartas = conteudo.flatMap((item, i) => [
    { id: `t${i}`, par: i, texto: item.pergunta, lado: 'Termo' },
    { id: `d${i}`, par: i, texto: item.respostaCorreta, lado: 'Definição' }
  ]);
  return embaralhar(cartas);
}
