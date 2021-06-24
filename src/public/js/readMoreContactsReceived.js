$(document).ready(function () {
    $("#link-read-more-contacts-received").bind("click", function () {
      let skipNumber = $("#request-contact-received").find("li").length;
  
      $("#link-read-more-contacts-received").css("display", "none");
      $(".spin-read-more-contacts-received").css("display", "inline-block");
  
      $.get(
        `/contact/read-more-contacts-received/?skipNumber=${skipNumber}`,
        function (newContactsUsers) {
          if (!newContactsUsers.length) {
            $("#link-read-more-contacts-received").css("display", "inline-block");
            $(".spin-read-more-contacts-received").css("display", "none");
  
            alertify.notify("No more friends request", "error", 7);
            return false;
          }
  
          newContactsUsers.forEach(function (user) {
            $("#request-contact-received").find("ul").append(`<li class="_contactList" data-uid="${user._id}">
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
                class="user-accept-contact-received"
                data-uid="${user._id}"
              >
                Chấp nhận
              </div>
              <div
                class="user-remove-request-contact-received action-danger"
                data-uid="${user._id}"
              >
                Xóa yêu cầu
              </div>
            </div>
          </li>`);
          });

          removeRequestContactReceived();
          acceptRequestContact();
  
          $("#link-read-more-contacts-received").css("display", "inline-block");
          $(".spin-read-more-contacts-received").css("display", "none");
        }
      );
    });
  });
  