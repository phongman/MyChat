function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`)
    .unbind("change")
    .on("change", function () {
      let fileData = $(this).prop("files")[0];

      let limit = 1048576; /**1MB */

      if (fileData.size > limit) {
        alertify.notify("Max size is 1MB", "error", 7);

        $(this).val(null);

        return false;
      }

      let targetId = $(this).data("chat");
      let isChatGroup = false;

      let messageFormData = new FormData();

      messageFormData.append("my-attachment-chat", fileData);
      messageFormData.append("uid", targetId);

      if ($(this).hasClass("chat-in-group")) {
        messageFormData.append("isChatGroup", true);
        isChatGroup = true;
      }

      $.ajax({
        url: "message/add-new-attachment",
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
            `<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`
          );

          let attachmentChat = `            
                <a
                href="data:${
                  data.message.file.contentType
                }; base64, ${bufferToBase64(data.message.file.data.data)}"
                download="${data.message.file.fileName}"
              >
              ${data.message.file.fileName}
              </a>
              `;

          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;

            myMessage.html(`${senderAvatar} ${attachmentChat}`);

            increaseNumberMessageGroup(divId);

            dataToEmit.groupId = targetId;
          } else {
            myMessage.html(attachmentChat);

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
            .html("Tệp đính kèm...");

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
          socket.emit("chat-attachment", dataToEmit);

          // add to modal attachment
          let attachmentChatAddModal = `
          <li>
          <a
          href="data:${data.message.file.contentType}; base64, ${bufferToBase64(
            data.message.file.data.data
          )}"
          download="${data.message.file.fileName}"
        >
        ${data.message.file.fileName}
        </a>
        </li>
        `;

          $(`#attachmentsModal_${divId}`)
            .find("ul.list-attachments")
            .append(attachmentChatAddModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, "error", 7);
        },
      });
    });
}

$(document).ready(function () {
  socket.on("response-chat-attachment", function (res) {
    let divId = "";

    // update right side
    let yourMessage = $(
      `<div class="bubble you bubble-attachment-file" data-mess-id="${res.message._id}"></div>`
    );

    let attachmentChat = `            
      <a
      href="data:${res.message.file.contentType}; base64, ${bufferToBase64(
      res.message.file.data.data
    )}"
      download="${res.message.file.fileName}"
    >
    ${res.message.file.fileName}
    </a>
    `;

    if (res.currentGroupId) {
      divId = res.currentGroupId;

      let senderAvatar = `<img src="/images/users/${res.message.sender.avatar}" class="avatar-small" title="${res.message.sender.name}"/>`;

      yourMessage.html(`${senderAvatar} ${attachmentChat}`);

      increaseNumberMessageGroup(divId);
    } else {
      divId = res.currentUserId;
      yourMessage.html(attachmentChat);
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
      .html("Tệp đính kèm...");

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
    let attachmentChatAddModal = `
    <li>
    <a
    href="data:${res.message.file.contentType}; base64, ${bufferToBase64(
      res.message.file.data.data
    )}"
    download="${res.message.file.fileName}"
  >
  ${res.message.file.fileName}
  </a>
  </li>
  `;

    $(`#attachmentsModal_${divId}`)
      .find("ul.list-attachments")
      .append(attachmentChatAddModal);
  });
});
