const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/userModel");
const validationUserUpdate = require("./validation/validationUserUpdate");
const cookieParser = require("cookie-parser");
const authUser = require("./validation/authUser");
const app = express();
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const connectionRequestRouter = require("./router/requestRouter");
const userRouter = require("./router/userRouter");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

app.get("/profile", authUser, (req, res) => {
  res.send(req.user);
});

app.post("/sendConnection", authUser, (req, res) => {
  res.send("connected successfully: " + req.user);
});

//get user api
app.get("/user", async (req, res) => {
  const { emailId } = req.body;

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

const PORT = process.env.PORT || 7000;

connectDb()
  .then(() => {
    console.log("connection established");
    app.listen(PORT, () => {
      console.log("server running");
    });
  })
  .catch((err) => console.log(err));

//listen
