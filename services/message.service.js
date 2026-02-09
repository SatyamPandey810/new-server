const { mongoose } = require("mongoose");
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

exports.createMessage = async ({
  senderId,
  receiverId,
  conversationId,
  text,
  media = [],
  io,
}) => {
  // validate ids
  if (conversationId && !mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new Error("Inavlid ConversationId");
  }

  let conversation = null;
  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
  }

  // for 1:1 conversation if not found
  if (!conversation) {
    conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
  }

  const message = await Message.create({
    conversationId: conversation._id,
    sender: senderId,
    receiver: receiverId,
    text,
    media,
    seenby: [senderId],
  });

  conversation.lastMessage = message._id;
  await conversation.save();



  // Emit to all sockets in conversation room (online users)
  if (io) {
    io.to(conversation._id.toString()).emit("newMessage", message);
    io.to(senderId.toString()).emit("newMessage", message); // sender ke liye bhi emit
    if (receiverId)
      io.to(receiverId.toString()).emit("newMessageNotification", message);
  }

  return message;
};

exports.getConversationMessages = async ({
  conversationId,
  limit = 50,
  skip = 0,
}) => {
  const messages = await Message.find({ conversationId })
    .populate("sender", "username email phone")
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.reverse();
};



exports.markSeen = async ({ conversationId, userId, messageIds = [] }) => {
  const q = messageIds.length ? { _id: { $in: messageIds } } : { conversationId };
  await Message.updateMany(
    { ...q, seenBy: { $ne: userId } },
    { $push: { seenBy: userId } }
  );
};

exports.getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId
  })
    .populate("participants", "id fullName username email phone")
    .populate("lastMessage")
    .lean();

  return conversations.map(conv => {
    const otherUser = conv.participants.find(
      p => p._id.toString() !== userId.toString()
    );
    return {
      conversationId: conv._id,
      otherUser,
      lastMessage: conv.lastMessage || null,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    };
  });
};
