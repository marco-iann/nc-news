exports.handleInvalidRoute = (req, res) => {
  res.status(404).send({ msg: 'invalid route' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'method not allowed' });
};

exports.handle400 = (err, req, res, next) => {
  // console.log(err);
  const codes = {
    400: 'bad request',
    '42703': 'invalid query',
    '22P02': 'invalid article id'
  };
  if (codes[err.code])
    res.status(400).send({ msg: err.msg || codes[err.code] });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  const codes = { 404: 'not found' };
  if (codes[err.code])
    res.status(404).send({ msg: err.msg || codes[err.code] });
  else next(err);
};
