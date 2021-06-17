import { validationResult } from "express-validator/check";
import {auth} from '../services';

const getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

const postRegister = async (req, res) => {
  let errorArr = [];
  let successArr = [];

  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((el) => {
      errorArr.push(el.msg);
    });

    req.flash("errors", errorArr);
    return res.redirect("/login-register");
    // res.status(500).json({error: errorArr})
  }

  try {
    const successMessage = await auth.register(req.body.email, req.body.password, req.body.gender, req.protocol, req.get("host"));    
    successArr.push(successMessage); 
    req.flash("success", successArr);
    res.redirect("/login-register")
    // res.status(200).json()
  } catch (err) {
    errorArr.push(err);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
    // res.status(500).json({error: errorArr})
  }
};

let verifyAccount = async (req, res) => {
  let errorArr= [];
  let successArr= [];

  try {
    let verifySuccess = await auth.verifyAccount(req.params.token);
    successArr.push(verifySuccess);

    req.flash("success", successArr);
    return res.redirect("/login-register");
    // res.status(200).json(sucessArr);
  } catch (error) {
    errorArr.push(err);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
    // res.status(500).json(errorArr)
  }
}

module.exports = { getLoginRegister, postRegister, verifyAccount };
