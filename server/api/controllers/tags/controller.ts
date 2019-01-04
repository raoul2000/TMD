import TagsService from '../../services/tags.service';
import { Request, Response } from 'express';
import config from '../../../common/config';


export class Controller {
  all(req: Request, res: Response): void {
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
