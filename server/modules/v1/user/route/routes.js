const express = require("express");
const userController = require("../controller/user");
const router = express.Router();
const conversationController = require('../controller/conversationController');
router.get("/users",userController.getUsers)
router.post('/login',userController.login)
router.get('/profilepic',userController.getprofilepic)

  router.get('/conversations', userController.getConversations);
  router.get('/conversations/:conversationId/messages', userController.getMessages);
router.post('/messages/send', conversationController.sendMessage);
// router.post('/messages/send', conversationController.sendMessage);

module.exports = router;  