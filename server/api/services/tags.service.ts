import L from '../../common/logger';
import TagStore from '../../common/stores/tag.store';
import { TMD } from '../../types';


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
      * 
      * @param name string 
      * @param file 
      */
    create(name: string): Promise<TMD.Tag[] | TMD.Tag> {
        L.info(`create tag with name ${name}`);
        if (!name) {
            return Promise.reject("missing parameter 'name'");
        }
        name = name.trim();
        if (name.length === 0) {
            return Promise.reject("invalid parameter 'name'");
        }

        return TagStore.insert({
            "name": name
        });
    }
}

export default new TagsService();