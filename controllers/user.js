const User = require("../models/User");
const { HistoryItem, Appointment } = require("../models/Appointment");
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

// Get user
exports.getUser = (req, res) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    } else {
      return res.json(user);
    }
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
  let historyItem = new HistoryItem({
    class: req.body.class,
  });
  history.push(historyItem);
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

// Get User History
exports.getUserHistory = (req, res) => {
  Appointment.find({ user: req.params.id })
    .populate("user class")
    .populate({
      path: "class",
      populate: {
        path: "teacher",
        model: "Teacher",
      },
    })
    .populate({
      path: "class",
      populate: {
        path: "slot",
        model: "Slot",
      },
    })
    .sort("-created")
    .exec((err, booking) => {
      if (err) {
        return res.status(400).json({
          errors: err,
        });
      } else {
        res.json(booking);
      }
    });
};
