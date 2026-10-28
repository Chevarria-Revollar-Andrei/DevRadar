const { fetchJson } = require('../servicios/http.service');
// Consulta Stack Exchange y devuelve preguntas técnicas con sus métricas y etiquetas.
async function searchQuestions(params = {}) {
  const q = String(params.q || 'javascript').trim().slice(0, 100);
  const url = new URL('https://api.stackexchange.com/2.3/search/advanced');
  url.searchParams.set('order', 'desc');
  url.searchParams.set('sort', 'relevance');
  url.searchParams.set('q', q);
  url.searchParams.set('site', 'stackoverflow');
  url.searchParams.set('pagesize', String(Math.min(Math.max(Number(params.limit) || 8, 1), 20)));
  const json = await fetchJson(url.toString());
  return (json.items || []).map((item) => ({
    id: item.question_id, title: item.title, url: item.link,
    score: item.score, answers: item.answer_count, answered: Boolean(item.is_answered),
    tags: item.tags || [], createdAt: item.creation_date
  }));
}
module.exports = { searchQuestions };
