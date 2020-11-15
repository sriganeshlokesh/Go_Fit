const { Appointment } = require("../models/Appointment");
const { v4: uuidv4 } = require("uuid");

// Get Appointment By ID
exports.appointmentById = (req, res, next, id) => {
  Appointment.findById(id).exec((err, appointment) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    req.appointment = appointment;
    next();
  });
};

// Get Appointment
exports.getAppointment = (req, res) => {
  Appointment.findById(req.params.appointmentId)

    .populate("user")

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
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        return res.json(data);
      }
    });
};

// Create Appointment
exports.createAppointment = (req, res) => {
  Appointment.findOne({ user: req.params.id, class: req.params.classId }).then(
    (data) => {
      if (data) {
        return res.status(400).json({
          error: "User has already booked this class",
        });
      } else {
        const booking = {
          user: req.params.id,
          class: req.params.classId,
        };
        const appointment = new Appointment(booking);
        appointment.save((err, data) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          }
          return res.json(data);
        });
      }
    }
  );
};

// Delete Appointment
exports.cancelAppointment = (req, res) => {
  const appointment = req.appointment;
  appointment.deleteOne((err) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    } else {
      return res.json({
        message: "Appointment Deleted",
      });
    }
  });
};
