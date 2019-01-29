import 'mocha';
import { expect, assert } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixture from '../../fixture/sample-1';
import DocumentStore from '../../../server/common/stores/document.store';
import fixtureLoader from '../../fixture/loader';
import httpStatus from "http-status";


describe('DELETE Tags', () => {

    beforeEach((done) => {
        fixtureLoader(fixture)
            .then(() => done());
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

    it('should remove delete tag from document', () =>
        request(Server)
            .delete('/api/v1/tags/1')
            .expect('Content-Length', '0')
            .expect(httpStatus.OK)
            .then(r => DocumentStore.byId("1")
                .then( doc => assert.isEmpty(doc.tags, ' should not contain any tag'))
            )
    );
});
