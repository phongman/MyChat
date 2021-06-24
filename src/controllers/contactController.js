import { contact } from "../services";
import { validationResult } from "express-validator/check";

const findUserContact = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((el) => {
      errorArr.push(el.msg);
    });

    res.status(500).json({error: errorArr})
  }

  try {
    let userId = req.user._id;
    let keyword = req.params.keyword;

    let users = await contact.findUserContact(userId, keyword);

    return res.render("main/contact/sections/_findUserContacts", {users});
    //return res.status(200).json(users);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
};

const addNew = async (req, res) => {
  try {
    let userId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contact.addNew(userId, contactId);

    return res.status(200).json({success: !!newContact});

    //return res.status(200).json(users);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
};

const removeRequestContactSent = async (req, res) => {
  try {
    let userId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactSent(userId, contactId);

    return res.status(200).json({success: !!removeReq});

    //return res.status(200).json(users);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
};

const removeRequestContactReceived = async (req, res) => {
  try {
    let userId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactReceived(userId, contactId);

    return res.status(200).json({success: !!removeReq});

    //return res.status(200).json(users);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
};

const readMoreContacts = async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber;

    let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumber);

    return res.status(200).send(newContactUsers);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
}

const readMoreContactsSent = async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber;

    let newContactUsers = await contact.readMoreContactsSent(req.user._id, skipNumber);

    return res.status(200).send(newContactUsers);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
}

const readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber;

    let newContactUsers = await contact.readMoreContactsReceived(req.user._id, skipNumber);

    return res.status(200).send(newContactUsers);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
}

const acceptContactReceived = async (req, res) => {
  try {
    let acceptReq = await contact.acceptContactReceived(req.user._id, req.body.uid);

    return res.status(200).send({success: !!acceptReq});
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
}

module.exports = {
  findUserContact,
  addNew,
  removeRequestContactSent,
  removeRequestContactReceived,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived,
  acceptContactReceived
};
