const User = require("../models/User");
const fs = require("fs");

// Get User By Id - Middleware
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        errors: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

// Get All Customers
exports.getAllUsers = (req, res) => {
  let errors = {};
  User.find({ role: "0" })
    .select("-photo")
    .exec((err, users) => {
      if (err) {
        errors.user = "Users not found";
        return res.status(400).json(errors);
      }
      res.json(users);
    });
};

// Add Appointment to History
exports.appointmentToHistory = (req, res, next) => {
  let history = [];
  history.push({
    _id: req.body.appointment.class,
    name: req.profile.name,
    class: req.class.name,
  });
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true }
  )
    .then((data) => {
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Could not add appointment to history",
      });
    });
};

// Delete Appointment From History
exports.deleteAppointmentHistory = (req, res, next) => {
  User.updateOne(
    { _id: req.profile._id },
    { $pull: { history: { _id: req.params.classId } } }
  ).then((data) => {
    if (!data) {
      return res.status(400).json({
        errors: "Not Updated",
      });
    }
    next();
  });
};
