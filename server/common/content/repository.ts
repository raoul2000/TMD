import { TMD } from '../../types';
import path from 'path';
import fse from 'fs-extra';

export class Repository implements TMD.RepositoryInterface {
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

export default new Repository();