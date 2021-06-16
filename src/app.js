require("dotenv").config();
import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import configSession from './config/session';

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

// init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log("Connected to host " + process.env.APP_PORT);
});
