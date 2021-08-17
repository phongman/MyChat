function readMoreMessages() {
  $(".right .chat")
    .unbind("scroll")
    .on("scroll", function () {
      // get the first message
      let firstMessage = $(this).find(".bubble:first");

      // get position of first message
      let currentOffset = firstMessage.offset().top - $(this).scrollTop();

      if ($(this).scrollTop() === 0) {
        let messageLoading =
          '<img src="images/chat/message-loading.gif" class="message-loading"/>';

        $(this).prepend(messageLoading);

        let targetId = $(this).data("chat");
        let skipMessage = $(this).find("div.bubble").length;
        let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

        let thisDom = $(this);

        $.get(
          `/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,
          function (data) {
            if (data.rightSideData.trim() === "") {
              alertify.notify("Không còn tin nhắn nào", "error", 7);
              thisDom.find("img.message-loading").remove();

              return false;
            }

            //Step 01: handle right side
            $(`.right .chat[data-chat=${targetId}]`).prepend(
              data.rightSideData
            );

            //Step 02: prevent scroll
            $(`.right .chat[data-chat=${targetId}]`).scrollTop(
              firstMessage.offset().top - currentOffset
            );

            //Step 03: handle image modal
            $(`#imagesModal_${targetId}`)
              .find("all-images")
              .append(data.imageModalData);

            //Step 04: call grid photo
            gridPhotos(5);

            //Step 05: handle attachment modal
            $(`#attachmentsModal_${targetId}`)
              .find("ul.list-attachments")
              .append(data.attachmentModalData);

            //Step 07: remove message loading
            thisDom.find("img.message-loading").remove();
          }
        );
      }
    });
}

$(document).ready(function () {
  readMoreMessages();
});
