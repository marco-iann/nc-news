const endpointsList = require('../apiEndpoints.json');

exports.getEndpointsList = (req, res, next) => {
  res.status(200).send(endpointsList);
};
