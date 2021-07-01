let pushSocketIdToArray = (clients, userId, socketId) => {
  if (clients[userId]) {
    clients[userId].push(socketId);
  } else {
    clients[userId] = [socketId];
  }
  return clients;
};

let emitNotifyToArray = (clients, userId, socket, eventName, data) => {
  return socket.to(clients[userId]).emit(eventName, data);
};

let emitNotifyToArrayIncludeSender = (clients, userId, io, eventName, data) => {
  return io.to(clients[userId]).emit(eventName, data);
};

let removeSocketIdFromArray = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter((socketId) => {
    return socketId !== socket;
  });
  if (!clients[userId].length) {
    delete clients[userId];
  }
  return clients;
};
module.exports = {
  removeSocketIdFromArray,
  pushSocketIdToArray,
  emitNotifyToArray,
  emitNotifyToArrayIncludeSender
};
