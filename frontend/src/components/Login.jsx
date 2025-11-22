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
				// Login exitoso: `body` contiene el usuario
				try {
					localStorage.setItem('user', JSON.stringify(body));
				} catch {
					// no bloqueante
				}
				onLogin?.(body);
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
