require("dotenv").config();
import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";

// Init app
const app = express();

// connect to mongodb
connectDB();

// config view engine
configViewEngine(app);

// init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log("Connected to host " + process.env.APP_PORT);
});
