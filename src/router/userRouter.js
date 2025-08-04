const express = require("express");
const userRouter = express.Router();
const authUser = require("../validation/authUser");
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");

userRouter.get("/user/request/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", "firstName lastName");

    if (connectionRequest.length > 0) {
      res.json({
        data: connectionRequest,
      });
    } else {
      res.json({
        success : false,
        data: [],
      });
    }
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

userRouter.get("/user/connection", authUser, async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();

    const userConnection = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUserId,
          status: "accepted",
        },
        {
          toUserId: loggedInUserId,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const userData = userConnection.map((key) => {
      if (loggedInUserId === key.fromUserId._id.toString()) {
        return key.toUserId;
      }

      return key.fromUserId;
    });

    console.log(userConnection);

    if (userConnection.length > 0) {
      res.json({
        data: userData,
      });
    } else {
      res.json({
        data: "no connection found",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

userRouter.get("/user/feed", authUser, async (req, res) => {
  const loggedInUserId = req.user._id.toString();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  

  const allConnection = await ConnectionRequest.find({
    $or: [{ toUserId: loggedInUserId }, { fromUserId: loggedInUserId }],
  });

  const hideUserFromFeed = new Set();

  allConnection.forEach((conn) => {
    hideUserFromFeed.add(conn.fromUserId.toString());
    hideUserFromFeed.add(conn.toUserId.toString());
  });

  const allUser = await User.find({
    $and: [
      {_id: {$nin: Array.from(hideUserFromFeed)}},
      {_id: {$ne: loggedInUserId}},
    ],
  })
  .select("firstName lastName")
  .skip(skip)
  .limit(limit);

  res.json({
    data: allUser,
  });
});

module.exports = userRouter;
