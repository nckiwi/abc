import React, { useEffect, useRef, useState } from 'react';

function Header({ currentUser, page, logoSecondary, unreadCount, onNavigate, onUserMenuSelect, onMarkNotificationsRead, onOpenPublish, theme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
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
            <button className="icon-button" onClick={onMarkNotificationsRead} title="Notificaciones">
              🔔
              {unreadCount > 0 ? <span className="badge">{unreadCount}</span> : null}
            </button>
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
