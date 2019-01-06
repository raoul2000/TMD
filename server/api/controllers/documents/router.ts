import express from 'express';
import controller from './controller'
import l from '../../../common/logger';


import multer from 'multer';
const uploadFolder = process.env['UPLOAD_PATH'] || 'ipload';
l.info(`Upload Folder : ${uploadFolder}`);

const upload = multer({dest: uploadFolder });

export default express.Router()
    .post('/', upload.single('content') , controller.create)
    .get('/', controller.all)
    .get('/:id', controller.byId);