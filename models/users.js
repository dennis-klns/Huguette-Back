const mongoose = require("mongoose");

const positionSchema = mongoose.Schema({
  completeAddress: String,
  latitude: Number,
  longitude: Number,
});

const addressSchema = mongoose.Schema({
  street: String,
  city: String,
  zipcode: Number,
});

const documentsSchema = mongoose.Schema({
  idCard: String,
  driverLicense: String,
  isValidated: Boolean,
});

const emergencySchema = mongoose.Schema({
  lastname: String,
  firstname: String,
  phone: Number,
  emergencyMessage:String,
});

const userSchema = mongoose.Schema({
  lastname: String,
  firstname: String,
  gender: String,
  type: String,
  birthdate: Date,
  email: String,
  picture: String,
  phone: Number,
  password: String,
  token: String,
  mood: Boolean,
  music: Boolean,
  isAccompanied:Boolean,
  documents: documentsSchema,
  address: addressSchema,
  emergency: emergencySchema,
  averageNote: [Number],
  home: positionSchema, 
  work:positionSchema,
  isBanned: Boolean,
});
//
const User = mongoose.model("users", userSchema);

module.exports = User;
