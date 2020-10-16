const Teacher = require("../models/Teacher");

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
  const teacher = new Teacher({
    name: req.body.name,
  });
  teacher
    .save()
    .then((teacher) => {
      if (!teacher) {
        return res.status(400).json({
          errors: "Teacher not created",
        });
      } else {
        return res.json(teacher);
      }
    })
    .catch((err) => console.log(err));
};

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
