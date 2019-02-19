import { TMD } from '../../types';
import path from 'path';
import fse from 'fs-extra';
import L from '../logger';


export class Repository implements TMD.RepositoryInterface {
    private basePath:string = "";
    constructor(basePath:string = process.env['CONTENT_ROOT_PATH']) {
        if( ! path.isAbsolute(basePath)) {            
            this.basePath = path.resolve(basePath);
        } else {
            this.basePath = basePath;
        }
        L.info(`repository initialized : basePath = ${this.basePath}`);
    }

    getAbsolutePath(currentPath:string):string {
        return path.resolve(this.basePath, currentPath);
    }
    
    write(file: Express.Multer.File): Promise<TMD.ContentMetadata> {
        const destFilePath = path.join(process.env['CONTENT_ROOT_PATH'], file.filename);

        // currently all content files are saved under the CONTENT folder (no subfolder)
        return fse.move(file.path, destFilePath)
            .then(() => ({
                "path" : file.filename,
                "originalName" : file.originalname,
                "mimeType" : file.mimetype,
                "size" : file.size
            }));
    }
}

export default new Repository();