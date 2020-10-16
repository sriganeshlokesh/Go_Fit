const express = require("express");
const router = express.Router();
const {
  getSlot,
  createSlot,
  slotsById,
  updateSlot,
  deleteSlot,
  getAllSlots,
} = require("../../controllers/slots");
const { protect, isAdmin, isAuth } = require("../../controllers/auth");
const { userById } = require("../../controllers/user");

// @route GET /api/slot/:slotId
// @desc Get Slot route
// @access Private
router.get("/:slotId", getSlot);

// @route POST /api/slot/create
// @desc Create slot route
// @access Private
router.post("/create/:id", protect, isAuth, isAdmin, createSlot);

// @route PUT /api/slot/:slotId/:id
// @desc Update slot route
// @access Private
router.put("/:slotId/:id", protect, isAuth, isAdmin, updateSlot);

// @route DELETE /api/slot/:slotId/:id
// @desc Delete slot route
// @access Private
router.delete("/:slotId/:id", protect, isAuth, isAdmin, deleteSlot);

// @route GET /api/slot/all/slot
// @desc Get all slots route
// @access Public
router.get("/all/slot", getAllSlots);

// @route PARAM id
// @desc Get User By Id
// @access Public
router.param("id", userById);

// @route PARAM slotId
// @desc Get Slot By Id
// @access Public
router.param("slotId", slotsById);

module.exports = router;
