import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixture from '../../fixture/sample-1';
import TagStore from '../../../server/common/stores/tag.store';
import httpStatus from "http-status";


describe('Tags', () => {

  beforeEach((done) => {
    TagStore.deleteAll()
      .then( () => TagStore.deleteAll())
      .then( () => TagStore.getImplementation().insert(fixture.tags))
      .then( () => {
        done();
      });
  });

  it('should get all tags', () =>
    request(Server)
      .get('/api/v1/tags')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('array')
          .of.length(2);
      }));

  it('should get a tag by id', () =>
    request(Server)
      .get('/api/v1/tags/2')
      .expect('Content-Type', /json/)
      .then(r => {
        //console.log(JSON.stringify(r.body));
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('tagName 2');
      }));

  it('should fail to get a tag by unkown id', () =>
    request(Server)
      .get('/api/v1/tags/NOT_FOUND')
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND)
      .then(r => {
        //console.log(JSON.stringify(r.body));
        expect(r.body)
          .to.be.an('object')
          .that.has.property('message');
      }));
});
