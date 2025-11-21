import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const gifts = [
  { id: 1, name: '❤️ Corazón', cost: 10, points: 5 },
  { id: 2, name: '🎉 Confeti', cost: 25, points: 15 },
  { id: 3, name: '🌟 Estrella', cost: 50, points: 30 },
  { id: 4, name: '👑 Corona', cost: 100, points: 60 },
  { id: 5, name: '🚀 Cohete', cost: 200, points: 120 },
  { id: 6, name: '💎 Diamante', cost: 500, points: 300 },
];

export default function GiftShop({ onLogout, coins = 0, onSpend }) {
  const [monedas, setMonedas] = useState(coins);
  const [puntos, setPuntos] = useState(0);
  const [notificacion, setNotificacion] = useState({ show: false, title: '', message: '' });

  const comprarRegalo = (regalo) => {
    if (monedas >= regalo.cost) {
      setMonedas(monedas - regalo.cost);
      onSpend?.(regalo.cost);
      setPuntos(puntos + regalo.points);
      mostrarNotificacion('¡Regalo Comprado!', `Has comprado ${regalo.name} y ganado ${regalo.points} puntos`);
    } else {
      mostrarNotificacion('Monedas Insuficientes', `Necesitas ${regalo.cost - monedas} monedas más`);
    }
  };

  const mostrarNotificacion = (titulo, mensaje) => {
    setNotificacion({ show: true, title: titulo, message: mensaje });
  };

  const cerrarNotificacion = () => {
    setNotificacion({ ...notificacion, show: false });
  };

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <div className="navbar-brand">
          <h1>StreamBoost</h1>
        </div>

        <div className="navbar-right">
          <span className="monedas">Monedas: <span id="monedas">{monedas}</span></span>
          <span className="points">Puntos: <span id="user-points">{puntos}</span></span>
          <Link to="/dashboard" className="perfil-button">Perfil</Link>
          <button className="logout-button" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="container-general">
        <div className="welcome-section">
          <h2>🎁 Tienda de Regalos</h2>
          <p className="text-secondary">Compra regalos para apoyar a tus streamers favoritos y gana puntos</p>
        </div>

        <div className="gifts-section">
          <h3>Regalos Disponibles</h3>
          <div className="gifts-grid" id="gifts-list">
            {gifts.map((regalo) => (
              <div key={regalo.id} className="gift-item">
                <div className="gift-emoji">
                  {regalo.name.split(' ')[0]}
                </div>
                <h4 className="gift-name">
                  {regalo.name.substring(regalo.name.indexOf(' ') + 1)}
                </h4>
                <p className="gift-cost">
                  💰 {regalo.cost} monedas
                </p>
                <p className="gift-points">
                  ⭐ +{regalo.points} puntos
                </p>
                <button 
                  className="btn btn-primary gift-button-full"
                  onClick={() => comprarRegalo(regalo)}
                >
                  Comprar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="back-section">
          <Link to="/dashboard" className="btn-back">← Regresar al Perfil</Link>
        </div>
      </main>
      {notificacion.show && (
        <div className="notification-modal">
          <div className="notification-content">
            <div className="notification-icon">
              {notificacion.title.includes('Comprado') ? '✅' : '⚠️'}
            </div>
            <h3 id="notification-title">{notificacion.title}</h3>
            <p id="notification-message">{notificacion.message}</p>
            <button 
              id="notification-close" 
              className="notification-close"
              onClick={cerrarNotificacion}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
