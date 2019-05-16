process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const chaiSorted = require('chai-sorted');

const app = require('../app');
const connection = require('../db/connection');

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
  });

  describe('/articles', () => {
    it('GET: status 200 - responds with list of article sorted by date - defaults to descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy('created_at', {
            descending: true
          });
          expect(body.articles).to.have.length(12);
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
          expect(body.articles).to.have.length(11);
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
    xit('GET: status 404 - responds with topic not found if passed an non existing topic as query', () => {
      return request(app)
        .get('/api/articles?topic=non_existing_topic')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('topic not found');
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
      it('PATCH: status 200 - responds with updated article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).to.equal(105);
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
    });
    describe('/comments/:comment_id', () => {
      it('PATCH: status 200 - responds with updated comment', () => {
        return request(app)
          .patch('/api/comments/2')
          .send({ inc_votes: 3 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(17);
          });
      });
      it('DELETE: status 204 - deletes selected comment', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
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
    });
  });
});
