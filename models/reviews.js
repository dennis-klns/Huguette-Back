const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema({
  complaintType: String,
  details: String,
});

const reviewSchema = mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'trips' },
  noteByDriver: Number,
  noteByPassenger: Number,
  commentByDriver: String,
  commentByPassenger: String,
  complaintByDriver: complaintSchema,
  complaintByPassenger: complaintSchema,
});
//
const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
