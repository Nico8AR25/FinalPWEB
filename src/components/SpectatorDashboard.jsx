import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SpectatorDashboard = ({ onLogout, user }) => {
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
const [monedas, setMonedas] = useState(user?.monedas ?? 0);
const nivel = user?.nivel ?? 1;
const puntos = user?.puntos ?? 0;

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
          <button className="view-streams-btn">📺 Ver Streams</button>
        </div>

        {/* Sección de Tienda de Regalos (enlace) */}
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