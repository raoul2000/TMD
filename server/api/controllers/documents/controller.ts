import L from '../../../common/logger';
import DocumentsService from '../../services/documents.service';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import fse from 'fs-extra';
import fs from 'fs';
import TMDError from '../../../common/error';

export class Controller {
  all(req: Request, res: Response): void {
    DocumentsService.all().then(r => res.json(r));
  }

  byId(req: Request, res: Response): void {
    DocumentsService.byId(req.params.id).then(r => {

      if (r) res.json(r);
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`document not found (id = ${req.params.id})`));
    });
  }

  tags(req: Request, res: Response): void {
    DocumentsService.byId(req.params.id).then(r => {
      if (r) res.json(r.tags);
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`document not found (id = ${req.params.id})`));
    });
  }

  content(req: Request, res: Response): void {
    DocumentsService.byId(req.params.id).then(r => {
      if (r) {
        res.download(r.content.path, r.content.originalName);
      }
      else res.status(httpStatus.NOT_FOUND).end();
    });
  }

  deleteById(req: Request, res: Response): void {
    DocumentsService.deleteById(req.params.id).then(r => {
      if (r !== 0) res.end();
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`tag not found (id = ${req.params.id})`));
    });
  }


  updateTags(req: Request, res: Response): void {
    DocumentsService.updateTags(req.params.id, req.body).then(r => {
      if (r) res.json(r);
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`tag not found (id = ${req.params.id})`));
    }).catch(err => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(err);
    });;
  }

  create(req: Request, res: Response, next: NextFunction): void {
    //console.log(req.file);
    //console.log(req.body);

    // build tag Id list
    if (!req.body.tags) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(new TMDError("missing parameter 'tags"));
      return;
    }

    const tags = JSON.parse(req.body.tags);

    // Promisify fs.unlink
    const unlink = (path) => new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // delete uploaded file from local FS
    const deleteUploadFile = () => unlink(req.file.path)
      .catch(err => {
        L.error(`failed to delete uploaded file : ${req.file.path}`);
        return Promise.resolve(); // always resolved
      });

    // send success Response
    const sendSuccessResponse = (insertedDoc) => res
      .status(httpStatus.CREATED)
      .json(insertedDoc);

    // send error Response
    const sendErrorResponse = (err) => res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(err);

    // create the document
    DocumentsService
      .create(req.body.name, tags, req.file)
      .then(
        (insertedDoc) => {
          return deleteUploadFile()
            .then(() => sendSuccessResponse(insertedDoc));
        },
        (error) => {
          return deleteUploadFile()
            .then(() => sendErrorResponse(error));
        }
      );
  }
}

export default new Controller();
