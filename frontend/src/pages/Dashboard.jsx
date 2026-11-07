import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateActivity from '../components/CreateActivity';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('library'); 
  
  // Inicializa o usuário diretamente do localStorage sem precisar de useEffect
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem('dynamisplay_user')) || null;
  });

  // Inicializa as atividades diretamente do localStorage
  const [activities, setActivities] = useState(() => {
    return JSON.parse(localStorage.getItem('dynamisplay_activities') || '[]');
  });

  const navigate = useNavigate();

  const loadActivities = () => {
    const savedActivities = JSON.parse(localStorage.getItem('dynamisplay_activities') || '[]');
    setActivities(savedActivities);
  };

  const handleLogout = () => {
    localStorage.removeItem('dynamisplay_user');
    navigate('/');
  };

  return (
    <div style={{ width: '100%', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Navbar Superior */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e4e7', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ margin: 0, color: '#1a73e8', fontSize: '24px' }}>DynamiSplay</h1>
          <span style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            Painel Docente
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('library')}
            style={{ padding: '8px 16px', backgroundColor: activeTab === 'library' ? '#1a73e8' : '#f1f3f4', color: activeTab === 'library' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📚 Biblioteca
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            style={{ padding: '8px 16px', backgroundColor: activeTab === 'create' ? '#1a73e8' : '#f1f3f4', color: activeTab === 'create' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ➕ Criar Atividade
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            style={{ padding: '8px 16px', backgroundColor: activeTab === 'reports' ? '#1a73e8' : '#f1f3f4', color: activeTab === 'reports' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📊 Relatórios
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{user?.nome || 'Jussara Maria Pereira'}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Docente Senac</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* 2. Conteúdo Principal */}
      <main style={{ padding: '30px', maxWidth: '1000px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {activeTab === 'library' && (
          <div>
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>Boas-vindas ao seu painel!</h2>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Gerencie suas atividades gamificadas de Quiz e Jogos.</p>
              </div>
              <button 
                onClick={() => setActiveTab('create')}
                style={{ padding: '10px 20px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ➕ Criar Nova Atividade
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Suas Atividades Criadas</h3>
              {activities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fafafa', borderRadius: '6px', border: '1px dashed #ccc' }}>
                  <p style={{ color: '#666', margin: '0 0 10px 0' }}>Nenhuma atividade cadastrada ainda.</p>
                  <button onClick={() => setActiveTab('create')} style={{ color: '#1a73e8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Criar seu primeiro quiz agora →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                  {activities.map((act, index) => (
                    <div key={index} style={{ padding: '15px', border: '1px solid #e5e4e7', borderRadius: '6px', backgroundColor: '#fff' }}>
                      <span style={{ fontSize: '10px', backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{act.type}</span>
                      <h4 style={{ margin: '8px 0 5px 0', color: '#333' }}>{act.title}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{act.description}</p>
                      <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: '#1a73e8', fontWeight: 'bold' }}>{act.questions?.length} Pergunta(s)</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div>
            <button onClick={() => setActiveTab('library')} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' }}>
              ← Voltar para a Biblioteca
            </button>
            <CreateActivity onSave={() => { loadActivities(); setActiveTab('library'); }} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Relatórios de Desempenho e Engajamento</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Acompanhe o rendimento e a participação dos alunos nas atividades aplicadas.</p>
            <div style={{ marginTop: '20px', padding: '40px', backgroundColor: '#fafafa', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '6px', color: '#666' }}>
              [Painel de Gráficos e Estatísticas - Próxima Etapa]
            </div>
          </div>
        )}

      </main>
    </div>
  );
}