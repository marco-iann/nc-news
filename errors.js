exports.errors = (err, req, res, next) => {
  const errorCodes = { '42703': 'invalid query' };
  // console.log(err);
  res.status(400).send({ msg: errorCodes[err.code] });
};
