exports.handle400 = (err, req, res, next) => {
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
