// api.js - Um único lugar para falar com o backend.
// Antes o endereço "http://localhost:5000" estava repetido em vários arquivos,
// o que impede de publicar na nuvem. Agora ele vem da variável VITE_API_URL.
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: `${API_URL}/api` });

// Antes de cada requisição, se o professor estiver logado, envia o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Pega a mensagem de erro que o backend mandou (campo "erro")
export function mensagemDeErro(err, padrao = 'Ocorreu um erro. Tente novamente.') {
  return err?.response?.data?.erro || padrao;
}

export default api;
