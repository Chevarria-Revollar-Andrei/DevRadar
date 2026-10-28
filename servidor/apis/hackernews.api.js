// API de noticias de Hacker News mediante Algolia.
// Sin término de búsqueda devuelve noticias recientes; con término, devuelve coincidencias del tema.
const { fetchJson } = require('../servicios/http.service');

const BASE = 'https://hn.algolia.com/api/v1/search_by_date';

async function getTopStories(params = {}) {
  // Limita la cantidad para mantener una respuesta rápida.
  const limite = Math.min(Math.max(Number(params.limit) || 8, 1), 12);
  const tema = String(params.q || '').trim().slice(0, 100);

  // Algolia realiza la búsqueda textual, por lo que las noticias sí corresponden al término.
  const url = new URL(BASE);
  url.searchParams.set('tags', 'story');
  url.searchParams.set('hitsPerPage', String(tema ? 30 : limite));
  url.searchParams.set('page', '0');

  // Cuando no hay búsqueda, el orden por fecha muestra noticias recientes.
  // Cuando hay tema, Algolia devuelve historias que coinciden con ese texto.
  if (tema) url.searchParams.set('query', tema);

  const respuesta = await fetchJson(url.toString());
  const historias = (respuesta.hits || [])
    .filter((historia) => historia.title || historia.story_title)
    .map((historia) => ({
      id: historia.objectID,
      title: historia.title || historia.story_title,
      url: historia.url || `https://news.ycombinator.com/item?id=${historia.objectID}`,
      author: historia.author || 'Desconocido',
      score: historia.points || 0,
      comments: historia.num_comments || 0,
      time: historia.created_at_i || 0,
      type: 'story'
    }));

  // La consulta con tema devuelve más coincidencias; se muestran solo las primeras necesarias.
  return historias.slice(0, limite);
}

module.exports = { getTopStories };
