import express from 'express';
import controller from './controller'
import l from '../../../common/logger';

console.log(`loading ${__filename}`);


import multer from 'multer';
const uploadFolder = process.env['UPLOAD_PATH'] || 'upload';
l.info(`Upload Folder : ${uploadFolder}`);

const upload = multer({dest: uploadFolder });

export default express.Router()
    // create a Document
    .post('/', upload.single('content') , controller.create)

    // get all documents
    .get('/', controller.all)

    // get a document by id
    .get('/:id', controller.byId)

    // delete a document by id
    .delete('/:id', controller.deleteById)

    // get content of a document by id
    .get('/:id/content', controller.content)

    // get all tags related to a document given the document id
    .get('/:id/tags', controller.tags)

    // update tags for a document given its id
    .put('/:id/tags', controller.updateTags);