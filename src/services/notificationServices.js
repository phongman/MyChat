import { model, contents } from "../model/notificationModel";
import UserModel from "../model/userModel";

const LIMIT_NUMBER = 10

/**
 *  Get notification when f5
 * @param {string} currentUserId
 * @param {number} limit
 */
let getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await model.getByUserAndLimit(currentUserId, LIMIT_NUMBER);

      let getNotification = notifications.map(async (noti) => {
        let sender = await UserModel.findUserById(noti.senderId);

        /**
         * return {
         *  senderId: sender._id,
         *  avatar: sender.avatar,
         *  username: sender.username,
         *  type: noti.type,
         *  isRead: noti.isRead,
         * }
         */

        // bo phan nay trong react
        return contents.getContent(
          noti.type,
          noti.isRead,
          sender._id,
          sender.avatar,
          sender.username
        );
      });
      
      resolve(await Promise.all(getNotification));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * count noti unread
 * @param {string} currentUserId 
 * @returns 
 */
let countNotiUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationUnread = await model.countNotiUnread(currentUserId);

      resolve(notificationUnread);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 
 * @param {string} userId 
 * @param {number} skipNumber 
 * @returns 
 */
let readMore = (userId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await model.readMore(userId, skipNumber, LIMIT_NUMBER);

      let getNotification = notifications.map(async (noti) => {
        let sender = await UserModel.findUserById(noti.senderId);

        /**
         * return {
         *  senderId: sender._id,
         *  avatar: sender.avatar,
         *  username: sender.username,
         *  type: noti.type,
         *  isRead: noti.isRead,
         * }
         */

        // bo phan nay trong react
        return contents.getContent(
          noti.type,
          noti.isRead,
          sender._id,
          sender.avatar,
          sender.username
        );
      });
      
      resolve(await Promise.all(getNotification));
      
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 
 * @param {string} userId 
 * @param {array string} targetUsers 
 * @returns 
 */
let markAllAsRead = (userId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await model.markAllAsRead(userId, targetUsers);

      resolve(true);
    } catch (error) {
      console.log(error);

      reject(false);
    }
  });
};

module.exports = {
  getNotifications,
  countNotiUnread,
  readMore,
  markAllAsRead
};
