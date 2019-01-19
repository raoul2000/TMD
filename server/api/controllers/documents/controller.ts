import DocumentsService from '../../services/documents.service';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export class Controller {
  all(req: Request, res: Response): void {
    DocumentsService.all().then(r => res.json(r));
  }

  byId(req: Request, res: Response): void {
    DocumentsService.byId(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(httpStatus.NOT_FOUND).end();
    });
  }

  deleteById(req: Request, res: Response): void {
    DocumentsService.deleteById(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(httpStatus.NOT_FOUND).end();
    });
  }

  create(req: Request, res: Response, next: NextFunction): void {
    console.log(req.file);
    console.log(req.body);

    // build tag Id list
    if( ! req.body.tags) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        "errorMessage" : "missing parameter 'tags"
      });
      return;
    }

    const tags = JSON.parse(req.body.tags).map( (tag) => {
      return tag;
    });
    /*
    const tags = req.body.tags.split(',')
      .map( tagId => tagId.trim())
      .filter( tagId => tagId.length !== 0);
    */
    // create the document
    DocumentsService.create(req.body.name, tags, req.file).then(r =>
      res
        .status(httpStatus.CREATED)
        .json(r),
    ).catch( err => {
      res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        "errorMessage" : err
      });
    });
  }
}

export default new Controller();
