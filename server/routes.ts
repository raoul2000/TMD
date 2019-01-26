import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router'
import tagsRouter from './api/controllers/tags/router';
import documentsRouter from './api/controllers/documents/router';

console.log(`loading ${__filename}`);

export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/tags', tagsRouter);
  app.use('/api/v1/documents', documentsRouter);
};