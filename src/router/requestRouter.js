const express = require("express");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");
const authUser = require("../validation/authUser");

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  authUser,
  async (req, res) => {
    const loggedInUserId = req.user._id.toString();
    const { status, userId } = req.params;

    const allowedStatus = ["interested", "ignored"];
    const isStatusValid = allowedStatus.includes(status);

    if (!isStatusValid) {
      return res.status(400).json({
        message: "invalid status",
      });
    }

    const isUserExist = (await User.countDocuments({
        _id : userId,
    })) > 0

    if(!isUserExist) {
        return res.status(400).json({
            message : "sending connection request to invalid user",
        })
    }


    const isConnectionRequestDuplicate =
      (await ConnectionRequest.countDocuments({
        $or: [
          {
            toUserId: loggedInUserId,
            fromUserId: userId,
          },
          {
            toUserId : userId,
            fromUserId : loggedInUserId
          }
        ],

      })) > 0;
    

    if (isConnectionRequestDuplicate) {
      return res.status(400).json({
        message: "cannot send connection request again",
      });
    }

    const connectionRequest = new ConnectionRequest({
      toUserId: userId,
      fromUserId: loggedInUserId,
      status: status,
    });

    await connectionRequest.save();
    res.status(200).json({
      message: "connection request send",
    });
  }
);

module.exports = connectionRequestRouter;
