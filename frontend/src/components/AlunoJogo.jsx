// AlunoJogo.jsx - Tela do aluno: identifica, joga e vê o resultado.
// O resultado é enviado para o backend e aparece nos Relatórios do professor.
import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../api';
import { TIPOS, embaralhar, verificarResposta } from '../utils/jogo';
import JogoMemoria from './JogoMemoria';

export default function AlunoJogo({ atividadeId, onVoltar }) {
  const [atividade, setAtividade] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [nomeAluno, setNomeAluno] = useState('');
  const [etapa, setEtapa] = useState('nome'); // 'nome' -> 'jogando' -> 'fim'

  const [indice, setIndice] = useState(0);        // item atual
  const [resposta, setResposta] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correto' | 'incorreto'
  const [escolhida, setEscolhida] = useState(null); // alternativa clicada no quiz
  const [acertos, setAcertos] = useState(0);
  const [placarFinal, setPlacarFinal] = useState(null);
  const inicio = useRef(0);

  useEffect(() => {
    api
      .get(`/atividades/${atividadeId}`)
      .then((res) => setAtividade(res.data))
      .catch(() => setAtividade(null))
      .finally(() => setCarregando(false));
  }, [atividadeId]);

  const comecar = (e) => {
    e.preventDefault();
    if (!nomeAluno.trim()) return;
    inicio.current = Date.now();
    setEtapa('jogando');
  };

  // Encerra o jogo e salva o resultado (se falhar, o aluno vê o placar mesmo assim)
  const finalizar = (totalAcertos, total) => {
    const tempoSegundos = Math.round((Date.now() - inicio.current) / 1000);
    setPlacarFinal({ acertos: totalAcertos, total, tempoSegundos });
    setEtapa('fim');
    api
      .post('/resultados', { atividadeId, nomeAluno, acertos: totalAcertos, total, tempoSegundos })
      .catch((err) => console.error('Não foi possível salvar o resultado:', err));
  };

  const responder = (valor) => {
    if (feedback) return; // já respondeu este item
    const item = atividade.conteudo[indice];
    const certo = verificarResposta(valor, item.respostaCorreta);
    setEscolhida(valor);
    setFeedback(certo ? 'correto' : 'incorreto');
    if (certo) setAcertos((a) => a + 1);
  };

  const proximo = () => {
    const ultimo = indice === atividade.conteudo.length - 1;
    if (ultimo) {
      finalizar(acertos, atividade.conteudo.length);
    } else {
      setIndice(indice + 1);
      setResposta('');
      setFeedback(null);
      setEscolhida(null);
    }
  };

  const jogarDeNovo = () => {
    setIndice(0); setResposta(''); setFeedback(null); setEscolhida(null); setAcertos(0); setPlacarFinal(null);
    inicio.current = Date.now();
    setEtapa('jogando');
  };

  // Alternativas do quiz embaralhadas (mudam só quando troca de pergunta)
  const itemAtual = atividade?.conteudo?.[indice];
  const alternativas = useMemo(
    () => (itemAtual?.opcoes?.length ? embaralhar(itemAtual.opcoes) : []),
    [itemAtual]
  );

  if (carregando) return <p className="container" role="status">Carregando o jogo... 🎮</p>;

  if (!atividade) {
    return (
      <section className="container estreito">
        <div className="cartao titulo-centro">
          <h1>Atividade não encontrada 😕</h1>
          <button className="btn btn-primario" onClick={onVoltar}>Ver outras atividades</button>
        </div>
      </section>
    );
  }

  const cabecalhoJogo = (
    <div className="topo-jogo">
      <button className="btn-link" onClick={onVoltar}>← Sair</button>
      {etapa !== 'nome' && <span>Jogador(a): <strong>{nomeAluno}</strong></span>}
    </div>
  );

  // ETAPA 1 - nome do aluno
  if (etapa === 'nome') {
    return (
      <section className="container estreito">
        <div className="cartao">
          {cabecalhoJogo}
          <span className="etiqueta">{TIPOS[atividade.tipo]}</span>
          <h1>{atividade.titulo}</h1>
          <p className="detalhe">Professor(a): {atividade.professor}</p>
          <form onSubmit={comecar} className="formulario">
            <div className="campo">
              <label htmlFor="apelido">Digite seu nome ou apelido</label>
              <input id="apelido" value={nomeAluno} onChange={(e) => setNomeAluno(e.target.value)} required autoFocus />
            </div>
            <button type="submit" className="btn btn-primario">Começar 🚀</button>
          </form>
        </div>
      </section>
    );
  }

  // ETAPA 3 - fim de jogo
  if (etapa === 'fim') {
    const pct = Math.round((placarFinal.acertos / placarFinal.total) * 100);
    return (
      <section className="container estreito">
        <div className="cartao titulo-centro" role="status" aria-live="polite">
          <h1>{pct >= 70 ? '🏆 Mandou bem' : '💪 Boa tentativa'}, {nomeAluno}!</h1>
          {atividade.tipo === 'cartas' ? (
            <p className="placar">Você achou os {atividade.conteudo.length} pares em {placarFinal.total} tentativas.</p>
          ) : (
            <p className="placar">Você acertou {placarFinal.acertos} de {placarFinal.total} ({pct}%).</p>
          )}
          <p>Tempo: {placarFinal.tempoSegundos} segundos</p>
          <div className="acoes centro">
            <button className="btn btn-primario" onClick={jogarDeNovo}>Jogar de novo</button>
            <button className="btn btn-secundario" onClick={onVoltar}>Outras atividades</button>
          </div>
        </div>
      </section>
    );
  }

  // ETAPA 2 - jogando
  if (atividade.tipo === 'cartas') {
    return (
      <section className="container">
        <div className="cartao">
          {cabecalhoJogo}
          <h1>{atividade.titulo}</h1>
          <JogoMemoria conteudo={atividade.conteudo} onFim={(tentativas) => finalizar(atividade.conteudo.length, tentativas)} />
        </div>
      </section>
    );
  }

  const item = atividade.conteudo[indice];
  const total = atividade.conteudo.length;

  return (
    <section className="container estreito">
      <div className="cartao">
        {cabecalhoJogo}
        <h1>{atividade.titulo}</h1>
        <p className="detalhe" aria-live="polite">Item {indice + 1} de {total} · Acertos: {acertos}</p>
        <progress value={indice + (feedback ? 1 : 0)} max={total} aria-label="Progresso na atividade" />

        {atividade.tipo === 'verdadeiro_falso' && (
          <>
            <p className="enunciado">"{item.pergunta}"</p>
            <div className="acoes centro">
              <button className="btn btn-verde" onClick={() => responder('verdadeiro')} disabled={!!feedback}>Verdadeiro</button>
              <button className="btn btn-vermelho" onClick={() => responder('falso')} disabled={!!feedback}>Falso</button>
            </div>
          </>
        )}

        {/* QUIZ DE MÚLTIPLA ESCOLHA: um botão para cada alternativa */}
        {atividade.tipo === 'quiz' && alternativas.length > 0 && (
          <>
            <p className="enunciado" id="enunciado">{item.pergunta}</p>
            <ul className="opcoes" aria-labelledby="enunciado">
              {alternativas.map((opcao, p) => {
                const ehCorreta = feedback && verificarResposta(opcao, item.respostaCorreta);
                const errouEsta = feedback && opcao === escolhida && !ehCorreta;
                return (
                  <li key={opcao}>
                    <button
                      className={`opcao ${ehCorreta ? 'certa' : ''} ${errouEsta ? 'errada' : ''}`}
                      onClick={() => responder(opcao)}
                      disabled={!!feedback}
                    >
                      <span className="letra">{['A', 'B', 'C', 'D', 'E'][p]}</span> {opcao}
                      {ehCorreta && ' ✔'}
                      {errouEsta && ' ✘'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* RESPOSTA ESCRITA: palavra ausente (e quizzes antigos, sem alternativas) */}
        {(atividade.tipo === 'palavra_ausente' || (atividade.tipo === 'quiz' && alternativas.length === 0)) && (
          <form onSubmit={(e) => { e.preventDefault(); responder(resposta); }} className="formulario">
            <p className="enunciado">
              {atividade.tipo === 'palavra_ausente' ? `Complete: "${item.pergunta}"` : item.pergunta}
            </p>
            <div className="campo">
              <label htmlFor="resposta">Sua resposta</label>
              <input id="resposta" value={resposta} onChange={(e) => setResposta(e.target.value)} required disabled={!!feedback} autoFocus />
            </div>
            {!feedback && <button type="submit" className="btn btn-primario">Responder</button>}
          </form>
        )}

        {/* role="alert" faz o leitor de tela anunciar o resultado */}
        {feedback && (
          <div role="alert" className={`alerta ${feedback === 'correto' ? 'alerta-ok' : 'alerta-erro'}`}>
            {feedback === 'correto'
              ? '🎉 Resposta correta!'
              : `❌ Não foi dessa vez. Resposta certa: ${item.respostaCorreta}`}
          </div>
        )}
        {feedback && (
          <button className="btn btn-primario" onClick={proximo} autoFocus>
            {indice === total - 1 ? 'Ver resultado' : 'Próximo →'}
          </button>
        )}
      </div>
    </section>
  );
}
