$(document).ready(function () {
  $("#link-read-more-notif").bind("click", function () {
    let skipNumber = $("ul.list-notifications").find("li").length;

    $("#link-read-more-notif").css("display", "none");
    $(".spin-read-more-notif").css("display", "inline-block");

    $.get(
      `/notification/read-more/?skipNumber=${skipNumber}`,
      function (notifications) {
        if (!notifications.length) {
            $("#link-read-more-notif").css("display", "inline-block");
            $(".spin-read-more-notif").css("display", "none");

            alertify.notify("Không còn thông báo nào", "error", 7);
            return false;
        };

        notifications.forEach(function(noti) {
            $("ul.list-notifications").append(`<li>${noti}</liv>`);
        })

        $("#link-read-more-notif").css("display", "inline-block");
        $(".spin-read-more-notif").css("display", "none");
      }
    );
  });
});
