let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function () {
    let fileData = $(this).prop("files")[0];

    let mime = ["image/png", "image/jpg", "image/jpeg"];

    let limit = 1048576; /**1MB */

    if ($.inArray(fileData.type, mime) === -1) {
      alertify.notify("File is not valid. Only allow jpg & png", "error", 7);

      $(this).val(null);

      return false;
    }

    // if (fileData.size > limit) {
    //   alertify.notify("Max size is 1MB", "error", 7);

    //   $(this).val(null);

    //   return false;
    // }

    if (typeof FileReader != undefined) {
      let imagePreview = $("#image-edit-profile");

      imagePreview.empty();

      let fileReader = new FileReader();

      fileReader.onload = function (el) {
        $("<img>", {
          src: el.target.result,
          class: "avatar img-circle",
          alt: "avatar",
          id: "user-modal-avatar",
        }).appendTo(imagePreview);
      };

      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();

      formData.append("avatar", fileData);

      userAvatar = formData;

    } else {
      alertify.notify("Your browser not supported FileReader", "error", 7);
    }
  });

  $("#input-change-username").bind("change", function() {
    userInfo.username = $(this).val();
  });
  $("#input-change-gender-male").bind("click", function() {
    userInfo.gender = $(this).val();
  });
  $("#input-change-gender-female").bind("click", function() {
    userInfo.gender = $(this).val();
  });
  $("#input-change-address").bind("change", function() {
    userInfo.address = $(this).val();
  });
  $("#input-change-phone").bind("change", function() {
    userInfo.phone = $(this).val();
  });
}

$(document).ready(function () {
  updateUserInfo();

  originAvatarSrc = $("#user-modal-avatar").attr("src")

  $("#input-btn-update-user").bind("click", function() {
      if($.isEmptyObject(userInfo) && !userAvatar) {
        alertify.notify("You have to change your information before update", "error", 7);
        return false;
    }

    $.ajax({
        url: "user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function(result) {
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");
               
            // update avatar navbar
            $(".navbar-avatar").attr("src", result.avatar);

            // update origin
            originAvatarSrc = result.avatar;

            //reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error) {
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");
        
            //reset all
            $("#input-btn-cancel-update-user").click();
        }
    })

  })

  $("#input-btn-cancel-update-user").bind("click", function() {
      userAvatar= null;
      userInfo={};
      $("#input-change-avatar").val(null);
      $("#user-modal-avatar").attr("src", originAvatarSrc);
  })
});
