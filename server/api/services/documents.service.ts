import L from '../../common/logger';
import DocumentStore from '../../common/stores/document.store';
import { TMD } from '../../types';
import Repository from '../../common/content/repository';
import TagStore from '../../common/stores/tag.store';
import TMDError from '../../common/error';
import { arrayContainsArray } from '../../common/helpers';
import TagsService from './tags.service';


console.log(`loading ${__filename}`);


export class DocumentsService {

  /**
   * Replaces the list of tag Ids assigned to the 'tags' property
   * with the corresponding list of tags object and returns the resulting document
   * 
   * @param doc the document object to process
   */
  expandTagId(doc: TMD.Document): Promise<TMD.Document> {
    if (!doc) {
      return Promise.resolve(doc);
    }
    L.debug('expanding tags');
    return TagStore.byId(doc.tags as string[])
      .then(tags => Object.assign(doc, { "tags": tags }));
  }

  all(query?: any): Promise<TMD.Document[]> {
    L.info(`fetch all documents. query = ${query}`);
    return DocumentStore.all(query)
      .then(docs => Promise.all(docs.map(this.expandTagId)));
  }

  byTags(tagIds: string[]): Promise<TMD.Document[]> {
    L.info(`fetch document with tags ${tagIds}`);
    let query: object = null;
    if (tagIds.length !== 0) {
      query = { "tags": { "$in": tagIds } };
    } else {
      query = { "tags": { "$size": 0 } };
    }

    return DocumentStore.all(query)
      .then(docs => {
        if (tagIds.length < 2) {
          return docs;
        }

        // check that doc.tags contains tagsIds
        return docs.filter(doc => arrayContainsArray(doc.tags, tagIds));
      })
      .then(docs => Promise.all(docs.map(this.expandTagId)));
  }

  byId(id: string): Promise<TMD.Document> {
    L.info(`fetch document with id ${id}`);
    return DocumentStore.byId(id)
      .then(this.expandTagId);
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
      .then(this.expandTagId)
      .catch((err) => {
        if (err.errorType && err.errorType == "uniqueViolated") {
          return Promise.reject(new TMDError('duplicate tag name', err));
        }
        return Promise.reject(err);
      });
  }


  /**
   * Insert one or more documents into the database.
   * There is one Document insertion per file in the `files` array, and all documents have the same 
   * set of tags assigned.
   * Existing Tags are provided as object having an `id` property. New tags have a `name`property only.
   * 
   * @param tags list of tags to associate to document(s)
   * @param files list of files representing the content of document(s)
   */
  create(tags: TMD.Tag[], files: Express.Multer.File[]): Promise<TMD.Document[]> {

    let documentTagIds: string[];

    return TagsService.createMissingTags(tags)
      .then(results => {
        documentTagIds = results;
        // we want to return complete tag objects (not only id) in the list of document
        // inserted and that we return to caller
        return TagStore.byId(documentTagIds) as Promise<TMD.Tag[]>
      })
      .then(documentTags => Promise.all(files.map( file => Repository.write(file)))
        .then(contentMetadataList => {

          // prepare our document for insertion
          const documents: TMD.Document[] = files.map((file, index) => ({
            "tags": documentTagIds,   // for insert we only need tag ids
            "content": contentMetadataList[index]
          }));

          return DocumentStore.insert(documents)
            .then( insertedDocuments => insertedDocuments.map(doc => ({
              "tags": documentTags,   // remember that we want to return complet tag object
              "content": doc.content
            })));
        })
      )
  }

  getContent(docId: string): Promise<any> {
    return this.byId(docId)
      .then(doc => {
        return {
          "absolutePath": Repository.getAbsolutePath(doc.content.path),
          "originalName": doc.content.originalName,
          "contentType": doc.content.mimeType
        }
      });
  }
}

export default new DocumentsService();