const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const classSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    teacher: {
      type: ObjectId,
      ref: "Teacher",
      required: true,
    },
    slots: {
      type: [ObjectId],
      ref: "Slot",
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema, "classes");
