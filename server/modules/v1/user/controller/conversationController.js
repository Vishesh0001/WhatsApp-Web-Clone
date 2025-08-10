const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');
const common = require('../../../../utilities/common');
const responsecode = require('../../../../utilities/response-error-code');
const Message = require('../models/Messages');
const Conversation = require('../models/Conversation');
module.exports = {
  async getConversations(req, res) {
    try {
      const role = await common.getRoleFromToken(req);
      const userId = await common.getIdFromToken(req);

      const response = await conversationModel.getConversationsByUserRole(role, userId);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }, 
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const role = await common.getRoleFromToken(req);
      const userId = await common.getIdFromToken(req);

      const response = await messageModel.getMessagesByConversationId(conversationId, userId, role);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  },

  async sendMessage(req, res) {
    try {
      const role = await common.getRoleFromToken(req);
      const userId = await common.getIdFromToken(req);
      const body = await common.decodeBody(req.body)
      const conversationId = body.conversationId
      const content = body.content

// console.log(body,content,conversationId);

      if (!conversationId || !content) {
        return common.sendResponse(req, res, 0, { keyword: "Missing required fields" }, {}, 400);
      }

      const response = await messageModel.sendMessage(conversationId, userId, content);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  },
};
