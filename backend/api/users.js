const express = require('express');
const db = require('../db/models');
const ruta = express.Router();

ruta.post('/registro', async (req, res) => {
	try {
		const { nombre, correo, password, tipoUsuario, saldo } = req.body;

		const nuevoUsuario = await db.user.create({
			nombre,
			correo,
			password,
			tipoUsuario,
			saldo: saldo || 0,
		});

		res.json(nuevoUsuario);
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
		res.json(usuario);
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
