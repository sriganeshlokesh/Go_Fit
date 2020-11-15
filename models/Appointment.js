const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const historySchema = mongoose.Schema(
  {
    class: {
      type: ObjectId,
      ref: "Class",
      required: true,
    },
  },
  { timestamps: true }
);

const bookingSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

const HistoryItem = mongoose.model("History", historySchema);

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    class: {
      type: ObjectId,
      ref: "Class",
      required: true,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema,
  "appointments"
);

module.exports = { Appointment, HistoryItem, Booking };
