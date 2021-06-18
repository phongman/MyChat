import UserModel from "../model/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { transErrors, transSuccess, transMail } from "../../lang/vi";
import sendMail from '../config/mailer';

let saltRounds = 10;

let register = (email, password, gender, protocol, host) => {
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

    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`

    //sendMail 
    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then((success) => {
         resolve(transSuccess.user_created(user.local.email))
      })
      .catch(async err => {
        console.log(err);
        // remove user
        await UserModel.removeById(user._id);
        
        reject(transMail.send_fail)
      }) 

    // resolve(user);
  });
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModel.findByToken();

    if(!userByToken) {
      return reject(transErrors.token_undefined)
    }

    await UserModel.verifyAccount(token);

    resolve(transSuccess.user_activated);
  })
}

module.exports = {
  register,
  verifyAccount
};
