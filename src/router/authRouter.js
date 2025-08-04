const express = require("express");
const authRouter = express.Router();
const validationUser = require("../validation/validationUser");
const validationSignup = require("../validation/validationSignup");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

authRouter.post("/signup", async (req, res) => {
  try {
    await validationSignup(req.body);

    const { firstName, lastName, age, gender, emailId, password } = req.body;
    const encryptPassword = await bcrypt.hash(password, 10);
    const userObj = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password: encryptPassword,
    });

    await userObj.save();

    res.status(201).json({
      success : "true",
      message : "user registered successful"
    });

  } catch (err) {
    res.status(400).json({
      success : "false",
      message : err.message
    });
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const user = await validationUser(req.body);

    const token = user.generateToken();

    res.cookie("token", token);
    res.json({
      success : "true",
      data : user
    });
  } catch (err) {
    res.status(401).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null);
  res.json({
    success : "true",
    message : "user logout"
  })
})

module.exports = authRouter;
