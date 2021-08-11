function addFriendsToGroup() {
  $("ul#group-chat-friends")
    .find("div.add-user")
    .bind("click", function () {
      let uid = $(this).data("uid");
      $(this).remove();
      let html = $("ul#group-chat-friends")
        .find("div[data-uid=" + uid + "]")
        .html();

      let promise = new Promise(function (resolve, reject) {
        $("ul#friends-added").append(html);
        $("#groupChatModal .list-user-added").show();
        resolve(true);
      });
      promise.then(function (success) {
        $("ul#group-chat-friends")
          .find("div[data-uid=" + uid + "]")
          .remove();
      });
    });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function () {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function (index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriends(e) {
  if (e.which === 13 || e.type === "click") {
    let keyword = $("#input-search-friends-to-add-group-chat").val();

    const regexKeyword = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );

    if (!keyword.length) {
      alertify.notify("Bạn chưa nhập từ khóa", "error", 7);
      return false;
    }

    if (!regexKeyword.test(keyword)) {
      alertify.notify("Từ khóa không hợp lệ", "error", 7);
      return false;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $("#group-chat-friends").html(data);

      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat() {
  $("#btn-create-group-chat")
    .unbind("click")
    .on("click", function () {
      let countUsers = $("ul#friends-added").find("li");

      if (countUsers.length < 2) {
        alertify.notify("Cần ít nhất 3 người để tạo nhóm", "error", 7);
        return false;
      }

      let groupChatName = $("#input-name-group-chat").val();
      let regexGroupname = new RegExp(
        /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
      );

      if (
        !regexGroupname.test(groupChatName) ||
        groupChatName.length < 5 ||
        groupChatName.length > 30
      ) {
        alertify.notify(
          "Tên nhóm từ 5-30 kí tự",
          "error",
          7
        );
        return false;
      }

      let arrayIds = [];

      $("ul#friends-added")
        .find("li")
        .each(function (index, item) {
          arrayIds.push({ userId: $(item).data("uid") });
        });

      Swal.fire({
        title: `Bạn chắc chắn muốn tạo nhóm &nbsp; ${groupChatName}?`,
        icon: "info",
        showCancelButton: true,
        cancelButtonColor: "#ff7675",
        confirmButtonColor: "#2ecc71",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (!result.value) {
          return false;
        }

        $.post(
          "/group-chat/add-new",
          {
            arrayIds: arrayIds,
            groupChatName: groupChatName,
          },
          function (data) {
            //step1: hide modal, reset modal
            $("#input-name-group-chat").val("");
            $("#btn-cancel-group-chat").click();
            $("#groupChatModal").modal("hide");

            //step2: handle leftside.ejs
            let subGroupChatName = data.groupChat.name;
            if (subGroupChatName.length > 15) {
              subGroupChatName = subGroupChatName.substr(0, 11);
            }

            let leftSideData = `
        <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}" >
        <li class="person group-chat" data-chat="${data.groupChat._id}">
          <div class="left-avatar">
            <img src="images/users/group-avatar-trungquandev.png" alt="" />
          </div>
          <span class="name">
            <span class="group-chat-name">
            ${subGroupChatName}<span>...</span>
          </span> 
          </span>
          <span class="time">
          </span>
          <span class="preview">
          </span>
        </li>
      </a>
        `;
            $("#all-chat").find("ul").prepend(leftSideData);
            $("#group-chat").find("ul").prepend(leftSideData);

            // step03: handle rightSide
            let rightSideData = `
        <div
        class="right tab-pane"
        data-chat="${data.groupChat._id}"
        id="to_${data.groupChat._id}"
      >
        <div class="top">
          <span>To: <span class="name">${data.groupChat.name}</span></span>
          <span class="chat-menu-right">
            <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachs" data-toggle="modal">
              Tệp đính kèm
              <i class="fa fa-paperclip"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-members" data-toggle="modal">
              <span class="show-number-members">${data.groupChat.userAmount}</span>
              <i class="fa fa-users"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
              <span class="show-number-messages">${data.groupChat.messageAmount}</span>
              <i class="fa fa-comment-o"></i>
            </a>
          </span>
        </div>
        <div class="content-chat">
          <div class="chat" data-chat="${data.groupChat._id}">
           
          </div>
        </div>
        <div class="write" data-chat="">
          <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}" />
          <div class="icons">
            <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"
              ><i class="fa fa-smile-o"></i
            ></a>
            <label for="image-chat-${data.groupChat._id}">
              <input
                type="file"
                id="image-chat-${data.groupChat._id}"
                name="my-image-chat"
                class="image-chat chat-in-group"
                data-chat="${data.groupChat._id}"
              />
              <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${data.groupChat._id}">
              <input
                type="file"
                id="attachment-chat-${data.groupChat._id}"
                name="my-attachment-chat"
                class="attachment-chat chat-in-group"
                data-chat="${data.groupChat._id}"
              />
              <i class="fa fa-paperclip"></i>
            </label>
            <a
              href="javascript:void(0)"
              id="video-chat-group"
            >
              <i class="fa fa-video-camera"></i>
            </a>
          </div>
        </div>
      </div>
        `;

            $("#screen-chat").prepend(rightSideData);

            // step 4: change screen chat
            changeScreenChat();

            // step 5: handle image modal
            let imageModalData = `
        <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
              <h4 class="modal-title">Tất cả ảnh trong cuộc trò chuyện.</h4>
            </div>
            <div class="modal-body">
              <div class="all-images" style="visibility: hidden"></div>
            </div>
          </div>
        </div>
      </div>
        `;

            $("body").append(imageModalData);

            // step 6: call function gridPhotos
            gridPhotos(5);

            // step 7: handle attachment modal
            let attachmentModalData = `
      <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
            <h4 class="modal-title">Tất cả file trong cuộc trò chuyện.</h4>
          </div>
          <div class="modal-body">
            <ul class="list-attachments"></ul>
          </div>
        </div>
      </div>
    </div>
      `;
            $("body").append(attachmentModalData);

            // step 8: emit new group created
            socket.emit("new-group-created", { groupChat: data.groupChat });
          
            // step 09: nothing to code

            //step10: check status
            socket.emit("check-status");
          }
        ).fail(function (res) {
          alertify.notify(res.responseText, "error", 7);
        });
      });
    });
}

$(document).ready(function () {
  $("#input-search-friends-to-add-group-chat").bind(
    "keypress",
    callSearchFriends
  );

  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);

  callCreateGroupChat();

  socket.on("response-new-group-created", function (res) {
    //step1: hide modal, reset modal: nothing to code

    //step2: handle leftside.ejs
    let subGroupChatName = res.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 11);
    }

    let leftSideData = `
    <a href="#uid_${res.groupChat._id}" class="room-chat" data-target="#to_${res.groupChat._id}" >
    <li class="person group-chat" data-chat="${res.groupChat._id}">
      <div class="left-avatar">
        <img src="images/users/group-avatar-trungquandev.png" alt="" />
      </div>
      <span class="name">
        <span class="group-chat-name">
        ${subGroupChatName}<span>...</span>
      </span> 
      </span>
      <span class="time">
      </span>
      <span class="preview">
      </span>
    </li>
  </a>
    `;
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#group-chat").find("ul").prepend(leftSideData);

    // step03: handle rightSide
    let rightSideData = `
    <div
    class="right tab-pane"
    data-chat="${res.groupChat._id}"
    id="to_${res.groupChat._id}"
  >
    <div class="top">
      <span>To: <span class="name">${res.groupChat.name}</span></span>
      <span class="chat-menu-right">
        <a href="#attachmentsModal_${res.groupChat._id}" class="show-attachs" data-toggle="modal">
          Tệp đính kèm
          <i class="fa fa-paperclip"></i>
        </a>
      </span>
      <span class="chat-menu-right">
        <a href="javascript:void(0)">&nbsp;</a>
      </span>
      <span class="chat-menu-right">
        <a href="#imagesModal_${res.groupChat._id}" class="show-images" data-toggle="modal">
          Hình ảnh
          <i class="fa fa-photo"></i>
        </a>
      </span>
      <span class="chat-menu-right">
        <a href="javascript:void(0)">&nbsp;</a>
      </span>
      <span class="chat-menu-right">
        <a href="javascript:void(0)" class="number-members" data-toggle="modal">
          <span class="show-number-members">${res.groupChat.userAmount}</span>
          <i class="fa fa-users"></i>
        </a>
      </span>
      <span class="chat-menu-right">
        <a href="javascript:void(0)">&nbsp;</a>
      </span>
      <span class="chat-menu-right">
        <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
          <span class="show-number-messages">${res.groupChat.messageAmount}</span>
          <i class="fa fa-comment-o"></i>
        </a>
      </span>
    </div>
    <div class="content-chat">
      <div class="chat" data-chat="${res.groupChat._id}">
       
      </div>
    </div>
    <div class="write" data-chat="">
      <input type="text" class="write-chat chat-in-group" id="write-chat-${res.groupChat._id}" data-chat="${res.groupChat._id}" />
      <div class="icons">
        <a href="#" class="icon-chat" data-chat="${res.groupChat._id}"
          ><i class="fa fa-smile-o"></i
        ></a>
        <label for="image-chat-${res.groupChat._id}">
          <input
            type="file"
            id="image-chat-${res.groupChat._id}"
            name="my-image-chat"
            class="image-chat chat-in-group"
            data-chat="${res.groupChat._id}"
          />
          <i class="fa fa-photo"></i>
        </label>
        <label for="attachment-chat-${res.groupChat._id}">
          <input
            type="file"
            id="attachment-chat-${res.groupChat._id}"
            name="my-attachment-chat"
            class="attachment-chat chat-in-group"
            data-chat="${res.groupChat._id}"
          />
          <i class="fa fa-paperclip"></i>
        </label>
        <a
          href="javascript:void(0)"
          id="video-chat-group"
        >
          <i class="fa fa-video-camera"></i>
        </a>
      </div>
    </div>
  </div>
    `;

    $("#screen-chat").prepend(rightSideData);

    // step 4: change screen chat
    changeScreenChat();

    // step 5: handle image modal
    let imageModalData = `
    <div class="modal fade" id="imagesModal_${res.groupChat._id}" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
          <h4 class="modal-title">Tất cả ảnh trong cuộc trò chuyện.</h4>
        </div>
        <div class="modal-body">
          <div class="all-images" style="visibility: hidden"></div>
        </div>
      </div>
    </div>
  </div>
    `;

    $("body").append(imageModalData);

    // step 6: call function gridPhotos
    gridPhotos(5);

    // step 7: handle attachment modal
    let attachmentModalData = `
  <div class="modal fade" id="attachmentsModal_${res.groupChat._id}" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">
          &times;
        </button>
        <h4 class="modal-title">Tất cả file trong cuộc trò chuyện.</h4>
      </div>
      <div class="modal-body">
        <ul class="list-attachments"></ul>
      </div>
    </div>
  </div>
</div>
  `;
    $("body").append(attachmentModalData);

    // step 8: emit new group created: nothing to code

    // step 9: emit
    socket.emit("member-received-group-chat", {
      groupChatId: res.groupChat._id,
    });

    // step 10: update online
    socket.emit("check-status");
  });
});
