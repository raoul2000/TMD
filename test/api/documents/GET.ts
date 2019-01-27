import 'mocha';

import { expect, assert } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixtureLoader from '../../fixture/loader';
import fixture from '../../fixture/sample-1';
import httpStatus from "http-status";


describe('GET Documents', () => {

    beforeEach((done) => {
        fixtureLoader(fixture)
            .then(() => done());
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

    it('should fail to get a document by unkowwn id', () =>
        request(Server)
            .get('/api/v1/documents/NOT_FOUND')
            .expect('Content-Type', /json/)
            .expect(httpStatus.NOT_FOUND)
            .then(r => {
                expect(r.body)
                    .to.be.an('object')
                    .that.has.property('message');
            }));

    it('should get document content from document id', () =>
        request(Server)
            .get('/api/v1/documents/1/content')
            .expect(httpStatus.OK)
            .expect('Content-Type', /text\/markdown/)
            .then(r => {
                assert.equal(r.header['content-length'], 37)
                assert.equal(r.header['content-disposition'], "attachment; filename=\"orig-doc.txt\"")
            }));

    it('should get tags for a document by id', () =>
        request(Server)
            .get('/api/v1/documents/1/tags')
            .expect('Content-Type', /json/)
            .then(r => {
                console.log(r.body);
                assert.deepEqual(r.body,[ { _id: '1', name: 'tagName 1' } ]);
            }));

});
