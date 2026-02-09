const MessageService = require('../services/message.service');
const { getIo } = require('../socket/socket');

exports.sendMessageController = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId; // optional if body contains conversationId
    const { text, conversationId, media } = req.body;
    console.log("cc-----",req.body);
    

    const io = getIo();
    const message = await MessageService.createMessage({ senderId, receiverId, conversationId, text, media, io });

    return res.status(200).json({ success: true, data: message });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMessagesController = async (req, res) => {
  try {
    const conversationId = req.params.id;

    const { limit = 50, skip = 0 } = req.query;
    const messages = await MessageService.getConversationMessages({ conversationId, limit: Number(limit), skip: Number(skip) });

    return res.status(200).json({ success: true, data: messages });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.markSeenController = async (req, res) => {
  try {
    const userId = req.userId;
    const conversationId = req.params.conversationId;
    const { messageIds = [] } = req.body;
    await MessageService.markSeen({ conversationId, userId, messageIds });
    // emit via socket
    const io = getIo();
    io.to(conversationId).emit('messagesSeen', { conversationId, messageIds, userId });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyConversationsController = async (req, res) => {
  try {
    const userId = req.userId; 
    const conversations = await MessageService.getUserConversations(userId);

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
