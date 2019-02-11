
export declare namespace TMD {
    interface ConfigurationSettings {
        /**
         * Server port. By default a free port is picked by the system.
         */
        port: string | number;
        param1: string;
        /**
         * Base folder path where file contents are stored
         */
        basePath:string;
    }
    interface Tag {
        id?: string;
        name:string;
    }

    interface DocumentContent {
        /**
         * File content path relative to the basePath defined by the repository
         * that owns the document
         */
        path: string;
        /**
         * Filename provided at import
         */
        originalName: string;
        mimeType: string;
        size: number;
    }
    interface Document {
        id?: string;
        /**
         * List of tag Ids
         */
        tags: string[];
        note?:string;
        content: DocumentContent
    }

    interface StoredDocument extends Document {
        _id:string;
    }
    interface NedbDocument {
        _id:string;
    }

    interface RepositoryInterface {
        write(file: any ): Promise<ContentMetadata>;
    }
    interface ContentMetadata {
        path: string;
        originalName:string;
        mimeType : string;
        size : number;
    }
}