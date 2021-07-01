import { notification, contact, message } from "../services";
import {
  bufferToBase64,
  getLatestMessage,
  convertTimestampToHumanTime,
} from "../util/clientsUtil";
import request from 'request';

let getIceTurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // Node Get ICE STUN and TURN list
    let o = {
      format: "urls",
    };

    let bodyString = JSON.stringify(o);


    let options = {
      url: 'https://global.xirsys.net/_turn/MyFirstApp',
      // host: "global.xirsys.net",
      // path: "/_turn/MyFirstApp",
      method: "PUT",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            "phonggenius99:ad8c5890-da8d-11eb-8944-0242ac130002"
          ).toString("base64"),
        "Content-Type": "application/json",
        "Content-Length": bodyString.length,
      },
    };

    // call request to get ice turn
    request(options, (error, response, body) => {
      if(error) return reject(error);
      
      let bodyJSON = JSON.parse(body);

      resolve(bodyJSON.v.iceServers)
    })
  });
};

let getHome = async (req, res) => {
  // get notification: default 10 items
  let notifications = await notification.getNotifications(req.user._id);

  let countNotiUnread = await notification.countNotiUnread(req.user._id);

  //get contacts: default 10 items
  let contacts = await contact.getContacts(req.user._id);

  //get contacts sent: default 10 items
  let contactsSent = await contact.getContactsSent(req.user._id);

  //get contacts received: default 10 items
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  // count contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(
    req.user._id
  );

  // message
  let allConversationMessage = await message.getAllConversations(req.user._id);

   let iceServerList = await getIceTurnServer();

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotiUnread: countNotiUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    allConversationMessage: allConversationMessage,
    bufferToBase64: bufferToBase64,
    getLatestMessage: getLatestMessage,
    convertTimestampToHumanTime: convertTimestampToHumanTime,
    iceServerList: JSON.stringify(iceServerList)
  });

  // res.status(200).send({notifications, countNotiUnread})
};

module.exports = { getHome };
