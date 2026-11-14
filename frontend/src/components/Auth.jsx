// Auth.jsx - Tela de login / cadastro do professor (e-mail+senha ou Google).
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api, { mensagemDeErro } from '../api';

export default function Auth({ onLoginSucesso, onVoltar }) {
  const [modoLogin, setModoLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const rota = modoLogin ? '/auth/login' : '/auth/registro';
      const dados = modoLogin ? { email, senha } : { nome, email, senha };
      const res = await api.post(rota, dados);
      onLoginSucesso(res.data); // res.data = { token, usuario }
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  };

  // O Google devolve "credential" (um token). Mandamos para o nosso backend conferir.
  const handleGoogle = async (resposta) => {
    setErro('');
    try {
      const res = await api.post('/auth/google', { token: resposta.credential });
      onLoginSucesso(res.data);
    } catch (err) {
      setErro(mensagemDeErro(err, 'Falha ao entrar com o Google.'));
    }
  };

  return (
    <section className="container estreito">
      <button className="btn-link" onClick={onVoltar}>← Voltar para a página inicial</button>

      <div className="cartao">
        <h1 className="titulo-centro">{modoLogin ? '🔑 Entrar na Área do Professor' : '📝 Criar conta de Professor'}</h1>

        {erro && <div role="alert" className="alerta alerta-erro">{erro}</div>}

        <div className="google">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setErro('Não foi possível entrar com o Google.')}
            text="continue_with"
            locale="pt-BR"
          />
        </div>

        <div className="divisor"><span>ou com e-mail e senha</span></div>

        <form onSubmit={handleSubmit} className="formulario">
          {!modoLogin && (
            <div className="campo">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name" />
            </div>
          )}

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha {!modoLogin && <small>(mínimo 6 caracteres)</small>}</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={modoLogin ? undefined : 6}
              autoComplete={modoLogin ? 'current-password' : 'new-password'}
            />
          </div>

          <button type="submit" className="btn btn-primario" disabled={enviando}>
            {enviando ? 'Aguarde...' : modoLogin ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="titulo-centro">
          <button className="btn-link" onClick={() => { setModoLogin(!modoLogin); setErro(''); }}>
            {modoLogin ? 'Não tem conta? Cadastre-se aqui' : 'Já tem conta? Faça login'}
          </button>
        </p>
      </div>
    </section>
  );
}
