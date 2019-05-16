const express = require('express');
const apiRouter = require('./routes/api');
const { handle400, handle404 } = require('./errors');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ msg: 'invalid route' });
});

app.use(handle400);
app.use(handle404);

module.exports = app;
