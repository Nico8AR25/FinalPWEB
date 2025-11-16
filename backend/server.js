const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3080;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Backend funcionando");
});

app.listen(port, () => {
  console.log(`Server escuchando en el puerto ${port}`);
});

