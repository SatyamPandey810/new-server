const { createFeedService, uploadToCloudinary } = require("../services/uploadMedia.service")

exports.handleUpload  = async (req, res) => {
  try {
    const file  = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const resource_type = file.mimetype.startsWith("video") ? "video" : "image";

    const uploadResult = await uploadToCloudinary({
      fileBuffer: file.buffer,
      folder: "my-media",
      resource_type
    });

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message,
    });
  }
};
