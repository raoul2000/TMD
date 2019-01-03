import TagsService from '../../services/tags.service';
import { Request, Response } from 'express';

export class Controller {
  all(req: Request, res: Response): void {
    debugger;
    TagsService.all().then(r => res.json(r));
  }

  byId(req: Request, res: Response): void {
    TagsService.byId(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }
}
export default new Controller();
