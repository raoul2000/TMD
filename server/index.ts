import './common/env';
import Server from './common/server';
import routes from './routes';
import TagStore from './common/stores/tag.store';
import path from 'path';

const port = parseInt(process.env.PORT);


TagStore.initialize({ filename: path.join(__dirname,'../tmp/store/tag-store.json'), autoload: true });

export default new Server()
  .router(routes)
  .listen(port);
