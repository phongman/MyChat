function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: {
      targetUsers: targetUsers,
    },
    success: function (result) {
      if (result) {
        targetUsers.forEach(function (uid) {
          $(".noti_content")
            .find(`div[data-uid=${uid}]`)
            .removeClass("notif-unread");
          $("ul.list-notifications")
            .find(`li>div[data-uid=${uid}]`)
            .removeClass("notif-unread");
        });

        decreaseNumberNotification("noti_counter", targetUsers.length);
      }
    },
  });
}

$(document).ready(function () {
  $("#mark-noti-as-read").bind("click", function () {
    let targetUsers = [];

    $(".noti_content")
      .find("div.notif-unread")
      .each(function (index, noti) {
        targetUsers.push($(noti).data("uid"));
      });

    if (!targetUsers.length) {
      alertify.notify("No more message", "error", 7);
      return false;
    }

    markNotificationsAsRead(targetUsers);
  });

  $("#modal-mark-noti-as-read").bind("click", function () {
    let targetUsers = [];

    $("ul.list-notifications")
      .find("li>div.notif-unread")
      .each(function (index, noti) {
        targetUsers.push($(noti).data("uid"));
      });
    if (!targetUsers.length) {
      alertify.notify("No more message", "error", 7);
      return false;
    }

    markNotificationsAsRead(targetUsers);
  });
});
