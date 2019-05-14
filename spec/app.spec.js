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
    it('GET: returns 200 and a list of topics', () => {
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
    it('GET: responds with 200 and a list of articles sorted by date in descending order by default', () => {
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
    it('GET: can sort articles by date in ascending order if passed a query', () => {
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
    it('GET: responds with 200 and the selected article', () => {
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
            'article_id'
          );
          expect(body.article_id).to.equal(1);
        });
    });
  });
});
