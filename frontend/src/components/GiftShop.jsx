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

export default function GiftShop({
	onLogout,
	coins = 0,
	onSpend,
	xp = 0,
	onEarnPoints,
	user,
}) {
	const [monedas, setMonedas] = useState(coins);
	const [puntos, setPuntos] = useState(xp ?? 0);
	const [purchasedGifts, setPurchasedGifts] = useState([]);
	const [notificacion, setNotificacion] = useState({
		show: false,
		title: '',
		message: '',
	});

	// Mantener sincronizado con props que vienen de App
	React.useEffect(() => {
		setMonedas(coins ?? 0);
	}, [coins]);

	React.useEffect(() => {
		setPuntos(xp ?? 0);
	}, [xp]);

	// Cargar regalos comprados desde servidor (fallback a localStorage)
	React.useEffect(() => {
		async function cargar() {
			if (user && user.id) {
				try {
					const res = await fetch(`http://localhost:3080/users/${user.id}/regalos`);
					if (res.ok) {
						const data = await res.json();
						setPurchasedGifts(data || []);
						return;
					}
				} catch (err) {
					// ignore and fallback
				}
				// fallback localStorage
				try {
					const key = `regalos_comprados_${user.id}`;
					const stored = JSON.parse(localStorage.getItem(key) || '[]');
					setPurchasedGifts(Array.isArray(stored) ? stored : []);
				} catch {
					setPurchasedGifts([]);
				}
			}
		}
		cargar();
	}, [user]);

	const comprarRegalo = regalo => {
		if (monedas < regalo.cost) {
			mostrarNotificacion(
				'Monedas Insuficientes',
				`Necesitas ${regalo.cost - monedas} monedas más`
			);
			return;
		}

		// Intentar actualizar en backend (restar saldo)
		const intentarCompraEnServidor = async () => {
			if (user && user.id) {
				try {
					// Llamamos al endpoint de compras: POST /users/:id/regalos
					const res = await fetch(`http://localhost:3080/users/${user.id}/regalos`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ giftId: regalo.id, nombre: regalo.name, costo: regalo.cost, puntos: regalo.points }),
					});

					if (res.ok) {
						// server devuelve usuario actualizado (usuario) y compra
						const body = await res.json();
						const updatedUser = body.usuario || body;
						const purchase = body.compra || null;
						const nuevasMonedas = updatedUser.saldo ?? updatedUser.monedas ?? monedas - regalo.cost;
						// actualizar estado en App via callback
						onSpend?.(regalo.cost);
						onEarnPoints?.(regalo.points);
						setMonedas(nuevasMonedas);
						setPuntos(p => p + regalo.points);
						// sincronizar localStorage y lista local de compras
						try {
							const datosUsuario = JSON.parse(localStorage.getItem('user')) || {};
							const merged = { ...datosUsuario, ...updatedUser };
							merged.monedas = nuevasMonedas;
							localStorage.setItem('user', JSON.stringify(merged));
						} catch {}
						if (purchase) {
							// añadir a la lista local y a localStorage
							setPurchasedGifts(prev => [purchase, ...prev]);
							try {
								const key = `regalos_comprados_${user.id}`;
								const stored = JSON.parse(localStorage.getItem(key) || '[]');
								localStorage.setItem(key, JSON.stringify([purchase, ...(Array.isArray(stored)?stored:[])]));
							} catch {}
						}
						mostrarNotificacion(
							'¡Regalo Comprado!',
							`Has comprado ${regalo.name} y ganado ${regalo.points} puntos`
						);
						return true;
					}
				} catch (err) {
					// fallo conectividad - fallback
				}
			}
			return false;
		};

		intentarCompraEnServidor().then(success => {
			if (!success) {
				// Fallback offline: actualizar localmente
				const nuevasMonedas = monedas - regalo.cost;
				setMonedas(nuevasMonedas);
				onSpend?.(regalo.cost);
				onEarnPoints?.(regalo.points);
				setPuntos(p => p + regalo.points);
				// actualizar localStorage
				try {
					const datosUsuario = JSON.parse(localStorage.getItem('user')) || {};
					datosUsuario.monedas = nuevasMonedas;
					localStorage.setItem('user', JSON.stringify(datosUsuario));
				} catch {}
				// registrar compra localmente
				try {
					if (user && user.id) {
						const key = `regalos_comprados_${user.id}`;
						const compra = {
							id: Date.now(),
							giftId: regalo.id,
							nombre: regalo.name,
							costo: regalo.cost,
							puntos: regalo.points,
							createdAt: new Date().toISOString()
						};
						const existing = JSON.parse(localStorage.getItem(key) || '[]');
						localStorage.setItem(key, JSON.stringify([compra, ...(Array.isArray(existing)?existing:[])]));
						setPurchasedGifts(prev => [compra, ...prev]);
					}
				} catch (err) {}
				mostrarNotificacion(
					'¡Regalo Comprado (offline)!',
					`Se registró localmente: ${regalo.name} y +${regalo.points} puntos`
				);
			}
		});
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
					<span className="monedas">
						Monedas: <span id="monedas">{monedas}</span>
					</span>
					<span className="points">
						Puntos: <span id="user-points">{puntos}</span>
					</span>
					<Link to="/dashboard" className="perfil-button">
						Perfil
					</Link>
					<button className="logout-button" onClick={onLogout}>
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

					<div className="purchased-gifts-section">
						<h3>Mis Regalos Comprados</h3>
						{purchasedGifts && purchasedGifts.length > 0 ? (
							<div className="gifts-grid" id="purchased-gifts-list">
								{purchasedGifts.map(p => (
									<div key={p.id} className="gift-item">
										<div className="gift-emoji">{(p.nombre || '').split(' ')[0]}</div>
										<h4 className="gift-name">{(p.nombre || '').substring((p.nombre || '').indexOf(' ') + 1)}</h4>
										<p className="gift-cost">💰 {p.costo} monedas</p>
										<p className="gift-points">⭐ +{p.puntos} puntos</p>
										<p className="gift-date">{new Date(p.createdAt).toLocaleString()}</p>
									</div>
								))}
							</div>
						) : (
							<div className="purchased-gifts-empty">No has comprado ningún regalo aún</div>
						)}
					</div>

				<div className="back-section">
					<Link to="/dashboard" className="btn-back">
						← Regresar al Perfil
					</Link>
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
