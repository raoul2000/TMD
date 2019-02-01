import express from 'express';
import { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import { AddressInfo } from 'net';


console.log(`loading ${__filename}`);

l.debug('__NEW APP EXPRESS__');
const app = express();

export default class ExpressServer {

  private server:http.Server = null;;

  constructor() {
    l.debug('__NEW EXPRESS SERVER__');
    
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
  }

  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }


  /**
   * Start the server.
   * @param port if not set, grab an arbitrary unused port
   */
  listen(port?: string | number): Application {    
    this.server = http.createServer(app).listen(port || 0, () => {
      const info = this.server.address() as AddressInfo;
      l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port ${info.port}`);
    });
    return app;
  }

  stop(): Promise<boolean> {
    if( !this.server ) {
      return Promise.reject(new Error('no server instance available'));
    }

    return new Promise( (resolve, reject) => {
      try {
        this.server.close( () => resolve(true));
      } catch (error) {
        reject(error);
      }
    });
  }
}
