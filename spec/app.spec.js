process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');

describe('/api', () => {
  describe('/topics', () => {
    it('GET: returns 200 and a list of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.have.property('slug');
          expect(body.topics).to.have.property('description');
        });
    });
  });
});
