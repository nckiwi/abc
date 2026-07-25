import React from 'react';
import PostCard from '../components/PostCard.jsx';

function HomePage({ posts, searchQuery, filterCategory, categories, onSearchChange, onFilterChange, onOpenPublish, onStartChat }) {
  return (
    <>
      <div className="section-header home-header">
        <div>
          <h2>Explorar publicaciones</h2>
          <p>Busca objetos, filtra por categoría y conecta con otros usuarios.</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenPublish}>
          Publicar
        </button>
      </div>

      <div className="search-panel">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Busca por título, descripción o detalles..."
        />
        <select value={filterCategory} onChange={(event) => onFilterChange(event.target.value)}>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option === 'all' ? 'Todas las categorías' : option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
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
    </>
  );
}

export default HomePage;
