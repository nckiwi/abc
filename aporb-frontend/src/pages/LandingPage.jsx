import React from 'react';

function LandingPage({ logoPrimary, heroImage, onLoginClick, onRegisterClick }) {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <img className="landing-logo" src={logoPrimary} alt="AporB" />
      </header>

      <section className="landing-hero">
        <div className="hero-column hero-column--visual">
          <div className="hero-copy">
            <h1>Trueque local sin complicaciones.</h1>
            <p className="hero-description">Comparte y recibe artículos en tu comunidad con confianza.</p>
          </div>

          <div className="hero-visual">
            <img src={heroImage} alt="Imagen principal de A por B" />
          </div>
        </div>

        <aside className="hero-column hero-column--form">
          <div className="hero-card">
            <div className="card-header">
              <div>
                <p className="card-pretitle">Accede a tu cuenta</p>
                <h2>Iniciar sesión</h2>
              </div>
            </div>

            <p className="card-text">Login rápido para continuar.</p>

            <div className="form-field">
              <label htmlFor="landing-email">Correo electrónico</label>
              <input id="landing-email" type="email" placeholder="hola@ejemplo.com" />
            </div>

            <div className="form-field">
              <label htmlFor="landing-password">Contraseña</label>
              <input id="landing-password" type="password" placeholder="••••••••" />
            </div>

            <button className="btn btn-primary btn-full" type="button" onClick={onLoginClick}>
              Iniciar sesión
            </button>

            <div className="form-separator">o</div>

            <button className="btn btn-secondary btn-full" type="button" onClick={onRegisterClick}>
              Crear cuenta
            </button>

            <button className="btn btn-link" type="button">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default LandingPage;
