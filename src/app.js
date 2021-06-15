require("dotenv").config();
import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";

// Init app
const app = express();

// connect to mongodb
connectDB();

// config view engine
configViewEngine(app);

app.get("/", function (req, res, next) {
  return res.render("main/master");
});

app.get("/register", function (req, res) {
  return res.render("auth/loginRegister");
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log("Connected to host " + process.env.APP_PORT);
});
