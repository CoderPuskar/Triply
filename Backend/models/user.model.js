const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: 255,
    },
    lastname: {
      type: String,
      required: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: 255,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [6, "Email must be at least 6 characters long"],
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    select: false,
    maxlength: 1024,
  },
  socketId: {
    type: String,
  },
  //   date: {
  //     type: Date,
  //     default: Date.now,
  //   },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
