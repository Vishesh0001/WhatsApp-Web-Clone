require('dotenv').config();
const common = require('../utilities/common');

async function validateApiKey(req, res, next) {
  const incomingApiKey1 = req.headers['api-key'];
//   (req.headers)
  const incomingApiKey = await common.decrypt(incomingApiKey1);
// (incomingApiKey);
// (incomingApiKey1);

  if (!incomingApiKey) {
    const response = {
      code: 0,
      message: { keyword: 'API KEY missing from headers' },
      data: [],
      status: 401
    };
    return common.sendResponse(req, res, response.code, response.message, response.data, response.status);
  }

  if (incomingApiKey !== process.env.API_KEY) {
    const response = {
      code: 0,
      message: { keyword: 'API KEY did not match' },
      data: [],
      status: 401
    };
    return common.sendResponse(req, res, response.code, response.message, response.data, response.status);
  }

  next(); // API key is valid, proceed to the route
}

module.exports = { validateApiKey };
