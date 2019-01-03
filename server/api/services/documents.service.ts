import L from '../../common/logger'


let id = 0;
interface Document {
  id: number,
  name: string
};

const examples: Document[] = [
    { id: id++, name: 'document 0' }, 
    { id: id++, name: 'document 1' }
];

export class DocumentsService {
  all(): Promise<Document[]> {
    L.info(examples, 'fetch all examples');
    return Promise.resolve(examples);
  }

  byId(id: number): Promise<Document> {
    L.info(`fetch document with id ${id}`);
    return this.all().then(r => r[id])
  }

  /**
   * 
   * @param name string 
   * @param file 
   */
  create(name: string, file:Express.Multer.File): Promise<Document> {
    L.info(`create document with name ${name}`);
    const document: Document = {
      id: id++,
      name
    };
    examples.push(document)
    return Promise.resolve(document);
  }
}

export default new DocumentsService();