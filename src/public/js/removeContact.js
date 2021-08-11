function removeContact() {
  $(".user-remove-contact")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      let username = $(this).parent().find("div.user-name p").text();

      Swal.fire({
        title: `Are you sure to remove ${username}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2ecc71",
        cancelButtonColor: "#ff7675",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (!result.value) {
          return false;
        }

        $.ajax({
          url: "/contact/remove-contact",
          method: "put",
          data: { uid: targetId },
          success: function (data) {
            if (data.success) {
              $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();

              decreaseNumberNotiContact("count-contacts");

              socket.emit("remove-contact", { contactId: targetId });

              // all steps handle chat after remove contact
              // step 0: check active
              let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass('active')

              // step 01: remove leftside.ejs
              $("#all-chat").find(`ul a[href="#uid_${targetId}"]`).remove();
              $("#user-chat").find(`ul a[href="#uid_${targetId}"]`).remove();

              // step 02: remove rightside.ejs
              $("#screen-chat").find(`div#to_${targetId}`).remove();

              // step 03: remove imageModal
              $("body").find(`div#imagesModal_${targetId}`).remove();

              // step 04: remove attachments modal
              $("body").find(`div#attachmentsModal_${targetId}`).remove();

              // step 05: click first conversation
              if(checkActive) {
                $("ul.people").find("li")[0].click();
              }
            }
          },
        });
      });
    });
}

socket.on("response-remove-contact", function (user) {
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotiContact("count-contacts");

  // all steps handle chat after remove contact
   // step 0: check active
   let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass('active')

  // step 01: remove leftside.ejs
  $("#all-chat").find(`ul a[href="#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul a[href="#uid_${user.id}"]`).remove();

  // step 02: remove rightside.ejs
  $("#screen-chat").find(`div#to_${user.id}`).remove();

  // step 03: remove imageModal
  $("body").find(`div#imagesModal_${user.id}`).remove();

  // step 04: remove attachments modal
  $("body").find(`div#attachmentsModal_${user.id}`).remove();

  // step 05: click first conversation
  if(checkActive) {
    $("ul.people").find("li")[0].click();
  }
});

$(document).ready(function () {
  removeContact();
});
