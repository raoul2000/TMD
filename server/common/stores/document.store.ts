import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';
import {TMD} from '../../types';
import {checkin, checkout} from './helpers';
import {getValidationErrors} from '../schema/validate';
import validate from '../schema/tag.schema';
import TMDError from '../error';

export class DocumentStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        L.debug('__INIT DB__ : DocumentStore');
        this.store = DB(options);
    }
    
    getImplementation(): any {
        return this.store;
    }

    all(query?:any): Promise<TMD.Document[]> {
        L.info('fetch all documents');
        return this.store.find( query || {}).then( checkout );
    }

    byId(id: string): Promise<TMD.Document> {
        L.info(`fetch document with id ${id}`);
        return this.store.findOne({"_id" : id}).then( checkout );
    }

    deleteById(id: string): Promise<number> {
        L.info(`delete document with id ${id}`);
         return this.store.remove({ "_id" : id}, { multi: false });  
    }

    deleteAll():Promise<number> {
        L.info('delete all documents');
        return this.store.remove({}, { multi: true });        
    }

    insert(documents:TMD.Document[] | TMD.Document):Promise<TMD.Document[]|TMD.Document> {
        L.info('insert one or more documents');
        // TODO: document checkin/checkout implies processing assigned tags ids (and not only document tag)
        const checkedDocuments = checkin(documents);
        // TODO: document validation
/*
        const validationErrors = getValidationErrors(validate(checkedDocuments));
        if( validationErrors.length > 0) {
            L.error('document validation failed');
            L.debug(validationErrors);
            return Promise.reject(new TMDError("document validation failed",validationErrors));
        }
*/
        return this.store.insert(checkedDocuments)
            .then( checkout );
    }

    updateTags(id: string, tagIds:string[]): Promise<TMD.Document> {
        L.info(`updating tags for document with id ${id}`);
        return this.store.update(
                { "_id" : id},
                { $set : { "tags" : tagIds}},
                { multi: false })
            .then( () => this.byId(id) );
    }

    findByTags(tagIds: string[]): Promise<TMD.Document[]> {
        return this.store.find({ "tags" : { $in : tagIds}})
            .then( checkout );
    }
}

export default new DocumentStore();