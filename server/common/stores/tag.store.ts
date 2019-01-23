import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';
import {TMD} from '../../types';
import {checkin, checkout} from './helpers';

export class TagStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        L.debug('__INIT DB__ : TagStore');
        this.store = DB(options);
        console.log('init index name');
        this.store.ensureIndex({ fieldName: 'name', unique: true }, (err) => {
            if(err) throw new Error("failed to setup index");
        });
    }

    getImplementation(): any {
        return this.store;
    }

    all(): Promise<TMD.Tag[]> {
        L.info('fetch all tags');
        return this.store.find({}).then( checkout );
    }

    byId(id: string): Promise<TMD.Tag> {
        L.info(`fetch tag with id ${id}`);
        return this.store.findOne({"_id" : id}).then( checkout );
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
        //let items = Array.isArray(tags) ? importTags(tags) : importTag(tags);

        return Promise.resolve(checkin(tags))
            .then(this.store.insert)
            .then( checkout );
    }

    insertMissing(tag: TMD.Tag[]): Promise<TMD.Tag[]> {
        L.info('create missing tag(s)');

        let tagToCreate = [], tagCreated = [];
        tag.forEach( t => {
            if( t.id ) tagCreated.push(t);
            else tagToCreate.push(t);
        });

        return this.store.insert(tagToCreate)
            .then( checkout )
            .then( newTags => tagCreated.concat(newTags));
    }
}

export default new TagStore();