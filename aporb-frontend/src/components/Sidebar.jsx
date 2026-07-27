import React from 'react';

function Sidebar({ profileOwner, notifications, categories = [], activeCategory = 'all', onFilterChange, onOpenPublish }) {
  const categoryIcons = {
    all: '◉',
    libros: '📚',
    tecnologia: '💻',
    ropa: '👕',
    muebles: '🪑',
    deportes: '⚽',
    hogar: '🏠',
    default: '✨',
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">A</div>
        <div>
          <strong>AporB</strong>
          <p>Marketplace</p>
        </div>
      </div>

      <div className="sidebar-panel">
        <div className="sidebar-panel-header">
          <h3>Categorías</h3>
          <span>Explorar</span>
        </div>

        <nav className="category-list">
          {categories.map((option) => {
            const value = typeof option === 'string' ? option : option;
            const label = value === 'all' ? 'Todo' : value.charAt(0).toUpperCase() + value.slice(1);
            const isActive = activeCategory === value;
            const icon = categoryIcons[value?.toLowerCase()] || categoryIcons.default;

            return (
              <button
                key={value}
                type="button"
                className={`category-item ${isActive ? 'active' : ''}`}
                onClick={() => onFilterChange?.(value)}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-panel sidebar-profile-card">
        <div className="profile-avatar">
          {profileOwner?.avatar ? <img src={profileOwner.avatar} alt="Avatar" /> : <span>{profileOwner?.name?.charAt(0) || 'A'}</span>}
        </div>
        <div>
          <strong>{profileOwner?.name || 'Tu perfil'}</strong>
          <p>{profileOwner?.description || 'Comparte y encuentra publicaciones cercanas.'}</p>
        </div>
      </div>

      <div className="sidebar-panel">
        <div className="sidebar-panel-header">
          <h3>Actividad</h3>
          <span>Reciente</span>
        </div>
        {notifications.slice(0, 3).map((item) => (
          <div key={item.id} className={item.read ? 'notification-item read' : 'notification-item'}>
            {item.text}
          </div>
        ))}
      </div>

      <button className="sidebar-create-btn" type="button" onClick={onOpenPublish}>
        + Crear publicación
      </button>
    </aside>
  );
}

export default Sidebar;
