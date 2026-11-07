import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Ferramenta para mudar de página

  const handleEntrar = (e) => {
    e.preventDefault();
    
    // Salvando os dados do docente no navegador para simular a sessão do MVP
    const docenteData = {
      email: email,
      nome: "Jussara Maria Pereira",
      perfil: "Docente"
    };
    localStorage.setItem('dynamisplay_user', JSON.stringify(docenteData));

    // Requisito do PI: Redireciona o docente para o Dashboard de atividades
    navigate('/dashboard');
  
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '40px', borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#1a73e8', fontSize: '36px' }}>DynamiSplay</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontStyle: 'italic' }}>
            Transformando aprendizado em experiência
          </p>
        </div>

        <h3 style={{ marginBottom: '20px', color: '#333' }}>Acesso do Docente</h3>

        <form onSubmit={handleEntrar}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '14px' }}>E-mail Institucional</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@senacsp.edu.br"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '14px' }}>Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{
            width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'
          }}>
            Entrar na Plataforma
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px 0' }}>Ou acesse com as contas integradas:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => alert('Integração Google')} style={{ flex: 1, padding: '8px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Google</button>
            <button type="button" onClick={() => alert('Integração Microsoft')} style={{ flex: 1, padding: '8px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Microsoft Teams</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
