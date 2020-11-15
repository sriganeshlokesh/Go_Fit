const express = require("express");
const router = express.Router();

const { protect, isAuth, isAdmin } = require("../../controllers/auth");
const {
  userById,
  appointmentToHistory,
  deleteAppointmentHistory,
} = require("../../controllers/user");
const {
  appointmentById,
  createAppointment,
  cancelAppointment,
  getAppointment,
} = require("../../controllers/appointment");
const {
  decreaseCapacity,
  classById,
  increaseCapacity,
  appointmentToBooking,
} = require("../../controllers/class");

// @route GET /api/appointment/:appointmentId
// @desc Get appointment route
// @access Private
router.get("/:appointmentId/:id", protect, isAuth, getAppointment);

// @route POST /api/appointment/create/:id
// @desc Create Appointment Route
// @access Private
router.post(
  "/create/:id/:classId",
  protect,
  isAuth,
  appointmentToBooking,
  decreaseCapacity,
  appointmentToHistory,
  createAppointment
);

// @route DELETE /api/appointment/:appointmentId/:id
// @desc Delete class route
// @access Private
router.delete(
  "/:appointmentId/:classId/:id",
  protect,
  isAuth,
  increaseCapacity,
  deleteAppointmentHistory,
  cancelAppointment
);

// @route PARAM id
// @desc Get User By Id
// @access Public
router.param("id", userById);

// @route PARAM id
// @desc Get Appointment By Id
// @access Public
router.param("appointmentId", appointmentById);

// @route PARAM id
// @desc Get Class By Id
// @access Public
router.param("classId", classById);

module.exports = router;
