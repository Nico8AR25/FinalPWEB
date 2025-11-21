import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SpectatorDashboard = ({ onLogout, user }) => {
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
  const [monedas, setMonedas] = useState(user?.monedas ?? 0);
  const nivel = user?.nivel ?? 1;
  const puntos = user?.puntos ?? 0;

  // STREAMERS + VIDEOS SINCRONIZADOS
  const streamers = [
    { nombre: "pgod", espectadores: 680, video: "/videos/video1.mp4" },
    { nombre: "Hitox", espectadores: 592, video: "/videos/video2.mp4" },
    { nombre: "Chung", espectadores: 3500, video: "/videos/video3.mp4" },
    { nombre: "NicoAro", espectadores: 3300, video: "/videos/video4.mp4" },
  ];

  React.useEffect(() => {
    setMonedas(user?.monedas ?? 0);
  }, [user?.monedas]);

  const manejarBusqueda = () => {};

  return (
    <div className="page-wrapper" style={{ marginLeft: "270px" }}>

      
      {/* NAVBAR */}
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


      {/* LAYOUT: ESPACIO PARA EL SIDEBAR */}
      <main className="container-general" style={{ marginLeft: "270px" }}>

        {/* SIDEBAR IZQUIERDO */}
        <div 
          style={{
            position: "fixed",
            left: 0,
            top: 20,
            width: "260px",
            height: "100vh",
            backgroundColor: "#18181b",
            color: "white",
            padding: "20px 15px",
            borderRight: "1px solid #333",
            overflowY: "auto",
            zIndex: 1000
          }}
        >
          <h3 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "bold" }}>
            Canales en vivo
          </h3>

          {streamers.map((s, i) => (
            <div 
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 5px",
                cursor: "pointer",
                borderRadius: "8px",
                marginBottom: "8px",
                transition: "0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2a2a2d"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "15px", fontWeight: "600" }}>{s.nombre}</span>
                <span style={{ fontSize: "13px", color: "#aaa" }}>fORTNITE</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span 
                  style={{
                    display: "block",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "red",
                    borderRadius: "50%"
                  }}
                ></span>
                <span style={{ fontSize: "14px" }}>{s.espectadores}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN DE BIENVENIDA */}
        <div className="welcome-section">
          <h2 id="saludo-usuario">Hola, {user?.nombre || user?.username || 'espectador'}</h2>
          <p className="user-role">Rol: <span id="rol-usuario">{user?.rol || 'espectador'}</span></p>

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

        {/* BUSCADOR */}
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

        {/* GALERÍA DE VIDEOS (Twitch style) */}
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
            {streamers.map((s, i) => (
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
                {/* LIVE + espectadores */}
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
                  LIVE ● {s.espectadores}
                </div>

                {/* VIDEO */}
                <video
                  src={s.video}
                  controls
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />

                {/* Nombre streamer */}
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#1b1b1d",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {s.nombre}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIENDA */}
        <div className="gifts-section">
          <Link to="/tienda-regalos" className="gifts-link">
            <h3>🎁 Tienda de Regalos</h3>
          </Link>
          <p className="text-secondary">Explora y compra regalos para tus streamers favoritos.</p>
        </div>

        {/* REGALOS COMPRADOS */}
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
