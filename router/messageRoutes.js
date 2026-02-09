const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken');
const messageController = require('../controller/message.controller');

router.post('/sendmessage/:receiverId', authToken, messageController.sendMessageController);
router.get('/getmessages/:id', authToken, messageController.getMessagesController);
router.patch('/seen/:conversationId', authToken, messageController.markSeenController);
router.get("/getconversations", authToken, messageController.getMyConversationsController)




module.exports = {
   messageRouter: router
}
