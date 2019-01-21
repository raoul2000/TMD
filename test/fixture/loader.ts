import DocumentStore from '../../server/common/stores/document.store';
import TagStore from '../../server/common/stores/tag.store';

export default (fixture) => DocumentStore.deleteAll()
    .then(() => TagStore.deleteAll())
    .then(() => TagStore.getImplementation().insert(fixture.tags))
    .then(() => DocumentStore.getImplementation().insert(fixture.documents));