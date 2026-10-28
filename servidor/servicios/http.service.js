// Cliente HTTP común para todas las APIs: aplica tiempo límite y valida respuestas.
async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'User-Agent': 'DevRadar-Student-Project/1.0', Accept: 'application/json', ...(options.headers || {}) }
    });
    if (!response.ok) {
      const error = new Error(`El servicio externo respondió con estado ${response.status}.`);
      error.status = 502;
      throw error;
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('La consulta tardó demasiado. Inténtalo nuevamente.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
module.exports = { fetchJson };
