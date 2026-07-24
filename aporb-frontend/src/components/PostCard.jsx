import React from 'react';

function PostCard({ post, author, onStartChat }) {
  return (
    <article className="post-card">
      <div className="post-header">
        <div>
          <span className="post-category">{post.category}</span>
          <h3>{post.title}</h3>
          <p className="post-meta">Publicado por {author.name} · {post.created}</p>
        </div>
        <button className="btn btn-sm" onClick={() => onStartChat(post.userId, author.name)}>
          Iniciar chat
        </button>
      </div>
      <p>{post.description}</p>
      {post.media?.length > 0 && (
        <div className="post-media-grid">
          {post.media.map((item, index) =>
            item.type.startsWith('video/') ? (
              <video key={index} src={item.src} controls className="media-preview" />
            ) : (
              <img key={index} src={item.src} alt={item.name} className="media-preview" />
            ),
          )}
        </div>
      )}
      <div className="post-details">
        <p>{post.details}</p>
      </div>
    </article>
  );
}

export default PostCard;
