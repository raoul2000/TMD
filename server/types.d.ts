
export declare namespace TMD {
    interface ConfigurationSettings {
        /**
         * Server port. By default a free port is picked by the system.
         */
        port: string | number;
        param1: string;
    }
    interface Tag {
        id?: string;
        name:string;
    }

    interface DocumentContent {
        path: string;
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