require("dotenv").config();
import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

/**
 * This variable save session to mongo
 */
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
  //   autRemove: "native",
});

/**
 * Config session for app
 */

let config = session({
  key: "express.sid",
  secret: "mySecret",
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});

module.exports = {
  config,
  sessionStore,
};
