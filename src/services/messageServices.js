import ContactModel from "../model/contactModel";
import UserModel from "../model/userModel";
import ChatGroupModel from "../model/chatGroupModel";
import _ from "lodash";

const LIMIT_NUMBER = 15;

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
          let getUserContact = await await UserModel.getUserDataById(
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

console.log(groupConversations);

      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });

      resolve({
        userConversations,
        groupConversations,
        allConversations,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversations,
};
