const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversation",
    requried: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    requried: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
    trim: true,
  },
  media: [
    {
      type: String,
    },
  ],
  seenby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
