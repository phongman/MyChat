require("dotenv").config();
import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";
import pem from "pem";

import https from "https";

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err;
  }

  // Init app
  const app = express();

  // connect to mongodb
  connectDB();

  // config session
  configSession(app);

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

  https
    .createServer(
      { key: keys.serviceKey, cert: keys.certificate },
      app
    )
    .listen(process.env.APP_PORT, process.env.APP_HOST, function () {
      console.log("Connected to host " + process.env.APP_PORT);
    });
});

  // // Init app
  // const app = express();

  // // connect to mongodb
  // connectDB();

  // // config session
  // configSession(app);

  // // config view engine
  // configViewEngine(app);

  // // config body parser
  // app.use(express.urlencoded());

  // // Enable flash message
  // app.use(connectFlash());

  // // passport
  // app.use(passport.initialize());
  // app.use(passport.session());

  // // init all routes
  // initRoutes(app);

// app.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
//   console.log("Connected to host " + process.env.APP_PORT);
// });
