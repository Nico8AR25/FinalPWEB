import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function StreamPreview({ onEndStream, onGift }) {
  const navigate = useNavigate();
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [espectadores, setEspectadores] = useState(23);
  const [actividad, setActividad] = useState([
    '🔥 Twitch te siguió — ahora',
    '✨ KappaKares se suscribió — hace 10 minutos',
    '👤 ParkaSpeak te siguió — hace 22 minutos',
  ]);
  const [chat, setChat] = useState([
    'maxxt: ¡Qué jugada! 🔥',
    'akaDonny: ¡Hola chat! 👋',
  ]);
  const [contadorRegalos, setContadorRegalos] = useState(0);
  const referenciaInput = useRef(null);

  useEffect(() => {
    const intervalo = setInterval(() => setTiempoTranscurrido((s) => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const etiquetaTiempo = useMemo(() => {
    const h = Math.floor(tiempoTranscurrido / 3600).toString().padStart(1, '0');
    const m = Math.floor((tiempoTranscurrido % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(tiempoTranscurrido % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, [tiempoTranscurrido]);

  const simularChat = () => {
    const valor = referenciaInput.current?.value?.trim();
    const mensaje = valor && valor.length ? valor : `Usuario${Math.floor(Math.random()*100)}: ¡Hola!`;
    setChat((c) => [...c, mensaje]);
    if (referenciaInput.current) referenciaInput.current.value = '';
  };
  const simularSeguimiento = () => {
    const nombre = `Usuario${Math.floor(Math.random()*9999)}`;
    setActividad((a) => [
      `👤 ${nombre} te siguió — ahora`,
      ...a,
    ]);
    setEspectadores((v) => v + Math.ceil(Math.random()*3));
  };
  const simularRegalo = () => {
    const puntos = [1,5,10,20][Math.floor(Math.random()*4)];
    setContadorRegalos((g) => g + 1);
    setActividad((a) => [
      `🎁 Recibiste un regalo (${puntos} pts) — ahora`,
      ...a,
    ]);
    onGift?.(puntos);
  };

  return (
    <div className="page-wrapper">
      <header className="sm-topbar">
        <div className="sm-title">Administrador de Transmisión</div>
        <div className="sm-metrics">
          <div className="metric-badge metric-center">{etiquetaTiempo}</div>
          <div className="metric-badge metric-center">{espectadores} espectadores</div>
        </div>
      </header>

      <main className="sm-grid">
        <aside className="sm-col fill-col">
          <section className="sm-panel grow">
            <h3 className="sm-panel-title">Actividad de Transmisión</h3>
            <ul className="sm-list">
              {actividad.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="sm-panel grow">
            <h3 className="sm-panel-title">Mi Chat</h3>
            <div className="sm-chat">
              {chat.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
            <div className="sm-input-row">
              <input ref={referenciaInput} className="sm-input" placeholder="Enviar mensaje" />
              <button className="btn btn-primary" onClick={simularChat}>Enviar</button>
            </div>
          </section>
        </aside>

        <section className="sm-center">
          <div className="sm-panel">
            <h3 className="sm-panel-title">Vista Previa de Transmisión</h3>
            <div className="preview-box">
              <div className="red-screen" />
            </div>
            <div className="sm-status">
              <span className="badge-live">EN VIVO</span>
              <span className="badge-good">BUENO</span>
              <span className="badge-gifts">🎁 {contadorRegalos}</span>
            </div>
          </div>
        </section>

        <aside className="sm-col">
          <section className="sm-panel">
            <h3 className="sm-panel-title">Acciones Rápidas</h3>
            <div className="qa-grid">
              {[
                'Editar Info de Transmisión', '¡Hacer Clip!',
                'Ejecutar Anuncio 30s', 'Raid a un Canal',
                'Iniciar Squad Stream', 'Chat Solo Seguidores',
                'Chat Solo Emotes', '+'
              ].map((label) => (
                <button key={label} className="qa-btn">{label}</button>
              ))}
            </div>
          </section>
        </aside>
      </main>
      <footer className="sm-bottom-controls">
        <div className="controls-inner">
          <button className="btn btn-primary" onClick={simularChat}>Simular Chat</button>
          <button className="btn btn-primary" onClick={simularSeguimiento}>Simular Seguimiento</button>
          <button className="btn btn-primary" onClick={simularRegalo}>Simular Regalo</button>
          <button
            className="btn btn-danger"
            onClick={() => { onEndStream?.(); navigate('/dashboard'); }}
          >
            Finalizar Transmisión
          </button>
        </div>
      </footer>
    </div>
  );
}
