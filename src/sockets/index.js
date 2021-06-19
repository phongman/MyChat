import addNewContact from './contact/addNewContact';

/**
 * 
 * @param io from socket.io
 */
let initSockets = (io) => {
    addNewContact(io);
};

module.exports = initSockets;