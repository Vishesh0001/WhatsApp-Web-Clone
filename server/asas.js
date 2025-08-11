require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URL; // should have whatsapp in URI
console.log(MONGO_URI);

// Schema with strict:false lets you see all fields without defining them
const userSchema = new mongoose.Schema({}, { collection: 'users', strict: false });
const User = mongoose.model('User', userSchema);

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const data = await User.find(); // fetch all users
    console.log("📦 Data from users collection:", data);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await mongoose.connection.close();
  }
}

testConnection();
