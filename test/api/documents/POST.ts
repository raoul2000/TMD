import 'mocha';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixture from '../../fixture/sample-1';
import DocumentStore from '../../../server/common/stores/document.store';

describe('POST Documents', () => {

    beforeEach((done) => {
        DocumentStore.deleteAll()
            .then(() => DocumentStore.deleteAll())
            .then(() => DocumentStore.getImplementation().insert(fixture.documents))
            .then(() => {
                done();
            });
    });


    it('should add a new document', () =>
        request(Server)
            .post('/api/v1/documents')
            .attach('content', path.join(__dirname, 'content-file/file-1.md'))
            .field('name', 'document1')
            .field('tags', 'T1,T2')
            .expect('Content-Type', /json/)
            .then(r => {
                expect(r.body)
                    .to.be.an('object')
                    .that.has.property('name')
                    .equal('document1');
            }));
});
