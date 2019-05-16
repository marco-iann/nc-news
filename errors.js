exports.handle400 = (err, req, res, next) => {
  const codes = { '42703': 'invalid query', '22P02': 'invalid article id' };
  // console.log(err);
  if (codes[err.code]) res.status(400).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {};
