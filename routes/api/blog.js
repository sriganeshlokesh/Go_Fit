const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createBlog,
  blogById,
  getBlog,
  getImage,
  updateBlog,
  deleteBlog,
  getAllBlogs,
} = require("../../controllers/blog");
const { protect, isAdmin, isAuth } = require("../../controllers/auth");
const { userById } = require("../../controllers/user");

// Creating Storage for Multer
let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/blog");
  },
  filename: function (req, file, cb) {
    const parts = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`);
  },
});

let upload = multer({ storage: storage });

// @route GET /api/blog/:blogId
// @desc Get blog route
// @access Private
router.get("/:blogId", getBlog);

// @route GET /api/blog/image/:blogId
// @desc Get blog image route
// @access Private
router.get("/image/:blogId", getImage);

// @route POST /api/blog/create
// @desc Create blog route
// @access Private
router.post(
  "/create/:id",
  upload.single("image"),
  protect,
  isAuth,
  isAdmin,
  createBlog
);

// @route PUT /api/blog/:blogId/:id
// @desc Update blog route
// @access Private
router.put(
  "/:blogId/:id",
  upload.single("image"),
  protect,
  isAuth,
  isAdmin,
  updateBlog
);

// @route DELETE /api/blog/:blogId/:id
// @desc Delete blog route
// @access Private
router.delete("/:blogId/:id", protect, isAuth, isAdmin, deleteBlog);

// @route GET /api/blog/all/blog
// @desc Get all blogs route
// @access Public
router.get("/all/blog", getAllBlogs);

// @route PARAM id
// @desc Get User By Id
// @access Public
router.param("id", userById);

// @route PARAM blogId
// @desc Get BLog By Id
// @access Public
router.param("blogId", blogById);

module.exports = router;
