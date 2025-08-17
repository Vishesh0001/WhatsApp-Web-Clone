const { UserModel, User } = require('../models/user-model');
const common = require("../../../../utilities/common");
const responsecode = require("../../../../utilities/response-error-code");
// const userModel = require('../models/user-model');

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

  async getprofile(req, res) {
    try {
      const id = await common.getWaIdFromToken(req);
      let response = await UserModel.getprofile(id);
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log("controller error", error.message);
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }
  async getchats(req, res) {
    try {
      const role = await common.getRoleFromToken(req);
      const wa_id = await common.getWaIdFromToken(req)
      let response = await UserModel.getRecentMessages(role,wa_id);
      // console.log('ff',role,wa_id);
      // res.send(response)
      common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log("controller error", error.message);
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }
  async getMessages(req,res){
    try {
      // let role = await common.getRoleFromToken(req);
      let wa_id = await common.decodeBody(req.body)
      let response = await UserModel.getConversations(wa_id)
      // console.log('response',response)
      // res.send(response)
         common.sendResponse(req, res, response.code, response.message, response.data, response.status);
    } catch (error) {
      console.log('cont err',error.message)
      common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: "txt_server_error" }, {}, 500);
    }
  }
}

module.exports = new user();