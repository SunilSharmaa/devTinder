const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 12,
    },

    lastName: {
      type: String,
      maxLength: 15,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 120,
    },

    gender: {
      type: String,
      required: true,
      validate: {
        validator: (val) =>
          val === "male" || val === "female" || val === "other",
        message: "gender must be male, female or other",
      },
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      maxLength: 20,
    },

    password: {
        type: String,
        required: true
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = function () {
  const payload = {id:this._id};
  const tokenKey = process.env.TOKEN_KEY;

  const token = jwt.sign(payload, tokenKey);
  return token;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
