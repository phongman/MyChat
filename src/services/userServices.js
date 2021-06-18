import UserModel from '../model/userModel';

/**
 * @param {userId} id 
 * @param {data update} item 
 * @returns 
 */
const updateUser = (id, item) => {
   return UserModel.updateUser(id, item);
};

module.exports = {
    updateUser,
}