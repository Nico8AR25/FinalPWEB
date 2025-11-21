const express = require('express');
const db = require('../db/models');
const ruta = express.Router();

ruta.post('/', async (req, res) => {
  const { titulo, descripcion, streamerId } = req.body;
  
  const nuevoStream = await db.stream.create({
    titulo,
    descripcion,
    streamerId
  });
  
  res.json(nuevoStream);
});

ruta.get('/', async (req, res) => {
  const streams = await db.stream.findAll({
    include: [{
      model: db.user,
      as: 'streamer'
    }]
  });
  
  res.json(streams);
});

ruta.get('/:id', async (req, res) => {
  const stream = await db.stream.findByPk(req.params.id, {
    include: [
      {
        model: db.user,
        as: 'streamer'
      },
      {
        model: db.donacion,
        as: 'donaciones'
      }
    ]
  });
  
  if (stream) {
    res.json(stream);
  } else {
    res.status(404).json({ error: 'Stream no encontrado' });
  }
});

module.exports = ruta;

