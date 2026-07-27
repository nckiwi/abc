import React from 'react';

function ProfilePage({ currentUser, profileTab, onTabChange, profileData, onProfileChange, onAvatarChange, onSave, profilePosts }) {
  const tabs = [
    { key: 'configuracion', label: 'Objetos en intercambio' },
    { key: 'valoraciones', label: 'Valoraciones' },
    { key: 'historial', label: 'Historial' },
    { key: 'favoritos', label: 'Favoritos' },
  ];

  const mockReviews = [
    { id: 1, name: 'Marta', stars: 5, comment: 'Muy buena comunicación y trato cercano.', date: 'Hace 2 días' },
    { id: 2, name: 'Luis', stars: 4, comment: 'Entrega rápida y muy claro en los detalles.', date: 'Hace 1 semana' },
  ];

  const historyItems = [
    { id: 1, delivered: 'Libro de cocina', received: 'Mesa pequeña', user: 'Sofía', date: '12 jun', status: 'Completado' },
    { id: 2, delivered: 'Cámara', received: 'Auriculares', user: 'Tomás', date: '03 jun', status: 'En revisión' },
  ];

  const renderProfileContent = () => {
    if (profileTab === 'valoraciones') {
      return (
        <div className="profile-review-list">
          {mockReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-head">
                <div className="review-avatar">{review.name.charAt(0)}</div>
                <div>
                  <strong>{review.name}</strong>
                  <p>{review.date}</p>
                </div>
              </div>
              <div className="review-stars">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      );
    }

    if (profileTab === 'historial') {
      return (
        <div className="profile-history-list">
          {historyItems.map((item) => (
            <div key={item.id} className="history-card">
              <div>
                <p className="history-label">Entregado</p>
                <strong>{item.delivered}</strong>
              </div>
              <div>
                <p className="history-label">Recibido</p>
                <strong>{item.received}</strong>
              </div>
              <div>
                <p className="history-label">Usuario</p>
                <strong>{item.user}</strong>
              </div>
              <div>
                <p className="history-label">Fecha</p>
                <strong>{item.date}</strong>
              </div>
              <div>
                <p className="history-label">Estado</p>
                <span className="history-status">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (profileTab === 'favoritos') {
      return (
        <div className="profile-grid-cards">
          {profilePosts.length === 0 ? (
            <div className="empty-state-card">No tienes favoritos guardados.</div>
          ) : (
            profilePosts.map((post) => (
              <div key={post.id} className="product-card">
                <div className="product-card-media" />
                <div className="product-card-body">
                  <strong>{post.title}</strong>
                  <p>{post.description}</p>
                  <div className="product-card-meta">
                    <span>{post.category}</span>
                    <button className="btn btn-secondary btn-sm" type="button">Ver detalles</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    return (
      <div className="profile-grid-cards">
        {profilePosts.length === 0 ? (
          <div className="empty-state-card">Aún no tienes publicaciones para mostrar.</div>
        ) : (
          profilePosts.map((post) => (
            <div key={post.id} className="product-card">
              <div className="product-card-media" />
              <div className="product-card-body">
                <strong>{post.title}</strong>
                <p>{post.description}</p>
                <div className="product-card-meta">
                  <span>{post.category}</span>
                  <button className="btn btn-secondary btn-sm" type="button">Ver detalles</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="profile-page">
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-avatar-block">
            <div className="profile-avatar-large">
              {profileData.avatar ? <img src={profileData.avatar} alt="Avatar" /> : <span>{(profileData.name || currentUser?.name || 'A').charAt(0).toUpperCase()}</span>}
            </div>
            <div className="profile-user-info">
              <h2>{profileData.name || currentUser?.name || 'Usuario'}</h2>
              <div className="profile-meta-line">
                <span>📍 {profileData.interests || currentUser?.interests || 'Ubicación no indicada'}</span>
                <span>📅 Miembro desde 2024</span>
              </div>
              <p>{profileData.description || currentUser?.description || 'Sin descripción aún.'}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div>
              <strong>24</strong>
              <span>Intercambios</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>Valoración</span>
            </div>
            <div>
              <strong>128</strong>
              <span>Opiniones</span>
            </div>
            <div>
              <strong>{profilePosts.length}</strong>
              <span>Disponibles</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn btn-primary" type="button" onClick={onSave}>Editar perfil</button>
          <button className="btn btn-secondary" type="button">Configuración</button>
        </div>
      </div>

      <div className="profile-content-card">
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={profileTab === tab.key ? 'tab-item active' : 'tab-item'}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderProfileContent()}
      </div>
    </div>
  );
}

export default ProfilePage;
