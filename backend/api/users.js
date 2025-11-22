const express = require('express');
const db = require('../db/models');
const ruta = express.Router();

ruta.post('/registro', async (req, res) => {
	try {
		const { nombre, correo, password, tipoUsuario, saldo } = req.body;

		// Evitar crear usuarios con el mismo correo
		const existente = await db.user.findOne({ where: { correo } });
		if (existente) {
			return res.status(400).json({ error: 'Correo ya registrado' });
		}

		const nuevoUsuario = await db.user.create({
			nombre,
			correo,
			password,
			tipoUsuario,
			saldo: saldo || 0,
		});

		// Normalizar la respuesta para el frontend y ocultar password
		const resp = {
			id: nuevoUsuario.id,
			nombre: nuevoUsuario.nombre,
			email: nuevoUsuario.correo,
			tipoUsuario: nuevoUsuario.tipoUsuario,
			rol: nuevoUsuario.tipoUsuario,
			monedas: nuevoUsuario.saldo || 0,
			nivel: 1,
			puntos: 0,
		};

		res.json(resp);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

ruta.post('/login', async (req, res) => {
	const { correo, password } = req.body;

	const usuario = await db.user.findOne({
		where: {
			correo: correo,
			password: password,
		},
	});

	if (usuario) {
		// No devolver password y normalizar fields para el frontend
		const u = {
			id: usuario.id,
			nombre: usuario.nombre,
			email: usuario.correo,
			tipoUsuario: usuario.tipoUsuario,
			rol: usuario.tipoUsuario,
			monedas: usuario.saldo || 0,
			// valores por defecto que el frontend espera
			nivel: usuario.nivel ?? 1,
			puntos: usuario.puntos ?? 0,
		};

		res.json(u);
	} else {
		res.status(404).json({ error: 'Credenciales incorrectas' });
	}
});

ruta.get('/:id', async (req, res) => {
	const usuario = await db.user.findByPk(req.params.id);

	if (usuario) {
		res.json(usuario);
	} else {
		res.status(404).json({ error: 'Usuario no encontrado' });
	}
});

ruta.put('/recarga', async (req, res) => {
	const { userId, monto } = req.body;

	const usuario = await db.user.findByPk(userId);

	if (usuario) {
		usuario.saldo = (usuario.saldo || 0) + monto;
		await usuario.save();
		res.json(usuario);
	} else {
		res.status(404).json({ error: 'Usuario no encontrado' });
	}
});

// Nueva ruta para vaciar la tabla users
ruta.delete('/vaciar', async (req, res) => {
	try {
		// Usamos una consulta directa para truncar, reiniciar IDs y propagar cascada.
		await db.sequelize.query(
			'TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;'
		);
		res.json({ success: true, message: 'Tabla users vaciada' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = ruta;
