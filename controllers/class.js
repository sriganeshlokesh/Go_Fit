const Class = require("../models/Class");
const User = require("../models/User");
const multer = require("multer");
const fs = require("fs");
const { Storage } = require("@google-cloud/storage");
const { HistoryItem } = require("../models/Appointment");

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
  Class.findById(req.params.classId)
    .populate("teacher slot")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json(err);
      } else {
        return res.json(data);
      }
    });
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
    const date = new Date(req.body.date);
    const newClass = new Class({
      name: req.body.name,
      teacher: req.body.teacher,
      slot: req.body.slot,
      day: req.body.day,
      date: date,
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

    const options = { _id: req.class._id };
    const date = new Date(req.body.date);
    const updates = {
      name: req.body.name,
      teacher: req.body.teacher,
      slot: req.body.slot,
      day: req.body.date,
      date: date,
      capacity: req.body.capacity,
      image: publicUrl,
      duration: req.body.duration,
      description: req.body.description,
    };
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
  let errors = {};
  let order = req.query.order ? req.query.order : "asc";
  let limit = req.query.limit ? req.query.limit : 6;
  Class.find()
    .populate("teacher slot")
    .sort([[order]])
    .limit(limit)
    .exec((err, classes) => {
      if (err) {
        errors.class = "Classes not found";
        return res.status(400).json(errors);
      }
      return res.json(classes);
    });
};

// Add Appointment to Booking Array
exports.appointmentToBooking = (req, res, next) => {
  let booking = [];
  let historyItem = new HistoryItem({
    user: req.params.id,
  });
  booking.push(historyItem);
  Class.findByIdAndUpdate(
    { _id: req.params.classId },
    { $push: { booking: booking } },
    { new: true }
  )
    .then((data) => {
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Could not add appointment to booking",
      });
    });
};

// Decrease Class Capacity after Booking Appointment
exports.decreaseCapacity = (req, res, next) => {
  Class.findOne({ booking: { user: req.params.id } }).then((data) => {
    console.log(data);
    if (data) {
      return res.status(400).json({
        error: "User has already booked the class",
      });
    } else {
      const id = req.params.classId;
      Class.updateOne({ _id: id }, { $inc: { capacity: -1 } }).then((data) => {
        if (!data) {
          return res.status(400).json({
            errors: "Not Updated",
          });
        }
        next();
      });
    }
  });
};

// Increase Class Capacity after Cancelling Appointment
exports.increaseCapacity = (req, res, next) => {
  const id = req.params.classId;
  Class.updateOne({ _id: id }, { $inc: { capacity: 1 } }).then((data) => {
    if (!data) {
      return res.status(400).json({
        errors: "Not Updated",
      });
    }
    next();
  });
};
