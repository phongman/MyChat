import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import ChatGroupModel from "../model/chatGroupModel";
import {model as MessageModel, conversationTypes, messageTypes} from '../model/messageModel';
import _ from "lodash";
import { transErrors } from '../../lang/vi';
import { app } from '../config/app';
import fsExtra from 'fs-extra';

const LIMIT_NUMBER = 15;
const LIMIT_MESSAGE = 30;

const getAllConversations = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER);

      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getUserDataById(
            contact.contactId
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      let userConversations = await Promise.all(userConversationsPromise);

      let groupConversations = await ChatGroupModel.getConversations(
        currentUserId,
        LIMIT_NUMBER
      );

      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });


      // get all message
      let allConversationMessagePromise = allConversations.map( async (conversation) => {
        conversation = conversation.toObject();

        if(conversation.members) {
          let messages = await MessageModel.getGroupMessages(conversation._id, LIMIT_MESSAGE);

          conversation.messages = messages;
        } else {
          let messages = await MessageModel.getPersonalMessages(currentUserId, conversation._id, LIMIT_MESSAGE);

          conversation.messages = messages;
        }

        return conversation;
      });

      let allConversationMessage = await Promise.all(allConversationMessagePromise);
      allConversationMessage = _.sortBy(allConversationMessage, (item) => {
        return -item.updatedAt;
      });

      resolve(allConversationMessage);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 
 * @param {object} sender currentUserInfo
 * @param {string} receiverId  
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
const addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);

        if(!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.group_avatar_default,
        }

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: conversationTypes.GROUP,
          messageType: messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now(),
        }

        let newMessage = await MessageModel.createNew(newMessageItem);

        // await group chat
        await ChatGroupModel.updateWhenHasNewMessage(receiver.id, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getUserDataById(receiverId);

        if(!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar,
        }

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: conversationTypes.PERSONAL,
          messageType: messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now(),
        }

        let newMessage = await MessageModel.createNew(newMessageItem);
        
        // update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, receiver.id);
        
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  })
}


/**
 * 
 * @param {object} sender currentUserInfo
 * @param {string} receiverId  
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
 const addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);

        if(!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.group_avatar_default,
        }

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: conversationTypes.GROUP,
          messageType: messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName,
          },
          createdAt: Date.now(),
        }

        let newMessage = await MessageModel.createNew(newMessageItem);

        // await group chat
        await ChatGroupModel.updateWhenHasNewMessage(receiver.id, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getUserDataById(receiverId);

        if(!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar,
        }

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: conversationTypes.PERSONAL,
          messageType: messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName,
          },
          createdAt: Date.now(),
        }

        let newMessage = await MessageModel.createNew(newMessageItem);
        
        // update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, receiver.id);
        
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  })
}
/**
 * 
 * @param {object} sender currentUserInfo
 * @param {string} receiverId  
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
 const addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);

        if(!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.group_avatar_default,
        }

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: conversationTypes.GROUP,
          messageType: messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer,
            contentType: attachmentContentType,
            fileName: attachmentName,
          },
          createdAt: Date.now(),
        }

        let newMessage = await MessageModel.createNew(newMessageItem);

        // await group chat
        await ChatGroupModel.updateWhenHasNewMessage(receiver.id, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getUserDataById(receiverId);

        if(!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar,
        }

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: conversationTypes.PERSONAL,
          messageType: messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer,
            contentType: attachmentContentType,
            fileName: attachmentName,
          },
          createdAt: Date.now(),
        }

        let newMessage = await MessageModel.createNew(newMessageItem);
        
        // update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, receiver.id);
        
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  })
}

/** 
 * @param {String} currentUserId 
 * @param {Number} skipPersonal 
 * @param {Number} skipGroup 
 */

const readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.readMoreContacts(currentUserId, skipPersonal,LIMIT_NUMBER);

      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getUserDataById(
            contact.contactId
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      let userConversations = await Promise.all(userConversationsPromise);

      let groupConversations = await ChatGroupModel.readMoreChatGroup(
        currentUserId,
        skipGroup,
        LIMIT_NUMBER
      );

      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });


      // get all message
      let allConversationMessagePromise = allConversations.map( async (conversation) => {
        conversation = conversation.toObject();

        if(conversation.members) {
          let messages = await MessageModel.getGroupMessages(conversation._id, LIMIT_MESSAGE);

          conversation.messages = messages;
        } else {
          let messages = await MessageModel.getPersonalMessages(currentUserId, conversation._id, LIMIT_MESSAGE);

          conversation.messages = messages;
        }

        return conversation;
      });

      let allConversationMessage = await Promise.all(allConversationMessagePromise);
      allConversationMessage = _.sortBy(allConversationMessage, (item) => {
        return -item.updatedAt;
      });

      resolve(allConversationMessage);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getAllConversations,
  addNewTextEmoji,
  addNewImage,
  addNewAttachment,
  readMoreAllChat
};
