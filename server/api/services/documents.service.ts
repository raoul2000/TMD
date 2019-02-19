import L from '../../common/logger';
import DocumentStore from '../../common/stores/document.store';
import { TMD } from '../../types';
import Repository from '../../common/content/repository';
import TagStore from '../../common/stores/tag.store';
import TMDError from '../../common/error';
import {arrayContainsArray} from '../../common/helpers';

console.log(`loading ${__filename}`);


export class DocumentsService {

  /**
   * Replaces the list of tag Ids assigned to the 'tags' property
   * with the corresponding list of tags object and returns the resulting document
   * 
   * @param doc the document object to process
   */
  expandTagId(doc: TMD.Document): Promise<TMD.Document> {
    if( ! doc ) {
      return Promise.resolve(doc);
    }
    L.debug('expanding tags');
    return TagStore.byId(doc.tags)
      .then(tags => Object.assign(doc, { "tags": tags }));
  }

  all(query?:any): Promise<TMD.Document[]> {
    L.info(`fetch all documents. query = ${query}`);
    return DocumentStore.all(query)
      .then( docs => Promise.all( docs.map( this.expandTagId )));
  }

  byTags(tagIds:string[]) : Promise<TMD.Document[]> {
    L.info(`fetch document with tags ${tagIds}`);
    let query:object = null;
    if(tagIds.length !== 0) {
      query = { "tags" : { "$in" : tagIds}};
    } else {
      query = { "tags" : { "$size" : 0 }};
    }

    return DocumentStore.all(query)
      .then( docs => {
        if( tagIds.length < 2) {
          return docs;
        }

        // check that doc.tags contains tagsIds
        return docs.filter( doc => arrayContainsArray(doc.tags, tagIds));
      })
      .then( docs => Promise.all( docs.map( this.expandTagId )));
  }

  byId(id: string): Promise<TMD.Document> {
    L.info(`fetch document with id ${id}`);
    return DocumentStore.byId(id)
      .then( this.expandTagId );
  }

  deleteById(id: string): Promise<number> {
    L.info(`delete document with id ${id}`);
    return DocumentStore.deleteById(id);
  }

  updateTags(id: string, tags: TMD.Tag[]): Promise<TMD.Document> {
    L.info(`update tags for document with id ${id}`);
    // we should validate tags schema

    // only tags with no id must be inserted
    const tagToInsert = tags.filter(tag => !tag.id);

    return TagStore.insert(tagToInsert)
      // merge inserted tag with the ones already inserted
      .then(result => {
        let newInsertedTags = !Array.isArray(result) ? [result] : result;
        return newInsertedTags.concat(tags.filter(tag => tag.id)).map(tag => tag.id);
      })
      // updates the tag property of the document given its id
      .then(documentTagIds => DocumentStore.updateTags(id, documentTagIds))
      .then( this.expandTagId )
      .catch((err) => {
        if (err.errorType && err.errorType == "uniqueViolated") {
          return Promise.reject(new TMDError('duplicate tag name', err));
        }
        return Promise.reject(err);
      });
  }

  /**
   * 
   * @param file 
   */
  create(tags: TMD.Tag[], file: Express.Multer.File): Promise<TMD.Document[] | TMD.Document> {

    // we should validate tags schema

    // get from the tag list, all tags that are not already stored
    const tagToInsert = tags.filter(tag => !tag.id);

    // store tags linked assigned to the document
    let documentTagIds = null;
    return TagStore.insert(tagToInsert)
      .catch(err => {
        return Promise.reject(new TMDError('failed to insert tag', err));
      })
      .then(result => {
        let newInsertedTags = !Array.isArray(result) ? [result] : result;
        documentTagIds = newInsertedTags.concat(tags.filter(tag => tag.id)).map(tag => tag.id);
        return true;
      })
      .then(() => Repository.write(file))
      .then(contentMetadata => DocumentStore.insert({
        "tags": documentTagIds,
        "content": contentMetadata
      }))
      .then( this.expandTagId );
  }

  getContent(docId:string): Promise<any> {
    return this.byId(docId)
      .then( doc => {
        return {
          "absolutePath": Repository.getAbsolutePath(doc.content.path),
          "originalName": doc.content.originalName,
           "contentType": doc.content.mimeType
        }
      });
  }
}

export default new DocumentsService();