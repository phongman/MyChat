import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import {types, model} from '../model/notificationModel';
import _ from "lodash";

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

    if(contactExists) reject(false);

    // create contact
    let newContactItem = {
      userId,
      contactId
    }

    let newContact = await ContactModel.createNew(newContactItem);
    
    //create notification
    let notificationItem = {
      senderId: userId,
      receiverId: contactId,
      type: types.ADD_CONTACT,
    };

    await model.createNew(notificationItem);

    resolve(newContact);
  })
}

const removeRequestContact = (userId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeRequestContact = await ContactModel.removeRequestContact(userId, contactId);

    if(removeRequestContact.n === 0) reject(false);

    // remove notification
    await model.removeRequestNotification(userId, contactId, types.ADD_CONTACT);

    resolve(true);
  })
}

module.exports = {
  findUserContact,
  addNew,
  removeRequestContact
};
