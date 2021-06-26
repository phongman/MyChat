import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { truncateSync } from "fs";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  // role: {type: String, default: "user"},
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  removeById(id) {
    return this.deleteOne({ _id: id }).exec();
  },

  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },

  verifyAccount(token) {
    return this.updateOne(
      {
        "local.verifyToken": token,
      },
      {
        "local.isActive": true,
        "local.verifyToken": null,
      }
    ).exec();
  },

  findUserById(id) {
    return this.findById(id).exec();
  },

  findUserByIdForSession(id) {
    return this.findById(id, {"local.password": 0}).exec();
  },

  getUserDataById(id) {
    return this.findById(id, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
  },

  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },

  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  updateUser(id, item) {
    return this.updateOne(
      {
        _id: id,
      },
      item
    ).exec();
  },

  updateUserPassword(id, hashedPass) {
    return this.updateOne({ _id: id }, { "local.password": hashedPass }).exec();
  },

  /**
   *
   * @param {array} deprecatedUserIds
   * @param {string} keyword
   */
  findAllUserToAddContact(deprecatedUserIds, keyword) {
    return this.find(
      {
        $and: [
          {
            _id: { $nin: deprecatedUserIds },
          },
          {
            "local.isActive": true,
          },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } },
              { "local.email": { $regex: new RegExp(keyword, "i") } },
              { "facebook.email": { $regex: new RegExp(keyword, "i") } },
              { "google.email": { $regex: new RegExp(keyword, "i") } },
            ],
          },
        ],
      },
      { _id: 1, username: 1, address: 1, avatar: 1 }
    ).exec();
  },
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  },
};

module.exports = mongoose.model("user", UserSchema);
