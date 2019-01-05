import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';
import {TMD} from '../../types';


export class DocumentStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        console.log('__INIT DB__');
        this.store = DB(options);
    }

    all(): Promise<TMD.Document[]> {
        L.info('fetch all documents');
        return this.store.find({});
    }

    byId(id: string): Promise<TMD.Document> {
        L.info(`fetch document with id ${id}`);
        return this.store.findOne({"_id" : id});
    }

    deleteAll():Promise<number> {
        L.info('delete all documents');
        return this.store.remove({}, { multi: true });        
    }

    insert(documents:TMD.Document[] | TMD.Document):Promise<TMD.Document[]|TMD.Document> {
        L.info('insert one or more documents');
        return this.store.insert(documents);
    }
}

export default new DocumentStore();