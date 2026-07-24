import React from 'react';

function LandingPage({ logoPrimary, heroImage, onLoginClick, onRegisterClick }) {
  return (
    <main className="landing-page landing-page--clean">
      <header className="landing-header landing-header--simple">
        <div className="landing-brand">
          <img className="hero-logo" src={logoPrimary} alt="AporB" />
          <div>
            <strong>AporB</strong>
            <span>Trueque social sin dinero</span>
          </div>
        </div>
        <div className="landing-actions">
          <button className="btn btn-ghost" onClick={onLoginClick}>
            Iniciar sesión
          </button>
          <button className="btn btn-primary" onClick={onRegisterClick}>
            Registrarse
          </button>
        </div>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="hero-label">Red social de trueque</p>
          <h1>Una plataforma minimalista para intercambiar con confianza.</h1>
          <p>
            Publica artículos, conversa con otros y gestiona trueques sin complicaciones desde una interfaz clara y moderna.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onRegisterClick}>
              Comenzar ahora
            </button>
            <button className="btn btn-secondary" onClick={onLoginClick}>
              Iniciar sesión
            </button>
          </div>
        </div>
        <div className="hero-visual-card">
          <img src={heroImage} alt="Vista del marketplace" />
        </div>
      </section>

      <section className="landing-features landing-features--minimal">
        <div className="feature-card">
          <h2>Publica rápido</h2>
          <p>Crea anuncios con fotos, detalles y ubicación en segundos.</p>
        </div>
        <div className="feature-card">
          <h2>Chatea con confianza</h2>
          <p>Habla directamente con interesados y coordina el trueque.</p>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
