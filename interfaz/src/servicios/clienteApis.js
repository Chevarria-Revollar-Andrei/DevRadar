// Dirección base del backend. En producción se configura mediante VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Centraliza las peticiones HTTP y transforma los errores en mensajes legibles.
async function request(path) {
  const response = await fetch(`${API_URL}${path}`);
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo obtener información.');
  return result.data;
}

// Métodos que corresponden a los endpoints definidos en el servidor Express.
export const api = {
  github: (q, language = '', sort = 'stars') => request(`/github?q=${encodeURIComponent(q)}&language=${encodeURIComponent(language)}&sort=${sort}`),
  stackoverflow: (q) => request(`/stackoverflow?q=${encodeURIComponent(q)}`),
  hackernews: (q = '') => request(`/hackernews?q=${encodeURIComponent(q)}`),
  wiki: (topic) => request(`/wiki?topic=${encodeURIComponent(topic)}`),
  health: () => request('/health')
};
