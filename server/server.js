const express = require('express');
const dotenv = require('dotenv');
const app_routing = require('./modules/app-routing');
const cors = require('cors');
// const { Server } = require("socket.io");

const connectDB = require('./config/database');
// const chatSockets = require('./sockets/chatSockets');

dotenv.config();
const app = express();
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'token', 'api-key'],
  })
);

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

connectDB();

// Initialize Socket.IO
// const server = require('http').createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });
// chatSockets(io);

// Your other API versioned routes
app_routing.v1(app);

app.get('/', (req, res) => {
  res.send("Backend is running.");
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 1000;
try {
  app.listen(port, () => {
    console.log('server is running on port ' + port);
  });
} catch (error) {
  console.log("Error in server:" + error);
}