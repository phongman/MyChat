import express from "express";
import { home, auth } from '../controllers';

let router = express.Router();

/**
 *  Init routes
 * @param app from exactly express module
 */

let initRoutes = (app) => {
  router.get("/", home.getHome);

  router.get("/register", auth.getLoginRegister);

  return app.use("/", router);
};

module.exports = initRoutes;