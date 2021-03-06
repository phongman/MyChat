let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function () {
    let fileData = $(this).prop("files")[0];

    let mime = ["image/png", "image/jpg", "image/jpeg"];

    let limit = 1048576; /**1MB */

    if ($.inArray(fileData.type, mime) === -1) {
      alertify.notify("Ảnh không hợp lệ", "error", 7);

      $(this).val(null);

      return false;
    }

    if (fileData.size > limit) {
      alertify.notify("Ảnh giới hạn 1MB 1MB", "error", 7);

      $(this).val(null);

      return false;
    }

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
      /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );

    if (
      !regexUsername.test(username) ||
      username.length < 3 ||
      username.length > 17
    ) {
      alertify.notify("Username có độ dài 3-17 kí tự", "error", 7);

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
      alertify.notify("Địa chỉ có độ dài 3-30 kí tự", "error", 7);

      $(this).val(originUserInfo.address);

      delete userInfo.address;

      return false;
    }

    userInfo.address = address;
  });
  $("#input-change-phone").bind("change", function () {
    let phone = $(this).val();

    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);

    if (!regexPhone.test(phone)) {
      alertify.notify("Số điện thoại từ 10-11 kí tự", "error", 7);

      $(this).val(originUserInfo.phone);

      delete userInfo.phone;

      return false;
    }

    userInfo.phone = phone;
  });

  $("#input-change-current-password").bind("change", function () {
    let currentPassword = $(this).val();

    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    );

    if (!regexPassword.test(currentPassword)) {
      alertify.notify("Mật khẩu có độ dài 8-30 kí tự gồm chữ hoa, chữ thường, kí tự đặc biệt", "error", 7);

      $(this).val(null);

      delete userUpdatePassword.currentPassword;

      return false;
    }

    userUpdatePassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").bind("change", function () {
    let newPassword = $(this).val();

    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    );

    if (!regexPassword.test(newPassword)) {
      alertify.notify("Mật khẩu có độ dài 8-30 kí tự gồm chữ hoa, chữ thường, kí tự đặc biệt", "error", 7);

      $(this).val(null);

      delete userUpdatePassword.newPassword;

      return false;
    }

    userUpdatePassword.newPassword = newPassword;
  });

  $("#input-change-confirm-new-password").bind("change", function () {
    let confirmNewPassword = $(this).val();

    if (!userUpdatePassword.newPassword) {
      alertify.notify("Mật khẩu mới không được để trống", "error", 7);

      $(this).val(null);

      delete userUpdatePassword.confirmNewPassword;

      return false;
    }

    if (confirmNewPassword !== userUpdatePassword.newPassword) {
      alertify.notify("Mật khẩu không khớp", "error", 7);

      $(this).val(null);

      delete userUpdatePassword.confirmNewPassword;

      return false;
    }

    userUpdatePassword.confirmNewPassword = confirmNewPassword;
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

function callLogout() {
  let timerInterval;
  Swal.fire({
    position: "top-end",
    title: "Auto close after 5s!",
    html: "Time: <strong></strong> milliseconds.",
    timer: 5000,
    timerProgressBar: true,
    onBeforeOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(
          Swal.getTimerLeft() / 1000
        );
      }, 1000);
    },
    onClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    $.get("/logout", function () {
      location.reload();
    });
  });
}

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "put",
    data: userUpdatePassword,
    success: function (result) {
      $(".user-modal-password-alert-success").find("span").text(result.message);
      $(".user-modal-password-alert-success").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user").click();

      //logout after change password
      callLogout();
    },
    error: function (error) {
      $(".user-modal-password-alert-error")
        .find("span")
        .text(error.responseText);
      $(".user-modal-password-alert-error").css("display", "block");

      //reset all
      $("#input-btn-cancel-update-user-password").click();
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
        "Không có thông tin thay đổi",
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

  $("#input-btn-update-user-password").bind("click", function () {
    if (
      !userUpdatePassword.currentPassword ||
      !userUpdatePassword.newPassword ||
      !userUpdatePassword.confirmNewPassword
    ) {
      alertify.notify("Bạn phải điền đủ thông tin", "error", 7);

      return false;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#ff7675",
      confirmButtonColor: "#2ecc71",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (!result.value) {
        $("#input-btn-cancel-update-user-password").click();
        return false;
      }

      return callUpdateUserPassword();
    });
  });

  $("#input-btn-cancel-update-user-password").bind("click", function () {
    userUpdatePassword = {};

    $("#input-change-current-password").val(null);
    $("#input-change-confirm-new-password").val(null);
    $("#input-change-new-password").val(null);
  });
});
