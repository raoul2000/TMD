import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';


interface Tag {
    id?: string;
    name:string;
}

export class TagStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        console.log('__INIT DB__');
        this.store = DB(options);
    }

    all(): Promise<Tag[]> {
        L.info('fetch all tags');
        return this.store.find({});
    }

    byId(id: string): Promise<Tag> {
        L.info(`fetch tag with id ${id}`);
        return this.store.findOne({"_id" : id});
    }

    deleteAll():Promise<number> {
        return this.store.remove({}, { multi: true });        
    }

    insert(tags:Tag[] | Tag):Promise<Tag[]|Tag> {
        return this.store.insert(tags);
    }
}

export default new TagStore();