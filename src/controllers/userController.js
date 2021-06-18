import multer from "multer";
import { app } from "../config/app";
import { transErrors, transSuccess } from "../../lang/vi";
import uuidv4 from "uuid/v4";
import { user } from "../services";
import fsExtra from "fs-extra";
import { validationResult } from "express-validator/check";

let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
    let mime = app.avatar_mime;

    if (!mime.includes(file.mimetype)) {
      return callback(transErrors.avatar_type_error, null);
    }

    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;

    callback(null, avatarName);
  },
});

const avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {
    fileSize: app.avatar_limit_size,
  },
}).single("avatar");

const updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(error.message);
      }
      return res.status(500).send(error);
    }

    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updatedAt: Date.now(),
      };

      // update user
      const userUpdated = await user.updateUser(req.user._id, updateUserItem);

      //remove old user avatar
      fsExtra.remove(`${app.avatar_directory}/${userUpdated.avatar}`);

      const result = {
        message: transSuccess.user_info_updated,
        avatar: `/images/users/${req.file.filename}`,
      };

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  });
};

const updateInfo = async (req, res) => {
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
    let updateUserItem = req.body;

    await user.updateUser(req.user._id, updateUserItem);

    const result = {
      message: transSuccess.user_info_updated,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

module.exports = { updateAvatar, updateInfo };
