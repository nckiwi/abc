import React from 'react';

function PostCard({ post, onStartChat }) {
  const featuredMedia = post.media?.find((item) => !item.type?.includes('video')) || post.media?.[0];
  const categoryLabel = typeof post.category === 'string' ? post.category : 'general';

  return (
    <article className="post-card">
      {featuredMedia ? (
        <div className="post-media">
          {featuredMedia.type?.includes('video') ? (
            <video src={featuredMedia.src} controls className="media-preview" />
          ) : (
            <img src={featuredMedia.src} alt={featuredMedia.name || post.title} className="media-preview" />
          )}
        </div>
      ) : (
        <div className="post-media post-media--placeholder">
          <span>Sin imágenes</span>
        </div>
      )}

      <div className="post-body">
        <div className="post-card-top">
          <span className="post-category">{categoryLabel}</span>
          <span className="post-chip">Disponible</span>
        </div>

        <h3>{post.title}</h3>
        <p className="post-description">{post.description}</p>

        <div className="post-user-row">
          <div className="post-avatar">{(post.authorName || 'A').charAt(0).toUpperCase()}</div>
          <div>
            <strong>{post.authorName || 'Anónimo'}</strong>
            <p>{post.location || 'Ubicación no indicada'}</p>
          </div>
        </div>

        <div className="post-meta-row">
          <span>{post.created}</span>
          <span>{post.details || 'Sin detalles adicionales'}</span>
        </div>

        <div className="post-actions">
          <button className="btn btn-primary" onClick={() => onStartChat(post.userId, post.authorName || 'Anónimo')}>
            Me interesa
          </button>
          <button className="btn btn-secondary" type="button">
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
