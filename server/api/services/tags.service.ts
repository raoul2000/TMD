import L from '../../common/logger';
import TagStore from '../../common/stores/tag.store';
import { TMD } from '../../types';
import validateSchema from '../../common/schema/tag.schema';
import TMDError from '../../common/error';

export class TagsService {

    all(): Promise<TMD.Tag[]> {
        L.info('fetch all tags');
        return TagStore.all();
    }

    byId(id: string): Promise<TMD.Tag> {
        L.info(`fetch tag with id ${id}`);
        return TagStore.byId(id);
    }

    deleteById(id: string): Promise<number> {
        L.info(`delete tag with id ${id}`);
        // TODO: When deleting a tag, all document linked to this tag must
        // also be modified 
        return TagStore.deleteById(id);
    }

    create(tag: TMD.Tag[] | TMD.Tag): Promise<TMD.Tag[] | TMD.Tag> {
        L.info('create tag(s)');

        const validationResult = validateSchema(tag);
        if( validationResult.find( (validation) => validation.error !== null) ) {
            return Promise.reject(new TMDError("invalid tag", validationResult));
        }

        return TagStore
            .insert(tag) 
            .catch( (err) => {
                if( err.errorType && err.errorType == "uniqueViolated") {
                    return Promise.reject(new TMDError('duplicate tag name', err));
                } 
                return Promise.reject(err);
            });
    }
}

export default new TagsService();