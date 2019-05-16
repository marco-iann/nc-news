const express = require('express');
const apiRouter = require('./routes/api');
const { errors } = require('./errors');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ msg: 'invalid route' });
});

app.use(errors);

module.exports = app;
