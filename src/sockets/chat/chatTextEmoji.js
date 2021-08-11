// chat-text-emoji
import {
  emitNotifyToArray,
  pushSocketIdToArray,
  removeSocketIdFromArray,
} from "../../util/socket";

/**
 *
 * @param io from socket.io
 */
let chatTextEmoji = (io) => {
  let clients = {};

  io.on("connection", (socket) => {
    // push socketId to array
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.request.user.chatGroupIds.map((group) => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    //when has new group chat
    socket.on("new-group-created", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });

    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("chat-text-emoji", (data) => {
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message: data.message,
        };

        if (clients[data.groupId]) {
          emitNotifyToArray(
            clients,
            data.groupId,
            socket,
            "response-chat-text-emoji",
            response
          );
        }
      }

      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
        };

        if (clients[data.contactId]) {
          emitNotifyToArray(
            clients,
            data.contactId,
            socket,
            "response-chat-text-emoji",
            response
          );
        }
      }
    });

    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket.id);

      socket.request.user.chatGroupIds.map((group) => {
        clients = removeSocketIdFromArray(clients, group._id, socket.id);
      });
    });
  });
};

module.exports = chatTextEmoji;
