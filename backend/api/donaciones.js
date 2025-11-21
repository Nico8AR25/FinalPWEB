const express = require('express');
const db = require('../db/models');
const ruta = express.Router();

ruta.post('/', async (req, res) => {
  const { userId, streamerId, streamId, monto } = req.body;
  
  const nuevaDonacion = await db.donacion.create({
    userId,
    streamerId,
    streamId,
    monto
  });
  
  res.json(nuevaDonacion);
});

ruta.get('/streamer/:id', async (req, res) => {
  const donaciones = await db.donacion.findAll({
    where: {
      streamerId: req.params.id
    }
  });
  
  res.json(donaciones);
});

ruta.get('/stream/:id', async (req, res) => {
  const donaciones = await db.donacion.findAll({
    where: {
      streamId: req.params.id
    }
  });
  
  res.json(donaciones);
});

module.exports = ruta;

