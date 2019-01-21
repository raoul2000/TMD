import L from '../../common/logger';
import DocumentStore from '../../common/stores/document.store';
import { TMD } from '../../types';
import Repository from '../../common/content/repository';
import TagStore from '../../common/stores/tag.store';

export class DocumentsService {

  all(): Promise<TMD.Document[]> {
    L.info('fetch all documents');
    return DocumentStore.all();
  }

  byId(id: string): Promise<TMD.Document> {
    L.info(`fetch document with id ${id}`);
    return DocumentStore.byId(id);
  }

  deleteById(id: string): Promise<number> {
    L.info(`delete document with id ${id}`);
    return DocumentStore.deleteById(id);
  }

  /**
   * 
   * @param name string 
   * @param file 
   */
  create(name: string, tags: TMD.Tag[], file: Express.Multer.File): Promise<TMD.Document[] | TMD.Document> {
    L.info(`create document with name ${name}`);

    if (!name) {
      return Promise.reject("missing parameter 'name'");
    }
    name = name.trim();
    if (name.length === 0) {
      return Promise.reject("invalid parameter 'name'");
    }
    // we should validate tags schema

    // insert all tags with no id
    const tagToInsert = tags
      .filter(tag => !tag.id);

    // store tags linked assigned to the document
    let documentTags = null;
    return TagStore.insert(tagToInsert)
      .then(result => {
        let newInsertedTags = !Array.isArray(result) ? [result] : result;
        documentTags = newInsertedTags.concat(tags.filter(tag => tag.id));
        return true;
      })
      .then( () => Repository.write(file))
      .then(contentMetadata => DocumentStore.insert({
        "name": name,
        "tags": documentTags,
        "content": contentMetadata
      }));
  }
}

export default new DocumentsService();