import L from '../../common/logger';

interface Tag {
    id: string;
    name:string;
}

export class TagsService {

    all(): Promise<Tag[]> {
        L.info('fetch all tags');
        return Promise.resolve([
            { id : "ID1", name : "tagName1"}
        ]);
    }

    byId(id: string): Promise<Tag> {
        L.info(`fetch tag with id ${id}`);
        return Promise.resolve({
            "id" : 'ID2',
            "name" : "TagName2"
        });
    }
}

export default new TagsService();