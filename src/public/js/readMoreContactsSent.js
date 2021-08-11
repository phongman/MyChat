$(document).ready(function () {
  $("#link-read-more-contacts-sent").on("click", function () {
    let skipNumber = $("#request-contact-sent").find("li").length;

    $("#link-read-more-contacts-sent").css("display", "none");
    $(".spin-read-more-contacts-sent").css("display", "inline-block");

    $.get(
      `/contact/read-more-contacts-sent/?skipNumber=${skipNumber}`,
      function (newContactsUsers) {
        if (!newContactsUsers.length) {
          $("#link-read-more-contacts-sent").css("display", "inline-block");
          $(".spin-read-more-contacts-sent").css("display", "none");

          alertify.notify("Không còn lời mời nào", "error", 7);
          return false;
        }

        newContactsUsers.forEach(function (user) {
          $("#request-contact-sent").find("ul").append(`<li class="_contactList" data-uid="${user._id}">
          <div class="contactPanel">
            <div class="user-avatar">
              <img src="images/users/${user.avatar}" alt="" />
            </div>
            <div class="user-name">
              <p>${user.username}</p>
            </div>
            <br />
            <div class="user-address">
              <span>&nbsp ${user.address}</span>
            </div>
            <div
              class="user-remove-request-contact-sent action-danger display-important"
              data-uid="${user._id}"
            >
              Hủy yêu cầu
            </div>
          </div>
        </li>`);
        });

        removeRequestContactSent();

        $("#link-read-more-contacts-sent").css("display", "inline-block");
        $(".spin-read-more-contacts-sent").css("display", "none");
      }
    );
  });
});
