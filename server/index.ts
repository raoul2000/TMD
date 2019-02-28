import './common/env';
import conf from './common/conf';
import Server from './common/server';
import routes from './routes';
import TagStore from './common/stores/tag.store';
import DocumentStore from './common/stores/document.store';
import path from 'path';


conf.init({
  "port" : 7777,
  "basePath" : "C:\\dev\\ws\\lab\\TMD"
});


TagStore.initialize({ filename: path.join(__dirname,'../tmp/store/tag-store.json'), autoload: true });
DocumentStore.initialize({ filename: path.join(__dirname,'../tmp/store/document-store.json'), autoload: true });


/*
const server = new Server();
server.listen('1234');

setTimeout( () => {
  server.stop().then( () => console.log('server closed'));
},2000);
*/

const port = parseInt(process.env.PORT);
export default new Server()
  .router(routes)
  .listen(port);

