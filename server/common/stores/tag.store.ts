import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';
import {TMD} from '../../types';


export class TagStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        L.debug('__INIT DB__ : TagStore');
        this.store = DB(options);
    }

    all(): Promise<TMD.Tag[]> {
        L.info('fetch all tags');
        return this.store.find({});
    }

    byId(id: string): Promise<TMD.Tag> {
        L.info(`fetch tag with id ${id}`);
        return this.store.findOne({"_id" : id});
    }

    deleteAll():Promise<number> {
        L.info('delete all tags');
        return this.store.remove({}, { multi: true });        
    }

    insert(tags:TMD.Tag[] | TMD.Tag):Promise<TMD.Tag[]|TMD.Tag> {
        L.info('insert one or more tags');

        return this.store.insert(tags);
    }
}

export default new TagStore();