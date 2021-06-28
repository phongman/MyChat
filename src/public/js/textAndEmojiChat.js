function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", function (el) {
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
        console.log(messageVal);
        console.log(targetId);

        $.post("/message/add-new-text-emoji", dataTextEmoji, function (data) {
            //success
          console.log(data.message);

        }).fail(function(res) {
            //errors
            alertify.notify(res.responseText, "error", 7)
        });
      }
    });
}
