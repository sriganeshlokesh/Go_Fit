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
