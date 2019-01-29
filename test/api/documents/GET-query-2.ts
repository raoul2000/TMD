import 'mocha';

import { expect, assert } from 'chai';
import request from 'supertest';
import Server from '../../../server';
import fixtureLoader from '../../fixture/loader';
import fixture from '../../fixture/sample-2';
import httpStatus from "http-status";

const q1 = "1";
const q2 = "2";
const q3 = "2,3";
const q4 = "1, 2 , 3";

describe('GET Documents', () => {

    beforeEach((done) => {
        fixtureLoader(fixture)
            .then(() => done());
    });

    it('should get all documents with tags 1', () =>
        request(Server)
            .get('/api/v1/documents')
            .query({ 
                "tags" : q1
            })
            .expect('Content-Type', /json/)
            .expect(httpStatus.OK)
            .then(r => {
                assert.isArray(r.body);
                assert.lengthOf(r.body,1);
                assert.equal(r.body[0].id,"1");
            }));

    it('should get all documents with tags 2', () =>
        request(Server)
            .get('/api/v1/documents')
            .query({ 
                "tags" : q2
            })
            .expect('Content-Type', /json/)
            .expect(httpStatus.OK)
            .then(r => {
                assert.isArray(r.body);
                assert.lengthOf(r.body,2);
                assert.equal(r.body[0].id,"1");
            }));

    it('should get all documents with tags 2 or 3', () =>
        request(Server)
            .get('/api/v1/documents')
            .query({ 
                "tags" : q3
            })
            .expect('Content-Type', /json/)
            .expect(httpStatus.OK)
            .then(r => {
                assert.isArray(r.body);
                assert.lengthOf(r.body,2);
                assert.equal(r.body[0].id,"1");
            }));

    it('should get all documents with tags 1, 2 or 3', () =>
        request(Server)
            .get('/api/v1/documents')
            .query({ 
                "tags" : q4
            })
            .expect('Content-Type', /json/)
            .expect(httpStatus.OK)
            .then(r => {
                //console.log(r.body);
                assert.isArray(r.body);
                assert.lengthOf(r.body,2);
                assert.equal(r.body[0].id,"1");
            }));
});
