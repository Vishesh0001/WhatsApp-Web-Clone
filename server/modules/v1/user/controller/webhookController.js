const Conversation = require('../models/Conversation');
const Message = require('../models/Messages');  // Ensure filename matches your model file
const User = require('../models/User');

exports.handleWebhook = async (req, res) => {
  try {
    console.log('Webhook handler called');

    // Defensive parsing in case body is a string
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('Invalid JSON string in request body');
        return res.sendStatus(400);
      }
    }

    // Check the object field inside metaData, not root
    const objectField = body.metaData?.object;
    if (objectField !== 'whatsapp_business_account') {
      console.warn('Invalid object field:', objectField);
      return res.sendStatus(404);
    }

    // Access required nested webhook data
    const entry = body.metaData.entry && body.metaData.entry[0];
    if (!entry) return res.sendStatus(400);

    const changes = entry.changes && entry.changes[0];
    if (!changes) return res.sendStatus(400);

    const value = changes.value || {};

    // Handle new messages
    if (value.messages && value.messages.length > 0) {
      const messageData = value.messages[0];
      const contactData = value.contacts && value.contacts[0];

      // Find or create conversation by customer's wa_id
      let conversation = await Conversation.findOne({ wa_id: contactData.wa_id });
      if (!conversation) {
        conversation = new Conversation({
          wa_id: contactData.wa_id,
          participants: [], // Optionally add user IDs here,
          last_message: messageData.text ? messageData.text.body : '',
          last_message_time: new Date(parseInt(messageData.timestamp) * 1000),
        });
        await conversation.save();
      }

      // Find sender: match wa_id with User or fallback to any agent
      const sender = await User.findOne({ wa_id: messageData.from }) || await User.findOne({ role: 'agent' });

      // Create the new message document
      const newMessage = new Message({
        conversation_id: conversation._id,
        sender: sender ? sender._id : null,
        content: messageData.type === 'text' ? messageData.text.body : '',
        direction: messageData.from === contactData.wa_id ? 'incoming' : 'outgoing',
        meta_msg_id: messageData.id,
        status: 'sent',
        timestamp: new Date(parseInt(messageData.timestamp) * 1000)
      });

      await newMessage.save();

      // Update conversation latest message info
      conversation.last_message = newMessage.content;
      conversation.last_message_time = newMessage.timestamp;
      await conversation.save();
    }
    // Handle message status updates
    else if (value.statuses && value.statuses.length > 0) {
      const statusUpdate = value.statuses[0];
      await Message.findOneAndUpdate(
        { meta_msg_id: statusUpdate.id },
        { status: statusUpdate.status }
      );
    }

    return res.sendStatus(200);

  } catch (error) {
    console.error('Webhook handling error:', error);
    return res.sendStatus(500);
  }
};
