require("dotenv").config();
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import UserModel from "../../model/userModel";
import { transErrors, transSuccess } from "../../../lang/vi";

let googleStrategy = passportGoogle.Strategy;

/**
 * Valid user account type: google
 */

let googleAppId = process.env.GOOGLE_APP_ID;
let googleSecret = process.env.GOOGLE_APP_SECRET;
let googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

let initPassportGoogle = () => {
  passport.use(
    new googleStrategy(
      {
        clientID: googleAppId,
        clientSecret: googleSecret,
        callbackURL: googleCallbackUrl,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
            console.log('profile', profile);

        let user = await UserModel.findByGoogleUid(profile.id);

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
            google: {
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

module.exports = initPassportGoogle;
