const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createClass,
  classById,
  getClass,
  updateClass,
  getImage,
  deleteClass,
  getAllClasses,
} = require("../../controllers/class");
const { protect, isAdmin, isAuth } = require("../../controllers/auth");
const { userById } = require("../../controllers/user");

// Creating Storage for Multer
let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const parts = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`);
  },
});

let upload = multer({ storage: storage });

// @route GET /api/class/:classId
// @desc Get class route
// @access Private
router.get("/:classId", getClass);

// @route GET /api/class/image/:classId
// @desc Get class image route
// @access Private
router.get("/image/:classId", getImage);

// @route POST /api/class/create
// @desc Create class route
// @access Private
router.post(
  "/create/:id",
  upload.single("image"),
  protect,
  isAuth,
  isAdmin,
  createClass
);

// @route PUT /api/class/:classId/:id
// @desc Update class route
// @access Private
router.put(
  "/:classId/:id",
  upload.single("image"),
  protect,
  isAuth,
  isAdmin,
  updateClass
);

// @route DELETE /api/class/:classId/:id
// @desc Delete class route
// @access Private
router.delete("/:classId/:id", protect, isAuth, isAdmin, deleteClass);

// @route GET /api/class/all/class
// @desc Get all classes route
// @access Public
router.get("/all/class", getAllClasses);

// @route PARAM id
// @desc Get User By Id
// @access Public
router.param("id", userById);

// @route PARAM classId
// @desc Get Class By Id
// @access Public
router.param("classId", classById);

module.exports = router;
