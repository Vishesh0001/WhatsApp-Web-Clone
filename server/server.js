const express = require('express');
const dotenv = require('dotenv');
const app_routing = require('./modules/app-routing');
const cors = require('cors');
const http = require('http');
// const { Server } = require("socket.io");

const connectDB = require('./config/database');
const chatSockets = require('./sockets/chatSockets');
const app = express();
const server = http.createServer(app);

dotenv.config();

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


// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

connectDB();
app_routing.v1(app);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 1000;
try {
  chatSockets(server)
  server.listen(port, () => {
    console.log('server is running on port ' + port);
  });
} catch (error) {
  console.log("Error in server:" + error);
}