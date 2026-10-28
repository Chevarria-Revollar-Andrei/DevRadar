const express = require('express');
const { searchRepositories } = require('../apis/github.api');
const { searchQuestions } = require('../apis/stackoverflow.api');
const { getTopStories } = require('../apis/hackernews.api');
const { getSummary } = require('../apis/wikipedia.api');

const router = express.Router();
// Envuelve cada consulta para responder errores con JSON y evitar caídas del servidor.
const safe = (handler) => async (req, res) => {
  try {
    const data = await handler(req);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error.message);
    res.status(error.status || 502).json({ success: false, error: error.message || 'No se pudo consultar el servicio externo.' });
  }
};

router.get('/health', (_req, res) => res.json({ success: true, message: 'DevRadar API funcionando', timestamp: new Date().toISOString() }));
// Endpoints públicos que consume la interfaz React.
router.get('/github', safe((req) => searchRepositories(req.query)));
router.get('/stackoverflow', safe((req) => searchQuestions(req.query)));
router.get('/hackernews', safe((req) => getTopStories(req.query)));
router.get('/wiki', safe((req) => getSummary(req.query)));

module.exports = router;
