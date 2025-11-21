const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3080;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Backend funcionando");
});

const usersRoutes = require('./api/users');
const streamsRoutes = require('./api/streams');
const donacionesRoutes = require('./api/donaciones');

app.use('/users', usersRoutes);
app.use('/streams', streamsRoutes);
app.use('/donaciones', donacionesRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

