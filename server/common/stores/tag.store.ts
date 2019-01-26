import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';
import {TMD} from '../../types';
import {checkin, checkout} from './helpers';
import validate from '../schema/tag.schema';
import {getValidationErrors} from '../schema/validate';
import TMDError from '../error';

console.log(`loading ${__filename}`);

export class TagStore {

    private store:any = null;

    initialize(options:Nedb.DataStoreOptions):void {
        L.debug('__INIT DB__ : TagStore');
        this.store = DB(options);
        L.debug('init index on field "name"');
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
    
    /**
     * Removes one tag from the store.
     * 
     * @param id id of the tag to delete
     */
    deleteById(id: string): Promise<number> {
        L.info(`delete tag with id ${id}`);
        return this.store.remove({ "_id" : id}, { multi: false });   
    }

    /**
     * Removes all tags from the store
     */
    deleteAll():Promise<number> {
        L.info('delete all tags');
        return this.store.remove({}, { multi: true });        
    }

    /**
     * Insert one or more tags.
     * If tag schema validation fails no tag is inserted, including in the case 
     * where there is more than one tag to insert.
     * 
     * @param tags one or more tags to insert
     * @returns one or more inserted tags 
     */
    insert(tags:TMD.Tag[] | TMD.Tag):Promise<TMD.Tag[]|TMD.Tag> {
        L.info('insert one or more tags');

        const checkedTags = checkin(tags);
        const validationErrors = getValidationErrors(validate(checkedTags));
        if( validationErrors.length > 0) {
            L.error('tag validation failed');
            L.debug(validationErrors);
            return Promise.reject(new TMDError("tag validation failed",validationErrors));
        }

        return this.store.insert(checkedTags)
            .then( checkout );
    }
}

export default new TagStore();