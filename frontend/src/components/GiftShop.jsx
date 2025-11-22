import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../giftshop.css'; // si ya tienes estilos, déjalo; si no, quítalo

const API_URL = 'http://localhost:3080';

const gifts = [
  { id: 1, name: '❤️ Corazón', cost: 10, points: 5 },
  { id: 2, name: '🎉 Confeti', cost: 25, points: 15 },
  { id: 3, name: '🌟 Estrella', cost: 50, points: 30 },
  { id: 4, name: '👑 Corona', cost: 100, points: 60 },
  { id: 5, name: '🚀 Cohete', cost: 200, points: 120 },
  { id: 6, name: '💎 Diamante', cost: 500, points: 300 },
];

export default function GiftShop({
  onLogout,
  coins = 0,
  onSpend,
  xp = 0,
  onEarnPoints,
}) {
  const [monedas, setMonedas] = useState(coins ?? 0);
  const [puntos, setPuntos] = useState(xp ?? 0);
  const [notificacion, setNotificacion] = useState({
    show: false,
    title: '',
    message: '',
  });

  // Mantener sincronizado con props que vienen de App
  useEffect(() => {
    setMonedas(coins ?? 0);
  }, [coins]);

  useEffect(() => {
    setPuntos(xp ?? 0);
  }, [xp]);

  const mostrarNotificacion = (titulo, mensaje) => {
    setNotificacion({ show: true, title: titulo, message: mensaje });
  };

  const cerrarNotificacion = () => {
    setNotificacion(prev => ({ ...prev, show: false }));
  };

  const comprarRegalo = async regalo => {
    if (!regalo) return;

    const usuarioRaw = localStorage.getItem('user');
    if (!usuarioRaw) {
      mostrarNotificacion(
        'Error',
        'No hay usuario logueado. Inicia sesión nuevamente.'
      );
      return;
    }

    const usuario = JSON.parse(usuarioRaw);
    const saldoActual = monedas ?? 0;

    if (saldoActual < regalo.cost) {
      mostrarNotificacion(
        'Monedas insuficientes',
        `Necesitas ${regalo.cost - saldoActual} monedas más`
      );
      return;
    }

    try {
      // Llamar al backend para registrar donación y descontar saldo
      const resp = await fetch(`${API_URL}/donaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: usuario.id,
          // Si tuvieras un streamer/stream activo, podrías enviar:
          // streamerId: ...,
          // streamId: ...,
          monto: regalo.cost,
        }),
      });

      if (!resp.ok) {
        const dataError = await resp.json().catch(() => ({}));
        throw new Error(
          dataError.error || 'No se pudo registrar la donación en el servidor'
        );
      }

      const donacionCreada = await resp.json();
      console.log('Donación creada:', donacionCreada);

      // Actualizar monedas en frontend y localStorage
      const nuevasMonedas = saldoActual - regalo.cost;
      setMonedas(nuevasMonedas);
      onSpend?.(regalo.cost);

      const usuarioActualizado = {
        ...usuario,
        saldo: nuevasMonedas,
        monedas: nuevasMonedas,
      };
      localStorage.setItem('user', JSON.stringify(usuarioActualizado));

      // Actualizar puntos en App
      onEarnPoints?.(regalo.points);
      setPuntos(p => p + regalo.points);

      mostrarNotificacion(
        '¡Regalo Comprado!',
        `Has comprado ${regalo.name} y ganado ${regalo.points} puntos`
      );
    } catch (error) {
      console.error(error);
      mostrarNotificacion(
        'Error',
        error.message || 'Ocurrió un problema al procesar la compra del regalo'
      );
    }
  };

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <div className="navbar-left">
          <h1 className="logo">StreamBoost</h1>
        </div>
        <div className="navbar-center">
          <span className="navbar-balance">
            Monedas: <strong>{monedas}</strong>
          </span>
          <span className="navbar-xp">
            Puntos: <strong>{puntos}</strong>
          </span>
        </div>
        <div className="navbar-right">
          <Link to="/dashboard" className="btn btn-secondary">
            Volver al Dashboard
          </Link>
          <button className="btn btn-danger" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container-general">
        <div className="welcome-section">
          <h2>🎁 Tienda de Regalos</h2>
          <p className="text-secondary">
            Compra regalos para apoyar a tus streamers favoritos y gana puntos
          </p>
        </div>

        <div className="gifts-section">
          <h3>Regalos Disponibles</h3>
          <div className="gifts-grid" id="gifts-list">
            {gifts.map(regalo => (
              <div key={regalo.id} className="gift-item">
                <div className="gift-emoji">{regalo.name.split(' ')[0]}</div>
                <h4 className="gift-name">
                  {regalo.name.substring(regalo.name.indexOf(' ') + 1)}
                </h4>
                <p className="gift-cost">💰 {regalo.cost} monedas</p>
                <p className="gift-points">⭐ +{regalo.points} puntos</p>
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
      </main>

      {notificacion.show && (
        <div className="notification-overlay">
          <div className="notification-container">
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
