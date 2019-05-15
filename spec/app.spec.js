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
    it('GET: status 200 - responds with list of article sorted by date', () => {
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
    it('GET: can sort articles by topic if passed a query', () => {
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
});
