const Class = require("../models/Class");
const multer = require("multer");
const fs = require("fs");
const Buffer = require("safe-buffer").Buffer;

// Get Class By Id
exports.classById = (req, res, next, id) => {
  Class.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Class not found",
      });
    }
    req.class = data;
    next();
  });
};

// Get a Class
exports.getClass = (req, res) => {
  if (req.class) {
    let _class = req.class;
    _class.image = undefined;
    return res.json(_class);
  } else {
    return res.json({
      message: "Class Does Not Exist",
    });
  }
};

// Get class image
exports.getImage = (req, res, next) => {
  console.log(req.class);
  if (req.class.image.data) {
    res.set("Content-Type", req.class.image.contentType);
    return res.send(req.class.image.data);
  }
  next();
};

// Create a Class
exports.createClass = (req, res) => {
  let img = fs.readFileSync(req.file.path);
  let encode_image = img.toString("base64");
  let finalImg = {
    contentType: req.file.mimetype,
    data: Buffer.from(encode_image, "base64"),
  };

  const newClass = new Class({
    name: req.body.name,
    teacher: req.body.teacher,
    slots: req.body.slots,
    capacity: req.body.capacity,
    image: finalImg,
    duration: req.body.duration,
    description: req.body.description,
  });
  newClass
    .save()
    .then((data) => {
      if (!data) {
        return res.status(400).json({
          errors: "Class not created",
        });
      } else {
        data.image = undefined;
        return res.json(data);
      }
    })
    .catch((err) => console.log(err));
};

// Update Class
exports.updateClass = (req, res) => {
  let updates = {
    name: req.body.name,
    teacher: req.body.teacher,
    slots: req.body.slots,
    capacity: req.body.capacity,
    duration: req.body.duration,
    description: req.body.description,
  };
  if (req.file) {
    let img = fs.readFileSync(req.file.path);
    let encode_image = img.toString("base64");
    let finalImg = {
      contentType: req.file.mimetype,
      data: Buffer.from(encode_image, "base64"),
    };
    updates.image = finalImg;
  }
  const options = { _id: req.class._id };
  Class.updateOne(options, updates).then((data) => {
    if (!data) {
      return res.status(400).json({
        errors: "Not Updated",
      });
    } else {
      data.image = undefined;
      return res.json(data);
    }
  });
};

// Delete Class
exports.deleteClass = (req, res) => {
  const _class = req.class;
  _class.deleteOne((err) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    } else {
      res.json({
        message: "Class Deleted",
      });
    }
  });
};

// Get All Classes
exports.getAllClasses = (req, res) => {
  Class.find().exec((err, classes) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    return res.json(classes);
  });
};
