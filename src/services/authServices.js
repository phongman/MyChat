import UserModel from "../model/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { transErrors, transSuccess } from "../../lang/vi";

let saltRounds = 10;

let register = (email, password, gender) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);

    if (userByEmail) {
        if(userByEmail.deletedAt != null) {
            return reject(transErrors.account_deleted);
        }
        if(!userByEmail.local.isActive) {
            return reject(transErrors.account_not_active);
        }
      return reject(transErrors.account_in_use);
    }

    let salt = bcrypt.genSaltSync(saltRounds);

    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4(),
      },
    };

    let user = await UserModel.createNew(userItem);

    // resolve(user);
    resolve(transSuccess.user_created(user.local.email))
  });
};

module.exports = {
  register,
};
