import 'mocha';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixture from '../../fixture/sample-1';
import DocumentStore from '../../../server/common/stores/document.store';

describe('GET Documents', () => {

    beforeEach((done) => {
        DocumentStore.deleteAll()
            .then(() => DocumentStore.deleteAll())
            .then(() => DocumentStore.getImplementation().insert(fixture.documents))
            .then(() => {
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
});
