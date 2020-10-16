const Slot = require("../models/Slot");

// Get Slot by Id
exports.slotsById = (req, res, next, id) => {
  Slot.findById(id).exec((err, slot) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    req.slot = slot;
    next();
  });
};

// Get a Slot
exports.getSlot = (req, res) => {
  return res.json(req.slot);
};

// Create a Slot
exports.createSlot = (req, res) => {
  const slot = new Slot({
    name: req.body.name,
    time: req.body.time,
  });
  slot
    .save()
    .then((slot) => {
      if (!slot) {
        return res.status(400).json({
          errors: "Slot not created",
        });
      } else {
        return res.json(slot);
      }
    })
    .catch((err) => console.log(err));
};

// Update a Slot
exports.updateSlot = (req, res) => {
  const id = req.slot._id;
  let option = { _id: id };
  Slot.update(option, req.body)
    .then((slot) => {
      if (!slot) {
        return res.status(400).json({
          errors: "Slot not updated",
        });
      } else {
        return res.json(slot);
      }
    })
    .catch((err) => console.log(err));
};

// Delete a slot
exports.deleteSlot = (req, res) => {
  const slot = req.slot;
  slot.deleteOne((err) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    } else {
      res.json({
        message: "Slot Deleted",
      });
    }
  });
};

// Get all slots
exports.getAllSlots = (req, res) => {
  Slot.find().exec((err, slots) => {
    if (err) {
      return res.status(400).json({
        errors: err,
      });
    }
    return res.json(slots);
  });
};
