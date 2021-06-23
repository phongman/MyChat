function removeRequestContactSent() {
  $(".user-remove-request-contact-sent").bind("click", function () {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/remove-request-contact-sent",
      method: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {
          $("#find-user ")
            .find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`)
            .hide();
          $("#find-user ")
            .find(`div.user-add-new-contact[data-uid = ${targetId}]`)
            .css("display", "inline-block");
            
            decreaseNumberNotiContact("count-request-contact-sent")

            $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();

            socket.emit("remove-request-contact-sent", { contactId: targetId });
        }
      },
    });
  });
}

socket.on("response-remove-request-contact-sent", function (user) {
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();

  $("ul.list-notifications").find(`li>div[data-uid=${user.id}]`).parent().remove();
  
  // xoa o modal yeu cau ket ban
  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotiContact("count-request-contact-received");

  decreaseNumberNotification("noti_contact_counter", 1);
  decreaseNumberNotification("noti_counter", 1);
});

$(document).ready(function() {
  removeRequestContactSent();
})