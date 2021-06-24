import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import acceptContactReceived from './contact/acceptContactReceived';

/**
 * 
 * @param io from socket.io
 */
let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    acceptContactReceived(io);
};

module.exports = initSockets;