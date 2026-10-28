import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, BookOpen, Bookmark, CheckCircle2, Code2, ExternalLink, Flame, Github, HelpCircle, Layers3, Lightbulb, Menu, Newspaper, Search, Sparkles, Star, Terminal, X } from 'lucide-react';
import { api } from './servicios/clienteApis';
import SectionTitle from './componentes/TituloSeccion';
import RepoCard from './componentes/TarjetaRepositorio';
import Loading from './componentes/Cargando';
import './estilos/estilos.css';

// La búsqueda inicia vacía: las noticias iniciales deben ser recientes y generales.
const initialQuery = '';
const storageKey = 'devradar-favorites-v1';

// Componente principal: coordina las búsquedas, estados de carga y vistas del panel.
export default function App() {
  // query es lo que el usuario escribe; submittedQuery es el último término enviado.
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('stars');
  const [repos, setRepos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [stories, setStories] = useState([]);
  const [wiki, setWiki] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [loading, setLoading] = useState({ repos: true, questions: true, stories: true, wiki: true });
  const [errors, setErrors] = useState({});
  const [activeView, setActiveView] = useState('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { api.health().then(() => setApiOnline(true)).catch(() => setApiOnline(false)); }, []);

  // Consulta repositorios con los filtros elegidos y controla sus estados de carga/error.
  const loadRepos = useCallback(async (q = submittedQuery, lang = language, sortBy = sort) => {
    setLoading((old) => ({ ...old, repos: true })); setErrors((old) => ({ ...old, repos: '' }));
    try { setRepos(await api.github(q, lang, sortBy)); }
    catch (e) { setErrors((old) => ({ ...old, repos: e.message })); setRepos([]); }
    finally { setLoading((old) => ({ ...old, repos: false })); }
  }, [submittedQuery, language, sort]);

  // Consulta las cuatro fuentes de datos. Las noticias reciben el término solo si existe.
  const loadEverything = useCallback(async (q) => {
    setLoading({ repos: true, questions: true, stories: true, wiki: true });
    setErrors({});
    const jobs = [
      ['repos', api.github(q || 'react', language, sort), setRepos],
      ['questions', api.stackoverflow(q || 'javascript'), setQuestions],
      ['stories', api.hackernews(q), setStories],
      ['wiki', api.wiki(q || 'software development'), setWiki]
    ];
    await Promise.all(jobs.map(async ([key, promise, setter]) => {
      try { setter(await promise); }
      catch (e) { setErrors((old) => ({ ...old, [key]: e.message })); }
      finally { setLoading((old) => ({ ...old, [key]: false })); }
    }));
  }, [language, sort]);

  // Primera carga: recursos de ejemplo y noticias recientes, sin filtrar por un tema.
  useEffect(() => { loadEverything(initialQuery); }, []);

  // Ejecuta la búsqueda general desde la barra superior.
  const runSearch = (event) => {
    event?.preventDefault();
    const clean = query.trim();
    if (!clean) { setNotice('Escribe una tecnología o concepto para buscar.'); return; }
    setNotice(''); setSubmittedQuery(clean); setActiveView('overview'); loadEverything(clean);
  };

  // Guarda o elimina un repositorio en favoritos del navegador.
  const toggleFavorite = (repo) => {
    setFavorites((old) => {
      const exists = old.some((item) => item.id === repo.id);
      setNotice(exists ? 'Repositorio eliminado de favoritos.' : 'Repositorio guardado en favoritos.');
      return exists ? old.filter((item) => item.id !== repo.id) : [...old, repo];
    });
  };
  const isSaved = (repo) => favorites.some((item) => item.id === repo.id);
  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);
  const shownRepos = activeView === 'favorites' ? favorites : repos;
  const shownQuestions = questions;
  const goTo = (view) => { setActiveView(view); setMobileMenu(false); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-icon"><RadarLogo /></div><div><strong>DevRadar</strong><span>DEVELOPER HUB</span></div><button className="close-menu" onClick={() => setMobileMenu(false)}><X size={18} /></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="nav-list">
        <button className={`nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={() => goTo('overview')}><Layers3 size={18} />Vista general</button>
        <button className={`nav-item ${activeView === 'repositories' ? 'active' : ''}`} onClick={() => goTo('repositories')}><Github size={18} />Repositorios <span className="nav-count">{repos.length}</span></button>
        <button className={`nav-item ${activeView === 'questions' ? 'active' : ''}`} onClick={() => goTo('questions')}><HelpCircle size={18} />Preguntas técnicas</button>
        <button className={`nav-item ${activeView === 'news' ? 'active' : ''}`} onClick={() => goTo('news')}><Newspaper size={18} />Noticias tech</button>
        <button className={`nav-item ${activeView === 'favorites' ? 'active' : ''}`} onClick={() => goTo('favorites')}><Bookmark size={18} />Favoritos <span className="nav-count">{favorites.length}</span></button>
      </nav>
      <div className="sidebar-bottom"><div className="api-status"><span className={`status-dot ${apiOnline ? 'online' : ''}`} /><div><strong>Backend API</strong><small>{apiOnline ? 'Conectado' : 'Sin conexión'}</small></div></div><div className="sidebar-foot"><span>DevRadar v1.0</span><span>Prototipo académico</span></div></div>
    </aside>
    {mobileMenu && <button className="mobile-scrim" aria-label="Cerrar menú" onClick={() => setMobileMenu(false)} />}

    <main className="main-content">
      <header className="topbar"><button className="mobile-menu-button" onClick={() => setMobileMenu(true)}><Menu size={21} /></button><div className="breadcrumb">Workspace <span>/</span> <strong>{({ overview: 'Vista general', repositories: 'Repositorios', questions: 'Preguntas técnicas', news: 'Noticias tech', favorites: 'Favoritos' })[activeView]}</strong></div><div className="topbar-right"><span className="live-label"><i /> APIs en vivo</span><div className="avatar">MG</div></div></header>
      <div className="page-wrap">
        <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14} /> TU CENTRO DE DESARROLLO</div><h1>{activeView === 'favorites' ? 'Tus recursos guardados' : activeView === 'repositories' ? 'Explora repositorios' : activeView === 'questions' ? 'Resuelve tus dudas' : activeView === 'news' ? 'Mantente al día' : 'Hola, developer'} <span className="wave">{activeView === 'overview' ? '✦' : ''}</span></h1><p className="welcome-subtitle">{activeView === 'favorites' ? 'Todo lo que guardaste, en un solo lugar.' : 'Descubre herramientas, respuestas y tendencias para construir mejores proyectos.'}</p></div><div className="date-chip"><span className="date-dot" /> Actualizado desde fuentes públicas</div></section>

        <form className="search-panel" onSubmit={runSearch}><div className="search-icon"><Search size={20} /></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca una tecnología, lenguaje, concepto o noticias..." aria-label="Buscar tecnología" /><div className="search-divider" /><select value={language} onChange={(e) => { setLanguage(e.target.value); }} aria-label="Filtrar por lenguaje"><option value="">Todos los lenguajes</option><option>JavaScript</option><option>TypeScript</option><option>Python</option><option>Java</option><option>Go</option><option>Rust</option><option>PHP</option><option>C++</option></select><button type="submit" className="search-button"><Search size={16} /> Buscar</button></form>
        {notice && <div className="notice" role="status"><CheckCircle2 size={16} />{notice}<button onClick={() => setNotice('')} aria-label="Cerrar aviso"><X size={14} /></button></div>}

        {/* VISTA GENERAL: métricas y resumen de todas las fuentes. */}
        {activeView === 'overview' && <>
          <section className="stats-grid">
            <StatCard icon={Github} label="Repositorios encontrados" value={loading.repos ? '…' : repos.length} note="GitHub REST API" tint="blue" />
            <StatCard icon={HelpCircle} label="Preguntas relacionadas" value={loading.questions ? '…' : questions.length} note="Stack Exchange API" tint="purple" />
            <StatCard icon={Flame} label="Noticias destacadas" value={loading.stories ? '…' : stories.length} note="Hacker News API" tint="orange" />
            <StatCard icon={Bookmark} label="Tus favoritos" value={favorites.length} note="Guardados en este dispositivo" tint="green" />
          </section>

          <section className="section-block"><SectionTitle icon={Github} title="Repositorios populares" subtitle={submittedQuery ? `Proyectos de código abierto relacionados con “${submittedQuery}”` : "Proyectos populares de código abierto"} action="Ver todos" onAction={() => goTo('repositories')} />
            {loading.repos ? <Loading /> : errors.repos ? <ErrorMessage message={errors.repos} onRetry={() => loadRepos()} /> : repos.length ? <div className="repo-grid">{repos.slice(0, 4).map((repo) => <RepoCard key={repo.id} repo={repo} saved={favoriteIds.has(repo.id)} onToggle={toggleFavorite} />)}</div> : <EmptyMessage text="No encontramos repositorios para esa búsqueda." />}
          </section>

          <div className="content-grid">
            <section className="section-block questions-block"><SectionTitle icon={HelpCircle} title="Preguntas de la comunidad" subtitle="Respuestas y soluciones de Stack Overflow" action="Ver preguntas" onAction={() => goTo('questions')} />
              {loading.questions ? <Loading /> : errors.questions ? <ErrorMessage message={errors.questions} onRetry={() => loadEverything(submittedQuery)} /> : <div className="question-list">{shownQuestions.slice(0, 4).map((item) => <QuestionRow key={item.id} item={item} />)}</div>}
            </section>
            <section className="section-block news-block"><SectionTitle icon={Newspaper} title="Radar tecnológico" subtitle={submittedQuery ? `Noticias relacionadas con “${submittedQuery}”` : 'Noticias tecnológicas recientes de Hacker News'} action="Ver noticias" onAction={() => goTo('news')} />
              {loading.stories ? <Loading /> : errors.stories ? <ErrorMessage message={errors.stories} onRetry={() => loadEverything(submittedQuery)} /> : <div className="news-list">{stories.slice(0, 4).map((item) => <NewsRow key={item.id} item={item} />)}</div>}
            </section>
          </div>
          <section className="section-block concept-section"><SectionTitle icon={Lightbulb} title="Concepto para explorar" subtitle="Un resumen rápido para aprender algo nuevo" />
            {loading.wiki ? <Loading /> : errors.wiki ? <ErrorMessage message={errors.wiki} onRetry={() => loadEverything(submittedQuery)} /> : wiki && <div className="concept-card">{wiki.image && <img src={wiki.image} alt="" className="concept-image" />}<div className="concept-copy"><span className="concept-label"><BookOpen size={14} /> WIKIPEDIA</span><h3>{wiki.title}</h3><p>{wiki.extract}</p><a href={wiki.url} target="_blank" rel="noreferrer" className="inline-link">Leer artículo completo <ArrowUpRight size={15} /></a></div></div>}
          </section>
        </>}

        {/* VISTA DE REPOSITORIOS: listado completo y filtros de ordenamiento. */}
        {activeView === 'repositories' && <section className="section-block page-section"><SectionTitle icon={Github} title="Repositorios de GitHub" subtitle={`${submittedQuery ? `Resultados para “${submittedQuery}”` : "Repositorios populares"} · Ordenados por ${sort === 'stars' ? 'estrellas' : sort === 'forks' ? 'forks' : 'actualización'}`} /><div className="toolbar"><span>{repos.length} resultados en esta consulta</span><select value={sort} onChange={(e) => { setSort(e.target.value); loadRepos(submittedQuery, language, e.target.value); }}><option value="stars">Más estrellas</option><option value="forks">Más forks</option><option value="updated">Actualizados recientemente</option></select></div>{loading.repos ? <Loading /> : errors.repos ? <ErrorMessage message={errors.repos} onRetry={() => loadRepos()} /> : repos.length ? <div className="repo-grid">{repos.map((repo) => <RepoCard key={repo.id} repo={repo} saved={favoriteIds.has(repo.id)} onToggle={toggleFavorite} />)}</div> : <EmptyMessage text="No encontramos repositorios. Prueba con otro término." />}</section>}

        {/* VISTA DE PREGUNTAS: resultados técnicos de Stack Overflow. */}
        {activeView === 'questions' && <section className="section-block page-section"><SectionTitle icon={HelpCircle} title="Preguntas de Stack Overflow" subtitle={submittedQuery ? `Dudas técnicas relacionadas con “${submittedQuery}”` : "Preguntas técnicas populares de la comunidad"} />{loading.questions ? <Loading /> : errors.questions ? <ErrorMessage message={errors.questions} onRetry={() => loadEverything(submittedQuery)} /> : <div className="question-list full-list">{questions.map((item) => <QuestionRow key={item.id} item={item} />)}</div>}</section>}

        {/* VISTA DE NOTICIAS: recientes por defecto o relacionadas con la búsqueda. */}
        {activeView === 'news' && <section className="section-block page-section"><SectionTitle icon={Newspaper} title="Noticias y tendencias tech" subtitle={submittedQuery ? `Noticias relacionadas con “${submittedQuery}”` : 'Noticias tecnológicas recientes de Hacker News'} />{loading.stories ? <Loading /> : errors.stories ? <ErrorMessage message={errors.stories} onRetry={() => loadEverything(submittedQuery)} /> : <div className="news-list full-list">{stories.map((item) => <NewsRow key={item.id} item={item} />)}</div>}</section>}

        {/* VISTA DE FAVORITOS: repositorios guardados en localStorage. */}
        {activeView === 'favorites' && <section className="section-block page-section"><SectionTitle icon={Bookmark} title="Repositorios favoritos" subtitle="Se guardan localmente en este navegador, sin cuenta de usuario." />{shownRepos.length ? <div className="repo-grid">{shownRepos.map((repo) => <RepoCard key={repo.id} repo={repo} saved onToggle={toggleFavorite} />)}</div> : <div className="empty-favorites"><div className="empty-icon"><Bookmark size={24} /></div><h3>Aún no guardaste favoritos</h3><p>Usa el icono de marcador en cualquier repositorio para guardarlo aquí.</p><button className="search-button" onClick={() => goTo('repositories')}>Explorar repositorios <ArrowUpRight size={16} /></button></div>}</section>}

        <footer className="footer"><div className="footer-brand"><div className="footer-logo"><Terminal size={16} /></div><strong>DevRadar</strong><span>Encuentra tu próxima idea.</span></div><div className="footer-note">Datos obtenidos de APIs públicas. Los resultados pueden variar según disponibilidad y límites de cada servicio.</div><div className="footer-copy">© 2026 DevRadar</div></footer>
      </div>
    </main>
  </div>;
}

// Tarjeta reutilizable para mostrar una métrica del panel principal.
function StatCard({ icon: Icon, label, value, note, tint }) {
  return <div className="stat-card"><div className={`stat-icon ${tint}`}><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note"><span className="note-dot" />{note}</div></div>;
}
// Fila de pregunta con votos, respuestas, etiquetas y enlace a Stack Overflow.
function QuestionRow({ item }) {
  return <a className="question-row" href={item.url} target="_blank" rel="noreferrer"><div className="question-metrics"><strong>{item.score}</strong><span>votos</span><strong className={item.answered ? 'answered' : ''}>{item.answers}</strong><span>respuestas</span></div><div className="question-content"><h3>{decodeHtml(item.title)}</h3><div className="tag-list">{item.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div></div><ExternalLink size={15} className="row-external" /></a>;
}
// Fila de noticia con puntaje, autor, comentarios y enlace a la publicación original.
function NewsRow({ item }) {
  return <a className="news-row" href={item.url} target="_blank" rel="noreferrer"><div className="news-score"><ArrowUpRight size={15} /><strong>{item.score}</strong></div><div className="news-copy"><h3>{item.title}</h3><p>por {item.author} <span>·</span> {item.comments} comentarios</p></div><ExternalLink size={14} className="row-external" /></a>;
}
// Componentes auxiliares para estados de error y resultados vacíos.
function ErrorMessage({ message, onRetry }) { return <div className="error-box"><p>{message}</p><button onClick={onRetry}>Intentar de nuevo</button><small>Comprueba que el backend esté ejecutándose y vuelve a intentar.</small></div>; }
function EmptyMessage({ text }) { return <div className="empty-message">{text}</div>; }
function decodeHtml(text) { const element = document.createElement('textarea'); element.innerHTML = text; return element.value; }
function RadarLogo() { return <svg viewBox="0 0 40 40" width="28" height="28" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.7" opacity=".55"/><circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.7" opacity=".75"/><path d="M20 20L31 9M20 20H6M20 20V34" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><circle cx="20" cy="20" r="3" fill="currentColor"/><circle cx="31" cy="9" r="2.4" fill="#e5b45d"/></svg>; }
