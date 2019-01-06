import L from '../../common/logger';
import DocumentStore from '../../common/stores/document.store';
import {TMD} from '../../types';
import path from 'path';
import fse from 'fs-extra';

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
    L.info(`create document with name ${name}`);
    if( ! name ) {
      return Promise.reject("missing parameter 'name'");
    }
    
    const srcFilePath = file.path;
    const destFilePath = path.join(process.env['CONTENT_ROOT_PATH'],file.filename);

    return fse.move(srcFilePath,destFilePath)
      .then( () => DocumentStore.insert({
        "name" : name,
        "content" : {
          "path" : destFilePath,
          "originalName" : file.originalname,
          "mimeType" : file.mimetype,
          "size" : file.size
        }
      }));
  }
}

export default new DocumentsService();