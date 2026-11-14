// JogoMemoria.jsx - Jogo da memória: o aluno vira 2 cartas por vez
// tentando juntar cada TERMO com a sua DEFINIÇÃO.
import { useState } from 'react';
import { montarCartasMemoria } from '../utils/jogo';

export default function JogoMemoria({ conteudo, onFim }) {
  const [cartas] = useState(() => montarCartasMemoria(conteudo)); // embaralha uma vez só
  const [abertas, setAbertas] = useState([]);    // ids das cartas viradas agora (máx. 2)
  const [achadas, setAchadas] = useState([]);    // números dos pares já encontrados
  const [tentativas, setTentativas] = useState(0);
  const [aviso, setAviso] = useState('');

  const virar = (carta) => {
    if (abertas.length === 2 || abertas.includes(carta.id) || achadas.includes(carta.par)) return;

    const novasAbertas = [...abertas, carta.id];
    setAbertas(novasAbertas);
    if (novasAbertas.length < 2) return;

    // Duas cartas abertas: confere se formam par
    const novasTentativas = tentativas + 1;
    setTentativas(novasTentativas);
    const [a, b] = novasAbertas.map((id) => cartas.find((c) => c.id === id));

    if (a.par === b.par) {
      const novasAchadas = [...achadas, a.par];
      setAchadas(novasAchadas);
      setAbertas([]);
      setAviso(`Par encontrado: ${conteudo[a.par].pergunta}!`);
      if (novasAchadas.length === conteudo.length) onFim(novasTentativas);
    } else {
      setAviso('Não formam par. Tente de novo.');
      setTimeout(() => setAbertas([]), 1000); // desvira depois de 1 segundo
    }
  };

  return (
    <div>
      <p className="detalhe">Pares: {achadas.length} de {conteudo.length} · Tentativas: {tentativas}</p>
      <p className="sr-only" aria-live="polite">{aviso}</p>

      <ul className="memoria" aria-label="Cartas do jogo da memória">
        {cartas.map((carta, i) => {
          const visivel = abertas.includes(carta.id) || achadas.includes(carta.par);
          return (
            <li key={carta.id}>
              <button
                className={`carta ${visivel ? 'virada' : ''} ${achadas.includes(carta.par) ? 'achada' : ''}`}
                onClick={() => virar(carta)}
                aria-label={visivel ? `${carta.lado}: ${carta.texto}` : `Carta ${i + 1}, virada para baixo`}
                aria-pressed={visivel}
              >
                {visivel ? (
                  <>
                    <small>{carta.lado}</small>
                    <span>{carta.texto}</span>
                  </>
                ) : (
                  '❓'
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
