require("dotenv").config();
import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "../../model/userModel";
import { transErrors, transSuccess } from "../../../lang/vi";

let facebookStrategy = passportFacebook.Strategy;

/**
 * Valid user account type: facebook
 */

let fbAppId = process.env.FB_APP_ID;
let fbSecret = process.env.FB_APP_SECRET;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;

let initPassportFacebook = () => {
  passport.use(
    new facebookStrategy(
      {
        clientID: fbAppId,
        clientSecret: fbSecret,
        callbackURL: fbCallbackUrl,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findByFacebookUid(profile.id);

          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.login_success)
            );
          }

          let newUserItem = {
            username: profile.displayName,
            gender: profile.gender,
            local: {
              isActive: true,
            },
            facebook: {
              uid: profile.id,
              token: accessToken,
              email: profile.emails[0].value,
            },
          };

          let newUser = await UserModel.createNew(newUserItem);

          return done(
            null,
            newUser,
            req.flash("success", transSuccess.login_success)
          );

        } catch (error) {
          console.log(error);
          return done(
            null,
            false,
            req.flash("errors", transErrors.server_error)
          );
          //done(null, false)
        }
      }
    )
  );

  // Save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findUserById(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(err, null);
      });
  });
};

module.exports = initPassportFacebook;
