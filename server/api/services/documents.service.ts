import L from '../../common/logger';
import DocumentStore from '../../common/stores/document.store';
import {TMD} from '../../types';
import Repository from '../../common/content/repository';

export class DocumentsService {

  all(): Promise<TMD.Document[]> {
      L.info('fetch all documents');
      return DocumentStore.all();
  }

  byId(id: string): Promise<TMD.Document> {
      L.info(`fetch document with id ${id}`);
      return DocumentStore.byId(id);
  }

  deleteById(id: string): Promise<TMD.Document> {
      L.info(`delete document with id ${id}`);
      return DocumentStore.deleteById(id);
  }

  /**
   * 
   * @param name string 
   * @param file 
   */
  create(name: string, tags: string[], file:Express.Multer.File): Promise<TMD.Document[] | TMD.Document> {
    L.info(`create document with name ${name}`);
    if( ! name ) {
      return Promise.reject("missing parameter 'name'");
    }
    name = name.trim();
    if( name.length === 0 ) {
      return Promise.reject("invalid parameter 'name'");
    }

    return Repository.write(file)
      .then( (contentMetadata) => DocumentStore.insert({
        "name" : name,
        "tags" : tags,
        "content" :contentMetadata
      })
    );
  }
}

export default new DocumentsService();