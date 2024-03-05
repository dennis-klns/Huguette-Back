const mongoose = require('mongoose');


const tripSchema = mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  departure: {latitudeD : Number,longitudeD : Number},
  arrival: {latitudeA : Number, longitudeA : Number},
  date: Date,
  arrivalHour: Date,
  departureHour: Date,
  driverAccepts: Boolean,
  passengerAccepts: Boolean,
  inProgress: Boolean,
  completed: Boolean,
  cost: Number,
});

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;