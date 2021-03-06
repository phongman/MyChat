import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import acceptContactReceived from './contact/acceptContactReceived';
import removeContact from './contact/removeContact';
import chatTextEmoji from './chat/chatTextEmoji';
import typingOn from './chat/typingOn';
import typingOff from './chat/typingOff';
import chatImage from './chat/chatImage';
import chatAttachment from './chat/chatAttachment';
import chatVideo from './chat/chatVideo';
import userOnlineOffline from './status/userOnlineOffline';
import newGroupChat from './group/newGroupChat';

/**
 * 
 * @param io from socket.io
 */
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    acceptContactReceived(io);
    removeContact(io);
    chatTextEmoji(io);
    typingOn(io);
    typingOff(io);
    chatImage(io);
    chatAttachment(io);
    chatVideo(io);
    userOnlineOffline(io);
    newGroupChat(io);
};

module.exports = initSockets;