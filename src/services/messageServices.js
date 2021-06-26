import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import ChatGroupModel from "../model/chatGroupModel";
import {model as MessageModel} from '../model/messageModel';
import _ from "lodash";

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
        let messages = await MessageModel.getMessages(currentUserId, conversation._id);
        console.log('messages', messages);
        conversation = conversation.toObject();
        conversation.messages = messages;
        return conversation;
      });

      let allConversationMessage = await Promise.all(allConversationMessagePromise);
      allConversationMessage = _.sortBy(allConversationMessage, (item) => {
        return -item.updatedAt;
      });

      resolve({
        userConversations,
        groupConversations,
        allConversations,
        allConversationMessage
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversations,
};
