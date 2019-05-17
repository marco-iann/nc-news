process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const chaiSorted = require('chai-sorted');

const app = require('../app');
const connection = require('../db/connection');

const { countArticles } = require('../models/articles');

chai.use(chaiSorted);

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  it('Invalid route: status 404 - returns invalid route ', () => {
    return request(app)
      .get('/notavalidroute')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('invalid route');
      });
  });

  describe('/topics', () => {
    it('GET: status 200 - responds with list of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.have.length(3);
          body.topics.forEach(topic => {
            expect(topic).to.have.all.keys('slug', 'description');
          });
        });
    });
    it('DELETE: status 405 - responds with method not allowed', () => {
      return request(app)
        .delete('/api/topics')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('method not allowed');
        });
    });

    describe('/topics/:slug', () => {
      it('GET: status 200 - responds with topic if it exists', () => {
        return request(app)
          .get('/api/topics/mitch')
          .expect(200)
          .then(({ body }) => {
            expect(body.topic.slug).to.equal('mitch');
          });
      });
      it('GET: status 404 - responds with topic not found if non existing topic', () => {
        return request(app)
          .get('/api/topics/non_existing_topic')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('topic not found');
          });
      });
    });
  });

  describe('/articles', () => {
    describe('countArticles()', () => {
      it('counts the number of articles given certain filters', () => {
        countArticles({ author: 'icellusedkars' }).then(count =>
          expect(count).to.equal(6)
        );
      });
    });

    it('GET: status 200 - responds with list of article sorted by date - defaults to descending order and limit 10', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy('created_at', {
            descending: true
          });
          // number of articles is limited by default pagination limit
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].comment_count).to.equal('13');
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
              'author',
              'title',
              'topic',
              'created_at',
              'votes',
              'comment_count',
              'article_id'
            );
          });
        });
    });
    it('GET: can change the number of articles in the response if passed a limit query', () => {
      return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(5);
        });
    });
    it('GET: can sort articles by topic if passed a query - defaults to descending order', () => {
      return request(app)
        .get('/api/articles?sort_by=topic')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy('topic', {
            descending: true
          });
        });
    });
    it('GET: can offset results if passed a page as query', () => {
      return request(app)
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(11);
        });
    });
    it('GET: can sort articles in ascending order if passed a query', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy('created_at', {
            ascending: true
          });
        });
    });
    it('GET: can filter articles by author if passed a query', () => {
      return request(app)
        .get('/api/articles?author=rogersop')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(3);
          body.articles.forEach(article => {
            expect(article.author).to.eql('rogersop');
          });
        });
    });
    it('GET: can filter articles by topic if passed a query', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          // number of articles is limited by default pagination limit
          expect(body.articles).to.have.length(10);
          body.articles.forEach(article => {
            expect(article.topic).to.eql('mitch');
          });
        });
    });
    it('GET: status 400 - responds with invalid query if passed an invalid sort_by column as query', () => {
      return request(app)
        .get('/api/articles?sort_by=abc')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid query');
        });
    });
    it('GET: status 404 - responds with author not found if passed an non existing author as query', () => {
      return request(app)
        .get('/api/articles?author=non_existing_author')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('author not found');
        });
    });
    it('GET: status 404 - responds with topic not found if passed an non existing topic as query', () => {
      return request(app)
        .get('/api/articles?topic=non_existing_topic')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('topic not found');
        });
    });
    it('DELETE: status 405 - responds with method not allowed', () => {
      return request(app)
        .delete('/api/articles')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('method not allowed');
        });
    });

    describe('/articles/:article_id', () => {
      it('GET: status 200 - responds with selected article', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.have.all.keys(
              'author',
              'title',
              'topic',
              'created_at',
              'votes',
              'comment_count',
              'article_id',
              'body'
            );
            expect(body.article_id).to.equal(1);
          });
      });
      it('GET: status 400 - responds with invalid article id if passed a not valid id', () => {
        return request(app)
          .get('/api/articles/invalid_article_id')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid id');
          });
      });
      it('GET: status 404 - responds with article not found if passed a non existing article id', () => {
        return request(app)
          .get('/api/articles/1000')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('article not found');
          });
      });
      it('PATCH: status 200 - responds with updated article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).to.equal(105);
          });
      });
      it('PATCH: status 400 - responds with invalid article id if passed a not valid id', () => {
        return request(app)
          .patch('/api/articles/invalid_article_id')
          .send({ inc_votes: 5 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid id');
          });
      });
      it('PATCH: status 400 - responds with missing increment votes if no inc_votes on request object', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ not_valid: 5 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('increment votes has not been sent');
          });
      });
      it('PATCH: status 400 - responds with invalid inc_votes if inc_votes is invalid', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'invalid' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid votes increment');
          });
      });
      it('PATCH: status 404 - responds with article not found if passed a non existing article', () => {
        return request(app)
          .patch('/api/articles/1000')
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('article not found');
          });
      });
      it('PUT: status 405 - responds with method not allowed', () => {
        return request(app)
          .put('/api/articles/1')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });
    });

    describe('/articles/:article_id/comments', () => {
      it('GET: status 200 - responds with all comments from that article sorted by date (descending order)', () => {
        return request(app)
          .get('/api/articles/9/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(2);
            expect(body.comments).to.be.sortedBy('created_at', {
              descending: true
            });
            body.comments.forEach(comment => {
              expect(comment).to.have.all.keys(
                'comment_id',
                'votes',
                'created_at',
                'author',
                'body'
              );
            });
          });
      });
      it('GET: status 400 - responds with invalid article if passed a non valid article', () => {
        return request(app)
          .get('/api/articles/not_an_article/comments')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid id');
          });
      });
      it('GET: status 404 - responds with article not found if passed a non existing article', () => {
        return request(app)
          .get('/api/articles/9999/comments')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('article not found');
          });
      });
      it('GET: can sort comments by author if passed a query', () => {
        return request(app)
          .get('/api/articles/9/comments?sort_by=author')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(2);
            expect(body.comments).to.be.sortedBy('author', {
              descending: true
            });
          });
      });
      it('GET: can sort comments by date in ascending order if passed a query', () => {
        return request(app)
          .get('/api/articles/9/comments?order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(2);
            expect(body.comments).to.be.sortedBy('created_at', {
              ascending: true
            });
          });
      });
      it('GET: status 400 - responds with invalid query if passed an invalid sort_by column as query', () => {
        return request(app)
          .get('/api/articles?sort_by=abc')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid query');
          });
      });
      it('POST: status 201 - responds with new comment', () => {
        return request(app)
          .post('/api/articles/9/comments')
          .send({ username: 'rogersop', body: 'body' })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.have.all.keys(
              'author',
              'body',
              'created_at',
              'comment_id',
              'votes',
              'article_id'
            );
            expect(body.comment.article_id).to.equal(9);
            expect(body.comment.author).to.equal('rogersop');
            expect(body.comment.body).to.equal('body');
          });
      });
      it('POST: status 400 - responds with invalid article if passed a non valid article', () => {
        return request(app)
          .get('/api/articles/not_an_article/comments')
          .send({ username: 'rogersop', body: 'body' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid id');
          });
      });
      it('POST: status 404 - responds with article not found if passed a non existing article', () => {
        return request(app)
          .get('/api/articles/9999/comments')
          .send({ username: 'rogersop', body: 'body' })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('article not found');
          });
      });
      it('POST: status 400 - responds with username does not exist if passed a non existing username', () => {
        return request(app)
          .post('/api/articles/9/comments')
          .send({ username: 'non existing username', body: 'body' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('author does not exist');
          });
      });
      it('POST: status 400 - responds with invalid post body if passed a non post object', () => {
        return request(app)
          .post('/api/articles/9/comments')
          .send({ username: 'rogersop', invalid_body: 'body' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid post body');
          });
      });
      it('PUT: status 405 - responds with method not allowed', () => {
        return request(app)
          .put('/api/articles/1/comments')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });
    });
  });
  describe('/comments/:comment_id', () => {
    it('GET: status 200 - responds with selected comment', () => {
      return request(app)
        .get('/api/comments/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.have.all.keys(
            'comment_id',
            'author',
            'article_id',
            'body',
            'votes',
            'created_at'
          );
          expect(body.comment.comment_id).to.eql(1);
        });
    });
    it('GET: status 400 - responds with invalid comment id if passed a not valid id', () => {
      return request(app)
        .get('/api/comments/invalid_comment_id')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id');
        });
    });
    it('GET: status 404 - responds with comment not found if passed a non existing comment', () => {
      return request(app)
        .get('/api/comments/1000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment not found');
        });
    });
    it('PATCH: status 200 - responds with updated comment', () => {
      return request(app)
        .patch('/api/comments/2')
        .send({ inc_votes: 3 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(17);
        });
    });
    it('PATCH: status 400 - responds with invalid comment id if passed a not valid id', () => {
      return request(app)
        .patch('/api/comments/invalid_comment_id')
        .send({ inc_votes: 5 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id');
        });
    });
    it('PATCH: status 400 - responds with missing increment votes if no inc_votes on request object', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ not_valid: 5 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('increment votes has not been sent');
        });
    });
    it('PATCH: status 400 - responds with invalid inc_votes if inc_votes is invalid', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 'invalid' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid votes increment');
        });
    });
    it('PATCH: status 404 - responds with comment not found if passed a non existing comment', () => {
      return request(app)
        .patch('/api/comments/1000')
        .send({ inc_votes: 5 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment not found');
        });
    });
    it('DELETE: status 204 - deletes selected comment', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204);
    });
    it('DELETE: status 400 - responds with invalid comment id if passed a not valid id', () => {
      return request(app)
        .delete('/api/comments/invalid_comment_id')
        .send({ inc_votes: 5 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id');
        });
    });
    it('DELETE: status 404 - responds with comment not found if passed a non existing comment', () => {
      return request(app)
        .delete('/api/comments/1000')
        .send({ inc_votes: 5 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment not found');
        });
    });
    it('PUT: status 405 - responds with method not allowed', () => {
      return request(app)
        .put('/api/comments/5')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('method not allowed');
        });
    });
  });
  describe('/users/:username', () => {
    it('GET: status 200 - responds with selected user', () => {
      return request(app)
        .get('/api/users/rogersop')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.all.keys('username', 'avatar_url', 'name');
          expect(body.username).to.equal('rogersop');
          expect(body.name).to.equal('paul');
        });
    });
    it('GET: status 404 - responds with username not found if non existing username', () => {
      return request(app)
        .get('/api/users/non_existing_username')
        .expect(404)
        .then(({ body }) => [expect(body.msg).to.equal('username not found')]);
    });
    it('PUT: status 405 - responds with method not allowed', () => {
      return request(app)
        .put('/api/users/rogersop')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('method not allowed');
        });
    });
  });
});
