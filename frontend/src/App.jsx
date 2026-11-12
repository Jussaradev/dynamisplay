/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import AlunoJogo from './components/AlunoJogo';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const COR_AZUL = '#084C61';
const COR_DOURADO = '#D4AF37';

export default function App() {
  const [tela, setTela] = useState('home'); // 'home', 'login', 'dashboard', 'jogar'
  const [atividadeSelecionadaId, setAtividadeSelecionadaId] = useState(null);
  
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  // Estados do formulário de criação (Professor)
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('quiz');
  const [pergunta, setPergunta] = useState('');
  const [respostaCorreta, setRespostaCorreta] = useState('');
  const [termoCarta, setTermoCarta] = useState('');
  const [definicaoCarta, setDefinicaoCarta] = useState('');
  const [fraseCompleta, setFraseCompleta] = useState('');
  const [palavraOculta, setPalavraOculta] = useState('');
  const [mensagemAtividade, setMensagemAtividade] = useState('');
  
  // Lista de atividades gerais
  const [atividades, setAtividades] = useState([]);

  const carregarAtividades = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/atividades');
      setAtividades(res.data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  // Carrega as atividades na primeira montagem do componente
  useEffect(() => {
    carregarAtividades();
  }, []);

  useEffect(() => {
    // Carrega atividades sempre que estiver na home ou dashboard
    carregarAtividades();
  }, [tela]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setTela('home');
  };

  const handleCriarAtividade = async (e) => {
    e.preventDefault();
    setMensagemAtividade('');

    let conteudoEstruturado = [];
    if (tipo === 'quiz') {
      conteudoEstruturado = [{ pergunta, respostaCorreta }];
    } else if (tipo === 'verdadeiro_falso') {
      conteudoEstruturado = [{ afirmacao: pergunta, respostaCorreta: respostaCorreta === 'verdadeiro' }];
    } else if (tipo === 'cartas') {
      conteudoEstruturado = [{ termo: termoCarta, definicao: definicaoCarta }];
    } else if (tipo === 'palavra_ausente') {
      conteudoEstruturado = [{ frase: fraseCompleta, respostaCorreta: palavraOculta }];
    }

    try {
      const novaAtividade = {
        titulo,
        tipo,
        professor: usuario?.nome || 'Professor',
        conteudo: conteudoEstruturado
      };

      await axios.post('http://localhost:5000/api/atividades', novaAtividade);
      setMensagemAtividade('Atividade criada e guardada com sucesso! 🚀');
      
      setTitulo('');
      setPergunta('');
      setRespostaCorreta('');
      setTermoCarta('');
      setDefinicaoCarta('');
      setFraseCompleta('');
      setPalavraOculta('');

      carregarAtividades();
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      setMensagemAtividade('Erro ao salvar atividade. Verifique o servidor.');
    }
  };

  const handleDeletarAtividade = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar esta atividade?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/atividades/${id}`);
      carregarAtividades();
    } catch (error) {
      console.error('Erro ao apagar atividade:', error);
      alert('Erro ao apagar atividade.');
    }
  };

  const iniciarJogo = (id) => {
    setAtividadeSelecionadaId(id);
    setTela('jogar');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', margin: 0, padding: 0, backgroundColor: '#fcfcfc', minHeight: '100vh', color: '#222' }}>
      
      {/* Cabeçalho */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: COR_AZUL, color: '#fff', borderBottom: `3px solid ${COR_DOURADO}` }}>
        <h1 role="button" tabIndex={0} onClick={() => setTela('home')} style={{ margin: 0, fontSize: '1.6rem', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}>
          🎮 Dynamisplay
        </h1>
        <div>
          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Olá, <strong>{usuario.nome}</strong></span>
              <button onClick={() => setTela('dashboard')} style={{ padding: '8px 14px', backgroundColor: COR_DOURADO, color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Painel Professor</button>
              <button onClick={handleLogout} style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sair</button>
            </div>
          ) : (
            <button onClick={() => setTela('login')} style={{ padding: '9px 18px', backgroundColor: COR_DOURADO, color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Área do Professor (Entrar)
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main>
        {tela === 'home' && (
          <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: '800', color: COR_AZUL }}>Dynamisplay</h2>
            <p style={{ fontSize: '1.3rem', color: COR_DOURADO, fontStyle: 'italic', margin: '0 0 25px 0', fontWeight: '600' }}>
              "Transformando aprendizado em experiência"
            </p>
            <p style={{ fontSize: '1.05rem', color: '#555', maxWidth: '650px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
              Plataforma gamificada para estudantes e professores. Escolha uma atividade abaixo criada pelos docentes e teste os seus conhecimentos de forma interativa!
            </p>

            {/* Lista de Atividades Públicas para os Alunos */}
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'left' }}>
              <h3 style={{ color: COR_AZUL, marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                🎯 Atividades Disponíveis para Jogar
              </h3>

              {atividades.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Nenhuma atividade cadastrada no momento. Faça login como professor para criar a primeira!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {atividades.map((atv) => (
                    <div key={atv._id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ display: 'inline-block', padding: '3px 8px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>
                          {atv.tipo.replace('_', ' ')}
                        </span>
                        <h4 style={{ margin: '0 0 8px 0', color: COR_AZUL, fontSize: '1.1rem' }}>{atv.titulo}</h4>
                        <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: '#64748b' }}>Prof.º(a): {atv.professor}</p>
                      </div>
                      <button 
                        onClick={() => iniciarJogo(atv._id)}
                        aria-label={`Jogar atividade ${atv.titulo}`}
                        style={{ padding: '10px', backgroundColor: COR_AZUL, color: '#fff', border: `1px solid ${COR_DOURADO}`, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                      >
                        Jogar Agora 🎮
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {tela === 'login' && (
          <Auth 
            onLoginSucesso={(user) => { setUsuario(user); setTela('dashboard'); }} 
            onVoltarHome={() => setTela('home')} 
          />
        )}

        {tela === 'jogar' && (
          <AlunoJogo 
            atividadeId={atividadeSelecionadaId} 
            onVoltar={() => setTela('home')} 
          />
        )}

        {tela === 'dashboard' && (
          <section style={{ padding: '40px 20px', maxWidth: '850px', margin: '0 auto' }}>
            {/* Formulário de Criação do Professor */}
            <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '40px' }}>
              <h2 style={{ color: COR_AZUL, marginTop: 0 }}>📋 Criar Nova Atividade</h2>
              <p style={{ color: '#64748b', marginBottom: '25px' }}>Bem-vindo(a), <strong>{usuario?.nome}</strong>! Preencha os campos abaixo para registar o conteúdo.</p>
              
              {mensagemAtividade && (
                <div role="alert" style={{ padding: '12px', marginBottom: '20px', backgroundColor: mensagemAtividade.includes('sucesso') ? '#dcfce7' : '#fee2e2', color: mensagemAtividade.includes('sucesso') ? '#166534' : '#991b1b', borderRadius: '6px', fontWeight: '500' }}>
                  {mensagemAtividade}
                </div>
              )}

              <form onSubmit={handleCriarAtividade} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Título da Atividade:</label>
                  <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Revisão de Administração - Capítulo 1" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Tipo de Atividade:</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                    <option value="quiz">Quiz Interativo</option>
                    <option value="cartas">Jogo de Cartas (Flashcards)</option>
                    <option value="palavra_ausente">Palavra Ausente</option>
                    <option value="verdadeiro_falso">Verdadeiro ou Falso</option>
                  </select>
                </div>

                {tipo === 'quiz' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Pergunta:</label>
                      <input type="text" value={pergunta} onChange={(e) => setPergunta(e.target.value)} required placeholder="Ex: Qual a função do Planeamento?" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Resposta Correta:</label>
                      <input type="text" value={respostaCorreta} onChange={(e) => setRespostaCorreta(e.target.value)} required placeholder="Ex: Definir objetivos" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                  </>
                )}

                {tipo === 'verdadeiro_falso' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Afirmação:</label>
                      <input type="text" value={pergunta} onChange={(e) => setPergunta(e.target.value)} required placeholder="Ex: O capital de giro é de curto prazo." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Verdadeiro ou Falso?</label>
                      <select value={respostaCorreta} onChange={(e) => setRespostaCorreta(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                        <option value="">Selecione...</option>
                        <option value="verdadeiro">Verdadeiro</option>
                        <option value="falso">Falso</option>
                      </select>
                    </div>
                  </>
                )}

                {tipo === 'cartas' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Termo (Frente):</label>
                      <input type="text" value={termoCarta} onChange={(e) => setTermoCarta(e.target.value)} required placeholder="Ex: SWOT" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Definição (Verso):</label>
                      <input type="text" value={definicaoCarta} onChange={(e) => setDefinicaoCarta(e.target.value)} required placeholder="Ex: Forças, Oportunidades, Fraquezas e Ameaças" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                  </>
                )}

                {tipo === 'palavra_ausente' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Frase com lacuna (use ___):</label>
                      <input type="text" value={fraseCompleta} onChange={(e) => setFraseCompleta(e.target.value)} required placeholder="Ex: A gestão divide-se em planejar, organizar e ___." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: COR_AZUL }}>Palavra Oculta:</label>
                      <input type="text" value={palavraOculta} onChange={(e) => setPalavraOculta(e.target.value)} required placeholder="Ex: controlar" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                    </div>
                  </>
                )}

                <button type="submit" style={{ padding: '12px', backgroundColor: COR_AZUL, color: 'white', border: `1px solid ${COR_DOURADO}`, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
                  Guardar Atividade no Sistema
                </button>
              </form>
            </div>

            {/* Gestão de Atividades do Professor */}
            <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h2 style={{ color: COR_AZUL, marginTop: 0 }}>📚 Suas Atividades Cadastradas</h2>
              {atividades.length === 0 ? (
                <p style={{ color: '#64748b' }}>Nenhuma atividade cadastrada ainda.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  {atividades.map((atv) => (
                    <div key={atv._id} style={{ padding: '18px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: COR_AZUL, fontSize: '1.1rem' }}>{atv.titulo}</h4>
                        <span style={{ display: 'inline-block', padding: '3px 8px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '5px' }}>
                          {atv.tipo.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
  <div style={{ textAlign: 'center' }}>
    <QRCodeSVG value="http://localhost:5173" size={60} />
  </div>
  <button 
    onClick={() => handleDeletarAtividade(atv._id)}
    style={{ padding: '8px 12px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', height: 'fit-content' }}
  >
    Apagar
  </button>
</div>
                      <button 
                        onClick={() => handleDeletarAtividade(atv._id)}
                        style={{ padding: '8px 12px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                      >
                        Apagar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}