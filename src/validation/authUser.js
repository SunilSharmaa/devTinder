const isEmail = require("validator/lib/isEmail");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const authUser = async (clientData) => {
  const { emailId, password } = clientData;
  if (!emailId) throw new Error("enter valid email");
  if (!password) throw new Error("enter password");

  if (isEmail(emailId)) {
    const user = await User.findOne({ emailId: emailId });
    if(user) {
        const match = await bcrypt.compare(password, user.password);
        if(!match) throw new Error ("invalid credential");
    } else {
        throw new Error ("invalid credential");
    }
  } else {
    throw new Error("invalid credential");
  }
};

module.exports = authUser;
