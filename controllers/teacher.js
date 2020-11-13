const Teacher = require("../models/Teacher");
const multer = require("multer");
const fs = require("fs");
const { Storage } = require("@google-cloud/storage");

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

// Get Teacher By Id - Middleware
exports.teacherById = (req, res, next, id) => {
  Teacher.findById(id).exec((err, teacher) => {
    if (err) {
      return res.status(400).json({
        error: "Teacher not found",
      });
    }
    req.teacher = teacher;
    next();
  });
};

// Get a Teacher
exports.getTeacher = (req, res) => {
  return res.json(req.teacher);
};

// Create a Teacher
exports.createTeacher = (req, res) => {
  Teacher.findOne({ name: req.body.name }).then((teacher) => {
    if (teacher) {
      return res.status(400).json({
        error: "Teacher Already Exists",
      });
    } else {
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
        const newTeacher = new Teacher({
          name: req.body.name,
          role: req.body.role,
          image: publicUrl,
          social: req.body.social,
        });
        newTeacher
          .save()
          .then((data) => {
            if (!data) {
              return res.status(400).json({
                errors: "Teacher not created",
              });
            } else {
              return res.json(data);
            }
          })
          .catch((err) => console.log(err));
      });

      // When there is no more data to be consumed from the stream
      blobStream.end(req.file.buffer);
    }
  });
};

// // Create a Teacher
// exports.createTeacher = (req, res) => {
//   const teacher = new Teacher({
//     name: req.body.name,
//     role: req.body.role,
//   });
//   teacher
//     .save()
//     .then((teacher) => {
//       if (!teacher) {
//         return res.status(400).json({
//           errors: "Teacher not created",
//         });
//       } else {
//         return res.json(teacher);
//       }
//     })
//     .catch((err) => console.log(err));
// }

// Update Teacher
exports.updateTeacher = (req, res) => {
  const teacher = req.teacher;
  teacher.name = req.body.name;
  teacher.save().then((teacher) => {
    return res.json(teacher);
  });
};

// Delete Teacher
exports.deleteTeacher = (req, res) => {
  const teacher = req.teacher;
  teacher.deleteOne((err, teacher) => {
    if (err) {
      return res.status(400).json({
        errors: "Teacher not deleted",
      });
    }
    return res.json({
      message: "Teacher Deleted",
    });
  });
};

// Get all Teachers
exports.getAllTeachers = (req, res) => {
  Teacher.find().exec((err, teachers) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    return res.json(teachers);
  });
};
