import './common/env';
import os from 'os';
import Server from './common/server';
import routes from './routes';
import TagStore from './common/stores/tag.store';
import path from 'path';
import config, {load as loadconfig}  from './common/config';

const DEFAULT_CONFIG_PATH:string = os.homedir();

process.env["NODE_CONFIG_DIR"] = __dirname + "/conf";

console.log(config());
console.log(loadconfig(path.join(__dirname, 'conf')));
console.log(config());
console.log(config().has('setting'));
console.log(config().get('object.param1'));
console.log(config().get('object.param22'));

TagStore.initialize({ filename: path.join(__dirname,'../tmp/store/tag-store.json'), autoload: true });

const port = parseInt(process.env.PORT);
export default new Server()
  .router(routes)
  .listen(port);
