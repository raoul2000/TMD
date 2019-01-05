import L from '../../common/logger';
import DocumentStore from '../../common/stores/document.store';
import {TMD} from '../../types';



export class DocumentsService {

  all(): Promise<TMD.Document[]> {
      L.info('fetch all documents');
      return DocumentStore.all();
  }

  byId(id: string): Promise<TMD.Document> {
      L.info(`fetch document with id ${id}`);
      return DocumentStore.byId(id);
  }

  /**
   * 
   * @param name string 
   * @param file 
   */
  create(name: string, file:Express.Multer.File): Promise<TMD.Document[] | TMD.Document> {
    L.info(`NOT IMPLEMENTED : create document with name ${name}`);
    return DocumentStore.insert({
      "name" : name,
      "content" : {
        "originalName" : file.originalname,
        "mimeType" : file.mimetype,
        "size" : file.size
      }
    });
  }
}

export default new DocumentsService();