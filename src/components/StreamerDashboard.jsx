import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StreamerDashboard = ({ onLogout, user, onStartStream, onStopStream, isLive, streamStart, horasTransmitidas, totalGifts, receivedPoints }) => {
  const [estaTransmitiendo, setEstaTransmitiendo] = useState(false);
  const [estadoRtmp, setEstadoRtmp] = useState('desconectado');
  const [progreso, setProgreso] = useState(0);
  const [horasParaSiguiente, setHorasParaSiguiente] = useState(5.0);
  const [nivelActual, setNivelActual] = useState(user?.nivel ?? 1);
  const navigate = useNavigate();

  const iniciarTransmision = () => {
    setEstaTransmitiendo(true);
    setEstadoRtmp('conectado');
    onStartStream?.();
    navigate('/stream-preview');
  };

  const detenerTransmision = () => {
  setEstaTransmitiendo(false);
  setEstadoRtmp('desconectado');
  onStopStream?.();
  };

  const actualizarProgreso = (horas) => {
    const horasParaSiguienteNivel = nivelActual * 5;
    const nuevoProgreso = (horas / horasParaSiguienteNivel) * 100;
    setProgreso(Math.min(nuevoProgreso, 100));
    setHorasParaSiguiente(Math.max(0, horasParaSiguienteNivel - horas));
  };

  const horasTranscurridasEnVivo = useMemo(() => {
    if (!isLive || !streamStart) return 0;
    const diferenciaMs = Date.now() - streamStart;
    return Math.max(0, diferenciaMs / (1000 * 60 * 60));
  }, [isLive, streamStart]);

  const horasTotales = (horasTransmitidas || 0) + horasTranscurridasEnVivo;

  useEffect(() => {
    actualizarProgreso(horasTotales);
    if (!isLive) return;
    const intervalo = setInterval(() => {
      actualizarProgreso((horasTransmitidas || 0) + ((Date.now() - (streamStart || 0)) / (1000 * 60 * 60)));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [isLive, streamStart, horasTransmitidas]);

  useEffect(() => {
    setEstaTransmitiendo(!!isLive);
    setEstadoRtmp(isLive ? 'conectado' : 'desconectado');
  }, [isLive]);

  return (
    <div className="page-wrapper">
      <header className="navbar">
        <div className="navbar-brand">
          <h1>StreamBoost</h1>
        </div>
        <div className="navbar-actions">
          <span className="navbar-greeting">Hola, {user?.nombre || user?.username || 'streamer'}</span>
          <span className="navbar-level">Nivel: {user?.nivel ?? 1}</span>
          <button onClick={onLogout} className="btn btn-outline">Cerrar sesión</button>
        </div>
      </header>

      <main className="container" id="ds-streamer">
        <div className="card">
          <h2>Dashboard del Streamer</h2>
          
          <div className="metric">
            <span id="rtmp-status" className={`rtmp-${estadoRtmp === 'conectado' ? 'connected' : 'disconnected'}`}>
              RTMP: {estadoRtmp}
            </span>
          </div>
          
          <div className="control-buttons">
            <button
              type="button"
              id="btnStart"
              className="btn btn-primary"
              onClick={iniciarTransmision}
              disabled={estaTransmitiendo}
            >
              Iniciar transmisión
            </button>
            <button 
              type="button"
              id="btnStop" 
              className="btn btn-danger" 
              onClick={detenerTransmision}
              disabled={!estaTransmitiendo}
            >
              Finalizar transmisión
            </button>
          </div>
          
          <div className="metric">
            Horas transmitidas: <span id="horas-transmitidas">{horasTotales.toFixed(2)}</span> h
          </div>
          
          <div className="progress-container">
            <div className="progress-label">Progreso hacia siguiente nivel:</div>
            <div className="progress">
              <div 
                id="hoursProgress" 
                className="progress-bar"
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
            <div id="hoursToNext" className="progress-text">
              Faltan {horasParaSiguiente.toFixed(1)} h para el nivel {nivelActual + 1}
            </div>
          </div>
          
          <p className="text-secondary">Última actualización: ahora</p>

          <section className="gifts-panel">
            <h3 className="gifts-title">🎁 Regalos Recibidos</h3>
            <p className="gifts-subtitle">Regalos enviados por tus espectadores durante las transmisiones</p>

            <div className="gift-stats">
              <div className="stat">
                <div className="stat-number">{totalGifts}</div>
                <div className="stat-label">Total de regalos</div>
              </div>
              <div className="stat">
                <div className="stat-number">{receivedPoints}</div>
                <div className="stat-label">Puntos recibidos</div>
              </div>
            </div>

            {totalGifts === 0 ? (
              <div className="empty-box">Aún no has recibido regalos de tus espectadores</div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
};

export default StreamerDashboard;