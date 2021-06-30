function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
}

function imageChat(divId) {
  $(`#image-chat-${divId}`)
    .unbind("change")
    .on("change", function () {
      let fileData = $(this).prop("files")[0];

      let mime = ["image/png", "image/jpg", "image/jpeg"];

      let limit = 1048576; /**1MB */

      if ($.inArray(fileData.type, mime) === -1) {
        alertify.notify("File is not valid. Only allow jpg & png", "error", 7);

        $(this).val(null);

        return false;
      }

      if (fileData.size > limit) {
        alertify.notify("Max size is 1MB", "error", 7);

        $(this).val(null);

        return false;
      }

      let targetId = $(this).data("chat");
      let isChatGroup = false;

      let messageFormData = new FormData();

      messageFormData.append("my-image-chat", fileData);
      messageFormData.append("uid", targetId);

      if ($(this).hasClass("chat-in-group")) {
        messageFormData.append("isChatGroup", true);
        isChatGroup = true;
      }

      $.ajax({
        url: "message/add-new-image",
        type: "post",
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function (data) {
          let dataToEmit = {
            message: data.message,
          };

          // update right side
          let myMessage = $(
            `<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`
          );

          let imageChat = `<img
        src="data:${data.message.file.contentType}; base64, ${bufferToBase64(
            data.message.file.data.data
          )}"
        class="show-image-chat"
      />`;

          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;

            myMessage.html(`${senderAvatar} ${imageChat}`);

            increaseNumberMessageGroup(divId);

            dataToEmit.groupId = targetId;
          } else {
            myMessage.html(imageChat);

            dataToEmit.contactId = targetId;
          }

          // append message data to screen
          $(`.right .chat[data-chat=${divId}]`).append(myMessage);

          nineScrollRight(divId);

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
            .html("Hình ảnh...");

          // move conversation to top
          $(`.person[data-chat=${divId}]`).on(
            "triggerClick.moveConversationToTheTop",
            function () {
              let dataToMove = $(this).parent();

              $(this).closest("ul").prepend(dataToMove);

              $(this).off("triggerClick.moveConversationToTheTop");
            }
          );

          $(`.person[data-chat=${divId}]`).trigger(
            "triggerClick.moveConversationToTheTop"
          );

          // emit real time
          socket.emit("chat-image", dataToEmit);

          // add to modal image
          let imageChatAddModal = `
          <img
          src="data:${data.message.file.contentType}; base64, ${bufferToBase64(
            data.message.file.data.data
          )}"
        />`;

          $(`#imagesModal_${divId}`)
            .find("div.all-images")
            .append(imageChatAddModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, "error", 7);
        },
      });
    });
}

$(document).ready(function () {
  socket.on("response-chat-image", function (res) {
    let divId = "";

    // update right side
    let yourMessage = $(
      `<div class="bubble you bubble-image-file" data-mess-id="${res.message._id}"></div>`
    );

    let imageChat = `<img
      src="data:${res.message.file.contentType}; base64, ${bufferToBase64(
      res.message.file.data.data
    )}"
      class="show-image-chat"
    />`;

    if (res.currentGroupId) {
      divId = res.currentGroupId;

      let senderAvatar = `<img src="/images/users/${res.message.sender.avatar}" class="avatar-small" title="${res.message.sender.name}"/>`;

      yourMessage.html(`${senderAvatar} ${imageChat}`);

      increaseNumberMessageGroup(divId);
    } else {
      divId = res.currentUserId;
      yourMessage.html(imageChat);
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

    $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");

    // move conversation to top
    $(`.person[data-chat=${divId}]`).on(
      "triggerClick.moveConversationToTheTop",
      function () {
        let dataToMove = $(this).parent();

        $(this).closest("ul").prepend(dataToMove);

        $(this).off("triggerClick.moveConversationToTheTop");
      }
    );

    $(`.person[data-chat=${divId}]`).trigger(
      "triggerClick.moveConversationToTheTop"
    );

    // add to modal image
    let imageChatAddModal = `
                <img
                src="data:${
                  res.message.file.contentType
                }; base64, ${bufferToBase64(res.message.file.data.data)}"
              />`;

    $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatAddModal);
  });
});
