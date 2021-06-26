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
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
