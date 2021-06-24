import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import acceptContactReceived from './contact/acceptContactReceived';
import removeContact from './contact/removeContact';

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
};

module.exports = initSockets;