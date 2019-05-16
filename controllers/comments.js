const {
  selectCommentById,
  updateCommentById,
  removeCommentById
} = require('../models/comments');

exports.getCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  selectCommentById(comment_id)
    .then(comment => {
      if (!comment)
        return Promise.reject({ code: 404, msg: 'comment not found' });
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes) next({ code: 400, msg: 'increment votes has not been sent' });
  if (typeof inc_votes !== 'number')
    next({ code: 400, msg: 'invalid votes increment' });
  selectCommentById();
  updateCommentById(comment_id, inc_votes)
    .then(comment => {
      if (!comment)
        return Promise.reject({ code: 404, msg: 'comment not found' });
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(deleted => {
      if (deleted.length === 0)
        return Promise.reject({ code: 404, msg: 'comment not found' });
      res.status(204).send();
    })
    .catch(next);
};
