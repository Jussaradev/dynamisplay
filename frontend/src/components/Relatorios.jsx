// Relatorios.jsx - Análise de dados: desempenho dos alunos em cada atividade.
// Usa a biblioteca Chart.js (através do react-chartjs-2) para desenhar o gráfico.
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api, { mensagemDeErro } from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Relatorios() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api
      .get('/resultados/resumo')
      .then((res) => setDados(res.data))
      .catch((err) => setErro(mensagemDeErro(err, 'Erro ao carregar relatório.')))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p role="status">Carregando relatório...</p>;
  if (erro) return <p role="alert" className="alerta alerta-erro">{erro}</p>;

  const jogadas = dados.filter((d) => d.participacoes > 0);

  return (
    <div>
      <h2>📊 Relatório de desempenho</h2>

      {jogadas.length === 0 ? (
        <p className="vazio">Ainda não há resultados. Compartilhe o link ou QR Code de uma atividade com a turma!</p>
      ) : (
        <div className="grafico">
          <Bar
            aria-label="Gráfico de barras com o percentual médio de acertos por atividade"
            role="img"
            data={{
              labels: jogadas.map((d) => d.titulo),
              datasets: [{ label: '% médio de acertos', data: jogadas.map((d) => d.percentualAcertos), backgroundColor: '#084C61', maxBarThickness: 90 }]
            }}
            options={{ responsive: true, scales: { y: { min: 0, max: 100 } } }}
          />
        </div>
      )}

      {/* A mesma informação em tabela: acessível para leitores de tela */}
      <table className="tabela">
        <caption>Resumo por atividade</caption>
        <thead>
          <tr>
            <th scope="col">Atividade</th>
            <th scope="col">Participações</th>
            <th scope="col">% de acertos</th>
            <th scope="col">Tempo médio</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((d) => (
            <tr key={d.atividadeId}>
              <td>{d.titulo}</td>
              <td>{d.participacoes}</td>
              <td>{d.participacoes ? `${d.percentualAcertos}%` : '-'}</td>
              <td>{d.participacoes ? `${d.tempoMedioSegundos}s` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
