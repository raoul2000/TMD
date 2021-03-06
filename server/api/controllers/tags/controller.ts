import TagsService from '../../services/tags.service';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import TMDError from '../../../common/error';

export class Controller {

  all(req: Request, res: Response): void {
    TagsService.all().then(r => res.json(r));
  }

  byId(req: Request, res: Response): void {
    TagsService.byId(req.params.id).then(r => {
      if (r) res.json(r);
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`tag not found (id = ${req.params.id})`));
    });
  }

  deleteById(req: Request, res: Response): void {
    TagsService.deleteById(req.params.id).then(r => {
      if (r !== 0) res.end();
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`tag not found (id = ${req.params.id})`));
    });
  }

  create(req: Request, res: Response, next: NextFunction): void {
    console.log(JSON.stringify(req.body));
    // create the tag
    TagsService.create(req.body).then(r =>
      res
        .status(httpStatus.CREATED)
        .json(r),
    ).catch( err => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(err);
    });
  }
}
export default new Controller();
