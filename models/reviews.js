const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  trip: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
  noteByDriver: Number,
  noteByPassenger: Number,
  commentByDriver: String,
  commentByPassenger: String,
  complaintByDriver: String,
  complaintByPassenger: String,
});
//
const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
