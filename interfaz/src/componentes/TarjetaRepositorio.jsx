import React from 'react';
import { Star, GitFork, ExternalLink, Bookmark } from 'lucide-react';
// Tarjeta que presenta un repositorio y permite guardarlo o quitarlo de favoritos.
export default function RepoCard({ repo, saved, onToggle }) {
  return <article className="repo-card">
    <div className="repo-card-top"><span className="repo-mark">{repo.name.split('/')[0]?.slice(0, 1).toUpperCase()}</span><button className={`icon-button ${saved ? 'saved' : ''}`} title={saved ? 'Quitar de favoritos' : 'Guardar favorito'} onClick={() => onToggle(repo)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button></div>
    <a className="repo-name" href={repo.url} target="_blank" rel="noreferrer">{repo.name}<ExternalLink size={13} /></a>
    <p className="repo-description">{repo.description}</p>
    <div className="repo-meta"><span className="language"><i />{repo.language}</span><span><Star size={14} />{Number(repo.stars).toLocaleString()}</span><span><GitFork size={14} />{Number(repo.forks).toLocaleString()}</span></div>
  </article>;
}
