import { groupChat } from "../services";
import { validationResult } from 'express-validator/check'

const addNewGroup = async (req, res) => {
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
        let currentUserId = req.user._id;
        let arrayMemberIds = req.body.arrayIds;
        let groupChatName = req.body.groupChatName;

        let newGroupChat = await groupChat.addNewGroup(currentUserId, arrayMemberIds, groupChatName);

        return res.status(200).send({groupChat: newGroupChat})
    } catch (error) {
        res.status(500).send(error);
    }
    
  };

module.exports = {
    addNewGroup,
};
