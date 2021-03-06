import path from 'path';

export default {
    "tags" : [
        { "_id" : "1", "name" : "tagName 1" },
        { "_id" : "2", "name" : "tagName 2" },
        { "_id" : "3", "name" : "tagName 3" }
    ],
    "documents" : [
        {
            "_id" : "1",
            "name" : "document 1",
            "tags" : [ "1", "2"],
            "content" : {
                "path" : path.join(__dirname, '..','api', 'documents', 'content-file', 'file-1.md'),
                "originalName" : "orig-doc.txt",
                "size" : 1234,
                "mimeType" : "application/txt"
            }
        },
        {
            "_id" : "2",
            "name" : "document 2",
            "tags" : [ "2", "3"],
            "content" : {
                "path" : path.join(__dirname, '..','api', 'documents', 'content-file', 'file-2.md'),
                "originalName" : "orig-doc.txt",
                "size" : 1234,
                "mimeType" : "application/txt"
            }
        }
    ]
}