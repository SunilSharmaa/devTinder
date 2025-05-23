const express = require("express");
const profileRouter = express.Router();
const authUser = require("../validation/authUser");
const validationUserUpdate = require("../validation/validationUserUpdate");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", authUser, (req, res) => {
  const user = req.user;
  const responseData = { data: user };
  res.send(responseData);
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  const {...obj } = req.body;

  try {
    validationUserUpdate(obj);
    const loggedInUser = req.user;
    Object.keys(obj).forEach((key) => loggedInUser[key] = obj[key]);
    await loggedInUser.save();
    
    const responseData = { data: loggedInUser };
    res.json(responseData);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password",authUser, async(req, res) => {
    const {password} = req.body;
    const encryptPassword = await bcrypt.hash(password, 10);

    const loggedInUser = req.user;

    loggedInUser.password = encryptPassword;
    await loggedInUser.save();
    res.json({message : "password changed successfully"});
})

module.exports = profileRouter;
