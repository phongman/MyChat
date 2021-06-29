function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", function (el) {
      let currentEmojionArea = $(this);

      if (el.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data("chat");

        let messageVal = $(`#write-chat-${divId}`).val();

        if (!targetId.length || !messageVal.length) return false;

        let dataTextEmoji = {
          uid: targetId,
          messageVal: messageVal,
        };

        if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
          dataTextEmoji.isChatGroup = true;
        }

        $.post("/message/add-new-text-emoji", dataTextEmoji, function (data) {
          //success
          let dataToEmit = {
            message: data.message,
          };

          // update right side
          let myMessage = $(
            `<div class="bubble me data-mess-id="${data.message._id}"></div>`
          );

          myMessage.text(data.message.text);

          if (dataTextEmoji.isChatGroup) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;

            myMessage.html(`${senderAvatar} ${myMessage.text()}`);

            increaseNumberMessageGroup(divId);

            dataToEmit.groupId = targetId;
          } else {
            dataToEmit.contactId = targetId;
          }

          // append message data to screen
          $(`.right .chat[data-chat=${divId}]`).append(myMessage);

          nineScrollRight(divId);

          // remove data input
          $(`#write-chat-${divId}`).val("");
          currentEmojionArea.find(".emojionearea-editor").text("");

          // update leftside
          $(`.person[data-chat=${divId}]`)
            .find("span.time")
            .removeClass("message-time-realtime")
            .html(
              moment(data.message.createdAt)
                .locale("vi")
                .startOf("seconds")
                .fromNow()
            );

          $(`.person[data-chat=${divId}]`)
            .find("span.preview")
            .html(data.message.text);

          // move conversation to top
          $(`.person[data-chat=${divId}]`).on(
            "triggerClick.moveConversationToTheTop",
            function () {
              let dataToMove = $(this).parent();
      
              $(this).closest("ul").prepend(dataToMove);
      
              $(this).off("triggerClick.moveConversationToTheTop");
            }
          );
      
          $(`.person[data-chat=${divId}]`).trigger("triggerClick.moveConversationToTheTop");

          // emit realtime
          socket.emit("chat-text-emoji", dataToEmit);

          // remove typing indicator
          typingOff(divId);

          // remove current indicator
          let check = $(`.chat[data-chat=${divId}]`).find(
            "div.bubble-typing-gif"
          );

          if(check.length) check.remove();

        }).fail(function (res) {
          //errors
          alertify.notify(res.responseText, "error", 7);
        });
      }
    });
}

$(document).ready(function () {
  socket.on("response-chat-text-emoji", function (res) {
    let divId = "";

    // update right side
    let yourMessage = $(
      `<div class="bubble you data-mess-id="${res.message._id}"></div>`
    );

    yourMessage.text(res.message.text);

    console.log('res', res);

    if (res.currentGroupId) {
      divId = res.currentGroupId;

      let senderAvatar = `<img src="/images/users/${res.message.sender.avatar}" class="avatar-small" title="${res.message.sender.name}"/>`;

      yourMessage.html(`${senderAvatar} ${yourMessage.text()}`);

      increaseNumberMessageGroup(divId);
    } else {
      divId = res.currentUserId;
    }

    $(`.right .chat[data-chat=${divId}]`).append(yourMessage);
      nineScrollRight(divId);

    // update leftside
    $(`.person[data-chat=${divId}]`)
      .find("span.time")
      .addClass("message-time-realtime")
      .html(
        moment(res.message.createdAt).locale("vi").startOf("seconds").fromNow()
      );

    $(`.person[data-chat=${divId}]`)
      .find("span.preview")
      .html(res.message.text);

    // move conversation to top
    $(`.person[data-chat=${divId}]`).on(
      "triggerClick.moveConversationToTheTop",
      function () {
        let dataToMove = $(this).parent();

        $(this).closest("ul").prepend(dataToMove);

        $(this).off("triggerClick.moveConversationToTheTop");
      }
    );

    $(`.person[data-chat=${divId}]`).trigger("triggerClick.moveConversationToTheTop");
  });
});
