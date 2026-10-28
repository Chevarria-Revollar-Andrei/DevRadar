
const { fetchJson } = require('../servicios/http.service');

// Direcciones de las APIs oficiales de Wikipedia.
const WIKIPEDIA_ES = 'https://es.wikipedia.org/w/api.php';
const WIKIPEDIA_EN = 'https://en.wikipedia.org/w/api.php';

// Normaliza el texto para comparar términos sin distinguir mayúsculas ni tildes.
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Amplía algunas búsquedas ambiguas para priorizar conceptos tecnológicos.
// Por ejemplo, "Java" buscará el lenguaje de programación y no la isla.
function mejorarBusqueda(tema) {
  const equivalencias = {
    java: 'Java lenguaje de programación',
    python: 'Python lenguaje de programación',
    javascript: 'JavaScript lenguaje de programación',
    typescript: 'TypeScript lenguaje de programación',
    rust: 'Rust lenguaje de programación',
    php: 'PHP lenguaje de programación',
    'c++': 'C++ lenguaje de programación',
    algoritmo: 'Algoritmo informática',
    algoritmos: 'Algoritmos informática'
  };

  return equivalencias[normalizar(tema)] || tema;
}

// Busca primero el artículo por relevancia, sin exigir que su título
// coincida exactamente con lo escrito en el buscador.
async function buscarArticulo(baseUrl, tema) {
  const parametrosBusqueda = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: tema,
    srnamespace: '0',
    srlimit: '5',
    srwhat: 'text',
    format: 'json',
    formatversion: '2'
  });

  const resultados = await fetchJson(
    `${baseUrl}?${parametrosBusqueda.toString()}`
  );

  const articulos = resultados.query?.search || [];

  // Si no hay resultados, permite intentar en otro idioma.
  if (articulos.length === 0) {
    return null;
  }

  // El buscador de Wikipedia ordena los resultados por relevancia.
  const articulo = articulos[0];

  // Una vez encontrado el artículo, obtenemos su resumen, imagen y URL.
  const parametrosDetalle = new URLSearchParams({
    action: 'query',
    pageids: String(articulo.pageid),
    prop: 'extracts|pageimages|info',
    exintro: '1',
    explaintext: '1',
    piprop: 'thumbnail',
    pithumbsize: '600',
    inprop: 'url',
    redirects: '1',
    format: 'json',
    formatversion: '2'
  });

  const detalle = await fetchJson(
    `${baseUrl}?${parametrosDetalle.toString()}`
  );

  const pagina = detalle.query?.pages?.[0];

  if (!pagina || pagina.missing !== undefined) {
    return null;
  }

  return {
    title: pagina.title || articulo.title || tema,
    extract: pagina.extract ||
      'El artículo existe, pero no tiene un resumen disponible.',
    image: pagina.thumbnail?.source || null,
    url: pagina.fullurl ||
      `https://${baseUrl.includes('es.wikipedia.org')
        ? 'es'
        : 'en'}.wikipedia.org/wiki/${encodeURIComponent(pagina.title)}`
  };
}

// Función principal que utiliza la ruta /api/wiki.
async function getSummary(params = {}) {
  const topic = String(params.topic || '').trim().slice(0, 200);

  if (!topic) {
    const error = new Error('Escribe un concepto para buscar.');
    error.status = 400;
    throw error;
  }

  // Prioriza la búsqueda del concepto tecnológico cuando corresponde.
  const termino = mejorarBusqueda(topic);

  // Primero intenta encontrar el concepto en Wikipedia en español.
  let articulo = await buscarArticulo(WIKIPEDIA_ES, termino);

  // Si no existe un resultado en español, prueba Wikipedia en inglés.
  if (!articulo) {
    articulo = await buscarArticulo(WIKIPEDIA_EN, termino);
  }

  // Solo informa que no se encontró si fallaron ambas búsquedas.
  if (!articulo) {
    const error = new Error(
      `Wikipedia no encontró artículos para "${topic}". Prueba con otro término.`
    );
    error.status = 404;
    throw error;
  }

  return articulo;
}

module.exports = { getSummary };
