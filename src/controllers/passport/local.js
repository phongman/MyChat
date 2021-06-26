import passport from "passport";
import passportLocal from "passport-local";
import UserModel from '../../model/userModel';
import { transErrors, transSuccess } from '../../../lang/vi';

let localStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */

let initPassportLocal = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email);

            if(!user) {
                return done(null, false, req.flash("errors", transErrors.login_failed));
                // return done(null, errors)
            }

            if(!user.local.isActive) {
                return done(null, false, req.flash("errors", transErrors.account_not_active));
            }

            let checkPassword = await user.comparePassword(password);

            if(!checkPassword) {
                return done(null, false, req.flash("errors", transErrors.login_failed))
                // return done(null, errors)
            }

            return done(null, user, req.flash("success", transSuccess.login_success))

        } catch (error) {
            console.log(error);
            return done(null, false, req.flash("errors", transErrors.server_error))
            //done(null, false)
        }
      }
    )
  );

  // Save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  })

  passport.deserializeUser((id, done) => {
      UserModel.findUserByIdForSession(id)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err, null)
        })
  })
};

module.exports = initPassportLocal;
