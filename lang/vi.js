export const transValidation = {
  email_incorrect: "Invalid email",
  gender_incorrect: "Invalid gender",
  password_incorrect: "Invalid password",
  password_confirm_incorrect: "wrong password",
  update_username: "Username must be less than 3-30 characters",
  update_gender: "Opps ! Something went wrong",
  update_address: "Address must be between 3-30 characters",
  update_phone: "Phone in range 10-11 characters"
};

export const transErrors = {
  account_in_use: "Email is used",
  account_deleted: "Account is deleted",
  account_not_active: "Account is not activated",
  token_undefined: "Token undefined",
  login_failed: "Email or password is wrong",
  server_error: "Server error",
  avatar_type_error: "File is not valid", 
};

export const transSuccess = {
  user_created: (userEmail) => {
    return `Account <strong>${userEmail}<strong> created success`;
  },
  user_activated: 'User activated',
  login_success: "Login success",
  logout_success: "Logout success",
  avatar_updated: "Update avatar success",
  user_info_updated: "Update user info success",
};

export const transMail = {
  subject: "Your verification code",
  template: (linkVerify) => {
    return `
            <h2>Link của bạn nài</h2>
            <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        `;
  },
  send_fail: "Something went wrong"
};
