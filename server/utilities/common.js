require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require("../config/database")
const crypto = require('crypto');
// const { log } = require('console');

const key = Buffer.from(process.env.HASH_KEY, 'hex');
const iv = Buffer.from(process.env.HASH_IV, 'hex');

class Common{ 
  encrypt(data) {
    try {
      if (!data) return null;
      const dataStr = typeof data === 'object' ? JSON.stringify(data) : data;
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(dataStr, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (err) {
      console.error('Encryption error:', err);
      return null;
    }
  }
  
async decrypt(encryptedData) {
  try {
    if (!encryptedData) return {};

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    try {
      const parsed = JSON.parse(decrypted); // no await needed
      return parsed;
    } catch {
      return decrypted; // return as string if not valid JSON
    }
  } catch (err) {
    console.error('Decryption error:', err);
    return {};
  }
}

  generateToken (Id, r) {
    // console.log('id',Id,r);
    
    return jwt.sign(
      { id: Id, r },
      process.env.JWT_SECRET ,
      { expiresIn: '1d' }
    );
  }


    async decodeBody(Adata){
      // (Adata);
      let responseData = Adata.data
      // (responseData);
      
      // let dataa = await data.data.json()
      let decryptedData = await this.decrypt(responseData);
    console.log("decreptted data in decode boduy",decryptedData);
      
      return decryptedData;
      // return data
    }

  sendResponse(req,res,code,message,data,status){
    let dataa ={
      code:code,
      message:message,
      data:data
    }
    let encryptedData = this.encrypt(dataa)
res.status(status).send(encryptedData)
  }





  
 async  getIdFromToken(req) {
  try {
    // console.log('hello',req.headers);
    
    const toke = req.headers['token']; // or req.headers.authorization
    // console.log('ssss',token);
    
    if (!toke) {
      throw new Error("No token provided");
    }
const token =await this.decrypt(toke)
// console.log('tttt',toke);

    // Verify and decode
    const decoded = jwt.verify(String(token), process.env.JWT_SECRET);
    
    // decoded will have { id, r, iat, exp }
    // console.log("Decoded payload:", decoded);

    return decoded.id; // Extract id
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}
 async  getRoleFromToken(req) {
  try {
    // console.log('hello',req.headers);
    
    const toke = req.headers['token']; // or req.headers.authorization
    // console.log('ssss',toke);
    
    if (!toke) {
      throw new Error("No token provided");
    }
const token =await this.decrypt(toke)
// console.log('tttt',token);

    // Verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // decoded will have { id, r, iat, exp }
    // console.log("Decoded payload:", decoded.r);

    return decoded.r; // Extract id
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}
//  async  getWaIdFromToken(req) {
//   try {
//     // console.log('hello',req.headers);
    
//     const toke = req.headers['token']; // or req.headers.authorization
//     // console.log('ssss',toke);
    
//     if (!toke) {
//       throw new Error("No token provided");
//     }
// const token =await this.decrypt(toke)
// // console.log('tttt',token);

//     // Verify and decode
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // decoded will have { id, r, iat, exp }
//     // console.log("Decoded payload:", decoded.r);

//     return decoded.r; // Extract id
//   } catch (err) {
//     console.error("Token verification failed:", err.message);
//     return null;
//   }
// }
}



module.exports = new Common();