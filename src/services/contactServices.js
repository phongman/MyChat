import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import { types, model } from "../model/notificationModel";
import _ from "lodash";

const LIMIT_NUMBER = 10;

const findUserContact = (userId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [userId];
    let contactsByUser = await ContactModel.findAllByUser(userId);

    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds = _.uniqBy(deprecatedUserIds);

    let users = await UserModel.findAllUserToAddContact(
      deprecatedUserIds,
      keyword
    );

    resolve(users);
  });
};

const addNew = (userId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(userId, contactId);

    if (contactExists) reject(false);

    // create contact
    let newContactItem = {
      userId,
      contactId,
    };

    let newContact = await ContactModel.createNew(newContactItem);

    //create notification
    let notificationItem = {
      senderId: userId,
      receiverId: contactId,
      type: types.ADD_CONTACT,
    };

    await model.createNew(notificationItem);

    resolve(newContact);
  });
};

const removeRequestContactSent = (userId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeRequestContactSent = await ContactModel.removeRequestContactSent(
      userId,
      contactId
    );

    if (removeRequestContactSent.n === 0) reject(false);

    // remove notification
    await model.removeRequestNotification(userId, contactId, types.ADD_CONTACT);

    resolve(true);
  });
};

const getContacts = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(userId, LIMIT_NUMBER);

      let users = contacts.map(async (contact) => {
        if (contact.contactId == userId)
          return await UserModel.getUserDataById(contact.userId);
        return await UserModel.getUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsSent = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsSent(userId, LIMIT_NUMBER);

      let users = contacts.map(async (contact) => {
        return await UserModel.getUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsReceived = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(
        userId,
        LIMIT_NUMBER
      );

      let users = contacts.map(async (contact) => {
        return await UserModel.getUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContacts = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(userId);

      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContactsSent = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsSent(userId);

      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};
const countAllContactsReceived = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsReceived(userId);

      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContacts = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContact = await ContactModel.readMoreContacts(
        currentUserId,
        skipNumber,
        LIMIT_NUMBER
      );

      let users = newContact.map(async (contact) => {
        if (contact.contactId == currentUserId)
          return await UserModel.getUserDataById(contact.userId);
        return await UserModel.getUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read contact sent: default 10 item
 * @param {string} currentUserId
 * @param {number} skipNumber
 * @returns
 */
const readMoreContactsSent = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContact = await ContactModel.readMoreContactsSent(
        currentUserId,
        skipNumber,
        LIMIT_NUMBER
      );

      let users = newContact.map(async (contact) => {
        return await UserModel.getUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContactsReceived = (currentUserId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContact = await ContactModel.readMoreContactsReceived(
        currentUserId,
        skipNumber,
        LIMIT_NUMBER
      );

      let users = newContact.map(async (contact) => {
        return await UserModel.getUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUserContact,
  addNew,
  removeRequestContactSent,
  getContacts,
  getContactsSent,
  getContactsReceived,
  countAllContacts,
  countAllContactsSent,
  countAllContactsReceived,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived
};
