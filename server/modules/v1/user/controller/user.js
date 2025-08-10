const userModel = require('../models/user-model')
const common = require("../../../../utilities/common")
const responsecode = require("../../../../utilities/response-error-code")
const { decode } = require('jsonwebtoken')
class User{


    async getUsers(req,res){
        try {
          // console.log('eelel');
        const id = await common.getRoleFromToken(req)
          let response = await userModel.getUsers(id)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          // ("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }

}
async login(req,res){
        try {
          console.log('rr',req.body);
          
          const request_data = await common.decodeBody(req.body)
            // console.log('Decoded body:', JSON.stringify(request_data, null, 2));  
          
          let response = await userModel.login(request_data)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          // ("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
}
async getprofilepic(req,res){
       try {
        // console.log('/hello',req.headers);
        
        const id = await common.getIdFromToken(req)
          let response = await userModel.getprofilepic(id)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          // ("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
}


}
      
    
    module.exports = new User();