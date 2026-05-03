const asyncHandler = require("../../utils/asyncHandler")
const {createDocumentService, getDocumentService, updateDocumentService, deleteDocumentService} = require("./document.service")

const createDocument = asyncHandler(async(req, res) => {

    const order_id = +req.params.id 

    const doc = await createDocumentService(order_id, req.file, req.user)

    res.status(201).json({
        message: "Upload document successfully", 
        data: doc
    }) 
})

const getDocument = asyncHandler(async(req, res) => {

    const order_id = +req.params.id 
    const { page = 1, limit = 10 } = req.query

    const docs = await getDocumentService(order_id, page, limit)

    res.status(200).json({
        message: "Get documents successfully", 
        data: docs
    }) 
})

const updateDocument = asyncHandler(async(req, res) => {

    const doc_id = +req.params.id 

    const updated = await updateDocumentService(doc_id, req.body)

    res.status(200).json({
        message: "Update document successfully", 
        data: updated
    }) 
})

const deleteDocument = asyncHandler(async(req, res) => {

    const doc_id = +req.params.id 

    const deleted = await deleteDocumentService(doc_id)

    res.status(200).json({
        message: "Deleted document successfully", 
        data: deleted
    }) 
})


module.exports = {createDocument, getDocument, updateDocument, deleteDocument}