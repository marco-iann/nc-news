const express = require('express');
const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ msg: 'Invalid route' });
});

module.exports = app;
