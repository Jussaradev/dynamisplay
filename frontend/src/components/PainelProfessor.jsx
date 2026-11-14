// PainelProfessor.jsx - Área do professor com 3 abas:
// Minhas atividades (biblioteca) | Criar atividade | Relatórios
import { useCallback, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api, { mensagemDeErro } from '../api';
import { TIPOS } from '../utils/jogo';
import CriarAtividade from './CriarAtividade';
import Relatorios from './Relatorios';

const ABAS = [
  { id: 'biblioteca', rotulo: '📚 Minhas atividades' },
  { id: 'criar', rotulo: '➕ Criar atividade' },
  { id: 'relatorios', rotulo: '📊 Relatórios' }
];

// Link que o aluno abre (pelo QR Code) para jogar direto
const linkDoJogo = (id) => `${window.location.origin}/?atividade=${id}`;

export default function PainelProfessor({ usuario, onJogar }) {
  const [aba, setAba] = useState('biblioteca');
  const [atividades, setAtividades] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const carregar = useCallback(async () => {
    try {
      const res = await api.get('/atividades/minhas');
      setAtividades(res.data);
    } catch (err) {
      setMensagem(mensagemDeErro(err, 'Erro ao carregar suas atividades.'));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  const apagar = async (atv) => {
    if (!window.confirm(`Apagar a atividade "${atv.titulo}"?`)) return;
    try {
      await api.delete(`/atividades/${atv._id}`);
      setMensagem('Atividade apagada.');
      carregar();
    } catch (err) {
      setMensagem(mensagemDeErro(err, 'Erro ao apagar atividade.'));
    }
  };

  const copiarLink = async (id) => {
    try {
      await navigator.clipboard.writeText(linkDoJogo(id));
      setMensagem('Link copiado! Cole no Teams ou no chat da turma.');
    } catch {
      setMensagem(`Link da atividade: ${linkDoJogo(id)}`);
    }
  };

  const aposCriar = () => {
    setMensagem('Atividade criada com sucesso! 🚀');
    carregar();
    setAba('biblioteca');
  };

  return (
    <section className="container">
      <h1>Painel do Professor</h1>
      <p>Bem-vindo(a), <strong>{usuario.nome}</strong>!</p>

      {/* Abas acessíveis: role="tablist" + aria-selected */}
      <div role="tablist" aria-label="Seções do painel" className="abas">
        {ABAS.map((a) => (
          <button
            key={a.id}
            role="tab"
            id={`aba-${a.id}`}
            aria-selected={aba === a.id}
            aria-controls={`painel-${a.id}`}
            className={`aba ${aba === a.id ? 'ativa' : ''}`}
            onClick={() => { setAba(a.id); setMensagem(''); }}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {mensagem && <p className={`alerta ${mensagem.includes('Erro') ? 'alerta-erro' : 'alerta-ok'}`}>{mensagem}</p>}
      </div>

      <div role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`} className="cartao">
        {aba === 'biblioteca' && (
          <>
            <h2>📚 Suas atividades</h2>
            {atividades.length === 0 ? (
              <p className="vazio">
                Você ainda não criou atividades.{' '}
                <button className="btn-link" onClick={() => setAba('criar')}>Criar a primeira agora →</button>
              </p>
            ) : (
              <ul className="lista">
                {atividades.map((atv) => (
                  <li key={atv._id} className="linha-atividade">
                    <div className="info">
                      <span className="etiqueta">{TIPOS[atv.tipo]}</span>
                      <h3>{atv.titulo}</h3>
                      <p className="detalhe">{atv.conteudo.length} item(ns)</p>
                      <div className="acoes">
                        <button className="btn btn-primario" onClick={() => onJogar(atv._id)}>Testar</button>
                        <button className="btn btn-secundario" onClick={() => copiarLink(atv._id)}>Copiar link</button>
                        <button className="btn btn-perigo-claro" onClick={() => apagar(atv)}>Apagar</button>
                      </div>
                    </div>
                    <QRCodeSVG
                      value={linkDoJogo(atv._id)}
                      size={90}
                      role="img"
                      aria-label={`QR Code para os alunos abrirem a atividade ${atv.titulo}`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {aba === 'criar' && <CriarAtividade onCriada={aposCriar} />}

        {aba === 'relatorios' && <Relatorios />}
      </div>
    </section>
  );
}
