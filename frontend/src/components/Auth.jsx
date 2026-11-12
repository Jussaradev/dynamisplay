/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';

const COR_AZUL = '#084C61';
const COR_DOURADO = '#D4AF37';

export default function Auth({ onLoginSucesso, onVoltarHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: response.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      onLoginSucesso(res.data.usuario);
    } catch (err) {
      console.error('Erro no login com Google:', err);
      setErro('Falha ao autenticar com o Google. Verifique as credenciais.');
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "24689047961-dk24q8l2amlr3au8hcnc5s2v1vd1a0kt.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleButtonDiv"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with" }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const endpoint = isLogin ? 'login' : 'registro';
      const payload = isLogin ? { email, senha } : { nome, email, senha };
      
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      onLoginSucesso(res.data.usuario);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '35px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
      <button onClick={onVoltarHome} style={{ background: 'none', border: 'none', color: COR_AZUL, cursor: 'pointer', fontWeight: '600', marginBottom: '20px', padding: 0 }}>
        ← Voltar para a Página Inicial
      </button>

      <h2 style={{ color: COR_AZUL, marginTop: 0, textAlign: 'center' }}>
        {isLogin ? '🔑 Entrar na Área do Professor' : '📝 Criar Conta de Professor'}
      </h2>

      {erro && (
        <div role="alert" style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
          {erro}
        </div>
      )}

      {/* Botão Oficial do Google */}
      <div id="googleButtonDiv" style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}></div>

      <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: '20px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
        <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
        <span style={{ padding: '0 10px' }}>ou com e-mail e senha</span>
        <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: COR_AZUL, fontSize: '0.9rem' }}>Nome Completo:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Prof.ª Jussara" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: COR_AZUL, fontSize: '0.9rem' }}>E-mail:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="exemplo@email.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: COR_AZUL, fontSize: '0.9rem' }}>Palavra-passe:</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: COR_AZUL, color: 'white', border: `1px solid ${COR_DOURADO}`, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' }}>
          {isLogin ? 'Entrar' : 'Registar Conta'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: COR_AZUL, cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
          {isLogin ? 'Não tem conta? Registe-se aqui' : 'Já tem conta? Faça login'}
        </button>
      </div>
    </div>
  );
}