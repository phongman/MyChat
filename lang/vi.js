export const transValidation = {
  email_incorrect: "Invalid email",
  gender_incorrect: "Invalid gender",
  password_incorrect: "Invalid password",
  password_confirm_incorrect: "wrong password",
};

export const transErrors = {
  account_in_use: "Email is used",
  account_deleted: "Account is deleted",
  account_not_active: "Account is not activated",
  token_undefined: "Token undefined"
};

export const transSuccess = {
  user_created: (userEmail) => {
    return `Account <strong>${userEmail}<strong> created success`;
  },
  user_activated: 'User activated'
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
