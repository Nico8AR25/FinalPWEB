import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = e => {
		e.preventDefault();
		const correo = username.trim().toLowerCase();
		const pass = password.trim();

		setError('');

		fetch('http://localhost:3080/users/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ correo, password: pass }),
		})
			.then(async res => {
				const body = await res.json().catch(() => ({}));
				if (!res.ok) {
					const msg =
						body && body.error ? body.error : 'Credenciales incorrectas';
					setError(msg);
					return;
				}
				// Login exitoso: `body` contiene el usuario del backend.
				// Normalizamos la respuesta para que el frontend tenga `rol`, `email`, `monedas`, `nivel`, `puntos`.
				const frontendUser = {
					...body,
					rol: body.tipoUsuario || body.rol,
					email: body.correo || body.email,
					monedas: body.saldo ?? body.monedas ?? 0,
					nivel: body.nivel ?? 1,
					puntos: body.puntos ?? 0,
				};

				// Fusionar con valores locales si existen (priorizar datos guardados en localStorage)
				const ls = localStorage.getItem('user');
				if (ls) {
					try {
						const local = JSON.parse(ls);
						if (local.monedas != null) frontendUser.monedas = local.monedas;
						if (local.nivel != null) frontendUser.nivel = local.nivel;
						if (local.puntos != null) frontendUser.puntos = local.puntos;
						// conservar nombre/email del backend si vienen, si no usar lo local
						frontendUser.nombre =
							frontendUser.nombre || local.nombre || local.username;
						frontendUser.email =
							frontendUser.email || local.email || local.correo;
					} catch {
						// ignore parse errors
					}
				}

				try {
					localStorage.setItem('user', JSON.stringify(frontendUser));
				} catch {
					// no bloqueante
				}
				onLogin?.(frontendUser);
				navigate('/dashboard');
			})
			.catch(() => {
				setError('No se pudo conectar con el servidor');
			});
	};

	return (
		<div className="login-center">
			<div className="contenedor">
				<div className="marca-universidad">
					<img src="/logo.png" alt="StreamBoost" className="imagen-logo" />
					<h1 className="titulo-universidad">STREAMBOOST</h1>
				</div>

				<form
					id="loginForm"
					className="formulario-login"
					onSubmit={handleSubmit}
				>
					<div className="grupo-formulario">
						<label htmlFor="email">Usuario</label>
						<input
							type="text"
							id="email"
							placeholder="streamer o espectador"
							value={username}
							onChange={e => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="grupo-formulario">
						<label htmlFor="password">Contraseña</label>
						<input
							type="password"
							id="password"
							placeholder="********"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="boton-login">
						Iniciar sesión
					</button>
					{error && <div className="login-error">{error}</div>}
					<div className="login-link-container">
						<Link to="/registro" className="login-link">
							¿No estás registrado?
						</Link>
					</div>
				</form>

				<nav className="navegacion-principal">
					<ul className="enlaces-navegacion">
						<li>
							<Link to="/nosotros">Nosotros</Link>
						</li>
						<li>
							<Link to="/tyc">Términos y Condiciones</Link>
						</li>
					</ul>
				</nav>

				<footer className="pie-pagina">
					<p>© 2025 StreamBoost Inc. Todos los derechos reservados.</p>
				</footer>
			</div>
		</div>
	);
};

export default Login;
