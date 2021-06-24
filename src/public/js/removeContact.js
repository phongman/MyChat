function removeContact() {
  $(".user-remove-contact")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      let username = $(this).parent().find("div.user-name p").text();

      Swal.fire({
        title: `Are you sure to remove ${username}?`,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ecc71',
        cancelButtonColor: '#ff7675',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if(!result.value) {
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
              }
            },
          });
      })
    });
}

socket.on("response-remove-contact", function (user) {
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotiContact("count-contacts");
});

$(document).ready(function () {
  removeContact();
});
