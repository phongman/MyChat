import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   *
   * @param {string} userId
   */
  findAllByUser(userId) {
    return this.find({
      $or: [{ userId: userId }, { contactId: userId }],
    }).exec();
  },

  /**
   *
   * @param {id} userId
   * @param {id} contactId
   * @returns
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] },
      ],
    }).exec();
  },

  /**
   * remove contact
   * @param {id} userId
   * @param {id} contactId
   * @returns
   */
  removeContact(userId, contactId) {
    return this.deleteOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }, {status: true}] },
        { $and: [{ userId: contactId }, { contactId: userId }, {status: true}] },
      ],
    }).exec();
  },

  /**
   * remove request contact sent
   * @param {string} userId
   * @param {string} contactId
   * @returns
   */
  removeRequestContactSent(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: userId }, { contactId: contactId }, { status: false }],
    }).exec();
  },

  /**
   * Remove request contact received
   * @param {string} userId
   * @param {string} contactId
   * @returns
   */
  removeRequestContactReceived(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
    }).exec();
  },

  /**
   * Accept request contact received
   * @param {string} userId
   * @param {string} contactId
   * @returns
   */
   acceptContactReceived(userId, contactId) {
    return this.updateOne(
      {
        $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
      },
      { status: true }
    ).exec();
  },

  /**
   * Get contact by user id and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Get contact sent by user id and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContactsSent(userId, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Get contact received by user id and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Count all contacts
   * @param {string} userId
   * @returns
   */
  countAllContacts(userId) {
    return this.countDocuments({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    }).exec();
  },

  /**
   * Count all contacts sent
   * @param {string} userId
   * @returns
   */
  countAllContactsSent(userId) {
    return this.countDocuments({
      $and: [{ userId: userId }, { status: false }],
    }).exec();
  },

  /**
   * Count all contacts received
   * @param {string} userId
   * @returns
   */
  countAllContactsReceived(userId) {
    return this.countDocuments({
      $and: [{ contactId: userId }, { status: false }],
    }).exec();
  },

  /**
   * get more contacts
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * get more contact sent by userId
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * get more contact received by userId
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

module.exports = mongoose.model("contact", ContactSchema);
