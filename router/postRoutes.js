

const express = require('express');
const { createPostController, updatePostController, getAllPostController, getPostByIdController, deletePostConstroller, createPostWithUploadController, getAllPostByAllUsersController } = require('../controller/post.controller');
const authToken = require('../middleware/authToken');
const { getPostByIdService } = require('../services/post.service');
const upload = require('../middleware/multer');
const router = express.Router()


router.post("/createPost", authToken, createPostController );
// router.post("/createPost", upload.single("file"), createPostWithUploadController);



router.get("/getAllPost", authToken, getAllPostController);
router.get("/getAllPostByAllUsers", getAllPostByAllUsersController);
router.get("/getPostDetails/:id", authToken, getPostByIdController);
router.patch("/updatePost/:id", authToken, updatePostController);
router.delete("/postDelete/:id", authToken, deletePostConstroller);

module.exports = {
   postRouter: router
}