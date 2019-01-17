import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';
import {TMD} from '../../types';
import {checkin, checkout} from './helpers';

export class DocumentStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        L.debug('__INIT DB__ : DocumentStore');
        this.store = DB(options);
    }
    
    getImplementation(): any {
        return this.store;
    }

    all(): Promise<TMD.Document[]> {
        L.info('fetch all documents');
        return this.store.find({}).then( checkout );
    }

    byId(id: string): Promise<TMD.Document> {
        L.info(`fetch document with id ${id}`);
        return this.store.findOne({"_id" : id}).then( checkout );
    }

    deleteById(id: string): Promise<TMD.Document> {
        L.info(`delete document with id ${id}`);
         return this.store.remove({ "_id" : id}, { multi: false });  
    }

    deleteAll():Promise<number> {
        L.info('delete all documents');
        return this.store.remove({}, { multi: true });        
    }

    insert(documents:TMD.Document[] | TMD.Document):Promise<TMD.Document[]|TMD.Document> {
        L.info('insert one or more documents');
        return Promise.resolve(checkin(documents))
            .then(this.store.insert)
            .then( checkout );
    }
}

export default new DocumentStore();