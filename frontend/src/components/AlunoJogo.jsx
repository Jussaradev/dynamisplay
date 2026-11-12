import { useState, useEffect } from 'react';
import axios from 'axios';

const COR_AZUL = '#084C61';
const COR_DOURADO = '#D4AF37';

export default function AlunoJogo({ atividadeId, onVoltar }) {
  const [atividade, setAtividade] = useState(null);
  const [nomeAluno, setNomeAluno] = useState('');
  const [jogoIniciado, setJogoIniciado] = useState(false);
  
  // Respostas e feedback
  const [respostaAluno, setRespostaAluno] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correto' ou 'incorreto'
  const [carregando, setCarregando] = useState(true);

  // Estado para Flashcards
  const [cartaVirada, setCartaVirada] = useState(false);

  useEffect(() => {
    const carregarAtividade = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/atividades/${atividadeId}`);
        setAtividade(res.data);
      } catch (err) {
        console.error('Erro ao carregar jogo:', err);
      } finally {
        setCarregando(false);
      }
    };
    carregarAtividade();
  }, [atividadeId]);

  const handleStartGame = (e) => {
    e.preventDefault();
    if (nomeAluno.trim() !== '') {
      setJogoIniciado(true);
    }
  };

  const handleResponderQuiz = (e) => {
    e.preventDefault();
    if (!atividade || !atividade.conteudo || atividade.conteudo.length === 0) return;
    
    const item = atividade.conteudo[0];
    const correta = String(item.respostaCorreta || '').trim().toLowerCase();
    const dada = respostaAluno.trim().toLowerCase();

    if (dada === correta) {
      setFeedback('correto');
    } else {
      setFeedback('incorreto');
    }
  };

  const handleResponderVF = (escolha) => {
    const item = atividade.conteudo[0];
    if (escolha === item.respostaCorreta) {
      setFeedback('correto');
    } else {
      setFeedback('incorreto');
    }
  };

  if (carregando) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: COR_AZUL }} role="status">
        <h2>A carregar o jogo... 🎮</h2>
      </div>
    );
  }

  if (!atividade) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#ef4444' }}>
        <h2>Atividade não encontrada.</h2>
        <button onClick={onVoltar} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: COR_AZUL, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Voltar para a Lista
        </button>
      </div>
    );
  }

  // TELA 1: Identificação do Aluno (Nome / Apelido)
  if (!jogoIniciado) {
    return (
      <div style={{ maxWidth: '480px', margin: '50px auto', padding: '35px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <button onClick={onVoltar} aria-label="Voltar para a lista de atividades" style={{ background: 'none', border: 'none', color: COR_AZUL, marginBottom: '20px', cursor: 'pointer', fontWeight: '600', float: 'left' }}>
          ← Voltar
        </button>
        <div style={{ clear: 'both' }} />

        <span style={{ padding: '4px 12px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {atividade.tipo.replace('_', ' ')}
        </span>
        <h2 style={{ color: COR_AZUL, marginTop: '15px', marginBottom: '8px' }}>{atividade.titulo}</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>Professor(a): {atividade.professor}</p>

        <form onSubmit={handleStartGame} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label htmlFor="input-apelido" style={{ fontWeight: '600', color: COR_AZUL, textAlign: 'left', fontSize: '0.95rem' }}>
            Digite o seu nome ou apelido para jogar:
          </label>
          <input
            id="input-apelido"
            type="text"
            value={nomeAluno}
            onChange={(e) => setNomeAluno(e.target.value)}
            required
            placeholder="Ex: Ana Souza ou Aninha"
            aria-label="Nome ou apelido do aluno"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '1rem' }}
          />
          <button type="submit" aria-label="Iniciar o desafio" style={{ padding: '12px', backgroundColor: COR_AZUL, color: '#fff', border: `1px solid ${COR_DOURADO}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
            Iniciar Desafio 🚀
          </button>
        </form>
      </div>
    );
  }

  // TELA 2: Execução do Jogo
  const item = atividade.conteudo[0] || {};

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
        <button onClick={onVoltar} aria-label="Sair da atividade" style={{ background: 'none', border: 'none', color: COR_AZUL, cursor: 'pointer', fontWeight: '600' }}>
          ← Sair
        </button>
        <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>
          Jogador: <strong style={{ color: COR_AZUL }}>{nomeAluno}</strong>
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h3 style={{ color: COR_AZUL, margin: '0 0 5px 0' }}>{atividade.titulo}</h3>
      </div>

      {/* FEEDBACK DE ACERTO / ERRO */}
      {feedback && (
        <div 
          role="alert" 
          aria-live="polite"
          style={{ padding: '15px', marginBottom: '20px', backgroundColor: feedback === 'correto' ? '#dcfce7' : '#fee2e2', color: feedback === 'correto' ? '#166534' : '#991b1b', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          {feedback === 'correto' ? `🎉 Excelente, ${nomeAluno}! Resposta Correta!` : `❌ Ops, ${nomeAluno}! Resposta Incorreta. Tente novamente!`}
        </div>
      )}

      {/* QUIZ */}
      {atividade.tipo === 'quiz' && (
        <form onSubmit={handleResponderQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>Pergunta: {item.pergunta}</p>
          <input 
            type="text" 
            value={respostaAluno} 
            onChange={(e) => setRespostaAluno(e.target.value)} 
            placeholder="Digite a sua resposta..." 
            required 
            aria-label="Sua resposta para a pergunta"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '1rem' }} 
          />
          <button type="submit" aria-label="Enviar resposta do quiz" style={{ padding: '12px', backgroundColor: COR_AZUL, color: '#fff', border: `1px solid ${COR_DOURADO}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            Responder
          </button>
        </form>
      )}

      {/* VERDADEIRO OU FALSO */}
      {atividade.tipo === 'verdadeiro_falso' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '25px' }}>Afirmação: "{item.afirmacao}"</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => handleResponderVF(true)} aria-label="Responder Verdadeiro" style={{ padding: '14px 28px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
              Verdadeiro
            </button>
            <button onClick={() => handleResponderVF(false)} aria-label="Responder Falso" style={{ padding: '14px 28px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
              Falso
            </button>
          </div>
        </div>
      )}

      {/* FLASHCARDS */}
      {atividade.tipo === 'cartas' && (
        <div style={{ textAlign: 'center' }}>
          <div 
            onClick={() => setCartaVirada(!cartaVirada)}
            role="button"
            tabIndex={0}
            aria-label="Virar a carta de estudo"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCartaVirada(!cartaVirada); }}
            style={{ 
              backgroundColor: cartaVirada ? '#f8fafc' : COR_AZUL, 
              color: cartaVirada ? COR_AZUL : '#fff', 
              padding: '40px 20px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              minHeight: '150px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}
          >
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px', opacity: 0.8 }}>
              {cartaVirada ? 'Verso (Definição)' : 'Frente (Termo)'}
            </span>
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>
              {cartaVirada ? item.definicao : item.termo}
            </h3>
          </div>
          <p style={{ marginTop: '15px', color: '#64748b', fontSize: '0.9rem' }}>👆 Clique na carta (ou pressione Enter) para virar.</p>
        </div>
      )}

      {/* PALAVRA AUSENTE */}
      {atividade.tipo === 'palavra_ausente' && (
        <form onSubmit={handleResponderQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>Complete a frase:</p>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: COR_AZUL, backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
            "{item.frase}"
          </p>
          <input 
            type="text" 
            value={respostaAluno} 
            onChange={(e) => setRespostaAluno(e.target.value)} 
            placeholder="Digite a palavra ausente..." 
            required 
            aria-label="Palavra para preencher a lacuna"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '1rem' }} 
          />
          <button type="submit" aria-label="Verificar palavra informada" style={{ padding: '12px', backgroundColor: COR_AZUL, color: '#fff', border: `1px solid ${COR_DOURADO}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            Verificar Resposta
          </button>
        </form>
      )}
    </div>
  );
}