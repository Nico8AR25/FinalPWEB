import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import About from './components/About';
import Terms from './components/Terms';
import StreamerDashboard from './components/StreamerDashboard';
import SpectatorDashboard from './components/SpectatorDashboard';
import GiftShop from './components/GiftShop';
import StreamPreview from './components/StreamPreview';
import Recarga from './components/Recarga';
import PerfilEspectador from './components/PerfilEspectador';
import Registro from './components/Registro';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  // Estado de transmisión (elevado) para que Preview pueda actualizar Dashboard
  const [estaEnVivo, setEstaEnVivo] = useState(false);
  const [inicioTransmision, setInicioTransmision] = useState(null); // milisegundos desde epoch
  const [horasTransmitidas, setHorasTransmitidas] = useState(0); // horas acumuladas
  const [totalRegalos, setTotalRegalos] = useState(0);
  const [puntosRecibidos, setPuntosRecibidos] = useState(0);
  // Estado específico del usuario
  const [monedas, setMonedas] = useState(null);
  const [nivelEspectador, setNivelEspectador] = useState(null);
  const [xpEspectador, setXpEspectador] = useState(null);
  const [xpMaxEspectador, setXpMaxEspectador] = useState(null);

  // Verificación de autenticación simulada
  useEffect(() => {
    // Verificar si el usuario está logueado
    const usuarioLogueado = localStorage.getItem('user');
    if (usuarioLogueado) {
      const datosUsuario = JSON.parse(usuarioLogueado);
      setUsuario(datosUsuario);
      setMonedas(datosUsuario.monedas ?? 0);
      setNivelEspectador(datosUsuario.nivel ?? 1);
      setXpEspectador(datosUsuario.puntos ?? 0);
      setXpMaxEspectador(100); // Puedes ajustar esto si quieres guardar xpMax por usuario
    }
    setEstaCargando(false);
  }, []);

  const manejarLogin = (credenciales) => {
    setUsuario(credenciales);
    setMonedas(credenciales.monedas ?? 0);
    setNivelEspectador(credenciales.nivel ?? 1);
    setXpEspectador(credenciales.puntos ?? 0);
    setXpMaxEspectador(100);
  };

  const manejarCerrarSesion = () => {
    localStorage.removeItem('user');
    setUsuario(null);
  };

  // Manejadores de control de transmisión
  const manejarIniciarTransmision = () => {
    setEstaEnVivo(true);
    setInicioTransmision(Date.now());
  };

  const manejarDetenerTransmision = () => {
    if (estaEnVivo && inicioTransmision) {
      const milisegundosTranscurridos = Date.now() - inicioTransmision;
      const horasTranscurridas = milisegundosTranscurridos / (1000 * 60 * 60);
      setHorasTransmitidas((h) => h + horasTranscurridas);
    }
    setEstaEnVivo(false);
    setInicioTransmision(null);
  };

  const manejarRegalo = (puntos) => {
    setTotalRegalos((g) => g + 1);
    setPuntosRecibidos((p) => p + (puntos || 0));
  };

  // Manejadores de monedas del espectador
  const manejarRecarga = (cantidad) => {
    const valor = Number(cantidad) || 0;
    setMonedas((c) => {
      const nuevasMonedas = c + valor;
      // Persistir en localStorage
      const datosUsuario = JSON.parse(localStorage.getItem('user'));
      if (datosUsuario) {
        datosUsuario.monedas = nuevasMonedas;
        localStorage.setItem('user', JSON.stringify(datosUsuario));
      }
      return nuevasMonedas;
    });
  };
  const manejarGastar = (cantidad) => {
    const valor = Number(cantidad) || 0;
    setMonedas((c) => {
      const nuevasMonedas = Math.max(0, c - valor);
      // Persistir en localStorage
      const datosUsuario = JSON.parse(localStorage.getItem('user'));
      if (datosUsuario) {
        datosUsuario.monedas = nuevasMonedas;
        localStorage.setItem('user', JSON.stringify(datosUsuario));
      }
      return nuevasMonedas;
    });
  };

  // Manejadores de XP/nivel del espectador
  const manejarSubirNivel = () => {
    setNivelEspectador((l) => l + 1);
    setXpEspectador(0);
    setXpMaxEspectador((m) => Math.floor(m * 1.5)); // aumentar requisito en 50%
  };
  const manejarAgregarXp = (cantidad) => {
    setXpEspectador((x) => Math.min(x + cantidad, xpMaxEspectador));
  };

  if (estaCargando) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            !usuario ? (
              <Login onLogin={manejarLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          } />
          <Route path="/registro" element={<Registro />} />
          
          <Route path="/dashboard" element={
            usuario ? (
              usuario.rol === 'streamer' ? (
                <StreamerDashboard
                  onLogout={manejarCerrarSesion}
                  user={usuario}
                  isLive={estaEnVivo}
                  streamStart={inicioTransmision}
                  horasTransmitidas={horasTransmitidas}
                  totalGifts={totalRegalos}
                  receivedPoints={puntosRecibidos}
                  onStartStream={manejarIniciarTransmision}
                  onStopStream={manejarDetenerTransmision}
                />
              ) : (
                <SpectatorDashboard 
                  onLogout={manejarCerrarSesion} 
                  user={usuario}
                  coins={monedas}
                  level={nivelEspectador}
                  xp={xpEspectador}
                  maxXp={xpMaxEspectador}
                />
              )
            ) : (
              <Navigate to="/" />
            )
          } />

          <Route path="/nosotros" element={<About />} />
          <Route path="/tyc" element={<Terms />} />
          <Route path="/tienda-regalos" element={
            usuario && usuario.rol === 'espectador' ? (
              <GiftShop onLogout={manejarCerrarSesion} coins={monedas} onSpend={manejarGastar} />
            ) : (
              <Navigate to="/" />
            )
          } />
          <Route path="/recarga" element={
            usuario && usuario.rol === 'espectador' ? (
              <Recarga onRecharge={manejarRecarga} />
            ) : (
              <Navigate to="/" />
            )
          } />
          <Route path="/perfil" element={
            usuario && usuario.rol === 'espectador' ? (
              <PerfilEspectador 
                coins={monedas}
                level={nivelEspectador}
                xp={xpEspectador}
                maxXp={xpMaxEspectador}
                onLogout={manejarCerrarSesion}
                onLevelUp={manejarSubirNivel}
                onAddXp={manejarAgregarXp}
              />
            ) : (
              <Navigate to="/" />
            )
          } />
          <Route path="/stream-preview" element={
            usuario && usuario.rol === 'streamer' ? (
              <StreamPreview onEndStream={manejarDetenerTransmision} onGift={manejarRegalo} />
            ) : (
              <Navigate to="/" />
            )
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
