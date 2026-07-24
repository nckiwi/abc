import React from 'react';

function Sidebar({ profileOwner, notifications }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="profile-card sidebar-card">
        <div className="profile-avatar">
          {profileOwner?.avatar ? <img src={profileOwner.avatar} alt="Avatar" /> : <span>{profileOwner?.name?.charAt(0) || 'A'}</span>}
        </div>
        <div>
          <strong>{profileOwner?.name}</strong>
          <p>{profileOwner?.description}</p>
        </div>
      </div>

      <div className="sidebar-card">
        <h3>Notificaciones</h3>
        {notifications.slice(0, 3).map((item) => (
          <div key={item.id} className={item.read ? 'notification-item read' : 'notification-item'}>
            {item.text}
          </div>
        ))}
      </div>

      <div className="sidebar-card">
        <h3>Recomendado</h3>
        <p>Usa el botón Publicar para compartir tu objeto y encontrar trueques más rápido.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
