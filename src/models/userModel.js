const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    validate: {
      validator: (val) => val === "male" || val === "female" || val === "other",
      message: "gender must be male, female or other",
    },
  },

  emailId: {
    type: String,
    unique: true,
    maxLength: 20,
  },

  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
