const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")
const uploadToCloudinary = require("../../utils/upload")
const cloudinary = require("../../config/cloudinary")


const createDocumentService = async (order_id, file, user) => {

  if (Number.isNaN(order_id)) {
    throw new AppError("Invalid Order ID", 400)
  }

  if (!file) {
    throw new AppError("File is required", 400)
  }

  const order = await prisma.order.findUnique({
    where: { order_id }
  })

  if (!order) {
    throw new AppError("Order not found", 404)
  }

  // upload cloudinary
  const result = await uploadToCloudinary(file)

  // lưu DB
  const doc = await prisma.document.create({
    data: {
      order_id,
      doc_name: file.originalname,
      file_url: result.secure_url,
      public_id: result.public_id,
      uploaded_by: user.user_id,
      is_uploaded: true
    }
  })

  return doc
}

const getDocumentService = async (order_id, page, limit) => {
    if (Number.isNaN(order_id)) {
        throw new AppError("Invalid Order ID", 400)
    }

    const order = await prisma.order.findFirst({
        where: { 
            order_id,
            is_deleted: false
        }
    })

    if (!order) {
        throw new AppError("Order not found", 404)
    }

    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50)
    const skip = (safePage - 1) * safeLimit

    const [docs, total] = await Promise.all([
        prisma.document.findMany({
            where: {
                order_id,
                is_deleted: false
            },
            skip,
            take: safeLimit,
            orderBy: {
                created_at: "desc"
            }
        }),

        prisma.document.count({
            where: {
                order_id,
                is_deleted: false
            }
        })
    ])

    return {
        documents: docs,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit)
        }
    }
}

const updateDocumentService = async(doc_id, data) => {
    if (Number.isNaN(doc_id)) {
        throw new AppError("Invalid Document ID", 400)
    }

    const doc = await prisma.document.findFirst({
        where: {
            doc_id,
            is_deleted: false
        }
    })

    if(!doc){
        throw new AppError("Document not found", 404)
    }

    const allowedFields = ["doc_name", "deadline"]

    const updateData = {}

    for (const field of allowedFields){
        if(data[field] !== undefined){
            updateData[field] = data[field]
        }
    }

    const updated = await prisma.document.update({
        where: {
            doc_id,
            is_deleted: false
        },
        data: updateData
    })

    return updated
}

const deleteDocumentService = async(doc_id) => {
    if (Number.isNaN(doc_id)) {
        throw new AppError("Invalid Document ID", 400)
    }

    const doc = await prisma.document.findFirst({
        where: {
            doc_id,
            is_deleted: false
        }
    })

    if(!doc){
        throw new AppError("Document not found", 404)
    }

    await cloudinary.uploader.destroy(doc.public_id)

    const deleted = await prisma.document.update({
        where: {doc_id},
        data: {
            is_deleted: true,
            deleted_at: new Date()
        }
    })

    return deleted
}
module.exports = { createDocumentService, getDocumentService, updateDocumentService, deleteDocumentService }