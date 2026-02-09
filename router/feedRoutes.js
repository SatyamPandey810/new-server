const express = require('express');
const upload = require('../middleware/multer');
const { createFeedController, handleUpload } = require('../controller/uploadMedia.controller');
const router = express.Router()


router.post("/upload", upload.single("file"), handleUpload);

module.exports = {
    feedRouter: router
}
