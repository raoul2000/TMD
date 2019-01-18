import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixture from '../../fixture/sample-1';
import TagStore from '../../../server/common/stores/tag.store';
import httpStatus from "http-status";


describe('DELETE Tags', () => {

    beforeEach((done) => {
        TagStore.deleteAll()
            .then(() => TagStore.deleteAll())
            .then(() => TagStore.getImplementation().insert(fixture.tags))
            .then(() => {
                done();
            });
    });

    it('should delete a tags', () =>
        request(Server)
            .delete('/api/v1/tags/2')
            .expect('Content-Length', '0')
            .expect(httpStatus.OK)
    );

    it('should fail to delete a tag by unkown id', () =>
        request(Server)
            .get('/api/v1/tags/NOT_FOUND')
            .expect('Content-Type', /json/)
            .expect(httpStatus.NOT_FOUND)
            .then(r => {
                expect(r.body)
                    .to.be.an('object')
                    .that.has.property('message');
            }));
});
