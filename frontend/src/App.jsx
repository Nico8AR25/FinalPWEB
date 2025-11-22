import { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
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
	const [estaEnVivo, setEstaEnVivo] = useState(false);
	const [inicioTransmision, setInicioTransmision] = useState(null);
	const [horasTransmitidas, setHorasTransmitidas] = useState(0);
	const [totalRegalos, setTotalRegalos] = useState(0);
	const [puntosRecibidos, setPuntosRecibidos] = useState(0);
	const [monedas, setMonedas] = useState(null);
	const [nivelEspectador, setNivelEspectador] = useState(null);
	const [xpEspectador, setXpEspectador] = useState(null);
	const [xpMaxEspectador, setXpMaxEspectador] = useState(null);

	useEffect(() => {
		const usuarioLogueado = localStorage.getItem('user');
		if (usuarioLogueado) {
			const raw = JSON.parse(usuarioLogueado);
			const datosUsuario = {
				...raw,
				rol: raw.rol || raw.tipoUsuario || raw.userRole || raw.role,
				email: raw.email || raw.correo,
				monedas: raw.monedas ?? raw.saldo ?? 0,
				nivel: raw.nivel ?? 1,
				puntos: raw.puntos ?? 0,
			};
			setUsuario(datosUsuario);
			setMonedas(datosUsuario.monedas ?? 0);
			setNivelEspectador(datosUsuario.nivel ?? 1);
			setXpEspectador(datosUsuario.puntos ?? 0);
			setXpMaxEspectador(100);
		}
		setEstaCargando(false);
	}, []);

	const manejarLogin = credenciales => {
		setUsuario(credenciales);
		setMonedas(credenciales.monedas ?? 0);
		setNivelEspectador(credenciales.nivel ?? 1);
		setXpEspectador(credenciales.puntos ?? 0);
		setXpMaxEspectador(100);
	};

	const manejarCerrarSesion = () => {
		// Limpiar usuario en localStorage y estado para cerrar sesión limpia
		try {
			localStorage.removeItem('user');
		} catch {}
		setUsuario(null);
	};

	const manejarIniciarTransmision = () => {
		setEstaEnVivo(true);
		setInicioTransmision(Date.now());
	};

	const manejarDetenerTransmision = () => {
		if (estaEnVivo && inicioTransmision) {
			const milisegundosTranscurridos = Date.now() - inicioTransmision;
			const horasTranscurridas = milisegundosTranscurridos / (1000 * 60 * 60);
			setHorasTransmitidas(h => h + horasTranscurridas);
		}
		setEstaEnVivo(false);
		setInicioTransmision(null);
	};

	const manejarRegalo = puntos => {
		setTotalRegalos(g => g + 1);
		setPuntosRecibidos(p => p + (puntos || 0));
	};

	const manejarRecarga = async cantidad => {
		const valor = Number(cantidad) || 0;

		// Si tenemos usuario con id, intentamos actualizar en el backend primero
		if (usuario && usuario.id) {
			try {
				const res = await fetch('http://localhost:3080/users/recarga', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: usuario.id, monto: valor })
				});

				if (res.ok) {
					const updatedUser = await res.json();
					const nuevasMonedas = updatedUser.saldo ?? updatedUser.monedas ?? (monedas + valor);

					// actualizar estado y localStorage con la respuesta del servidor
					setMonedas(nuevasMonedas);
					const datosUsuario = JSON.parse(localStorage.getItem('user')) || {};
					const merged = { ...datosUsuario, ...updatedUser };
					merged.monedas = nuevasMonedas;
					try {
						localStorage.setItem('user', JSON.stringify(merged));
					} catch {}
					return;
				}
				// si el servidor respondió con error, caemos al fallback
			} catch (err) {
				// fallo de conexión: seguimos con el fallback (sincronizar localmente)
			}
		}

		// Fallback: actualizar solo en localStorage/estado (modo offline/demo)
		setMonedas(c => {
			const nuevasMonedas = c + valor;
			const datosUsuario = JSON.parse(localStorage.getItem('user'));
			if (datosUsuario) {
				datosUsuario.monedas = nuevasMonedas;
				try {
					localStorage.setItem('user', JSON.stringify(datosUsuario));
				} catch {}
			}
			return nuevasMonedas;
		});
	};
	const manejarGastar = cantidad => {
		const valor = Number(cantidad) || 0;
		setMonedas(c => {
			const nuevasMonedas = Math.max(0, c - valor);
			const datosUsuario = JSON.parse(localStorage.getItem('user'));
			if (datosUsuario) {
				datosUsuario.monedas = nuevasMonedas;
				localStorage.setItem('user', JSON.stringify(datosUsuario));
			}
			return nuevasMonedas;
		});
	};

	const manejarSubirNivel = () => {
		setNivelEspectador(l => {
			const nuevo = l + 1;
			// Persistir en backend si hay usuario
			if (usuario && usuario.id) {
				fetch('http://localhost:3080/users/nivel', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: usuario.id, nivel: nuevo })
				}).catch(() => {});
			}
			// actualizar localStorage también se hace por el efecto
			return nuevo;
		});
		setXpEspectador(0);
		setXpMaxEspectador(m => Math.floor(m * 1.5));
	};
	const manejarAgregarXp = cantidad => {
		// Actualizamos estado localmente
		setXpEspectador(x => {
			const nuevo = Math.min(x + cantidad, xpMaxEspectador);
			return nuevo;
		});
		// Persistir suma de puntos en backend si hay usuario
		if (usuario && usuario.id) {
			fetch('http://localhost:3080/users/puntos/add', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: usuario.id, delta: Number(cantidad) || 0 })
			}).catch(() => {});
		}
	};

	// Persistir cambios de nivel/XP en localStorage para mantener consistencia
	useEffect(() => {
		try {
			const datosUsuario = JSON.parse(localStorage.getItem('user')) || {};
			if (datosUsuario) {
				datosUsuario.monedas = monedas ?? datosUsuario.monedas;
				datosUsuario.nivel = nivelEspectador ?? datosUsuario.nivel;
				datosUsuario.puntos = xpEspectador ?? datosUsuario.puntos;
				localStorage.setItem('user', JSON.stringify(datosUsuario));
			}
		} catch {
			// no bloqueante
		}
	}, [monedas, nivelEspectador, xpEspectador]);

	if (estaCargando) {
		return <div>Cargando...</div>;
	}

	return (
		<Router>
			<div className="app">
				<Routes>
					<Route
						path="/"
						element={
							!usuario ? (
								<Login onLogin={manejarLogin} />
							) : (
								<Navigate to="/dashboard" />
							)
						}
					/>
					<Route path="/registro" element={<Registro />} />

					<Route
						path="/dashboard"
						element={
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
						}
					/>

					<Route path="/nosotros" element={<About />} />
					<Route path="/tyc" element={<Terms />} />
					<Route
						path="/tienda-regalos"
						element={
							usuario && usuario.rol === 'espectador' ? (
								<GiftShop
									onLogout={manejarCerrarSesion}
									coins={monedas}
									onSpend={manejarGastar}
									xp={xpEspectador}
									onEarnPoints={manejarAgregarXp}
									user={usuario}
								/>
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						path="/recarga"
						element={
							usuario && usuario.rol === 'espectador' ? (
								<Recarga onRecharge={manejarRecarga} />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						path="/perfil"
						element={
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
						}
					/>
					<Route
						path="/stream-preview"
						element={
							usuario && usuario.rol === 'streamer' ? (
								<StreamPreview
									onEndStream={manejarDetenerTransmision}
									onGift={manejarRegalo}
								/>
							) : (
								<Navigate to="/" />
							)
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
