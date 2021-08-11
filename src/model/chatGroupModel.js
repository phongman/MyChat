import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 100 },
  messageAmount: { type: Number, default: 0 },
  userId: String,
  members: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  /**
   * get conversations by current userid and limit
   * @param {string} userId
   * @param {string} limit
   * @returns
   */
  getConversations(userId, limit) {
    return this.find({
      members: {
        $elemMatch: { userId: userId },
      },
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * 
   * @param {string} receiverId 
   */
  getChatGroupById(receiverId) {
    return this.findById(receiverId).exec();
  },

  /**
   * 
   * @param {string} id 
   * @param {number} messageAmount 
   */
  updateWhenHasNewMessage(id, messageAmount) {
    return this.updateOne({_id: id}, {messageAmount: messageAmount, updatedAt: Date.now()}).exec();
  },

  /**
   * 
   * @param {string} userId 
   */
  getChatGroupIdsByUser(userId) {
    return this.find({
      members: {
        $elemMatch: { userId: userId },
      },
    }, {_id: 1}).exec();
  }
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
