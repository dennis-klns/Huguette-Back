const mongoose = require('mongoose');


const positionSchema = mongoose.Schema({
    longitude: Number,
    latitude: Number,
   });

const tripSchema = mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  departure: positionSchema,
  arrival: positionSchema,
  date: Date,
  arrivalHour: Date,
  departureHour: Date,
  driverAccepts: Boolean,
  passengerAccepts: Boolean,
  inProgress: Boolean,
  completed: Boolean,
});

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;