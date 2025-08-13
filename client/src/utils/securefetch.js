import Cookies from 'js-cookie';
import { encrypt, decrypt } from './crypto';
// import { jwtVerify } from 'jose';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_API_KEY ;
// const jwtSecret = process.env.JWT_SECRET ;
const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const userBaseURL = `${BaseURL}/v1/user`;

const validStatusCodes = [200, 201, 400,401, 403, 404, 409, 410, 500];
const secureFetch = async (url, data = {}, method = 'POST') => {
  try {
    let baseURL = userBaseURL; // Default to user base URL
    let cookietoken = Cookies.get('token_test');
    let token;
    let encryptedApi = encrypt(apiKey);
    let encryptedToken = '';

    if (url === '/login' || url === '/signup') {
      token = ' ';
    } else {
      token = cookietoken;
      encryptedToken = encrypt(token);
    }

    // ('encrypted token', encryptedToken);

    const receivedData = JSON.stringify(data);
    // (receivedData);
    
    const encryptedData = encrypt(receivedData);

    let reqOptions;

    if (method === 'GET') {
      reqOptions = {
        method: 'GET',
        url: `${baseURL}${url}`,
        headers: {
          'Content-Type': 'application/json',
          'token': encryptedToken,
          'api-key': encryptedApi,
        },
        validateStatus: (status) => validStatusCodes.includes(status),
      };
    } else {
      reqOptions = {
        method: method,
        url: `${baseURL}${url}`,
        headers: {
          'Content-Type': 'application/json',
          'token': encryptedToken,
          'api-key': encryptedApi,
        },
        data: {
          data: encryptedData,
        },
        validateStatus: (status) => validStatusCodes.includes(status),
      };
    }

    console.log('reqOptions', reqOptions);

    const res = await axios(reqOptions);
    // console.log('yupppp',res)
    if(!res.data){
      // ('res.data nto found',res)
      throw new Error('No data returned from the server')
    }
    const encryptedText = res.data;
// console.log('enc',res.data);
if (!encryptedText || typeof encryptedText !== 'string') {
  throw new Error('Invalid encrypted response from the server');
}

let decryptedData;


try {
  // console.log('enc',encryptedText);
  decryptedData = decrypt(encryptedText); // returns a JSON string
//  console.log('decrypt',decryptedData);
 
} catch (err) {
  console.error('Failed to decrypt/parse response', err);
  throw new Error('Failed to decrypt response');
}
  console.log('decrypted dtat',decryptedData);
return decryptedData;
  } catch (error) {
    console.error('Error in secureFetch:', error);
   const encryptedText = error.response?.data;

if (encryptedText && typeof encryptedText === 'string') {
  try {
    // console.log('enc',encryptedText);
    let decryptedData = decrypt(encryptedText);
    decryptedData = JSON.parse(decryptedData);
    console.log('decrypted dtat',decryptedData);
    
    return decryptedData;
  } catch (err) {
    console.error('Failed to decrypt/parse error response', err);
    throw new Error('Failed to decrypt error response');
  }
}

throw new Error('Error while making the secure API request');
  }
};

export default secureFetch;




