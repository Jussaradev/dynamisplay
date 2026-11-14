// Inicio.jsx - Aba "Início": apresentação da plataforma.
export default function Inicio({ onVerAtividades, onProfessor }) {
  return (
    <section className="container">
      <div className="hero">
        <h1>DynamiSplay</h1>
        <p className="slogan">"Transformando aprendizado em experiência"</p>
        <p className="hero-texto">
          Crie quizzes, jogos da memória e desafios em poucos minutos e compartilhe com a turma por link ou QR Code.
        </p>
        <div className="acoes centro">
          <button className="btn btn-primario btn-grande" onClick={onVerAtividades}>🎯 Sou aluno: quero jogar</button>
          <button className="btn btn-dourado btn-grande" onClick={onProfessor}>👩‍🏫 Sou professor: quero criar</button>
        </div>
      </div>

      <h2 className="titulo-centro">Como funciona</h2>
      <ol className="passos">
        <li className="cartao">
          <span className="passo-icone" aria-hidden="true">✏️</span>
          <h3>1. O professor cria</h3>
          <p>Escolha o tipo de jogo, escreva as perguntas e salve. Sem complicação.</p>
        </li>
        <li className="cartao">
          <span className="passo-icone" aria-hidden="true">📲</span>
          <h3>2. Compartilha com a turma</h3>
          <p>Cada atividade tem link e QR Code. Cole no Teams ou projete na sala.</p>
        </li>
        <li className="cartao">
          <span className="passo-icone" aria-hidden="true">📊</span>
          <h3>3. Acompanha os resultados</h3>
          <p>Veja quantos alunos jogaram, a média de acertos e o tempo gasto.</p>
        </li>
      </ol>

      <h2 className="titulo-centro">Tipos de atividade</h2>
      <ul className="tipos">
        <li><strong>❓ Quiz</strong><span>Perguntas de múltipla escolha</span></li>
        <li><strong>✅ Verdadeiro ou Falso</strong><span>Afirmações para julgar</span></li>
        <li><strong>🃏 Jogo da Memória</strong><span>Junte o termo à definição</span></li>
        <li><strong>✍️ Palavra Ausente</strong><span>Complete a frase</span></li>
      </ul>
    </section>
  );
}
