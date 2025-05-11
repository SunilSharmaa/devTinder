const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/userModel");
const validationUserUpdate = require("./validation/validationUserUpdate");
const validationSignup = require("./validation/validationSignup");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

//signup post api
app.post("/signup", async (req, res) => {
  try {
    await validationSignup(req.body);
    const {firstName, lastName, age, gender, emailId, password} = req.body;
    const encryptPassword = await bcrypt.hash(password, 10);
    const userObj = new User({firstName, lastName, age, gender, emailId, password : encryptPassword});
    await userObj.save();
    res.send("data save successfully");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//get user api
app.get("/user", async (req, res) => {
  const { emailId } = req.body;
  console.log(emailId);

  try {
    const data = await User.find({ emailId: emailId });
    res.send(data);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//delete user api
app.delete("/userDelete", async (req, res) => {
  const { _id } = req.body;

  try {
    await User.findByIdAndDelete(_id);

    res.send("user deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//patch api to update data
app.patch("/userUpdate", async (req, res) => {
  const { _id, ...obj } = req.body;

  try {
    validationUserUpdate(obj);
    const updateUser = await User.findByIdAndUpdate(_id, obj);
    res.send(updateUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDb()
  .then(() => {
    console.log("connection established");
    app.listen(7000, () => {
      console.log("server running");
    });
  })
  .catch((err) => console.log(err));

//listen
