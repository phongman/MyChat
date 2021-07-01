require("dotenv").config();
import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import {config} from "./config/session";
import passport from "passport";
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets/index';
import events from 'events';
import { app as configApp } from './config/app';

// import pem from "pem";

// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err;
//   }

//   // Init app
//   const app = express();

//   // connect to mongodb
//   connectDB();

//   // config session
//   configSession(app);

//   // config view engine
//   configViewEngine(app);

//   // config body parser
//   app.use(express.urlencoded());

//   // Enable flash message
//   app.use(connectFlash());

//   // passport
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // init all routes
//   initRoutes(app);

//   https
//     .createServer(
//       { key: keys.serviceKey, cert: keys.certificate },
//       app
//     )
//     .listen(process.env.APP_PORT, process.env.APP_HOST, function () {
//       console.log("Connected to host " + process.env.APP_PORT);
//     });
// });

// Init app
const app = express();

// set max connection event listeners
events.EventEmitter.defaultMaxListeners = configApp.max_event_listener;

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// connect to mongodb
connectDB();

// config session
app.use(config);

// config view engine
configViewEngine(app);

// config body parser
app.use(express.urlencoded());

// Enable flash message
app.use(connectFlash());

// passport
app.use(passport.initialize());
app.use(passport.session());

// init all routes
initRoutes(app);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(config));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

// init all sockets
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log("Connected to host " + process.env.APP_PORT);
});
