// Atividades.jsx - Aba "Atividades": lista pública para os alunos jogarem,
// com busca pelo nome e filtro por tipo de jogo.
import { useEffect, useState } from 'react';
import api from '../api';
import { TIPOS, normalizar } from '../utils/jogo';

export default function Atividades({ onJogar }) {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    api
      .get('/atividades')
      .then((res) => setAtividades(res.data))
      .catch(() => setErro('Não foi possível carregar as atividades. O servidor está ligado?'))
      .finally(() => setCarregando(false));
  }, []);

  // Aplica a busca e o filtro (sem acentos e sem diferenciar maiúsculas)
  const visiveis = atividades.filter(
    (atv) =>
      (filtroTipo === 'todos' || atv.tipo === filtroTipo) &&
      (normalizar(atv.titulo).includes(normalizar(busca)) || normalizar(atv.professor).includes(normalizar(busca)))
  );

  return (
    <section className="container">
      <h1>🎯 Atividades</h1>
      <p>Escolha uma atividade e teste seus conhecimentos!</p>

      <div className="cartao">
        <div className="filtros">
          <div className="campo">
            <label htmlFor="busca">Buscar por título ou professor</label>
            <input id="busca" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: Administração" />
          </div>

          <div role="group" aria-label="Filtrar por tipo de jogo" className="chips">
            {[['todos', 'Todos'], ...Object.entries(TIPOS)].map(([valor, rotulo]) => (
              <button
                key={valor}
                className={`chip ${filtroTipo === valor ? 'ativo' : ''}`}
                aria-pressed={filtroTipo === valor}
                onClick={() => setFiltroTipo(valor)}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </div>

        {carregando && <p role="status">Carregando atividades...</p>}
        {erro && <p role="alert" className="alerta alerta-erro">{erro}</p>}
        {!carregando && !erro && visiveis.length === 0 && (
          <p className="vazio">
            {atividades.length === 0 ? 'Nenhuma atividade cadastrada ainda.' : 'Nenhuma atividade encontrada com esse filtro.'}
          </p>
        )}

        <p className="sr-only" aria-live="polite">{!carregando && `${visiveis.length} atividade(s) encontrada(s)`}</p>

        <ul className="grade" aria-label="Lista de atividades">
          {visiveis.map((atv) => (
            <li key={atv._id} className="item-atividade">
              <span className="etiqueta">{TIPOS[atv.tipo] || atv.tipo}</span>
              <h2 className="titulo-card">{atv.titulo}</h2>
              <p className="detalhe">Prof.(a) {atv.professor} · {atv.conteudo.length} item(ns)</p>
              <button className="btn btn-primario" onClick={() => onJogar(atv._id)} aria-label={`Jogar a atividade ${atv.titulo}`}>
                Jogar agora 🎮
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
