const Class = require("../models/Class");
const multer = require("multer");
const fs = require("fs");
const Buffer = require("safe-buffer").Buffer;
const { Storage } = require("@google-cloud/storage");

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

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
  if (!req.file) {
    res.status(400).json({
      errors: "Could not upload image",
    });
  }
  // Create new blob in the bucket referencing the file
  const blob = bucket.file(req.file.originalname);

  // initialize a writable stream
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  // Check for errors in Writestream object
  blobStream.on("error", (err) => next(err));

  blobStream.on("finish", () => {
    // Assembling public URL for accessing the file via HTTP
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(blob.name)}?alt=media`;
    const newClass = new Class({
      name: req.body.name,
      teacher: req.body.teacher,
      slot: req.body.slot,
      capacity: req.body.capacity,
      image: publicUrl,
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
          return res.json(data);
        }
      })
      .catch((err) => console.log(err));
  });

  // When there is no more data to be consumed from the stream
  blobStream.end(req.file.buffer);
};

// Update Class
exports.updateClass = (req, res) => {
  // Create new blob in the bucket referencing the file
  const blob = bucket.file(req.file.originalname);

  // initialize a writable stream
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  // Check for errors in Writestream object
  blobStream.on("error", (err) => next(err));

  blobStream.on("finish", () => {
    // Assembling public URL for accessing the file via HTTP
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(blob.name)}?alt=media`;
    const updates = {
      name: req.body.name,
      teacher: req.body.teacher,
      slot: req.body.slot,
      capacity: req.body.capacity,
      image: publicUrl,
      duration: req.body.duration,
      description: req.body.description,
    };
    const options = { _id: req.class._id };
    Class.updateOne(options, updates).then((data) => {
      if (!data) {
        return res.status(400).json({
          errors: "Not Updated",
        });
      } else {
        return res.json(data);
      }
    });
  });

  // When there is no more data to be consumed from the stream
  blobStream.end(req.file.buffer);
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
