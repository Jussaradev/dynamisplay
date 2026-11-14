// utils/relatorio.js - Análise de dados dos resultados dos alunos.
// É uma função "pura": recebe listas e devolve o resumo, sem acessar o banco.
// Por isso é fácil de testar (veja tests/relatorio.test.js).

function calcularResumo(atividades, resultados) {
  return atividades.map((atv) => {
    const doAtv = resultados.filter((r) => String(r.atividade) === String(atv._id));
    const participacoes = doAtv.length;

    if (participacoes === 0) {
      return { atividadeId: atv._id, titulo: atv.titulo, tipo: atv.tipo,
               participacoes: 0, percentualAcertos: 0, tempoMedioSegundos: 0 };
    }

    // média do % de acertos de cada aluno
    const somaPercentuais = doAtv.reduce((soma, r) => soma + r.acertos / r.total, 0);
    const somaTempo = doAtv.reduce((soma, r) => soma + (r.tempoSegundos || 0), 0);

    return {
      atividadeId: atv._id,
      titulo: atv.titulo,
      tipo: atv.tipo,
      participacoes,
      percentualAcertos: Math.round((somaPercentuais / participacoes) * 100),
      tempoMedioSegundos: Math.round(somaTempo / participacoes)
    };
  });
}

module.exports = { calcularResumo };
