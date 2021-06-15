require("dotenv").config();
import express from 'express';
import ConnectDB from './config/connectDB';
import ContactModel from './model/contact.model';

const app = express();

// connect to mongodb
ConnectDB();

app.get("/", function (req, res, next) {
  res.send("Hello world");
});

app.get("/test", async (req, res) => {
  try {
      let item = {
        userId: '1234',
        contactId: '34567',
      };

      let contact = await ContactModel.createNew(item);

      res.send(contact);

  } catch (error) {
    console.log(error);
  }
})

app.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log("Connected to host " + process.env.APP_PORT);
});
