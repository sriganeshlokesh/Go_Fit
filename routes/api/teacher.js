const express = require("express");
const router = express.Router();

const {
  teacherById,
  getTeacher,
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../../controllers/teacher");
const { protect, isAdmin, isAuth } = require("../../controllers/auth");
const { userById } = require("../../controllers/user");

// @route GET /api/teacher/:teacherId
// @desc Get teacher route
// @access Private
router.get("/:teacherId", getTeacher);

// @route POST /api/teacher/create
// @desc Create teacher route
// @access Private
router.post("/create/:id", protect, isAuth, isAdmin, createTeacher);

// @route PUT /api/teacher/:teacherId/:id
// @desc Update teacher route
// @access Private
router.put("/:teacherId/:id", protect, isAuth, isAdmin, updateTeacher);

// @route DELETE /api/teacher/:teacherId/:id
// @desc Delete teacher route
// @access Private
router.delete("/:teacherId/:id", protect, isAuth, isAdmin, deleteTeacher);

// @route GET /api/teacher/all/teacher
// @desc Get all teachers route
// @access Public
router.get("/all/teacher", getAllTeachers);

// @route PARAM id
// @desc Get User By Id
// @access Public
router.param("id", userById);

// @route PARAM teacherId
// @desc Get Teacher By Id
// @access Public
router.param("teacherId", teacherById);

module.exports = router;
