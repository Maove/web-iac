
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola desde EC2!');
});

app.listen(3000, () => {
  console.log('App ejecutándose en el puerto 3000');
});
