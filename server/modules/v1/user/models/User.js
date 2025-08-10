// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['agent','customer'], required: true },
  profilePic: { type: String, default: '' },
  about: { type: String, default: '' },
 
  phone: { type: String, default: '' },  
  wa_id: { type: String, default: '' }   
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
