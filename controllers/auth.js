const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const validateRegisterInput = require("../validations/register");
const validateLoginInput = require("../validations/login");

// Register User
exports.register = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already registered";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      });

      newUser
        .save()
        .then((user) => {
          user.salt = undefined;
          user.hashed_password = undefined;

          const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
          };
          // Sign Token
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 14400,
          });
          res.cookie("token", token);
          // Return user and token to client
          const { _id, name, email, role } = user;
          return res.json({
            success: true,
            user: { _id, name, email, role },
            token: `Bearer ${token}`,
          });
        })
        .catch((err) => console.log(err));
    }
  });
};

// Login User
exports.login = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  // Find the user by email
  User.findOne({ email }).then((user) => {
    // Check for User
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    } else {
      // Check for Password
      if (!user.authenticate(password)) {
        errors.password = "Incorrect Password";
        return res.status(400).json(errors);
      }

      // Generate a token for authentication
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 14400,
      });
      res.cookie("token", token);
      // Return user and token to client
      const { _id, name, email, role } = user;
      return res.json({
        success: true,
        user: { _id, name, email, role },
        token: `Bearer ${token}`,
      });
    }
  });
};

// Logout User
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Logout Successful",
  });
};

// Login Check
exports.protect = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

// User Authentication
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth.id;
  if (!user) {
    return res.status(403).json({
      errors: "Access Denied! Unauthorized User",
    });
  }
  next();
};

// Admin Authentication
exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      errors: "Access Denied. Admin Only",
    });
  }
  next();
};
