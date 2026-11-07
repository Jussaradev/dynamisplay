import { useState } from 'react';

export default function CreateActivity({ onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe o título da atividade.');
      return;
    }

    const newActivity = {
      id: Date.now(),
      type: 'Quiz',
      title,
      description,
      questions,
      createdAt: new Date().toLocaleDateString()
    };

    const existingActivities = JSON.parse(localStorage.getItem('dynamisplay_activities') || '[]');
    const updatedActivities = [newActivity, ...existingActivities];
    localStorage.setItem('dynamisplay_activities', JSON.stringify(updatedActivities));

    alert('Atividade criada com sucesso!');
    if (onSave) onSave();
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '22px' }}>Criar Nova Atividade (Quiz)</h2>
      <p style={{ margin: '0 0 25px 0', color: '#666', fontSize: '14px' }}>
        Monte seu quiz interativo preenchendo as perguntas e definindo a alternativa correta.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Título e Descrição */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Título da Atividade</label>
          <input
            type="text"
            placeholder="Ex: Gestão de Pessoas - Caso Prático"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Descrição ou Instruções</label>
          <textarea
            placeholder="Descreva brevemente o objetivo da atividade para os alunos..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e4e7', margin: '10px 0' }} />

        {/* Lista de Perguntas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Perguntas do Quiz</h3>

          {questions.map((q, qIndex) => (
            <div key={qIndex} style={{ backgroundColor: '#fafafa', border: '1px solid #e5e4e7', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a73e8' }}>Pergunta {qIndex + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    style={{ backgroundColor: '#ffebee', color: '#c62828', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Remover Pergunta
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Digite o enunciado da pergunta aqui..."
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff', outline: 'none' }}
              />

              {/* Alternativas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Alternativas (Selecione a correta no botão ao lado):</label>
                
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                      title="Marcar como alternativa correta"
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <input
                      type="text"
                      placeholder={`Alternativa ${String.fromCharCode(65 + oIndex)}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', backgroundColor: '#fff', outline: 'none' }}
                    />
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Botão Adicionar Nova Pergunta */}
        <button
          type="button"
          onClick={handleAddQuestion}
          style={{ padding: '10px', backgroundColor: '#e8f0fe', color: '#1a73e8', border: '1px dashed #1a73e8', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
        >
          + Adicionar Outra Pergunta
        </button>

        {/* Botão Salvar Atividade */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="submit"
            style={{ padding: '12px 25px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            💾 Salvar Atividade na Biblioteca
          </button>
        </div>

      </form>
    </div>
  );
}