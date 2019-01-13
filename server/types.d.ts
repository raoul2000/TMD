
export declare namespace TMD {
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
        name: string;
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
}