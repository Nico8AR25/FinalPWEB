const express = require('express');
const db = require('../db/models');
const ruta = express.Router();

/**
 * POST /streams
 * Crea un nuevo stream
 * Body: { titulo, descripcion, streamerId }
 */
ruta.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, streamerId } = req.body;

    if (!titulo || !streamerId) {
      return res
        .status(400)
        .json({ error: 'titulo y streamerId son obligatorios' });
    }

    const streamer = await db.user.findByPk(streamerId);
    if (!streamer) {
      return res.status(404).json({ error: 'Streamer no encontrado' });
    }

    const nuevoStream = await db.stream.create({
      titulo,
      descripcion: descripcion || '',
      streamerId,
    });

    res.status(201).json(nuevoStream);
  } catch (error) {
    console.error('Error al crear stream:', error);
    res.status(500).json({ error: 'Error al crear stream' });
  }
});

/**
 * GET /streams
 * Lista todos los streams
 */
ruta.get('/', async (req, res) => {
  try {
    const streams = await db.stream.findAll({
      include: [
        {
          model: db.user,
          as: 'streamer',
          attributes: ['id', 'nombre', 'correo'],
        },
      ],
    });

    res.json(streams);
  } catch (error) {
    console.error('Error al listar streams:', error);
    res.status(500).json({ error: 'Error al listar streams' });
  }
});

/**
 * GET /streams/:id
 * Obtiene un stream por id, incluyendo donaciones
 */
ruta.get('/:id', async (req, res) => {
  try {
    const stream = await db.stream.findByPk(req.params.id, {
      include: [
        {
          model: db.user,
          as: 'streamer',
          attributes: ['id', 'nombre', 'correo'],
        },
        {
          model: db.donacion,
          as: 'donaciones',
          include: [
            { model: db.user, as: 'donador', attributes: ['id', 'nombre'] },
            { model: db.user, as: 'streamer', attributes: ['id', 'nombre'] },
          ],
        },
      ],
    });

    if (stream) {
      res.json(stream);
    } else {
      res.status(404).json({ error: 'Stream no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener stream:', error);
    res.status(500).json({ error: 'Error al obtener stream' });
  }
});

module.exports = ruta;


