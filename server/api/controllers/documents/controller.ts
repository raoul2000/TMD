import DocumentsService from '../../services/documents.service';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const upload = multer({dest: 'uploads/'});

export class Controller {
  all(req: Request, res: Response): void {
    DocumentsService.all().then(r => res.json(r));
  }

  byId(req: Request, res: Response): void {
    DocumentsService.byId(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  create(req: Request, res: Response, next: NextFunction): void {
    console.log(req.file);
    DocumentsService.create(req.body.name, req.file).then(r =>
      res
        .status(201)
        .location(`<%= apiRoot %>/documents/${r.id}`)
        .json(r),
    );
  }
}
export default new Controller();
