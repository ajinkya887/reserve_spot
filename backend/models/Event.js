const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  soldTickets: { type: Number, default: 0 },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
