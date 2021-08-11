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
let userOnlineOffline = (io) => {
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

    socket.on("check-status", () => {
      let listUserOnline = Object.keys(clients);

      // step 01: after to user online
      socket.emit("server-send-list-user-online", listUserOnline);

      // step 02: emit to all other users when new user online
      socket.broadcast.emit("server-send-when-new-user-online", currentUserId);
    })

    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket.id);

      socket.request.user.chatGroupIds.map((group) => {
        clients = removeSocketIdFromArray(clients, group._id, socket.id);
      });

      // step 03: emit to all user when user offline
      socket.broadcast.emit("server-send-when-new-user-offline", currentUserId);
    });
  });
};

module.exports = userOnlineOffline;
