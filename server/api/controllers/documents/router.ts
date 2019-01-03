import express from 'express';
import controller from './controller'
import { NextFunction } from 'connect';

import multer from 'multer';

const upload = multer({dest: 'uploads/'});

const rh = (req:any, res: any, next:NextFunction) => {
    debugger;
    let handler = upload.single('content');
    return handler(req, res,next);
};


export default express.Router()
    .post('/', upload.single('content') , controller.create)
    .get('/', controller.all)
    .get('/:id', controller.byId);