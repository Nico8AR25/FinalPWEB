import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SpectatorDashboard = ({ onLogout, user }) => {
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
  const [monedas, setMonedas] = useState(user?.monedas ?? 0);
  const nivel = user?.nivel ?? 1;
  const puntos = user?.puntos ?? 0;

  // Lista de videos locales (pon tus mp4 en /public/videos)
  const videos = [
    "/videos/video1.mp4",
    "/videos/video2.mp4",
    "/videos/video3.mp4",
    "/videos/video4.mp4",
  ];

  React.useEffect(() => {
    setMonedas(user?.monedas ?? 0);
  }, [user?.monedas]);

  const manejarBusqueda = () => {
    // Buscando: consultaBusqueda
  };

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <div className="navbar-brand">
          <h1>StreamBoost</h1>
        </div>

        <div className="navbar-right">
          <div className="xp-header">
            <span id="nivel-text">Nivel <span id="nivel">{nivel}</span></span>
          </div>

          <span className="monedas">Monedas: <span id="monedas">{monedas}</span></span>
          <Link to="/recarga" target="_blank" className="perfil-button perfil-button-margin">Recargar Monedas</Link>
          <Link to="/perfil" className="perfil-button">Perfil</Link>
          <button className="logout-button" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="container-general">
        <div className="welcome-section">
          <h2 id="saludo-usuario">Hola, {user?.nombre || user?.username || 'espectador'}</h2>
          <p className="user-role">Rol: <span id="rol-usuario">{user?.rol || 'espectador'}</span></p>
          
          {/* Información de nivel del usuario */}
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

          {/* 🔴 BOTÓN ELIMINADO */}
          {/* <button className="view-streams-btn">📺 Ver Streams</button> */}
        </div>

        {/* ⭐⭐⭐ GALERÍA DE VIDEOS CON ESTILO TWITCH ⭐⭐⭐ */}
<div className="videos-section">
  <h3>📺 Streams Disponibles</h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    }}
  >
    {videos.map((src, i) => (
      <div
        key={i}
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {/* 🔴 ETIQUETA EN VIVO */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            backgroundColor: "red",
            color: "white",
            padding: "3px 8px",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
            zIndex: 10,
          }}
        >
          EN VIVO
        </div>

        {/* 👁️ CONTADOR DE ESPECTADORES */}
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: "8px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            fontSize: "13px",
            borderRadius: "4px",
            zIndex: 10,
          }}
        >
          {Math.floor(Math.random() * 900 + 100)} espectadores
        </div>

        {/* 🎥 EL VIDEO */}
        <video
          src={src}
          controls
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
        />
      </div>
    ))}
  </div>
</div>

        
        

        {/* Sección de Tienda de Regalos */}
        <div className="gifts-section">
          <Link to="/tienda-regalos" className="gifts-link">
            <h3>🎁 Tienda de Regalos</h3>
          </Link>
          <p className="text-secondary">Explora y compra regalos para tus streamers favoritos.</p>
        </div>

        {/* Sección de Regalos Comprados */}
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
