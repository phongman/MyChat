import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  removeRequestNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [
        { senderId: senderId },
        { receiverId: receiverId },
        { type: type },
      ],
    }).exec();
  },

  /**
   * Get noti by userId and limit
   * @param {string} userId
   * @param {number} limit
   * @returns
   */
  getByUserAndLimit(userId, limit) {
    return this.find({
      receiverId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * count all noti unread
   * @param {string} userId
   * @returns
   */
  countNotiUnread(userId) {
    return this.count({
      $and: [{ receiverId: userId }, { isRead: false }],
    }).exec();
  },

  /**
   * @param {string} userId
   * @param {number} skipNumber
   * @param {number} limit
   */
  readMore(userId, skipNumber, limit) {
    return this.find({
      receiverId: userId,
    })
      .sort({ createdAt: -1 })
      .skip(skipNumber)
      .limit(limit)
      .exec();
  },

  /**
   *
   * @param {string} userId
   * @param {array} targetUsers
   * @returns
   */
  markAllAsRead(userId, targetUsers) {
    return this.updateMany(
      {
        $and: [{ receiverId: userId }, { senderId: { $in: targetUsers } }],
      },
      { isRead: true }
    ).exec();
  },
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENT = {
  getContent: (notificationType, isRead, userId, avatar, username) => {
    if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return `<div class="notif-unread" data-uid="${userId}">
      <img
        class="avatar-small"
        src="images/users/${avatar}"
        alt=""
      />
      <strong>${username}</strong> đã gửi cho bạn một lời mời kết
      bạn! </div
    >`;
      }
      return `<div data-uid="${userId}">
      <img
        class="avatar-small"
        src="images/users/${avatar}"
        alt=""
      />
      <strong>${username}</strong> đã gửi cho bạn một lời mời kết
      bạn! </div
    >`;
    }

    return "undefined";
  },
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENT,
};
