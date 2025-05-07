const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/userModel");

const app = express();

app.use(express.json());

//signup post api
app.post("/signup", async (req, res) => {
  const userObj = new User(req.body);

  try {
    await userObj.save();
    res.send("data save successfully");
  } catch {
    res.status(401).send("something went wrong");
  }
});

//get user api
app.get("/user", async (req, res) => {
  const { emailId } = req.body;
  console.log(emailId);

  try {
    const data = await User.find({ emailId: emailId });
    res.send(data);
  } catch {
    res.status(401).send("something went wrong");
  }
});

//delete user api
app.delete("/userDelete", async (req, res) => {
  const { _id } = req.body;

  try {
    await User.findByIdAndDelete(_id);

    res.send("user deleted");
  } catch {
    res.status(500).send("could not delete the data");
  }
});

//patch api to update data
app.patch("/userUpdate", async (req, res) => {
  const { _id } = req.body;
  const obj = req.body;
  console.log(obj);
  try {
    const updateUser = await User.findByIdAndUpdate(_id, obj, {
      returnDocument: "after",
    });
    res.send(updateUser);
  } catch {
    res.status(401).send("something went wrong");
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
