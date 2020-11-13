const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const historySchema = mongoose.Schema(
  {
    class: {
      type: ObjectId,
      ref: "Class",
    },
  },
  { timestamps: true }
);

const HistoryItem = mongoose.model("History", historySchema);

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    class: {
      type: ObjectId,
      ref: "Class",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema,
  "appointments"
);

module.exports = { Appointment, HistoryItem };
