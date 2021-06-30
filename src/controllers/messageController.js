import { validationResult } from "express-validator/check";
import { message } from '../services';
import multer from 'multer';
import {app} from '../config/app';
import { transErrors } from '../../lang/vi';
import fsExtra from 'fs-extra';

const addNewTextEmoji = async (req, res) => {
  let errorArr = [];

  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((el) => {
      errorArr.push(el.msg);
    });

    res.status(500).json({ error: errorArr });
  }

  try {
    let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
    }

    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

    return res.status(200).send({message: newMessage});
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
};

let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
    let mime = app.image_message_mime;

    if (!mime.includes(file.mimetype)) {
      return callback(transErrors.image_message_error, null);
    }

    let imageChatName = `${file.originalname}`;

    callback(null, imageChatName);
  },
});

const imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: {
    fileSize: app.image_message_limit_size,
  },
}).single("my-image-chat");

const addNewImage = (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(error.message);
      }
      return res.status(500).send(error);
    }

    try {
      let sender = {
          id: req.user._id,
          name: req.user.username,
          avatar: req.user.avatar,
      }
  
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
  
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
  
      console.log(`${app.image_message_directory}/${newMessage.file.fileName}`);

      // remove image cause image saved in mongo
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);

      return res.status(200).send({message: newMessage});
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  })
}

/**Attachment */
let storageAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.attachment_message_directory);
  },
  filename: (req, file, callback) => {
    let attachmentName = `${file.originalname}`;

    callback(null, attachmentName);
  },
});

const atthachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: {
    fileSize: app.attachment_message_directory,
  },
}).single("my-attachment-chat");

const addNewAttachment = (req, res) => {
  atthachmentMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(error.message);
      }
      return res.status(500).send(error);
    }

    try {
      let sender = {
          id: req.user._id,
          name: req.user.username,
          avatar: req.user.avatar,
      }
  
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
  
      let newMessage = await message.addNewAttachment(sender, receiverId, messageVal, isChatGroup);
  
      // remove image cause image saved in mongo
      await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`);

      return res.status(200).send({message: newMessage});
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }

  })
}

module.exports = {
  addNewTextEmoji,
  addNewImage,
  addNewAttachment
};
