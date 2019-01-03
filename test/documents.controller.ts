import 'mocha';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('Documents', () => {
  it('should get all documents', () =>
    request(Server)
      .get('/api/v1/documents')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('array')
          .of.length(2);
      }));

  it('should get a document by id', () =>
    request(Server)
      .get('/api/v1/documents/1')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('document 1');
      }));

  it('should add a new document', () =>
    request(Server)
      .post('/api/v1/documents')
      .attach('content', path.join(__dirname,'data/document-1.md') )
      .field('name','document1')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('document1');
      }));      
});
