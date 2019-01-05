
export declare namespace TMD {
    interface Tag {
        id?: string;
        name:string;
    }

    interface DocumentContent {
        originalName: string;
        mimeType: string;
        size: number;
    }
    interface Document {
        id?: string;
        name: string;
        note?:string;
        content: DocumentContent
    }
}