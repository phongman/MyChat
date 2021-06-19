import UserModel from '../model/userModel';
import { transErrors } from '../../lang/vi';
import bcrypt from 'bcrypt';

const saltRound = 10;

/**
 * @param {userId} id 
 * @param {data update} item 
 * @returns 
 */
const updateUser = (id, item) => {
   return UserModel.updateUser(id, item);
};

/**
 * 
 * @param {userId} id 
 * @param {dataUpdate} item 
 * @returns 
 */
const updatePassword = (id, dataPassword) => {
    return new Promise(async (resolve, reject) => {
        let currentUser = await UserModel.findUserById(id);

        if(!currentUser) return reject(transErrors.account_not_found);

        const checkPassword = await currentUser.comparePassword(dataPassword.currentPassword);

        if(!checkPassword) return reject(transErrors.password_not_match);

        let salt = bcrypt.genSaltSync(saltRound);

        await UserModel.updateUserPassword(id, bcrypt.hashSync(dataPassword.newPassword, salt));

        resolve(true);
    })
}

module.exports = {
    updateUser,
    updatePassword
}