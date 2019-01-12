import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';
import { doesNotReject } from 'assert';
import { before } from 'mocha';
import fixture from './fixture/sample-1';
import TagStore from '../server/common/stores/tag.store';


describe('Tags', () => {

  beforeEach((done) => {
    TagStore.deleteAll()
      .then( () => TagStore.deleteAll())
      .then( () => TagStore.insert(fixture.tags))
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

        console.log(JSON.stringify(r.body));
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('tagName 2');
      }));
});
