import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../registro.css';

const initialForm = {
	nombre: '',
	email: '',
	password: '',
	rol: '',
};

function getUsers() {
	const users = localStorage.getItem('usuariosRegistrados');
	return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
	localStorage.setItem('usuariosRegistrados', JSON.stringify(users));
}

export default function Registro() {
	const [form, setForm] = useState(initialForm);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();

	function handleChange(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
		setError('');
		setSuccess('');
	}

	function handleSubmit(e) {
		e.preventDefault();
		const { nombre, email, password, rol } = form;
		if (!nombre || !email || !password || !rol) {
			setError('Completa todos los campos.');
			return;
		}
		// Intentamos registrar en el backend. Si falla, mostramos error.
		const payload = {
			nombre: nombre.trim(),
			correo: email.trim().toLowerCase(),
			password,
			tipoUsuario: rol,
			saldo: 0,
		};

		setError('');
		setSuccess('');

		fetch('http://localhost:3080/users/registro', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
			.then(async res => {
				const data = await res.json();
				if (!res.ok) {
					const msg = data && data.error ? data.error : res.statusText;
					throw new Error(msg || 'Error al registrar');
				}
				// Registro exitoso en la base de datos
				setSuccess('✅ Registro exitoso. ¡Ya puedes iniciar sesión!');
				setForm(initialForm);
				// Guardamos una copia ligera en localStorage (opcional)
				try {
					const users = getUsers();
					users.push({
						nombre: data.nombre,
						email: data.email || data.correo,
						rol: data.rol || data.tipoUsuario,
						monedas: data.monedas ?? 0,
						nivel: data.nivel ?? 1,
						puntos: data.puntos ?? 0,
					});
					saveUsers(users);
				} catch {
					// no bloqueante
				}
				setTimeout(() => {
					navigate('/');
				}, 1200);
			})
			.catch(err => {
				setError(err.message || 'No se pudo conectar con el servidor');
			});
	}

	return (
		<div className="registro-page">
			<header className="registro-header">
				<h1>StreamBoost</h1>
			</header>
			<div className="registro-main">
				<section className="form-section registro-form-section">
					<h2>Crear cuenta</h2>
					<form id="registerForm" onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="nombre">Nombre completo:</label>
							<input
								type="text"
								id="nombre"
								name="nombre"
								placeholder="Tu nombre"
								value={form.nombre}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email">Correo electrónico:</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="usuario@correo.com"
								value={form.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Contraseña:</label>
							<input
								type="password"
								id="password"
								name="password"
								placeholder="********"
								value={form.password}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="rol">Selecciona tu rol:</label>
							<select
								id="rol"
								name="rol"
								value={form.rol}
								onChange={handleChange}
								required
							>
								<option value="">-- Seleccionar --</option>
								<option value="streamer">Streamer</option>
								<option value="espectador">Espectador</option>
							</select>
						</div>
						<button type="submit">Registrarme</button>
					</form>
					{error && <div className="registro-error">{error}</div>}
					{success && <div className="registro-success">{success}</div>}
					<div className="registro-boton-secundario">
						<button type="button" onClick={() => navigate('/')}>
							¿Ya tienes cuenta? Inicia sesión
						</button>
					</div>
					<div className="registro-boton-volver">
						<button type="button" onClick={() => navigate('/')}>
							← Regresar
						</button>
					</div>
				</section>
			</div>
			<footer className="registro-footer">
				© 2025 StreamBoost Inc. Todos los derechos reservados.
			</footer>
		</div>
	);
}
