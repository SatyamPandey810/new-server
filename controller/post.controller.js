const feedModel = require("../models/feeds.model");
const {
  postService,
  updatePostService,
  getAllPostService,
  getPostByIdService,
  createPostWithUploadService,
  getAllPostByAllUsersService,
} = require("../services/post.service");

exports.createPostController = async (req, res) => {
  try {
    const data = await postService(req);

    res.status(200).json({
      message: "Post created successfully",
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};



exports.getAllPostController = async (req, res) => {
  try {
    const data = await getAllPostService(req);

    res.status(200).json({
      message: "All Posts Are Fetch successfully",
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};



exports.getAllPostByAllUsersController = async (req, res) => {
  try {
    const data = await getAllPostByAllUsersService(req);

    res.status(200).json({
      message: "All Posts Are Fetch successfully",
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

exports.getPostByIdController = async (req, res) => {
  try {
    const data = await getPostByIdService(req.params.id);

    res.status(200).json({
      message: "Post Details Fetch successfully",
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

exports.updatePostController = async (req, res) => {
  try {
    const data = await updatePostService(req.body, req.params.id);

    res.status(200).json({
      message: "Post Updated successfully",
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

exports.deletePostConstroller = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await feedModel.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No post is found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
