import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SpectatorDashboard = ({ onLogout, user }) => {
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
  const [monedas, setMonedas] = useState(user?.monedas ?? 0);
  const nivel = user?.nivel ?? 1;
  const puntos = user?.puntos ?? 0;

  const streamers = [
    { nombre: "pgod", espectadores: 680, video: "/videos/video1.mp4" },
    { nombre: "Hitox", espectadores: 592, video: "/videos/video2.mp4" },
    { nombre: "Chung", espectadores: 3500, video: "/videos/video3.mp4" },
    { nombre: "NicoAro", espectadores: 3300, video: "/videos/video4.mp4" },
  ];

  useEffect(() => {
    setMonedas(user?.monedas ?? 0);
  }, [user?.monedas]);

  const manejarBusqueda = () => {};

  return (
    <div className="page-wrapper dashboard-with-sidebar">

      <header className="navbar">
        <div className="navbar-brand">
          <h1>StreamBoost</h1>
        </div>

        <div className="navbar-right">
          <div className="xp-header">
            <span id="nivel-text">Nivel <span id="nivel">{nivel}</span></span>
          </div>

          <span className="monedas">
            Monedas: <span id="monedas">{monedas}</span>
          </span>

          <Link to="/recarga" target="_blank" className="perfil-button perfil-button-margin">
            Recargar Monedas
          </Link>

          <Link to="/perfil" className="perfil-button">
            Perfil
          </Link>

          <button className="logout-button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container-general dashboard-with-sidebar">
        <div className="sidebar-container">
          <h3 className="sidebar-title">
            Canales en vivo
          </h3>

          {streamers.map((s, i) => (
            <div 
              key={i}
              className="sidebar-item"
            >
              <div className="sidebar-item-content">
                <span className="sidebar-item-name">{s.nombre}</span>
                <span className="sidebar-item-game">fORTNITE</span>
              </div>

              <div className="sidebar-item-viewers">
                <span className="live-indicator"></span>
                <span className="sidebar-viewer-count">{s.espectadores}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="welcome-section">
          <h2 id="saludo-usuario">
            Hola, {user?.nombre || user?.username || 'espectador'}
          </h2>

          <p className="user-role">
            Rol: <span id="rol-usuario">{user?.rol || 'espectador'}</span>
          </p>

          <div className="user-level-info">
            <div className="level-badge">
              <span className="level-text">Nivel</span>
              <span id="user-level" className="level-number">{nivel}</span>
            </div>
            <div className="points-info">
              <span id="user-points">{puntos}</span> puntos
            </div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-container">
            <input 
              type="text" 
              id="search-input" 
              placeholder="Buscar streamers..." 
              className="search-input"
              value={consultaBusqueda}
              onChange={(e) => setConsultaBusqueda(e.target.value)}
            />
            <button className="search-button" onClick={manejarBusqueda}>🔍</button>
          </div>
        </div>

        <div className="videos-section">
          <h3>📺 Streams Disponibles</h3>

          <div className="videos-grid">
            {streamers.map((s, i) => (
              <div
                key={i}
                className="video-card"
              >
                <div className="live-badge">
                  LIVE ● {s.espectadores}
                </div>

                <video
                  src={s.video}
                  controls
                  className="video-preview"
                />

                <div className="video-info">
                  {s.nombre}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gifts-section">
          <Link to="/tienda-regalos" className="gifts-link">
            <h3>🎁 Tienda de Regalos</h3>
          </Link>
          <p className="text-secondary">Explora y compra regalos para tus streamers favoritos.</p>
        </div>

        <div className="purchased-gifts-section">
          <h3>Mis Regalos Comprados</h3>
          <div id="purchased-gifts-list" className="gifts-grid">
            <p className="purchased-gifts-empty">No has comprado ningún regalo aún</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default SpectatorDashboard;
