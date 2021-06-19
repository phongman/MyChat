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

const removeRequestContact = async (req, res) => {
  try {
    let userId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContact(userId, contactId);

    return res.status(200).json({success: !!removeReq});

    //return res.status(200).json(users);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
};

module.exports = {
  findUserContact,
  addNew,
  removeRequestContact
};
