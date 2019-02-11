import { TMD } from '../../types';
import path from 'path';
import fse from 'fs-extra';
import conf from '../conf';
import L from '../logger';



export class Repository implements TMD.RepositoryInterface {
    private basePath:string = "";
    constructor(basePath:string) {
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
        const srcFilePath = file.path;
        const destFilePath = path.join(process.env['CONTENT_ROOT_PATH'], file.filename);

        return fse.move(srcFilePath, destFilePath)
            .then(() => ({
                "path" : destFilePath,
                "originalName" : file.originalname,
                "mimeType" : file.mimetype,
                "size" : file.size
            }));
    }
}

export default new Repository(conf.read().basePath);