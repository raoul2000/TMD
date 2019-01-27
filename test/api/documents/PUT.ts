import 'mocha';
import httpStatus from "http-status";
import { expect, assert } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixtureLoader from '../../fixture/loader';
import fixture from '../../fixture/sample-1';


describe('PUT Documents', () => {

    beforeEach((done) => {
        fixtureLoader(fixture)
            .then(() => done());
    });


    it('should update tags for document by id', () =>
        request(Server)
            .put('/api/v1/documents/1/tags')
            .send([
                { "name": "my tag" },
                { "id" : "2", "name" : "tagName 2" }
            ])
            .expect('Content-Type', /json/)            
            .then(r => {
                let doc = r.body;
                console.log(doc);
                // WARN : tag order in property 'tags' is not preserved
                assert.isArray(doc.tags);
                assert.lengthOf(doc.tags,2);
                assert.equal(doc.tags[1].name , "my tag");
                assert.deepEqual(doc.tags[0], { id: '2', name: 'tagName 2' });
            }));

    it('fails on duplicate tag name update', () =>
        request(Server)
            .put('/api/v1/documents/1/tags')
            .send([
                { "name" : "REALLY NEW TAG 1" },
                { "name" : "tagName 2" },
                { "name" : "OTHER TAG" }
            ])
            .expect('Content-Type', /json/)
            .expect(httpStatus.INTERNAL_SERVER_ERROR)
            .then(r => {
                console.log(r.body);
                assert.isObject(r.body);
                assert.propertyVal(r.body, "message", "duplicate tag name");
            }));
});
