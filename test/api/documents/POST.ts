import 'mocha';
import path from 'path';

import { expect, assert } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixtureLoader from '../../fixture/loader';
import fixture from '../../fixture/sample-1';


describe('POST Documents', () => {

    beforeEach((done) => {
        fixtureLoader(fixture)
            .then(() => done());
    });


    it('should add a new document', () =>
        request(Server)
            .post('/api/v1/documents')
            .attach('content', path.join(__dirname, 'content-file/file-1.md'))
            .field('name', 'document1')
            .field('tags', JSON.stringify([
                { "name" : "TAG-A"},
                { "name" : "TAG-B"},
                { "id" : "1", "name" : "tagName 1" },
            ]))
            .expect('Content-Type', /json/)
            .then(r => {
                let doc = r.body;
                //console.log(doc);
                expect(doc)
                    .to.be.an('object')
                    .that.has.property('name')
                    .equal('document1');
                    
                assert.isArray(doc.tags);
                assert.lengthOf(doc.tags,3);
                
                const tagIds = doc.tags.map( tag => tag.id);
                assert.lengthOf(tagIds, 3, "all tags must have id");
            }));
});
