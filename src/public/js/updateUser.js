let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

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

  $("#input-change-username").bind("change", function () {
    let username = $(this).val();
    let regexUsername = new RegExp(
      "^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$"
    );

    if (
      !regexUsername.test(username) ||
      username.length < 3 ||
      username.length > 17
    ) {
      alertify.notify(
        "Username must be less than 3-17 characters",
        "error",
        7
      );

      $(this).val(originUserInfo.username);

      delete userInfo.username;

      return false;
    }

    userInfo.username = username;
  });
  $("#input-change-gender-male").bind("click", function () {
    let gender = $(this).val();
    if (gender !== "male") {
      alertify.notify("Opps ! Something went wrong", "error", 7);

      $(this).val(originUserInfo.gender);

      delete userInfo.gender;

      return false;
    }

    userInfo.gender = gender;
  });
  $("#input-change-gender-female").bind("click", function () {
    let gender = $(this).val();
    if (gender !== "female") {
      alertify.notify("Opps ! Something went wrong", "error", 7);

      $(this).val(originUserInfo.gender);

      delete userInfo.gender;

      return false;
    }

    userInfo.gender = gender;
  });
  $("#input-change-address").bind("change", function () {
    let address = $(this).val();

    if (address.length < 3 || address.length > 30) {
      alertify.notify("Address must be less than 3-30 characters", "error", 7);

      $(this).val(originUserInfo.address);

      delete userInfo.address;

      return false;
    }

    userInfo.address = address;
  });
  $("#input-change-phone").bind("change", function () {
    let phone = $(this).val();

    let regexPhone = new RegExp("^(0)[0-9]{9,10}$");

    if (!regexPhone.test(phone)) {
      alertify.notify("Phone in range 10-11 characters", "error", 7);

      $(this).val(originUserInfo.phone);

      delete userInfo.phone;

      return false;
    }

    userInfo.phone = phone;
  });
}

function callUpdateAvatar() {
  $.ajax({
    url: "user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      // update avatar navbar
      $(".navbar-avatar").attr("src", result.avatar);

      // update origin
      originAvatarSrc = result.avatar;

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function (error) {
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
  });
}

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function (result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      // update origin userinfo
      originUserInfo = {
        ...originUserInfo,
        ...userInfo,
      };

      $("#navbar-username").text(originUserInfo.username);

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function (error) {
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();
    },
  });
}

$(document).ready(function () {
  originAvatarSrc = $("#user-modal-avatar").attr("src");

  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: $("#input-change-gender-male").is(":checked")
      ? $("#input-change-gender-male").val()
      : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val(),
  };
  // update user info after change value
  updateUserInfo();

  $("#input-btn-update-user").bind("click", function () {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify(
        "You have to change your information before update",
        "error",
        7
      );
      return false;
    }

    if (userAvatar) {
      callUpdateAvatar();
    }

    if (!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").bind("click", function () {
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);
    $("#input-change-username").val(originUserInfo.username);
    originUserInfo.gender === "male"
      ? $("#input-change-gender-male").click()
      : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });
});
