const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    media: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video", "audio", "gif", "other"],
        },
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],

    shares: {
      type: Number,
      default: 0,
    },

    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
const feedModel = mongoose.model("feed", feedSchema);
module.exports = feedModel;
