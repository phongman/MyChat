const socket = io();

function nineScrollLeft() {
  $(".left").niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: "#ECECEC",
    cursorwidth: "7px",
    scrollspeed: 50,
  });
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: "#ECECEC",
    cursorwidth: "7px",
    scrollspeed: 50,
  });
  $(`.right .chat[data-chat=${divId}]`).scrollTop(
    $(`.right .chat[data-chat=${divId}]`)[0].scrollHeight
  );
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: "top",
    filtersPosition: "bottom",
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function() {
        textAndEmojiChat(divId);

        typingOn(divId);
      },
      blur: function() {
        typingOff(divId);
      }
    },
  });
  $(".icon-chat").bind("click", function (event) {
    event.preventDefault();
    $(".emojionearea-button").click();
    $(".emojionearea-editor").focus();
  });
}

function spinLoaded() {
  $(".master-loader").css("display", "none");
}

function spinLoading() {
  $(".master-loader").css("display", "block");
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function () {
      spinLoading();
    })
    .ajaxStop(function () {
      spinLoaded();
    });
}

function showModalContacts() {
  $("#show-modal-contacts").click(function () {
    $(this).find(".noti_contact_counter").fadeOut("slow");
  });
}

function configNotification() {
  $("#noti_Button").click(function () {
    $("#notifications").fadeToggle("fast", "linear");
    // $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function () {
    $("#notifications").fadeOut("fast", "linear");
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images")
    .unbind("click")
    .on("click", function () {
      let href = $(this).attr("href");
      let modalImageId = href.replace("#", "");

      let originDataImage = $(`#${modalImageId}`).find('div.modal-body').html();

      let countRows = Math.ceil(
        $(`#${modalImageId}`).find("div.all-images>img").length / layoutNumber
      );
      let layoutStr = new Array(countRows).fill(layoutNumber).join("");

      $(`#${modalImageId}`)
        .find("div.all-images")
        .photosetGrid({
          highresLinks: true,
          rel: "withhearts-gallery",
          gutter: "2px",
          layout: layoutStr,
          onComplete: function () {
            $(`#${modalImageId}`).find(".all-images").css({
              visibility: "visible",
            });
            $(`#${modalImageId}`).find(".all-images a").colorbox({
              photo: true,
              scalePhotos: true,
              maxHeight: "90%",
              maxWidth: "90%",
            });
          },
        });
      
          // close modal
          $(`#${modalImageId}`).on('hidden.bs.modal', function() {
            $(this).find('div.modal-body').html(originDataImage);
          })
    });
}

function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 7);
  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    let optionSelected = $("option:selected", this);

    optionSelected.tab("show");

    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  });
}

function changeScreenChat() {
  $(".room-chat")
    .unbind("click")
    .on("click", function () {
      let divId = $(this).find("li").data("chat");

      $(".person").removeClass("active");
      $(`.person[data-chat=${divId}]`).addClass("active");
      $(this).tab("show");

      nineScrollRight(divId);

        // B???t emoji, tham s??? truy???n v??o l?? id c???a box nh???p n???i dung tin nh???n
      enableEmojioneArea(divId);

      // chat image
      imageChat(divId);

      // attachment chat
      attachmentChat(divId);

      // video call
      videoChat(divId);
    });
}

function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
}

function resizeNiceScrollLeft() {
  $(".left").getNiceScroll().resize();
}

$(document).ready(function () {
  // Hide s??? th??ng b??o tr??n ?????u icon m??? modal contact
  showModalContacts();

  // B???t t???t popup notification
  configNotification();

  // C???u h??nh thanh cu???n
  nineScrollLeft();

  // Icon loading khi ch???y ajax
  ajaxLoading();

  // Hi???n th??? h??nh ???nh grid slide trong modal t???t c??? ???nh, tham s??? truy???n v??o l?? s??? ???nh ???????c hi???n th??? tr??n 1 h??ng.
  // Tham s??? ch??? ???????c ph??p trong kho???ng t??? 1 ?????n 5
  gridPhotos(5);

  // flash message
  flashMasterNotify();

  // change type chat
  changeTypeChat();

  // change screen chat
  changeScreenChat();

  // auto focus first message
  if($("ul.people").find("li").length) {
    $("ul.people").find("li")[0].click();
  }

  $("#video-chat-group").bind("click", function() {
    alertify.notify("Not supported yet", "error", 7);
  })

});
