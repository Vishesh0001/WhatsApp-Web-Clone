// routes/webhook.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controller/webhookController');

// Route to receive webhook POST requests
router.post('/webhook', webhookController.handleWebhook);

module.exports = router;
