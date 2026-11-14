// CriarAtividade.jsx - Formulário para o professor montar uma atividade
// com quantos itens quiser (perguntas, cartas, frases...).
import { useState } from 'react';
import api, { mensagemDeErro } from '../api';

// Textos dos campos mudam conforme o tipo da atividade
const ROTULOS = {
  quiz: { pergunta: 'Pergunta', exP: 'Qual é a primeira etapa do processo administrativo?' },
  verdadeiro_falso: { pergunta: 'Afirmação', resposta: 'Ela é verdadeira ou falsa?', exP: 'O capital de giro é de curto prazo.' },
  cartas: { pergunta: 'Termo', resposta: 'Definição (o par do termo)', exP: 'SWOT', exR: 'Forças, Fraquezas, Oportunidades e Ameaças' },
  palavra_ausente: { pergunta: 'Frase com lacuna (use ___ no lugar da palavra)', resposta: 'Palavra que falta', exP: 'A gestão é planejar, organizar, dirigir e ___.', exR: 'controlar' }
};

const MIN_ALTERNATIVAS = 3;
const MAX_ALTERNATIVAS = 5;
const LETRAS = ['A', 'B', 'C', 'D', 'E'];

// Cada item guarda tudo o que qualquer tipo pode precisar.
// "opcoes" e "correta" (posição da alternativa certa) só são usados no quiz.
const itemVazio = () => ({ pergunta: '', respostaCorreta: '', opcoes: ['', '', ''], correta: null });

export default function CriarAtividade({ onCriada }) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('quiz');
  const [itens, setItens] = useState([itemVazio()]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const r = ROTULOS[tipo];

  // Atualiza um campo de um item, sem mexer nos outros itens
  const alterarItem = (indice, mudancas) => {
    setItens(itens.map((item, i) => (i === indice ? { ...item, ...mudancas } : item)));
  };

  const alterarOpcao = (indice, posicao, valor) => {
    const opcoes = [...itens[indice].opcoes];
    opcoes[posicao] = valor;
    alterarItem(indice, { opcoes });
  };

  const adicionarOpcao = (indice) => {
    alterarItem(indice, { opcoes: [...itens[indice].opcoes, ''] });
  };

  const removerOpcao = (indice, posicao) => {
    const item = itens[indice];
    const opcoes = item.opcoes.filter((_, p) => p !== posicao);
    // se apagou a alternativa marcada como correta, desmarca; se apagou uma antes dela, ajusta a posição
    let correta = item.correta;
    if (correta === posicao) correta = null;
    else if (correta !== null && correta > posicao) correta -= 1;
    alterarItem(indice, { opcoes, correta });
  };

  const adicionarItem = () => setItens([...itens, itemVazio()]);
  const removerItem = (indice) => setItens(itens.filter((_, i) => i !== indice));

  // Confere o formulário antes de enviar. Devolve a mensagem de erro ou null.
  const validar = () => {
    if (tipo === 'cartas' && itens.length < 2) {
      return 'O jogo da memória precisa de pelo menos 2 pares.';
    }
    for (const [i, item] of itens.entries()) {
      if (tipo === 'palavra_ausente' && !item.pergunta.includes('___')) {
        return `Item ${i + 1}: coloque ___ (três sublinhados) no lugar da palavra que falta.`;
      }
      if (tipo === 'quiz') {
        const preenchidas = item.opcoes.map((o) => o.trim());
        if (preenchidas.some((o) => o === '')) return `Pergunta ${i + 1}: preencha todas as alternativas (ou remova as vazias).`;
        if (new Set(preenchidas).size !== preenchidas.length) return `Pergunta ${i + 1}: há alternativas repetidas.`;
        if (item.correta === null) return `Pergunta ${i + 1}: marque qual alternativa é a correta.`;
      }
    }
    return null;
  };

  // Transforma o que está na tela no formato que o backend espera
  const montarConteudo = () =>
    itens.map((item) =>
      tipo === 'quiz'
        ? { pergunta: item.pergunta, opcoes: item.opcoes.map((o) => o.trim()), respostaCorreta: item.opcoes[item.correta].trim() }
        : { pergunta: item.pergunta, respostaCorreta: item.respostaCorreta }
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const problema = validar();
    if (problema) {
      setErro(problema);
      return;
    }

    setSalvando(true);
    try {
      await api.post('/atividades', { titulo, tipo, conteudo: montarConteudo() });
      setTitulo('');
      setItens([itemVazio()]);
      onCriada();
    } catch (err) {
      setErro(mensagemDeErro(err, 'Erro ao salvar a atividade.'));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>➕ Nova atividade</h2>
      {erro && <div role="alert" className="alerta alerta-erro">{erro}</div>}

      <div className="campo">
        <label htmlFor="titulo">Título da atividade</label>
        <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex.: Revisão de Administração - Capítulo 1" />
      </div>

      <div className="campo">
        <label htmlFor="tipo">Tipo de atividade</label>
        <select id="tipo" value={tipo} onChange={(e) => { setTipo(e.target.value); setItens([itemVazio()]); setErro(''); }}>
          <option value="quiz">Quiz (múltipla escolha)</option>
          <option value="verdadeiro_falso">Verdadeiro ou Falso</option>
          <option value="cartas">Jogo da Memória (cartas)</option>
          <option value="palavra_ausente">Palavra Ausente (completar a frase)</option>
        </select>
      </div>

      {itens.map((item, i) => (
        <fieldset key={i} className="item-form">
          <legend>{tipo === 'cartas' ? `Par ${i + 1}` : tipo === 'quiz' ? `Pergunta ${i + 1}` : `Item ${i + 1}`}</legend>

          <div className="campo">
            <label htmlFor={`pergunta-${i}`}>{r.pergunta}</label>
            <input id={`pergunta-${i}`} value={item.pergunta} onChange={(e) => alterarItem(i, { pergunta: e.target.value })} required placeholder={`Ex.: ${r.exP}`} />
          </div>

          {/* QUIZ: alternativas + marcar a correta */}
          {tipo === 'quiz' && (
            <div role="group" aria-labelledby={`alt-titulo-${i}`} className="alternativas">
              <p id={`alt-titulo-${i}`} className="rotulo">Alternativas: escreva e marque a correta ✔</p>
              {item.opcoes.map((opcao, p) => (
                <div key={p} className={`alternativa ${item.correta === p ? 'correta' : ''}`}>
                  <input
                    type="radio"
                    name={`correta-${i}`}
                    id={`correta-${i}-${p}`}
                    checked={item.correta === p}
                    onChange={() => alterarItem(i, { correta: p })}
                    aria-label={`Marcar a alternativa ${LETRAS[p]} como correta`}
                  />
                  <label htmlFor={`opcao-${i}-${p}`} className="letra">{LETRAS[p]}</label>
                  <input
                    id={`opcao-${i}-${p}`}
                    value={opcao}
                    onChange={(e) => alterarOpcao(i, p, e.target.value)}
                    placeholder={`Alternativa ${LETRAS[p]}`}
                  />
                  {item.opcoes.length > MIN_ALTERNATIVAS && (
                    <button type="button" className="btn-x" onClick={() => removerOpcao(i, p)} aria-label={`Remover alternativa ${LETRAS[p]}`}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {item.opcoes.length < MAX_ALTERNATIVAS && (
                <button type="button" className="btn-link" onClick={() => adicionarOpcao(i)}>
                  + Adicionar alternativa
                </button>
              )}
            </div>
          )}

          {/* OUTROS TIPOS: um campo de resposta */}
          {tipo !== 'quiz' && (
            <div className="campo">
              <label htmlFor={`resposta-${i}`}>{r.resposta}</label>
              {tipo === 'verdadeiro_falso' ? (
                <select id={`resposta-${i}`} value={item.respostaCorreta} onChange={(e) => alterarItem(i, { respostaCorreta: e.target.value })} required>
                  <option value="">Selecione...</option>
                  <option value="verdadeiro">Verdadeiro</option>
                  <option value="falso">Falso</option>
                </select>
              ) : (
                <input id={`resposta-${i}`} value={item.respostaCorreta} onChange={(e) => alterarItem(i, { respostaCorreta: e.target.value })} required placeholder={`Ex.: ${r.exR}`} />
              )}
            </div>
          )}

          {itens.length > 1 && (
            <button type="button" className="btn btn-perigo-claro" onClick={() => removerItem(i)} aria-label={`Remover item ${i + 1}`}>
              Remover {tipo === 'quiz' ? 'pergunta' : 'item'}
            </button>
          )}
        </fieldset>
      ))}

      <button type="button" className="btn btn-secundario" onClick={adicionarItem}>
        + Adicionar {tipo === 'cartas' ? 'outro par' : tipo === 'quiz' ? 'outra pergunta' : 'outro item'}
      </button>

      <button type="submit" className="btn btn-primario" disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar atividade'}
      </button>
    </form>
  );
}
