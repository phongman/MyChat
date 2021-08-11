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
let newGroupChat = (io) => {
  let clients = {};

  io.on("connection", (socket) => {
    // push socketId to array
    let currentUserId = socket.request.user._id;

    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.request.user.chatGroupIds.map((group) => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on("new-group-created", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);

      let response = {
        groupChat: data.groupChat,
      };

      data.groupChat.members.forEach((member) => {
        if (clients[member.userId]) {
          emitNotifyToArray(
            clients,
            member.userId,
            socket,
            "response-new-group-created",
            response
          );
        }
      });
    });

    socket.on("member-received-group-chat", (data) => {
        clients= pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket.id);

      socket.request.user.chatGroupIds.map((group) => {
        clients = removeSocketIdFromArray(clients, group._id, socket.id);
      });
    });
  });
};

module.exports = newGroupChat;
