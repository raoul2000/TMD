import 'mocha';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';
import fixture from './fixture/sample-1';
import DocumentStore from '../server/common/stores/document.store';

describe('Documents', () => {

  beforeEach((done) => {
    DocumentStore.deleteAll()
      .then( () => DocumentStore.insert(fixture.documents))
      .then( () => {
        done();
      });
  });

  it('should get all documents', () =>
    request(Server)
      .get('/api/v1/documents')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('array')
          .of.length(1);
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
      .field('tags','T1,T2')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('document1');
      }));      
});
