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
        return TagStore.byId(id);
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
                    const updatedTags = doc.tags.filter(tagId => tagId !== id);
                    L.debug(`updating document ${doc.id}`);
                    return DocumentStore.updateTags(doc.id, updatedTags);
                });

                return Promise.all(op1);
            })
            .then(() => TagStore.deleteById(id));
    }

    create(tag: TMD.Tag[] | TMD.Tag): Promise<TMD.Tag[] | TMD.Tag> {
        L.info('create tag(s)');

        return TagStore
            .insert(tag)
            .catch((err) => {
                if (err.errorType && err.errorType == "uniqueViolated") {
                    return Promise.reject(new TMDError('duplicate tag name', err));
                }
                return Promise.reject(err);
            });
    }
}

export default new TagsService();