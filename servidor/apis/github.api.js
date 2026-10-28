const { fetchJson } = require('../servicios/http.service');

// Consulta la API REST de GitHub y adapta sus repositorios al formato usado por React.
async function searchRepositories(params = {}) {
  const q = String(params.q || 'react').trim().slice(0, 100);
  const language = String(params.language || '').trim().slice(0, 40);
  const sort = ['stars', 'forks', 'updated'].includes(params.sort) ? params.sort : 'stars';
  const pageSize = Math.min(Math.max(Number(params.limit) || 8, 1), 20);
  const query = [q, language ? `language:${language}` : ''].filter(Boolean).join(' ');
  const url = new URL('https://api.github.com/search/repositories');
  url.searchParams.set('q', query);
  url.searchParams.set('sort', sort);
  url.searchParams.set('order', 'desc');
  url.searchParams.set('per_page', pageSize);
  const json = await fetchJson(url.toString());
  return (json.items || []).map((repo) => ({
    id: repo.id, name: repo.full_name, description: repo.description || 'Sin descripción disponible.',
    language: repo.language || 'No especificado', stars: repo.stargazers_count,
    forks: repo.forks_count, url: repo.html_url, updatedAt: repo.updated_at,
    avatar: repo.owner?.avatar_url
  }));
}
module.exports = { searchRepositories };
