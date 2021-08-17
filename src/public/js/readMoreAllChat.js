$(document).ready(function () {
    $("#link-read-more-all-chat").bind("click", function () {
        let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
        let skipGroup = $("#all-chat").find("li.group-chat").length;
        
      $("#link-read-more-all-chat").css("display", "none");
      $(".spin-read-more-all-chat").css("display", "inline-block");
  
      $.get(
        `/message/read-more-all-chat/?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,
        function (data) {
          if(data.leftSideData.trim() === "") {
            $("#link-read-more-all-chat").css("display", "inline-block");
            $(".spin-read-more-all-chat").css("display", "none");

            alertify.notify("Không còn cuộc trò chuyện nào", "error", 7);
            return false;
          }

          //Step01: handle leftSide
          $("#all-chat").find("ul").append(data.leftSideData);

          //Step02: handle scroll left
          resizeNiceScrollLeft();
          nineScrollLeft();

          //Step03: handleRightSide
          $('#screen-chat').append(data.rightSideData)

          //Step04: call function screen chat
          changeScreenChat();

          //Step05: handle imageModal
          $("body").append(data.imageModalData);

          // step 6: call function gridPhotos
          gridPhotos(5);

          //Step08: handle attachmentModal
          $("body").append(data.attachmentModalData);

          //Step09: update online
          socket.emit("check-status");
          
          // call read more messages
          readMoreMessages()

          $("#link-read-more-all-chat").css("display", "inline-block");
          $(".spin-read-more-all-chat").css("display", "none");
        }
      );
    });
  });
