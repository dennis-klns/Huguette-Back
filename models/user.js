const mongoose = require("mongoose");

const adressSchema = mongoose.Schema({
  street: String,
  city: String,
  zipcode: Number,
});

const documentSchema = mongoose.Schema({
  carteid: String,
  driverLicense: String,
  isValidated: Boolean,
});

const emergencySchema = mongoose.Schema({
  name: String,
  firstname: String,
  phone: Number,
  isBanned: Boolean,
});

const userSchema = mongoose.Schema({
  name: String,
  firstname: String,
  gender: String,
  type: String,
  birthdate: Number,
  email: String,
  phone: Number,
  password: String,
  token: String,
  mood: Boolean,
  music: Boolean,
  documents: documentSchema,
  adress: adressSchema,
  emergency: emergencySchema,
  averageNote: [number],
});
//
const User = mongoose.model("users", userSchema);

module.exports = User;
