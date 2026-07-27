import React from 'react';
import PostCard from '../components/PostCard.jsx';

function HomePage({ posts, searchQuery, filterCategory, categories, onSearchChange, onFilterChange, onOpenPublish, onStartChat }) {
  const communitySuggestions = posts.slice(0, 3);
  const popularExchanges = posts.slice(0, 2);

  return (
    <div className="home-shell">
      <div className="home-feed">
        <div className="home-banner">
          <div>
            <p className="home-eyebrow">Marketplace moderno</p>
            <h2>Descubre oportunidades alrededor de ti</h2>
            <p>Explora publicaciones reales, filtra por categoría y conecta con otros usuarios de forma sencilla.</p>
          </div>
          <button className="btn btn-primary" onClick={onOpenPublish}>
            + Crear publicación
          </button>
        </div>

        <div className="search-panel">
          <label className="search-input-wrap">
            <span aria-hidden="true">🔎</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Busca por título, descripción o detalles..."
            />
          </label>
          <label className="search-select-wrap">
            <select value={filterCategory} onChange={(event) => onFilterChange(event.target.value)}>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'Todas las categorías' : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="empty-state">
              <h3>No hay publicaciones que coincidan.</h3>
              <p>Prueba otra palabra clave o categoría.</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} onStartChat={onStartChat} />)
          )}
        </div>
      </div>

      <aside className="home-side">
        <div className="home-side-card">
          <div className="home-side-card-head">
            <h3>Sugerencias de la comunidad</h3>
            <span>Hoy</span>
          </div>

          {communitySuggestions.length > 0 ? (
            communitySuggestions.map((post) => (
              <div key={`suggest-${post.id}`} className="community-card">
                <div>
                  <strong>{post.title}</strong>
                  <p>{post.category}</p>
                </div>
                <span>{post.location || 'Sin ubicación'}</span>
              </div>
            ))
          ) : (
            <p className="home-empty-copy">Aún no hay publicaciones para mostrar.</p>
          )}
        </div>

        <div className="home-side-card">
          <div className="home-side-card-head">
            <h3>Intercambios populares</h3>
            <span>En tendencia</span>
          </div>

          {popularExchanges.length > 0 ? (
            popularExchanges.map((post) => (
              <div key={`popular-${post.id}`} className="community-card community-card--compact">
                <div>
                  <strong>{post.title}</strong>
                  <p>{post.authorName || 'Anónimo'}</p>
                </div>
                <span>{post.created}</span>
              </div>
            ))
          ) : null}
        </div>

        <button className="floating-create-btn" onClick={onOpenPublish}>
          + Crear publicación
        </button>
      </aside>
    </div>
  );
}

export default HomePage;
