export const transValidation = {
  email_incorrect: "Email không hợp lệ",
  gender_incorrect: "Thông tin không hợp lệ",
  password_incorrect: "Mật khẩu có độ dài 8-30 kí tự gồm chữ hoa, chữ thường, kí tự đặc biệt",
  password_confirm_incorrect: "Mật khẩu không khớp",
  update_username: "Username có độ dài 3-17 kí tự",
  update_gender: "Thông tin không hợp lệ",
  update_address: "Địa chỉ có độ dài 3-30 kí tự",
  update_phone: "Số điện thoại từ 10-11 kí tự",
  password_not_match: "Mật khẩu không khớp",
  message_text_emoji_incorrect: "Tin nhắn không hợp lệ",
  add_new_group_incorrect: "Cần ít nhất 3 người để tạo nhóm",
  add_new_group_name_incorrect: "Cần ít nhất 3 người để tạo nhóm",
};

export const transErrors = {
  account_in_use: "Email đã được sử dụng",
  account_deleted: "Tài khoản đã bị xóa",
  account_not_active: "Tài khoản chưa được kích hoạt",
  token_undefined: "Token undefined",
  login_failed: "Email hoặc mật khẩu không đúng",
  server_error: "Server error",
  avatar_type_error: "File không hợp lệ", 
  account_not_found: "Không tìm thấy tài khoản",
  password_not_match: "Mật khẩu không khớp",
  keyword_find_user: "Từ khóa không hợp lệ",
  conversation_not_found: "Không tìm thấy cuộc trò chuyện",
  image_message_error: 'Ảnh không hợp lệ',
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
  password_update_success: "Password updated"
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
