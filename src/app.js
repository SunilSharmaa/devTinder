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
const http = require("http");
const { initializeSocket } = require("./utils/socket");
const chatRouter = require("./router/chatRouter");

const server = http.createServer(app);
initializeSocket(server);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.DEVTINDER_FRONTEND_LOCAL_URL,
  process.env.DEVTINDER_FRONTEND_URL
];



app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

app.get("/profile", authUser, (req, res) => {
  res.send(req.user);
});

app.post("/sendConnection", authUser, (req, res) => {
  res.send("connected successfully: " + req.user);
});

//get user api
app.get("/user", async (req, res) => {
  const { emailId } = req.query;

  try {
    const data = await User.find({ emailId: emailId });
    res.send(data);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

const PORT = process.env.PORT || 7000;

connectDb()
  .then(() => {
    console.log("connection established");
    server.listen(PORT, () => {
      console.log("server running");
    });
  })
  .catch((err) => console.log(err));

//listen
