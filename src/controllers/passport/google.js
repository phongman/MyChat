require("dotenv").config();
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import UserModel from "../../model/userModel";
import { transErrors, transSuccess } from "../../../lang/vi";
import ChatGroupModel from '../../model/chatGroupModel';

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

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UserModel.findUserByIdForSession(id);
      let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);
      
      user = user.toObject();

      user.chatGroupIds = getChatGroupIds;
      return done(null, user);

    } catch (error) {
      return done(error, null)
    }
  });
};

module.exports = initPassportGoogle;
