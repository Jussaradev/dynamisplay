// Teste de componente: simula um aluno jogando um quiz de múltipla escolha.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import AlunoJogo from '../components/AlunoJogo';
import api from '../api';

vi.mock('../api', () => ({
  default: { get: vi.fn(), post: vi.fn() }
}));

test('aluno escolhe alternativas no quiz e vê o placar final', async () => {
  api.get.mockResolvedValue({
    data: {
      _id: '1', titulo: 'Quiz de RH', tipo: 'quiz', professor: 'Jussara',
      conteudo: [
        { pergunta: 'O que significa RH?', opcoes: ['Recursos Humanos', 'Renda Habitual', 'Rede Hospitalar'], respostaCorreta: 'Recursos Humanos' },
        { pergunta: 'Capital de SP?', opcoes: ['Campinas', 'São Paulo', 'Santos'], respostaCorreta: 'São Paulo' }
      ]
    }
  });
  api.post.mockResolvedValue({});
  const usuario = userEvent.setup();

  render(<AlunoJogo atividadeId="1" onVoltar={() => {}} />);

  // Tela do nome
  await usuario.type(await screen.findByLabelText(/nome ou apelido/i), 'Ana');
  await usuario.click(screen.getByRole('button', { name: /começar/i }));

  // Pergunta 1 - escolhe a certa
  await usuario.click(screen.getByRole('button', { name: /Recursos Humanos/ }));
  expect(screen.getByRole('alert')).toHaveTextContent(/correta/i);
  await usuario.click(screen.getByRole('button', { name: /próximo/i }));

  // Pergunta 2 - escolhe a errada e o jogo mostra a certa
  await usuario.click(screen.getByRole('button', { name: /Campinas/ }));
  expect(screen.getByRole('alert')).toHaveTextContent(/São Paulo/);
  await usuario.click(screen.getByRole('button', { name: /ver resultado/i }));

  expect(screen.getByText(/acertou 1 de 2/i)).toBeInTheDocument();
  expect(api.post).toHaveBeenCalledWith('/resultados', expect.objectContaining({ nomeAluno: 'Ana', acertos: 1, total: 2 }));
});

test('palavra ausente continua com resposta escrita', async () => {
  api.get.mockResolvedValue({
    data: {
      _id: '2', titulo: 'Complete', tipo: 'palavra_ausente', professor: 'Jussara',
      conteudo: [{ pergunta: 'Planejar, organizar, dirigir e ___.', respostaCorreta: 'controlar' }]
    }
  });
  const usuario = userEvent.setup();
  render(<AlunoJogo atividadeId="2" onVoltar={() => {}} />);

  await usuario.type(await screen.findByLabelText(/nome ou apelido/i), 'Bia');
  await usuario.click(screen.getByRole('button', { name: /começar/i }));
  await usuario.type(screen.getByLabelText(/sua resposta/i), 'Controlar');
  await usuario.click(screen.getByRole('button', { name: /responder/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(/correta/i);
});
