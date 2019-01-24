import 'mocha';
import { expect, assert } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import { before } from 'mocha';
import fixture from '../../fixture/sample-1';
import TagStore from '../../../server/common/stores/tag.store';
import httpStatus from "http-status";


describe('POST Tags', () => {

    beforeEach((done) => {
        TagStore.deleteAll()
            .then(() => TagStore.getImplementation().insert(fixture.tags))
            .then(() => {
                done();
            });
    });

    it('should create a tag', () =>
        request(Server)
            .post('/api/v1/tags')
            .send({ "name": "my tag" })
            .expect('Content-Type', /json/)
            .then(r => {
                console.log(r.body);
                assert.isObject(r.body);
                assert.propertyVal(r.body, "name", "my tag");
                assert.property(r.body, "id");
            })
    );

    it('should returns an error is name is missing when creating a tag', () =>
        request(Server)
            .post('/api/v1/tags')
            .expect('Content-Type', /json/)
            .expect(httpStatus.INTERNAL_SERVER_ERROR)
            .then(r => {
                console.log(r.body);
                assert.isObject(r.body);
                assert.propertyVal(r.body, "message", "invalid tag");
            })
    );

    it('should fail create tag with duplicate name', () =>
        request(Server)
            .post('/api/v1/tags')
            .send({ "name": 'tagName 1' })
            .expect('Content-Type', /json/)
            .expect(httpStatus.INTERNAL_SERVER_ERROR)
            .then(r => {
                console.log(r.body);
                assert.isObject(r.body);
                assert.propertyVal(r.body, "message", "duplicate tag name");
            })
    );

});
