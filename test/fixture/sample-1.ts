export default {
    "tags" : [
        { "_id" : "1", "id" : "ID1", "name" : "tagName 1" },
        { "_id" : "2", "id" : "ID2", "name" : "tagName 2" }
    ],
    "documents" : [
        {
            "_id" : "1",
            "name" : "document 1",
            "tags" : [],
            "content" : {
                "path" : "/a/b/c",
                "originalName" : "orig-doc.txt",
                "size" : 1234,
                "mimeType" : "application/txt"
            }
        }
    ]
}