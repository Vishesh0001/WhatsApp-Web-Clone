const { UserModel, User } = require('../models/user-model');
const common = require("../../../../utilities/common");
const responsecode = require("../../../../utilities/response-error-code");

class user {
  async getUsers(req, res) {
    try {
      const role = await common.getRoleFromToken(req);
      let response = await UserModel.getUsers(role);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log("controller error", error.message);
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }

  async login(req, res) {
    try {
      const request_data = await common.decodeBody(req.body);
      let response = await UserModel.login(request_data);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log("controller error", error.message);
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }

  async getprofilepic(req, res) {
    try {
      const id = await common.getIdFromToken(req);
      let response = await UserModel.getprofilepic(id);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log("controller error", error.message);
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }

  async getConversations(req, res) {
    try {
      const userId = await common.getIdFromToken(req);
      const role = await common.getRoleFromToken(req);
      // const wa_id = await common.getWaIdFromToken(req);
      const user = await User.findOne({ _id: userId });
      if (!user) {
        console.log('No user found for userId:', userId);
        return common.sendResponse(req, res, 0, { keyword: 'No user found' }, {}, 400);
      }
      // console.log('Fetching conversations with:', { userId, role, wa_id });
      let response = await UserModel.getConversations(userId, role);
      console.log('getConversations response:', response);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log('controller error', error.message);
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }

  async getMessages(req, res) {
    try {
      const userId = await common.getIdFromToken(req);
      const role = await common.getRoleFromToken(req);
      // const wa_id = await common.getWaIdFromToken(req);
      const user = await User.findById(userId);
      if (!user) {
        console.log('No user found for userId:', userId);
        return common.sendResponse(req, res, 0, { keyword: 'No user found' }, {}, 400);
      }
      const conversationId = req.params.conversationId;
      // console.log('Fetching messages with:', { conversationId, userId, role, wa_id });
      let response = await UserModel.getMessages(conversationId, userId, role);
      console.log('getMessages response:', response);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log('controller error', error.message);
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }
}

module.exports = new user();