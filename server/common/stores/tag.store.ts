import L from '../logger';
import Nedb from 'nedb';
import DB from 'nedb-promise';


interface Tag {
    id: string;
    name:string;
}

export class TagStore {

    private store:any = null;

    initialize():Promise<any> {

        this.store = DB();
        return this.store.insert([
            { id : "ID0", name : "tagName0"},
            { id : "ID0", name : "tagName0"}
        ]);


        /*
        this.store = new Nedb();
        return new Promise( (resolve,reject) => {
            this.store.insert([
                { id : "ID0", name : "tagName0"},
                { id : "ID0", name : "tagName0"}
            ],(err,doc) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            })
        })*/
    }

    all(): Promise<Tag[]> {
        L.info('fetch all tags');
        return this.store.find({});
        /*
        return new Promise( (resolve, reject) => {

            this.store.find({}, (err, docs) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });*/
    }

    byId(id: string): Promise<Tag> {
        L.info(`fetch tag with id ${id}`);
        return Promise.resolve({
            "id" : 'ID2',
            "name" : "TagName2"
        });
    }
}

export default new TagStore();