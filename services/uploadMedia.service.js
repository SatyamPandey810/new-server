const cloudinary = require("../config/cloudinary.config");

exports.uploadToCloudinary  = async ({ fileBuffer, folder = "my-media", resource_type = "auto" }) => {
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const stream = cloudinary.uploader.upload_stream(
      {
       folder ,
        resource_type,
        timestamp
      },
      (error, result) => {
      if (error) {
          console.error('Cloudinary Error:', error); // Log full error details
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer)
  });
};
