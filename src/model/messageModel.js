import mongoose from "mongoose";

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String,
  },
  receiver: {
    id: String,
    name: String,
    avatar: String,
  },
  text: String,
  file: { data: Buffer, contentType: String, fileName: String },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

MessageSchema.statics = {
  /**
   * @param {object} item 
   * @returns 
   */
  createNew(item) {
    return this.create(item);
  },

  /**
   * get limited message
   * @param {string} senderId currentUserId
   * @param {string} receiverId idContact
   * @param {number} limit
   */
  getPersonalMessages(senderId, receiverId, limit) {
    return this.find({
      $or: [
        {
          $and: [{ senderId: senderId }, { receiverId: receiverId }],
        },
        {
          $and: [{ senderId: receiverId }, { receiverId: senderId }],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * get message in group
   * @param {*} conversationId id group chat
   * @param {*} limit 
   * @returns 
   */
  getGroupMessages(conversationId, limit) {
    return this.find({
      receiverId: conversationId
    })
      .sort({createdAt: -1})
      .limit(limit)
      .exec()
  },

  /**
   * @param {String} conversationId 
   * @param {Number} skip 
   * @param {Number} limit 
   * @returns 
   */
  readMoreGroupMessages(conversationId, skip, limit) {
    return this.find({
      receiverId: conversationId
    })
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .exec()
  },

  /**
   * get limited message
   * @param {string} senderId currentUserId
   * @param {string} receiverId idContact
   * @param {Number} skip
   * @param {Number} limit
   */
   readMorePersonalMessages(senderId, receiverId, skip, limit) {
    return this.find({
      $or: [
        {
          $and: [{ senderId: senderId }, { receiverId: receiverId }],
        },
        {
          $and: [{ senderId: receiverId }, { receiverId: senderId }],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group",
};

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationTypes: MESSAGE_CONVERSATION_TYPES,
  messageTypes: MESSAGE_TYPES,
};
