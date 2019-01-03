import './common/env';
import Server from './common/server';
import routes from './routes';
import TagStore from './common/stores/tag.store';

const port = parseInt(process.env.PORT);


TagStore.initialize();
/*
TagStore.initialize()
  .then( () => {
    new Server()
      .router(routes)
      .listen(port);
  })
  .catch( (err) => {
    console.error('failed to start server');
    console.error(err);
  });
*/

export default new Server()
  .router(routes)
  .listen(port);
