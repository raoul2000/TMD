import L from '../../common/logger';
import TagStore from '../../common/stores/tag.store';
import {TMD} from '../../types';


export class TagsService {

    all(): Promise<TMD.Tag[]> {
        L.info('fetch all tags');
        return TagStore.all();
    }

    byId(id: string): Promise<TMD.Tag> {
        L.info(`fetch tag with id ${id}`);
        return TagStore.byId(id);
    }
}

export default new TagsService();