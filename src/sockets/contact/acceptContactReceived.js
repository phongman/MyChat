import {
    emitNotifyToArray,
    pushSocketIdToArray,
    removeSocketIdFromArray,
  } from "../../util/socket";
  
  /**
   *
   * @param io from socket.io
   */
  let acceptContactReceived = (io) => {
    let clients = {};
  
    io.on("connection", (socket) => {
      // push socketId to array
      let currentUserId = socket.request.user._id;
  
      pushSocketIdToArray(clients, currentUserId, socket.id);
  
console.log('clients', clients);
        
      socket.on("accept-contact-received", (data) => {
console.log('target', data.contactId)

        let currentUser = {
          id: socket.request.user._id,
          username: socket.request.user.username,
          avatar: socket.request.user.avatar,
          address: socket.request.user.address ? socket.request.user.address : '',
        };
  
        if (clients[data.contactId]) {
            console.log('runnnn')

          emitNotifyToArray(
            clients,
            data.contactId,
            socket,
            "response-accept-contact-received",
            currentUser
          );
        }
      });
  
      socket.on("disconnect", () => {
        clients = removeSocketIdFromArray(clients, currentUserId, socket.id);
      });
    });
  };
  
  module.exports = acceptContactReceived;
  