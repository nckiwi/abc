import React from 'react';

function ProfilePage({ currentUser, profileTab, onTabChange, profileData, onProfileChange, onAvatarChange, onSave, profilePosts }) {
  return (
    <div className="profile-page">
      <div className="section-header">
        <div>
          <h2>Tu perfil</h2>
          <p>Gestiona tu configuración y revisa tu cuenta.</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={profileTab === 'configuracion' ? 'tab-item active' : 'tab-item'} onClick={() => onTabChange('configuracion')}>
          Configuración
        </button>
        <button className={profileTab === 'cuenta' ? 'tab-item active' : 'tab-item'} onClick={() => onTabChange('cuenta')}>
          Cuenta
        </button>
      </div>

      {profileTab === 'configuracion' ? (
        <div className="profile-grid">
          <div className="profile-form-card">
            <h3>Detalles del perfil</h3>
            <label>
              Foto de perfil
              <input type="file" accept="image/*" onChange={onAvatarChange} />
            </label>
            <label>
              Nombre
              <input
                type="text"
                value={profileData.name}
                onChange={(event) => onProfileChange({ ...profileData, name: event.target.value })}
              />
            </label>
            <label>
              Nueva contraseña
              <input
                type="password"
                value={profileData.password}
                onChange={(event) => onProfileChange({ ...profileData, password: event.target.value })}
                placeholder="Dejar en blanco para mantener la actual"
              />
            </label>
            <label>
              Descripción
              <textarea
                value={profileData.description}
                onChange={(event) => onProfileChange({ ...profileData, description: event.target.value })}
                rows={4}
              />
            </label>
            <label>
              Intereses
              <input
                type="text"
                value={profileData.interests}
                onChange={(event) => onProfileChange({ ...profileData, interests: event.target.value })}
              />
            </label>
            <button className="btn btn-primary" onClick={onSave}>
              Guardar cambios
            </button>
          </div>

          <div className="profile-publications-card">
            <h3>Tus publicaciones</h3>
            {profilePosts.length === 0 ? (
              <p>Aún no tienes publicaciones. Usa Publicar para comenzar.</p>
            ) : (
              profilePosts.map((post) => (
                <div key={post.id} className="publication-item">
                  <strong>{post.title}</strong>
                  <span>{post.category}</span>
                  <p>{post.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="profile-account-card">
          <div className="account-summary">
            <h3>Resumen de cuenta</h3>
            <p>
              <strong>Nombre:</strong> {currentUser?.name}
            </p>
            <p>
              <strong>Correo:</strong> {currentUser?.email}
            </p>
            <p>
              <strong>Intereses:</strong> {currentUser?.interests || 'No configurado'}
            </p>
            <p>
              <strong>Publicaciones:</strong> {profilePosts.length}
            </p>
          </div>
          <div className="profile-publications-card">
            <h3>Publicaciones recientes</h3>
            {profilePosts.length === 0 ? (
              <p>No tienes publicaciones todavía.</p>
            ) : (
              profilePosts.map((post) => (
                <div key={post.id} className="publication-item">
                  <strong>{post.title}</strong>
                  <span>{post.category}</span>
                  <p>{post.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
