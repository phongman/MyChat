// chat-text-emoji
import {
  emitNotifyToArray,
  pushSocketIdToArray,
  removeSocketIdFromArray,
  emitNotifyToArrayIncludeSender,
} from "../../util/socket";

/**
 *
 * @param io from socket.io
 */
let chatVideo = (io) => {
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

    socket.on("caller-check-listener-online", (data) => {
      if (clients[data.listenerId]) {
        // online
        let response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName,
        };

        emitNotifyToArray(
          clients,
          data.listenerId,
          socket,
          "server-request-peerId-of-listener",
          response
        );
      } else {
        // offline
        socket.emit("server-sent-listener-is-offline");
      }
    });

    socket.on("listener-emit-peerId-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients,
          data.callerId,
          socket,
          "server-sent-peerId-of-listener-to-caller",
          response
        );
      }
    });

    socket.on("call-request-to-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients,
          data.listenerId,
          socket,
          "server-sent-request-call-to-listener",
          response
        );
      }
    });

    socket.on("caller-cancel-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients,
          data.listenerId,
          socket,
          "server-sent-cancel-request-call-to-listener",
          response
        );
      }
    });

    socket.on("listener-reject-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients,
          data.callerId,
          socket,
          "server-sent-reject-call-to-caller",
          response
        );
      }
    });

    socket.on("listener-accept-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients,
          data.callerId,
          socket,
          "server-sent-accept-call-to-caller",
          response
        );
      }

      if (clients[data.listenerId]) {
        emitNotifyToArrayIncludeSender(
          clients,
          data.listenerId,
          io,
          "server-sent-accept-call-to-listener",
          response
        );
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

module.exports = chatVideo;
