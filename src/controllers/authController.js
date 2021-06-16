import { validationResult } from "express-validator/check";

const getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

const postRegister = (req, res) => {
  let errorArr = [];

  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((el) => {
      errorArr.push(el.msg);
    });
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
    // res.status(500).json({error: errorArr})
  }

  console.log(req.body);
};

module.exports = { getLoginRegister, postRegister };
