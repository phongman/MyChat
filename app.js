const express = require("express");
const app = express();

const hostname = "localhost";
const port = 8080;

app.get("/", function (req, res, next) {
  res.send("Hello world");
});

app.use(port, hostname, function () {
  console.log("Connected to host" + port);
});
