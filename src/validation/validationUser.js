const isEmail = require("validator/lib/isEmail");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const validationUser = async (clientData) => {
  const { emailId, password } = clientData;
  if (!emailId) throw new Error("enter valid email");
  if (!password) throw new Error("enter password");

  if(!isEmail(emailId)) throw new Error("invalid credential");

  const user = await User.findOne({ emailId});

  if(!user) throw new Error ("invalid credential");
  const match = await bcrypt.compare(password, user.password);
  if(!match) throw new Error ("invalid credential");
  return user;
  
};

module.exports = validationUser;
