import React from 'react';

function AuthPage({ authMode, authForm, onFormChange, onSubmit, onToggleMode, authMessage }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>{authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
        {authMode === 'register' && (
          <label>
            Nombre completo
            <input
              type="text"
              value={authForm.name}
              onChange={(event) => onFormChange({ ...authForm, name: event.target.value })}
              placeholder="Tu nombre"
            />
          </label>
        )}

        <label>
          Correo electrónico
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => onFormChange({ ...authForm, email: event.target.value })}
            placeholder="tucorreo@aporb.com"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => onFormChange({ ...authForm, password: event.target.value })}
            placeholder="********"
          />
        </label>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={onSubmit}>
            {authMode === 'login' ? 'Ingresar' : 'Registrarme'}
          </button>
          <button className="btn btn-ghost" onClick={onToggleMode}>
            {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta'}
          </button>
        </div>

        {authMessage ? <p className="form-message">{authMessage}</p> : null}
      </div>
    </main>
  );
}

export default AuthPage;
