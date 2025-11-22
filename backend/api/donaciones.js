const express = require('express');
const db = require('../db/models');
const ruta = express.Router();
/**
 * POST /donaciones
 * Crea una nueva donación.
 * Espera en el body: { userId, streamerId, streamId, monto }
 * - Valida que exista el usuario (donador)
 * - Valida que tenga saldo suficiente (si se usa saldo)
 * - Crea el registro de donación
 * - (Opcional) Podrías actualizar saldo del streamer
 */
ruta.post('/', async (req, res) => {
  try {
    const { userId, streamerId, streamId, monto } = req.body;

    if (!userId || !monto) {
      return res
        .status(400)
        .json({ error: 'userId y monto son obligatorios' });
    }

    const usuario = await db.user.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario donador no encontrado' });
    }

    // Si quieres controlar saldo en backend:
    if ((usuario.saldo || 0) < monto) {
      return res
        .status(400)
        .json({ error: 'Saldo insuficiente para realizar la donación' });
    }

    // Descontar saldo del usuario
    usuario.saldo = (usuario.saldo || 0) - monto;
    await usuario.save();

    // (Opcional) Si existe streamerId, podrías sumar al streamer
    if (streamerId) {
      const streamer = await db.user.findByPk(streamerId);
      if (streamer) {
        streamer.saldo = (streamer.saldo || 0) + monto;
        await streamer.save();
      }
    }

    const nuevaDonacion = await db.donacion.create({
      userId,
      streamerId: streamerId || null,
      streamId: streamId || null,
      monto,
    });

    res.json(nuevaDonacion);
  } catch (error) {
    console.error('Error al crear donación:', error);
    res.status(500).json({ error: 'Error al crear la donación' });
  }
});

/**
 * GET /donaciones
 * Lista todas las donaciones
 */
ruta.get('/', async (req, res) => {
  try {
    const donaciones = await db.donacion.findAll({
      include: [
        { model: db.user, as: 'donador' },
        { model: db.user, as: 'streamer' },
        { model: db.stream, as: 'stream' },
      ],
    });
    res.json(donaciones);
  } catch (error) {
    console.error('Error al obtener donaciones:', error);
    res.status(500).json({ error: 'Error al obtener donaciones' });
  }
});

/**
 * GET /donaciones/usuario/:id
 * Lista las donaciones hechas por un usuario
 */
ruta.get('/usuario/:id', async (req, res) => {
  try {
    const donaciones = await db.donacion.findAll({
      where: {
        userId: req.params.id,
      },
      include: [
        { model: db.user, as: 'streamer' },
        { model: db.stream, as: 'stream' },
      ],
    });
    res.json(donaciones);
  } catch (error) {
    console.error('Error al obtener donaciones por usuario:', error);
    res.status(500).json({ error: 'Error al obtener donaciones del usuario' });
  }
});

/**
 * GET /donaciones/stream/:id
 * Lista donaciones de un stream específico
 */
ruta.get('/stream/:id', async (req, res) => {
  try {
    const donaciones = await db.donacion.findAll({
      where: {
        streamId: req.params.id,
      },
      include: [
        { model: db.user, as: 'donador' },
        { model: db.user, as: 'streamer' },
      ],
    });

    res.json(donaciones);
  } catch (error) {
    console.error('Error al obtener donaciones del stream:', error);
    res.status(500).json({ error: 'Error al obtener donaciones del stream' });
  }
});

module.exports = ruta;

