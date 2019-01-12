import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';
import {TMD} from '../../types';


const exportTag = (tag) => {
    if(tag) {
        tag.id = tag._id;
        delete tag._id;
    }
    return tag;
} ;
const exportTags = (tags) => tags.map( exportTag ); 

const importTag = (tag) => {
    if(tag) {
        delete tag._id;
        delete tag.id;
    }
    return tag;
};

const importTags = (tags) => tags.map( importTag);


export class TagStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        L.debug('__INIT DB__ : TagStore');
        this.store = DB(options);
        this.store.ensureIndex({ fieldName: 'name', unique: true }, (err) => {
            if(err) throw new Error("failed to setup index");
        });
    }

    all(): Promise<TMD.Tag[]> {
        L.info('fetch all tags');
        return this.store.find({}).then( exportTags );
    }

    byId(id: string): Promise<TMD.Tag> {
        L.info(`fetch tag with id ${id}`);
        return this.store.findOne({"_id" : id}).then( exportTag );
    }
    
    deleteById(id: string): Promise<number> {
        L.info(`delete tag with id ${id}`);
        return this.store.remove({ "_id" : id}, { multi: false });   
    }

    deleteAll():Promise<number> {
        L.info('delete all tags');
        return this.store.remove({}, { multi: true });        
    }

    insert(tags:TMD.Tag[] | TMD.Tag):Promise<TMD.Tag[]|TMD.Tag> {
        L.info('insert one or more tags');
        let items = Array.isArray(tags) ? importTags(tags) : importTag(tags);

        return this.store.insert(items);
    }
}

export default new TagStore();