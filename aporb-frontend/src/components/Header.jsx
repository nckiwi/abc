import React, { useEffect, useRef, useState } from 'react';

function Header({ currentUser, page, logoSecondary, unreadCount, notifications = [], onNavigate, onUserMenuSelect, onMarkNotificationsRead, onOpenPublish, theme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = currentUser?.name?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className={`app-header ${theme === 'night' ? 'header-night' : 'header-day'}`}>
      <button className="brand-block" type="button" onClick={() => (currentUser ? onNavigate('home') : onNavigate('landing'))} aria-label="AporB">
        <img className="brand-logo" src={logoSecondary} alt="AporB" />
      </button>

      {currentUser ? (
        <nav className="nav-links">
          <button className={page === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('home')}>
            Home
          </button>
          <button className={page === 'chats' ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate('chats')}>
            Chats
          </button>
          <button className="nav-item" onClick={onOpenPublish}>
            Publicar
          </button>
        </nav>
      ) : null}

      <div className="header-actions">
        {currentUser ? (
          <>
            <div className="notifications-wrapper" ref={notificationsRef}>
              <button
                className="icon-button"
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  if (!notificationsOpen) {
                    onMarkNotificationsRead();
                  }
                }}
                title="Notificaciones"
                type="button"
              >
                🔔
                {unreadCount > 0 ? <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span> : null}
              </button>

              {notificationsOpen ? (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <div>
                      <h3>Notificaciones</h3>
                      <p>{unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}</p>
                    </div>
                    <button className="notifications-link" type="button" onClick={onMarkNotificationsRead}>
                      Marcar todas como leídas
                    </button>
                  </div>

                  <div className="notifications-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">No tienes notificaciones aún.</div>
                    ) : (
                      notifications.slice(0, 8).map((item) => (
                        <button key={item.id} className={`notification-item-card ${item.read ? '' : 'unread'}`} type="button">
                          <div className="notification-avatar">{(item.text || 'A').charAt(0).toUpperCase()}</div>
                          <div className="notification-body">
                            <strong>{item.text}</strong>
                            <p>Hace unos momentos</p>
                          </div>
                          {!item.read ? <span className="notification-dot" /> : null}
                        </button>
                      ))
                    )}
                  </div>

                  <button className="notifications-footer-btn" type="button">
                    Ver todas las notificaciones
                  </button>
                </div>
              ) : null}
            </div>
            <div className="user-menu-wrapper" ref={menuRef}>
              <button className="icon-button user-avatar" onClick={() => setMenuOpen((open) => !open)} title="Perfil">
                {initials || 'US'}
              </button>
              {menuOpen ? (
                <div className="user-menu-card">
                  <button className="menu-item" onClick={() => { onUserMenuSelect('configuracion'); setMenuOpen(false); }}>
                    Configuración
                  </button>
                  <button className="menu-item" onClick={() => { onUserMenuSelect('cuenta'); setMenuOpen(false); }}>
                    Cuenta
                  </button>
                  <button className="menu-item" onClick={() => { onUserMenuSelect('aspecto'); setMenuOpen(false); }}>
                    Aspecto ({theme === 'night' ? 'Día' : 'Nocturno'})
                  </button>
                  <button className="menu-item menu-item--danger" onClick={() => { onUserMenuSelect('logout'); setMenuOpen(false); }}>
                    Cerrar sesión
                  </button>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
