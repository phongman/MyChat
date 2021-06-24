import {
  emitNotifyToArray,
  pushSocketIdToArray,
  removeSocketIdFromArray,
} from "../../util/socket";

/**
 *
 * @param io from socket.io
 */
let removeRequestContactSent = (io) => {
  let clients = {};

  io.on("connection", (socket) => {
    // push socketId to array
    let currentUserId = socket.request.user._id;

    pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.on("remove-request-contact-sent", (data) => {
      let currentUser = {
        id: socket.request.user._id,
      };

      if (clients[data.contactId]) {
        emitNotifyToArray(
          clients,
          data.contactId,
          socket,
          "response-remove-request-contact-sent",
          currentUser
        );
      }
    });

    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket.id);
    });
  });
};

module.exports = removeRequestContactSent;
