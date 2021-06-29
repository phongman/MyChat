function typingOn(divId) {
  let targetId = $(`#write-chat-${divId}`).data("chat");

  if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
    socket.emit("user-is-typing", { groupId: targetId });
  } else {
    socket.emit("user-is-typing", { contactId: targetId });
  }
}

function typingOff(divId) {
  let targetId = $(`#write-chat-${divId}`).data("chat");

  if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
    socket.emit("user-is-not-typing", { groupId: targetId });
  } else {
    socket.emit("user-is-not-typing", { contactId: targetId });
  }
}

$(document).ready(function () {
  socket.on("response-user-is-typing", function (res) {
    let messageTyping = `
        <div class="bubble you bubble-typing-gif">
            <img src="/images/chat/typing.gif" />
        </div>`;

    if (res.currentGroupId) {
      let check = $(`.chat[data-chat=${res.currentGroupId}]`).find(
        "div.bubble-typing-gif"
      );

      if (check.length) return false;

      $(`.chat[data-chat=${res.currentGroupId}]`).append(messageTyping);
      nineScrollRight(res.currentGroupId);
    } else {
      let check = $(`.chat[data-chat=${res.currentUserId}]`).find(
        "div.bubble-typing-gif"
      );

      if (check.length) return false;

      $(`.chat[data-chat=${res.currentUserId}]`).append(messageTyping);
      nineScrollRight(res.currentUserId);
    }
  });

  socket.on("response-user-is-not-typing", function (res) {
    if (res.currentGroupId) {
        $(`.chat[data-chat=${res.currentGroupId}]`)
        .find("div.bubble-typing-gif")
        .remove();;
      nineScrollRight(res.currentGroupId);
    } else {
      $(`.chat[data-chat=${res.currentUserId}]`)
        .find("div.bubble-typing-gif")
        .remove();
      nineScrollRight(res.currentUserId);
    }
  });
});
