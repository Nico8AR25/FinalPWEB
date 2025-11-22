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
			nivel: 1,
			puntos: 0,
		});

		// Normalizar la respuesta para el frontend y ocultar password
		const resp = {
			id: nuevoUsuario.id,
			nombre: nuevoUsuario.nombre,
			email: nuevoUsuario.correo,
			tipoUsuario: nuevoUsuario.tipoUsuario,
			rol: nuevoUsuario.tipoUsuario,
			monedas: nuevoUsuario.saldo || 0,
			nivel: nuevoUsuario.nivel ?? 1,
			puntos: nuevoUsuario.puntos ?? 0,
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

// Actualizar nivel (set)
ruta.put('/nivel', async (req, res) => {
	const { userId, nivel } = req.body;
	if (typeof nivel !== 'number') return res.status(400).json({ error: 'nivel debe ser número' });
	const usuario = await db.user.findByPk(userId);
	if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
	usuario.nivel = nivel;
	await usuario.save();
	res.json({ id: usuario.id, nivel: usuario.nivel, puntos: usuario.puntos, saldo: usuario.saldo });
});

// Establecer puntos (set absolute)
ruta.put('/puntos', async (req, res) => {
	const { userId, puntos } = req.body;
	if (typeof puntos !== 'number') return res.status(400).json({ error: 'puntos debe ser número' });
	const usuario = await db.user.findByPk(userId);
	if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
	usuario.puntos = puntos;
	await usuario.save();
	res.json({ id: usuario.id, nivel: usuario.nivel, puntos: usuario.puntos, saldo: usuario.saldo });
});

// Sumar/añadir puntos (delta)
ruta.put('/puntos/add', async (req, res) => {
	const { userId, delta } = req.body;
	const d = Number(delta) || 0;
	const usuario = await db.user.findByPk(userId);
	if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
	usuario.puntos = (usuario.puntos || 0) + d;
	await usuario.save();
	res.json({ id: usuario.id, nivel: usuario.nivel, puntos: usuario.puntos, saldo: usuario.saldo });
});

// Listar regalos comprados por usuario
ruta.get('/:id/regalos', async (req, res) => {
	try {
		const regalos = await db.regalo_comprado.findAll({
			where: { userId: req.params.id },
			order: [['createdAt', 'DESC']]
		});
		res.json(regalos);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Registrar compra de regalo: transaccional (descontar saldo, sumar puntos, crear registro)
ruta.post('/:id/regalos', async (req, res) => {
	const userId = req.params.id;
	const { giftId, nombre, costo, puntos } = req.body;
	if (!costo || isNaN(Number(costo))) return res.status(400).json({ error: 'Costo inválido' });
	try {
		const resultado = await db.sequelize.transaction(async (t) => {
			const usuario = await db.user.findByPk(userId, { transaction: t, lock: t.LOCK.UPDATE });
			if (!usuario) {
				const e = new Error('Usuario no encontrado');
				e.status = 404;
				throw e;
			}
			const saldoActual = usuario.saldo || 0;
			if (saldoActual < Number(costo)) {
				const e = new Error('Saldo insuficiente');
				e.status = 400;
				throw e;
			}
			usuario.saldo = saldoActual - Number(costo);
			usuario.puntos = (usuario.puntos || 0) + (Number(puntos) || 0);
			await usuario.save({ transaction: t });

			const compra = await db.regalo_comprado.create({
				userId: usuario.id,
				giftId: giftId || null,
				nombre: nombre || null,
				costo: Number(costo),
				puntos: Number(puntos) || 0
			}, { transaction: t });

			return { usuario, compra };
		});

		res.json({ usuario: resultado.usuario, compra: resultado.compra });
	} catch (error) {
		if (error.status) return res.status(error.status).json({ error: error.message });
		res.status(500).json({ error: error.message });
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
