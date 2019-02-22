import L from '../../common/logger';
import TagStore from '../../common/stores/tag.store';
import { TMD } from '../../types';
import TMDError from '../../common/error';
import DocumentStore from '../../common/stores/document.store';

export class TagsService {

    all(): Promise<TMD.Tag[]> {
        L.info('fetch all tags');
        return TagStore.all();
    }

    byId(id: string): Promise<TMD.Tag> {
        L.info(`fetch tag with id ${id}`);
        return TagStore.byId(id) as Promise<TMD.Tag>;
    }

    /**
     * Delete a tag from the store and updates all document associated to this tag
     * 
     * @param id Id of the tag to delete
     */
    deleteById(id: string): Promise<number> {
        L.info(`delete tag with id ${id}`);

        return DocumentStore.findByTags([id])
            .then(docToUpdate => {
                L.debug(`document count to update : ${docToUpdate.length}`);

                const op1 = docToUpdate.map(doc => {
                    const updatedTags = (doc.tags as string[]).filter(tagId => tagId !== id);
                    L.debug(`updating document ${doc.id}`);
                    return DocumentStore.updateTags(doc.id, updatedTags);
                });

                return Promise.all(op1);
            })
            .then(() => TagStore.deleteById(id));
    }

    create(tag: TMD.Tag[] | TMD.Tag): Promise<TMD.Tag[] | TMD.Tag> {
        L.info('create tag(s)',tag);

        return TagStore
            .insert(tag)
            .catch((err) => {
                if (err.errorType && err.errorType == "uniqueViolated") {
                    return Promise.reject(new TMDError('duplicate tag name', err));
                }
                return Promise.reject(err);
            });
    }

    /**
     * Given a list containing existing and new tags, this method will create the new tags
     * and return a list of all tag ids : the existing ones and the inserted ones.
     * 
     * A tag from the list is considered new if it has no 'id' property.
     * @param tags list of tags to process
     */
    createMissingTags(tags: TMD.Tag[]): Promise<string[]> {
        // get from the tag list, all tags that are not already stored (i.e. they have no 'id' property)
        const tagToInsert: TMD.Tag[] = tags.filter(tag => !tag.id);

        if (tagToInsert.length) {
            // there are tag to insert
            return this.create(tagToInsert)
                .catch(err => {
                    return Promise.reject(new TMDError('failed to insert tag', err));
                })
                .then(result => {
                    // for all inserted tags, keep only ids and concat to existing tags ids
                    return  (result as TMD.Tag[]).concat(tags.filter(tag => tag.id)).map(tag => tag.id);
                });
        } else {
            // no tag to insert : return the list of tag ids passed as argument
            return Promise.resolve(tags.map(tag => tag.id));
        }
    }
}

export default new TagsService();