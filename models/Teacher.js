const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    role: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    image: {
      type: String,
      required: true,
    },
    social: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
      linkedin: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema, "teachers");
