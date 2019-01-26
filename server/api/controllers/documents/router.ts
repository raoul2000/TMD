import express from 'express';
import controller from './controller'
import l from '../../../common/logger';

console.log(`loading ${__filename}`);


import multer from 'multer';
const uploadFolder = process.env['UPLOAD_PATH'] || 'upload';
l.info(`Upload Folder : ${uploadFolder}`);

const upload = multer({dest: uploadFolder });

export default express.Router()
    .post('/', upload.single('content') , controller.create)
    .get('/', controller.all)
    .get('/:id', controller.byId)
    .delete('/:id', controller.deleteById)
    .get('/:id/content', controller.content)
    .get('/:id/tags', controller.tags)
    .put('/:id/tags', controller.updateTags);