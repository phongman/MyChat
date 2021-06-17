import express from "express";
import { home, auth } from "../controllers";
import { authValid } from "../validation";
import initPassportLocal from "../controllers/passport/local";
import passport from "passport";

//Init passport
initPassportLocal();

let router = express.Router();

/**
 *  Init routes
 * @param app from exactly express module
 */

let initRoutes = (app) => {
  router.get("/", home.getHome);

  router.get("/login-register", auth.getLoginRegister);

  router.post("/register", authValid.register, auth.postRegister);

  router.get("/verify/:token", auth.verifyAccount);

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login-register",
      successFlash: true,
      failureFlash: true,
    })
  );

  return app.use("/", router);
};

module.exports = initRoutes;
