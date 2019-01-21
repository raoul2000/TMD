import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixtureLoader from '../../fixture/loader';
import fixture from '../../fixture/sample-1';
import httpStatus from "http-status";


describe('DELETE Documents', () => {

    beforeEach((done) => {
        fixtureLoader(fixture)
            .then(() => done());
    });

    it('should delete a document', () =>
        request(Server)
            .delete('/api/v1/documents/1')
            .expect('Content-Length', '0')
            .expect(httpStatus.OK)
    );

    it('should fail to delete a document by unkown id', () =>
        request(Server)
            .get('/api/v1/documents/NOT_FOUND')
            .expect('Content-Type', /json/)
            .expect(httpStatus.NOT_FOUND)
            .then(r => {
                expect(r.body)
                    .to.be.an('object')
                    .that.has.property('message');
            }));
});
