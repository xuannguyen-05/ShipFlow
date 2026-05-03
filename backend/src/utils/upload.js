const cloudinary = require("../config/cloudinary.js")

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (err, result) => {
        if (err) return reject(err)
        resolve(result)
      }
    ).end(file.buffer)
  })
}


module.exports = uploadToCloudinary