const express = require("express");
const router = express.Router();

const { protect, isAuth } = require("../../controllers/auth");
const { userById, getUserHistory, getUser } = require("../../controllers/user");

// @route GET /api/user/:id
// @desc Get user history route
// @access Private
router.get("/:id", protect, isAuth, getUser);

// @route GET /api/user/history/:id
// @desc Get user history route
// @access Private
router.get("/history/:id", protect, isAuth, getUserHistory);

// @route PARAM id
// @desc Get User By Id
// @access Public
router.param("id", userById);

module.exports = router;
