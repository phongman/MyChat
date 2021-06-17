import { check } from "express-validator/check";
import { transValidation } from "../../lang/vi";

let register = [
  check("email", transValidation.email_incorrect).isEmail().trim(),
  check("gender", transValidation.gender_incorrect).isIn(["male", "female"]),
  check("password", transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    ),
  check(
    "password_confirmation",
    transValidation.password_confirm_incorrect
  ).custom((val, { req }) => {
    return val === req.body.password;
  }),
];

let verifyAccount = (req, res) => {

};

module.exports = {
  register,
  verifyAccount
};