import L from '../../common/logger';
import TagStore from '../../common/stores/tag.store';


interface Tag {
    id: string;
    name:string;
}

export class TagsService {

    all(): Promise<Tag[]> {
        L.info('fetch all tags');
        return TagStore.all();
    }

    byId(id: string): Promise<Tag> {
        L.info(`fetch tag with id ${id}`);
        return TagStore.byId(id);
    }
}

export default new TagsService();