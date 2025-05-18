const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authUser = async(req, res, next) => {

    const token = req?.cookies?.token;
      if (!token) return res.status(401).send("no token found");
      try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    
        const user = await User.findById(decodedToken?.id);

        if(!user) throw new Error ("no user found");

        req.user = user;
        next();
    
        // res.status(200).send(user);
      } catch (err) {
        res.status(401).send(err.message);
      }
}

module.exports = authUser;