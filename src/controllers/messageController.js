import { validationResult } from "express-validator/check";
import { message } from "../services";
import multer from "multer";
import { app } from "../config/app";
import { transErrors } from "../../lang/vi";
import fsExtra from "fs-extra";
import ejs from "ejs";
import {
  convertTimestampToHumanTime,
  getLatestMessage,
  bufferToBase64
} from "../util/clientsUtil";
import { promisify } from "util";

// make ejs function renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);

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
    };

    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await message.addNewTextEmoji(
      sender,
      receiverId,
      messageVal,
      isChatGroup
    );

    return res.status(200).send({ message: newMessage });
  } catch (error) {
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
      };

      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewImage(
        sender,
        receiverId,
        messageVal,
        isChatGroup
      );

      // remove image cause image saved in mongo
      await fsExtra.remove(
        `${app.image_message_directory}/${newMessage.file.fileName}`
      );

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

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
      };

      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewAttachment(
        sender,
        receiverId,
        messageVal,
        isChatGroup
      );

      // remove image cause image saved in mongo
      await fsExtra.remove(
        `${app.attachment_message_directory}/${newMessage.file.fileName}`
      );

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

const readMoreAllChat = async (req, res) => {
  try {
    let skipPersonal = +req.query.skipPersonal;
    let skipGroup = +req.query.skipGroup;

    let newAllConversation = await message.readMoreAllChat(
      req.user._id,
      skipPersonal,
      skipGroup
    );

    let dataToRender = {
      newAllConversation,
      convertTimestampToHumanTime,
      getLatestMessage,
      bufferToBase64,
      user: req.user,
    };

    let leftSideData = await renderFile(
      "src/views/main/readMoreConversations/_leftSide.ejs",
      dataToRender
    );

    let rightSideData = await renderFile(
      "src/views/main/readMoreConversations/_rightSide.ejs",
      dataToRender
    );

    let imageModalData = await renderFile(
      "src/views/main/readMoreConversations/_imageModal.ejs",
      dataToRender
    );

    let attachmentModalData = await renderFile(
      "src/views/main/readMoreConversations/_attachmentModal.ejs",
      dataToRender
    );



    return res.status(200).send({
      leftSideData,
      rightSideData,
      imageModalData,
      attachmentModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMore = async (req, res) => {
  try {
    let skipMessage = +req.query.skipMessage;
    let targetId = req.query.targetId;
    let chatInGroup = req.query.chatInGroup === "true";

    let newMessages = await message.readMore(
      req.user._id,
      skipMessage,
      targetId,
      chatInGroup
    );

    let dataToRender = {
      newMessages,
      bufferToBase64,
      user: req.user,
      chatInGroup
    };

    let rightSideData = await renderFile(
      "src/views/main/readMoreMessages/_rightSide.ejs",
      dataToRender
    );

    let imageModalData = await renderFile(
      "src/views/main/readMoreMessages/_imageModal.ejs",
      dataToRender
    );

    let attachmentModalData = await renderFile(
      "src/views/main/readMoreMessages/_attachmentModal.ejs",
      dataToRender
    );

    return res.status(200).send({
      rightSideData,
      imageModalData,
      attachmentModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  addNewTextEmoji,
  addNewImage,
  addNewAttachment,
  readMoreAllChat,
  readMore
};
