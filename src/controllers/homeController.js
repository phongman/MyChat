import { notification } from "../services";

let getHome = async (req, res) => {
  // get notification: default 10 items
  let notifications = await notification.getNotifications(req.user._id);

  let countNotiUnread = await notification.countNotiUnread(req.user._id);

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotiUnread: countNotiUnread
  });

  // res.status(200).send({notifications, countNotiUnread})
};

module.exports = { getHome };
