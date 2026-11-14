// App.jsx - Componente principal. Decide qual "tela" mostrar.
// Telas: 'inicio', 'atividades' (lista para alunos), 'login', 'painel' (professor), 'jogar'
import { useState } from 'react';
import Inicio from './components/Inicio';
import Atividades from './components/Atividades';
import Auth from './components/Auth';
import PainelProfessor from './components/PainelProfessor';
import AlunoJogo from './components/AlunoJogo';

// Se o link tiver ?atividade=ID (ex.: veio do QR Code), já abre o jogo
const atividadeDoLink = new URLSearchParams(window.location.search).get('atividade');

function lerUsuarioSalvo() {
  try {
    return JSON.parse(localStorage.getItem('usuario')) || null;
  } catch {
    return null;
  }
}

export default function App() {
  const [tela, setTela] = useState(atividadeDoLink ? 'jogar' : 'inicio');
  const [atividadeId, setAtividadeId] = useState(atividadeDoLink);
  const [usuario, setUsuario] = useState(lerUsuarioSalvo);

  const irPara = (novaTela) => {
    setTela(novaTela);
    window.scrollTo(0, 0);
  };

  const handleLoginSucesso = ({ token, usuario }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuario(usuario);
    irPara('painel');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    irPara('inicio');
  };

  const jogar = (id) => {
    setAtividadeId(id);
    irPara('jogar');
  };

  // Volta para uma aba pública e limpa o ?atividade= da barra de endereço
  const voltarPara = (aba) => {
    window.history.replaceState(null, '', window.location.pathname);
    irPara(aba);
  };
  const voltarParaInicio = () => voltarPara('inicio');
  const voltarParaAtividades = () => voltarPara('atividades');

  // Abas do menu superior (aria-current indica a página atual ao leitor de tela)
  const abaMenu = (id, rotulo) => (
    <button
      className={`menu-aba ${tela === id ? 'ativa' : ''}`}
      aria-current={tela === id ? 'page' : undefined}
      onClick={() => voltarPara(id)}
    >
      {rotulo}
    </button>
  );

  return (
    <>
      {/* Acessibilidade: permite pular direto para o conteúdo usando o teclado */}
      <a href="#conteudo" className="pular-link">Pular para o conteúdo</a>

      <header className="cabecalho">
        <button className="logo" onClick={voltarParaInicio} aria-label="DynamiSplay - ir para a página inicial">
          🎮 DynamiSplay
        </button>
        <nav aria-label="Páginas" className="menu-abas">
          {abaMenu('inicio', '🏠 Início')}
          {abaMenu('atividades', '🎯 Atividades')}
        </nav>
        <nav aria-label="Conta" className="menu">
          {usuario ? (
            <>
              <span className="ola">Olá, <strong>{usuario.nome}</strong></span>
              <button className="btn btn-dourado" onClick={() => irPara('painel')}>Painel do Professor</button>
              <button className="btn btn-perigo" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <button className="btn btn-dourado" onClick={() => irPara('login')}>Área do Professor (Entrar)</button>
          )}
        </nav>
      </header>

      <main id="conteudo" tabIndex={-1}>
        {tela === 'inicio' && <Inicio onVerAtividades={voltarParaAtividades} onProfessor={() => irPara(usuario ? 'painel' : 'login')} />}

        {tela === 'atividades' && <Atividades onJogar={jogar} />}

        {tela === 'login' && <Auth onLoginSucesso={handleLoginSucesso} onVoltar={voltarParaInicio} />}

        {tela === 'painel' && usuario && <PainelProfessor usuario={usuario} onJogar={jogar} />}
        {tela === 'painel' && !usuario && <Auth onLoginSucesso={handleLoginSucesso} onVoltar={voltarParaInicio} />}

        {tela === 'jogar' && <AlunoJogo atividadeId={atividadeId} onVoltar={voltarParaAtividades} />}
      </main>

      <footer className="rodape">
        DynamiSplay · Projeto Integrador em Computação II · UNIVESP
      </footer>
    </>
  );
}
