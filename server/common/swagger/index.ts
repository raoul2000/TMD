import middleware from 'swagger-express-middleware';
import { Application } from 'express';
import path from 'path';

export default function (app: Application, routes: (app: Application) => void) {
  middleware(path.join(__dirname, 'Api.yaml'), app, function(err, middleware) {

    //routes(app);
    //return;
    
    // Enable Express' case-sensitive and strict options
    // (so "/entities", "/Entities", and "/Entities/" are all different)
    app.enable('case sensitive routing');
    app.enable('strict routing');

    app.use(middleware.metadata());
    
    app.use(middleware.files(app, {
      apiPath: process.env.SWAGGER_API_SPEC,
    }));
    
    // The Swagger Request Parser Middleware has been disabled
    // because of issues with multer module : uploading file failed
    // @see https://github.com/apigee-127/swagger-tools/issues/60
    // @see https://apidevtools.org/swagger-express-middleware/docs/middleware/parseRequest.html

    /*
    app.use(middleware.parseRequest({
      // Configure the cookie parser to use secure cookies
      cookie: {
        secret: process.env.SESSION_SECRET
      },
      // Don't allow JSON content over 100kb (default is 1mb)
      json: {
        limit: process.env.REQUEST_LIMIT
      }
    }));
    */

    // These two middleware don't have any options (yet)
    app.use(
      middleware.CORS(),
      middleware.validateRequest());

    // Error handler to display the validation error as HTML
    app.use(function (err, req, res, next) {
      res.status(err.status);
      res.send(
        '<h1>' + err.status + ' Error</h1>' +
        '<pre>' + err.message + '</pre>'
      );
    });

    routes(app);
  });
}
