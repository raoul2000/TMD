import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('Tags', () => {
  it('should get all tags', () =>
    request(Server)
      .get('/api/v1/tags')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('array')
          .of.length(2);
      }));

  it('should get an example by id', () =>
    request(Server)
      .get('/api/v1/tags/2')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('TagName2');
      }));
});
