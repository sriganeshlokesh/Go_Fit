const Appointment = require("../models/Appointment");
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

// Create Appointment
exports.createAppointment = (req, res) => {
  req.body.appointment.user = req.profile;
  req.body.appointment.class = req.class;
  const appointment = new Appointment(req.body);
  appointment.save((err, data) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    res.json(data);
  });
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
