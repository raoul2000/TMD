import L from '../../../common/logger';
import DocumentsService from '../../services/documents.service';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import fs from 'fs';
import TMDError from '../../../common/error';
import path from 'path';
import ExpressServer from '../../../common/server';
import TagsService from '../../services/tags.service';

console.log(`loading ${__filename}`);

export class Controller {
  /**
   * Returns all documents.
   * 
   * @param req request
   * @param res response
   */
  all(req: Request, res: Response): void {
    let q: any = null,
      validQuery: boolean = true,
      tagIds: string[] = [];

    // processing the TAGS query selector
    // Allowed formats :
    //
    // ...&tags=id1,id3,id4
    // ...&tags=id1&tags=id3&tags=id4
    //    All document with at least the given tags
    //
    // ...&tags= 
    //    All document with no tag
    if (req.query.hasOwnProperty('tags')) {
      if (typeof req.query.tags === 'string') {
        let str: string = req.query.tags as string;
        tagIds = str.split(',').map(tag => tag.trim()).filter(tag => tag.length);
      }
      else if (Array.isArray(req.query.tags)) {
        tagIds = req.query.tags as Array<string>;
      }
      L.debug('tags query', tagIds);
      DocumentsService.byTags(tagIds).then(r => res.json(r));
      return;
    }

    // parse the query param into an object
    // NOTE : if the TAGS query selector is set, ignore the QUERY param
    if (q === null && req.query.hasOwnProperty('query')) {
      try {
        q = JSON.parse(req.query.query);
      } catch (error) {
        validQuery = false;
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(new TMDError("query is not a valid JSON object", error));
      }
    }

    if (validQuery) {
      L.debug('query = ', JSON.stringify(q));
      DocumentsService.all(q).then(r => res.json(r));
    }
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
    DocumentsService.getContent(req.params.id)
      .then(content => {
        L.debug("document content descriptor", content);
        const { absolutePath, originalName, contentType } = content;
        if (req.query.download) {
          res.download(absolutePath, originalName);
        } else {
          res.sendFile(absolutePath, {
            "headers": {
              "Content-Type": contentType
            }
          });
        }
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(err);
      });
  }

  deleteById(req: Request, res: Response): void {
    DocumentsService.deleteById(req.params.id).then(r => {
      if (r !== 0) res.end();
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`document not found (id = ${req.params.id})`));
    });
  }


  updateTags(req: Request, res: Response): void {
    DocumentsService.updateTags(req.params.id, req.body).then(r => {
      if (r) res.json(r);
      else res
        .status(httpStatus.NOT_FOUND)
        .json(new TMDError(`document not found (id = ${req.params.id})`));
    }).catch(err => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(err);
    });
  }


  /**
   * CReate a new document.
   * 
   * @param req the client request
   * @param res service response
   * @param next next middleware
   */
  createSingle(req: Request, res: Response, next: NextFunction): void {
    //console.log(req.file);
    //console.log(req.body);
    debugger;
    // build tag Id list
    if (!req.body.tags) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(new TMDError("missing parameter 'tags"));
      return;
    }
    // TODO: rewrite this function to accept an array of files
    /**
       [{
          destination: "tmp/upload"
          encoding: "7bit"
          fieldname: "content"
          filename: "e92191c0c3f65811605e72522515f9d3"
          mimetype: "image/jpeg"
          originalname: "140.jpg"
          path: "tmp\upload\e92191c0c3f65811605e72522515f9d3"
          size: 8053
      }, ...]
     */

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
      .create(tags, req.file)
      .then(
        (insertedDoc) => deleteUploadFile().then(() => sendSuccessResponse(insertedDoc)),
        (error) => deleteUploadFile().then(() => sendErrorResponse(error))
      );
  }


  create(req: Request, res: Response, next: NextFunction): void {

    // build tag Id list
    if (!req.body.tags) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(new TMDError("missing parameter 'tags"));
      return;
    }
    // prepare tags
    const tags = JSON.parse(req.body.tags);

    // process file argument
    let files: Express.Multer.File[] = [];
    if (req.file) {
      files = [req.file];
    } else if (req.files && Array.isArray(req.files)) {
      files = req.files;
    }

    /**
       [{
          destination: "tmp/upload"
          encoding: "7bit"
          fieldname: "content"
          filename: "e92191c0c3f65811605e72522515f9d3"
          mimetype: "image/jpeg"
          originalname: "140.jpg"
          path: "tmp\upload\e92191c0c3f65811605e72522515f9d3"
          size: 8053
      }, ...]
     */

    // delete uploaded file from local FS
    const deleteUploadedFile = (filePath: string) => new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          L.warn(`failed to delete uploaded file : ${filePath}`);
        }
        resolve(true);  // always resolved
      })
    });

    // TODO: Tags must be created first and documents inserted with tag ids
    //TagsService.create(tags);

    Promise.all(
      files.map(file => DocumentsService
        .create(tags, file)
        .then((newDoc) => deleteUploadedFile(file.path).then(() => newDoc))
      )
    )
      .then(newDocs => res.status(httpStatus.CREATED).json(newDocs))
      .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err));
  }
}

export default new Controller();
